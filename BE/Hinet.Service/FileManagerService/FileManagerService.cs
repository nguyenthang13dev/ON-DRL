using System.Diagnostics;
using System.IO.Compression;
using CommonHelper.String;
using DocumentFormat.OpenXml.Presentation;
using Hinet.Model.Entities;
using Hinet.Repository.AspNetUsersRepository;
using Hinet.Repository.DepartmentRepository;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using Hinet.Repository.DM_NhomDanhMucRepository;
using Hinet.Repository.FileManagerRepository;
using Hinet.Repository.FileSecurityRepository;
using Hinet.Repository.RoleRepository;
using Hinet.Repository.UserRoleRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.Constant;
using Hinet.Service.Core.Mapper;
using Hinet.Service.FileManagerService.Dto;
using Hinet.Service.FileManagerService.ViewModels;
using Hinet.Service.FileSecurityService.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Service.FileManagerService
{
    public class FileManagerService : Service<FileManager>, IFileManagerService
    {
        private readonly IAspNetUsersRepository _aspNetUsersRepository;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IFileSecurityRepository _fileSecurityRepository;
        private readonly IMapper _mapper;
        private readonly IRoleRepository _roleRepository;
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IDM_DuLieuDanhMucRepository _dM_DuLieuDanhMucRepository;
        private readonly IDM_NhomDanhMucRepository _NhomDanhMucRepository;


        public FileManagerService(
            IFileManagerRepository fileManagerRepository
            , IFileSecurityRepository fileSecurityRepository,
            IUserRoleRepository userRoleRepository,
            IAspNetUsersRepository aspNetUsersRepository,
            IRoleRepository roleRepository,
            IDepartmentRepository departmentRepository,
            IMapper mapper,
            IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository,
            IDM_NhomDanhMucRepository nhomDanhMucRepository) : base(fileManagerRepository)
        {
            _fileSecurityRepository = fileSecurityRepository;
            _userRoleRepository = userRoleRepository;
            _aspNetUsersRepository = aspNetUsersRepository;
            _roleRepository = roleRepository;
            _departmentRepository = departmentRepository;
            _mapper = mapper;
            _dM_DuLieuDanhMucRepository = dM_DuLieuDanhMucRepository;
            _NhomDanhMucRepository = nhomDanhMucRepository;
        }

        /// <summary>
        ///     Tải file zip
        /// </summary>
        /// <param name="fileIDs">id những file/folder cần tải</param>
        /// <param name="rootPath">Thư mục gốc vật lý chứa file/folder</param>
        /// <param name="rootZipPath">Thư mục gốc vật lý chứa file/folder sau khí nén</param>
        /// <returns></returns>
        public async Task<string> Download(List<Guid> fileIDs, string rootPath, string rootZipPath, FileManagerSearch searchModel)
        {
            var result = "";
            try
            {
                if (!fileIDs.Any())
                {
                    return result;
                }

                var fileDownloads = new List<FileManager>();
                foreach (var id in fileIDs)
                {
                    var item = await GetByIdAsync(id);
                    if (item != null)
                    {
                        fileDownloads.Add(item);
                    }
                }

                if (!fileDownloads.Any())
                {
                    return result;
                }

                // Tạo thư mục tạm chứa tất cả file/folder cần nén
                var tempFolder = Path.Combine(rootZipPath, $"temp_{Guid.NewGuid()}");
                Directory.CreateDirectory(tempFolder);

                var allItems = new List<FileManager>();
                var allFileManagers = await GetData(searchModel);

                //đánh dấu
                foreach (var item in fileDownloads)
                {
                    var removeHeaderParent = item.Path
                        .Substring(0, item.Path.LastIndexOf(item.Name))
                        .TrimEnd('/');

                    item.Path = "/" + item.Name;
                    var childItems = await GetChildToZip(item.Id, allFileManagers, removeHeaderParent);
                    allItems.AddRange(childItems);
                }

                allItems.AddRange(fileDownloads);

                // Copy tất cả vào thư mục tạm trước khi nén
                foreach (var item in allItems)
                {
                    if (string.IsNullOrEmpty(item.PhysicalPath))
                    {
                        continue;
                    }

                    var sourcePath = Path.Combine(rootPath, item.PhysicalPath);
                    var relativeZipPath = item.Path.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString());
                    var targetPath = Path.Combine(tempFolder, relativeZipPath);

                    if (item.IsDirectory == true)
                    {
                        Directory.CreateDirectory(targetPath);
                    }
                    else
                    {
                        var parentDir = Path.GetDirectoryName(targetPath);
                        if (!Directory.Exists(parentDir))
                        {
                            Directory.CreateDirectory(parentDir);
                        }

                        if (File.Exists(sourcePath))
                        {
                            File.Copy(sourcePath, targetPath, true);
                        }
                    }
                }

                // Nén toàn bộ thư mục tạm thành file zip
                var zipFileNameFinal = $"download_{DateTime.Now:yyyyMMdd_HHmmss}.zip";
                var zipFilePath = Path.Combine(rootZipPath, zipFileNameFinal);
                ZipFile.CreateFromDirectory(tempFolder, zipFilePath, CompressionLevel.Fastest, false);

                // Xóa thư mục tạm
                Directory.Delete(tempFolder, true);

                result = zipFilePath;
            }
            catch (Exception ex)
            {
                return "";
            }

            return result;
        }


        public async Task<List<FileManagerDto>> GetDataAll(FileManagerSearch search)
        {
            var result = await GetData(search);

            if (search.ParentId != null)
            {
                result = result.Where(x => x.ParentId.Equals(search.ParentId)).ToList();
            }

            if (!string.IsNullOrWhiteSpace(search.Name))
            {
                result = result.Where(x => x.Name.Trim().ToLower().Contains(search.Name.Trim().ToLower())).ToList();
            }

            return result;
        }

        public async Task<List<FileManagerDto>> SearchData(FileManagerSearch search)
        {
            var result = await GetData(search);

            // lọc ra những tài liệu nằm trong folder hiện tại
            if (search.ParentId != null)
            {
                var parentFolder = result.FirstOrDefault(x => x.Id == search.ParentId);
                if (parentFolder != null)
                {
                    var parentPath = parentFolder.Path;
                    if (!string.IsNullOrEmpty(parentPath))
                    {
                        result = result.Where(x => x.Path.StartsWith(parentPath)).ToList();
                    }

                    // lọc bỏ chính nó
                    result = result.Where(x => x.Id != parentFolder.Id).ToList();
                }
            }

            if (!string.IsNullOrWhiteSpace(search.Name))
            {
                result = result
                    .Where(x => x.Name.Trim().ToLower().RemoveUnicode()
                    .Contains(search.Name.Trim().ToLower()?.RemoveUnicode()))
                    .ToList();
            }

            return result;
        }


        public async Task<FileManagerDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)
                              select new FileManagerDto
                              {
                                  Name = q.Name,
                                  ParentId = q.ParentId,
                                  Path = q.Path,
                                  Size = q.Size,
                                  IsDirectory = q.IsDirectory,
                                  FileExtension = q.FileExtension,
                                  MimeType = q.MimeType,
                                  CreatedBy = q.CreatedBy,
                                  UpdatedBy = q.UpdatedBy,
                                  IsDelete = q.IsDelete,
                                  DeleteId = q.DeleteId,
                                  CreatedDate = q.CreatedDate,
                                  UpdatedDate = q.UpdatedDate,
                                  DeleteTime = q.DeleteTime,
                                  Id = q.Id
                              }).FirstOrDefaultAsync();

            return item;
        }


        private async Task<List<FileManagerDto>> GetData(FileManagerSearch search)
        {
            var result = new List<FileManagerDto>();

            var loaiVanBanDict = await (from dm in _dM_DuLieuDanhMucRepository.GetQueryable()
                                        join nhom in _NhomDanhMucRepository.GetQueryable()
                                        on dm.GroupId equals nhom.Id
                                        where nhom.GroupCode == MaDanhMucConstant.LVB
                                        select new { dm.Id, dm.Name }
                                        )
                .ToDictionaryAsync(x => x.Id.ToString(), x => x.Name)
                ?? new Dictionary<string, string>();

            // Nếu là admin thì lấy tất cả
            if (search.IsAdmin == true)
            {
                var result2 = await (from q in GetQueryable()
                                     select new FileManagerDto
                                     {
                                         Name = q.Name,
                                         ParentId = q.ParentId,
                                         Path = q.Path,
                                         Size = q.Size,
                                         IsDirectory = q.IsDirectory,
                                         FileExtension = q.FileExtension,
                                         PhysicalPath = q.PhysicalPath,
                                         MimeType = q.MimeType,
                                         UpdatedDate = q.UpdatedDate,
                                         CreatedDate = q.CreatedDate,
                                         LoaiVanBan = q.LoaiVanBan,
                                         SoKyHieu = q.SoKyHieu,
                                         NgayBanHanh = q.NgayBanHanh,
                                         TrichYeu = q.TrichYeu,
                                         Id = q.Id,
                                         TenLoaiVanBan = !string.IsNullOrEmpty(q.LoaiVanBan)
                                             && loaiVanBanDict.ContainsKey(q.LoaiVanBan)
                                             ? loaiVanBanDict[q.LoaiVanBan] : null,
                                         Permission = new FilePermissionDto
                                         {
                                             Create = true,
                                             Upload = true,
                                             Rename = true,
                                             Delete = true,
                                             Share = true,
                                             Move = true,
                                             Copy = true,
                                             Download = true
                                         }
                                     }).ToListAsync();

                result.AddRange(result2 ?? new List<FileManagerDto>());

            }
            else
            {
                // Step 1: Lấy thông tin về file liên quan đến currentUser
                var fileSecurities = await _fileSecurityRepository.GetQueryable()
                    .Select(x => new FileSecurity
                    {
                        SharedByID = x.SharedByID,
                        FileID = x.FileID,
                        SharedToType = x.SharedToType,
                        SharedToID = x.SharedToID,
                        Permission = x.Permission,
                    }).ToListAsync();

                // thông tin chia sẻ cho người dùng
                var userFilePermisons = fileSecurities?
                    .Where(x => x.SharedToType == FileManagerShareTypeConstant.USER
                                && x.SharedToID == search.UserID);
                var lsstuserFilePermisons = userFilePermisons?.ToList();

                // thông tin chia sẻ cho nhóm quyền
                var roleFilePermisons = fileSecurities?
                    .Where(x => x.SharedToType == FileManagerShareTypeConstant.ROLE)
                    .Join(_userRoleRepository.GetQueryable().Where(x => x.UserId == search.UserID),
                        s => s.SharedToID,
                        ul => ul.RoleId,
                        (s, ul) => new { s })
                    .Select(x => x.s);

                var listRoleFilePermisons = roleFilePermisons.ToList();

                // thông tin chia sẻ cho phòng ban
                var departmentFilePermisons = fileSecurities?
                    .Where(x => x.SharedToType == FileManagerShareTypeConstant.DEPARTMENT);

                if (search.UserDepartmentID != null)
                {
                    departmentFilePermisons = departmentFilePermisons
                        .Where(x => x.SharedToID == search.UserDepartmentID);

                    var roleDepartent = departmentFilePermisons.ToList();
                }

                // sau khi lọc theo từng type để join thì gộp lại thành 1
                var allPermissions = userFilePermisons
                    .Concat(roleFilePermisons)
                    .Concat(departmentFilePermisons)
                    .Distinct()
                    .ToList();

                // Step 2: Tạo permissionMap ánh xạ FileID -> Permission trực tiếp (chọn quyền cao nhất)
                var permissionMap = allPermissions
                    .GroupBy(x => x.FileID)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(x => x.Permission)
                            .OrderByDescending(p => p ==  PermissionFileConstant.NguoiSoHuu ? 3 
                                : p == PermissionFileConstant.NguoiChinhSua ? 2
                                    : p == PermissionFileConstant.NguoiXem ? 1
                                        : 0)
                                .First()
                    );

                // Step 3: Lấy danh sách tất cả folder/file (ID -> ParentID)
                var allFileAndFolders = await GetQueryable()
                    .Select(file => new FileManager
                    {
                        Name = file.Name,
                        ParentId = file.ParentId,
                        Path = file.Path,
                        Size = file.Size,
                        IsDirectory = file.IsDirectory,
                        FileExtension = file.FileExtension,
                        PhysicalPath = file.PhysicalPath,
                        MimeType = file.MimeType,
                        CreatedDate = file.CreatedDate,
                        UpdatedDate = file.UpdatedDate,
                        Id = file.Id,
                        CreatedId = file.CreatedId
                    }).ToListAsync();

               

                var fileOrFolderDics = allFileAndFolders.ToDictionary(x => x.Id, x => x.ParentId);

                // Step 4: Xây dựng cây từ permissionMap -> duyệt lên & xuống để mở rộng node có thể truy cập
                var accessibleIds = new HashSet<Guid>(permissionMap.Keys);
                var queue = new Queue<(Guid id, bool allowTraverseDown)>();
                foreach (var item in accessibleIds)
                {
                    queue.Enqueue((item, true));
                }

                while (queue.Count > 0)
                {
                    var (current, allow) = queue.Dequeue();

                    // Duyệt lên cha
                    Guid? parent = fileOrFolderDics.ContainsKey(current) ? fileOrFolderDics[current] : null;
                    while (parent != null && accessibleIds.Add(parent.Value))
                    {
                        queue.Enqueue((parent.Value, false));
                        parent = fileOrFolderDics.ContainsKey(parent.Value) ? fileOrFolderDics[parent.Value] : null;
                    }

                    // Duyệt xuống con
                    if (allow == false) continue;
                    var children = fileOrFolderDics.Where(x => x.Value == current).Select(x => x.Key).ToList();
                    foreach (var child in children)
                    {
                        if (accessibleIds.Add(child))
                        {
                            queue.Enqueue((child, true));
                        }
                    }
                }

               // var ownerFiles = allFileAndFolders
               //.Where(f => f.CreatedId == search.UserID)
               //.Select(f => f.Id);

               // foreach (var id in ownerFiles)
               // {
               //     accessibleIds.Add(id);
               // }

                // Step 5: Duyệt tất cả node có thể truy cập và gán permission
                //       : Trực tiếp > theo cha gần nhất > chuỗi rỗng
                foreach (var id in accessibleIds)
                {
                    string? permission;
                    if (permissionMap.TryGetValue(id, out var directPermission))
                    {
                        permission = directPermission;
                    }
                    else
                    {
                        var currentId = id;
                        string? inherited = null;
                        while (true)
                        {
                            var parentId = fileOrFolderDics.GetValueOrDefault(currentId);
                            if (parentId == null) break;

                            if (permissionMap.TryGetValue(parentId.Value, out inherited))
                            {
                                break;
                            }

                            currentId = parentId.Value;
                        }

                        permission = inherited ?? string.Empty;
                    }

                    var file = allFileAndFolders.FirstOrDefault(f => f.Id == id);
                    if (file != null)
                    {
                        result.Add(new FileManagerDto
                        {
                            Name = file.Name,
                            ParentId = file.ParentId,
                            Path = file.Path,
                            Size = file.Size,
                            IsDirectory = file.IsDirectory,
                            FileExtension = file.FileExtension,
                            PhysicalPath = file.PhysicalPath,
                            MimeType = file.MimeType,
                            CreatedDate = file.CreatedDate,
                            UpdatedDate = file.UpdatedDate,
                            LoaiVanBan = file.LoaiVanBan,
                            SoKyHieu = file.SoKyHieu,
                            NgayBanHanh = file.NgayBanHanh,
                            TrichYeu = file.TrichYeu,
                            Id = file.Id,
                            TenLoaiVanBan = !string.IsNullOrEmpty(file.LoaiVanBan)
                                             && loaiVanBanDict.ContainsKey(file.LoaiVanBan)
                                             ? loaiVanBanDict[file.LoaiVanBan] : null,
                            Permission = new FilePermissionDto
                            {
                                Create = permission == PermissionFileConstant.NguoiChinhSua || permission == PermissionFileConstant.NguoiSoHuu,
                                Upload = permission == PermissionFileConstant.NguoiChinhSua || permission == PermissionFileConstant.NguoiSoHuu,
                                Rename = permission == PermissionFileConstant.NguoiChinhSua || permission == PermissionFileConstant.NguoiSoHuu,
                                Delete = search.IsAdmin == true || file.CreatedId == search.UserID,
                                Share = search.IsAdmin == true || file.CreatedId == search.UserID,
                                Move = search.IsAdmin == true || file.CreatedId == search.UserID,
                                Copy = permission == PermissionFileConstant.NguoiChinhSua || permission == PermissionFileConstant.NguoiSoHuu,
                                Download = permission == PermissionFileConstant.NguoiXem
                                           || permission == PermissionFileConstant.NguoiChinhSua || permission == PermissionFileConstant.NguoiSoHuu
                            }
                        });
                    }
                }
            }

            result.OrderByDescending(x => x.CreatedDate);
            return result;
        }


        #region Những hàm dùng chung

        /// <summary>
        ///     Lấy file/folder con để tải xuống zip
        /// </summary>
        /// <param name="id">id folder cần lấy con</param>
        /// <param name="allFiles">tất cả các file/folder trong db</param>
        /// <param name="removeHeaderParent">Xóa đoạn path đầu cần xóa để tránh nén thừa folder cha</param>
        /// <returns>list file/folder con</returns>
        private async Task<List<FileManager>> GetChildToZip(Guid id, List<FileManagerDto> allFiles,
            string removeHeaderParent)
        {
            var result = new List<FileManager>();
            if (id == new Guid())
            {
                return result;
            }

            if (!allFiles.Any())
            {
                return result;
            }

            var childs = allFiles.Where(x => x.ParentId == id).ToList();
            if (childs != null && childs.Any())
            {
                foreach (var item in childs)
                {
                    if (!string.IsNullOrEmpty(removeHeaderParent) &&
                        !string.IsNullOrEmpty(item.Path) &&
                        item.Path.StartsWith(removeHeaderParent))
                    {
                        item.Path = item.Path.Substring(removeHeaderParent.Length).TrimStart('/');
                    }

                    result.AddRange(await GetChildToZip(item.Id, allFiles, removeHeaderParent));
                }

                result.AddRange(childs);
            }

            return result;
        }

        /// <summary>
        ///     Lấy các file/folder con
        /// </summary>
        /// <param name="ids">id những folder cần lấy con</param>
        /// <param name="allFiles">tất cả file/folder trong db</param>
        /// <returns>Tất cả file/folder con</returns>
        public async Task<List<FileManager>> GetChilds(List<Guid>? ids, List<FileManager> allFiles)
        {
            var result = new List<FileManager>();
            if (ids == null || !ids.Any())
            {
                return result;
            }

            if (!allFiles.Any())
            {
                return result;
            }

            var childs = allFiles
                .Where(x => x.ParentId != null && ids.Contains((Guid)x.ParentId))
                .ToList();
            if (childs != null && childs.Any())
            {
                result.AddRange(childs);
                result.AddRange(await GetChilds(childs.Select(x => x.Id).ToList(), allFiles));
            }

            return result;
        }

        /// <summary>
        ///     Lấy đường dẫn mới khi thay đổi tên
        /// </summary>
        /// <param name="parentID">ID thư mục cha</param>
        /// <param name="name">Tên mới</param>
        /// <returns>Đường dẫn mới</returns>
        public async Task<string> GetPath(Guid? parentID, string name)
        {
            var folderPath = "";
            if (parentID != null)
            {
                var parentFolder = FindBy(x => x.Id == parentID).FirstOrDefault();
                if (parentFolder != null)
                {
                    folderPath = parentFolder.Path + "/" + name;
                }
                else
                {
                    folderPath = "/" + name;
                }
            }
            else
            {
                folderPath = "/" + name;
            }

            return folderPath;
        }

        /// <summary>
        ///     Tạo tên file ko bị trùng trong db
        /// </summary>
        /// <param name="parentID">ID thư mục cha</param>
        /// <param name="baseName">Tên hiện tại</param>
        /// <returns>Tên mới hợp lệ</returns>
        public async Task<string> GenerateUniqueNameFromDB(Guid? parentID, string baseName)
        {
            var nameWithoutSuffix = baseName;
            var extension = "";
            var i = 1;

            // Nếu có phần mở rộng (ví dụ: .txt), tách riêng
            if (Path.HasExtension(baseName))
            {
                extension = Path.GetExtension(baseName);
                nameWithoutSuffix = Path.GetFileNameWithoutExtension(baseName);
            }

            var newName = baseName;

            while (await ExistsName(parentID, newName))
            {
                newName = $"{nameWithoutSuffix} ({i}){extension}";
                i++;
            }

            return newName;
        }

        /// <summary>
        ///     Tạo tên file vật lý hợp lệ
        /// </summary>
        /// <param name="directory">thư mục lưu file</param>
        /// <param name="baseName">tên file hiện tại</param>
        /// <returns>tên file mới</returns>
        public string GenerateUniqueNamePhysical(string directory, string baseName)
        {
            var nameWithoutExtension = baseName;
            var extension = "";
            var i = 1;

            // Kiểm tra nếu là file (có phần mở rộng)
            if (Path.HasExtension(baseName))
            {
                extension = Path.GetExtension(baseName);
                nameWithoutExtension = Path.GetFileNameWithoutExtension(baseName);
            }

            var newName = baseName;

            while (File.Exists(Path.Combine(directory, newName)) || Directory.Exists(Path.Combine(directory, newName)))
            {
                newName = $"{nameWithoutExtension} ({i}){extension}";
                i++;
            }

            return newName;
        }

        /// <summary>
        ///     Cập nhật đường dẫn của các tài liệu nằm trong khi thư mục thay đổi
        /// </summary>
        /// <param name="file">thư mục cần cập nhật</param>
        /// <returns></returns>
        public async Task UpdatePathChilds(FileManager file)
        {
            var childrens = FindBy(x => x.ParentId == file.Id).ToList();
            if (childrens == null || !childrens.Any())
            {
                return;
            }

            foreach (var item in childrens)
            {
                var oldPath = item.Path;
                item.Path = file.Path + "/" + item.Name;
                await UpdateAsync(item);

                if (item.IsDirectory == true)
                {
                    await UpdatePathChilds(item);
                }
            }
        }

        /// <summary>
        ///     Kiểm tra tên tài liệu đã tồn tại chưa
        /// </summary>
        /// <param name="parentId">Id thư mục cha</param>
        /// <param name="itemName">Tên mới</param>
        /// <returns>true nếu tồn tại</returns>
        public async Task<bool> ExistsName(Guid? parentId, string itemName)
        {
            if (string.IsNullOrWhiteSpace(itemName))
            {
                return true;
            }

            // thư mục cha là thư mục gốc
            if (parentId == null)
            {
                var lstFile = FindBy(x => x.ParentId == null).ToList();
                if (lstFile != null && lstFile.Any())
                {
                    return lstFile.Any(x => x.Name.Trim().ToLower() == itemName.Trim().ToLower());
                }
            }
            else
            {
                var NameExistsed = FindBy(x => x.ParentId == parentId)
                    .Select(x => x.Name)
                    .ToList();
                if (NameExistsed == null || !NameExistsed.Any())
                {
                    return false;
                }

                return NameExistsed.Any(x => x.Trim().ToLower().Equals(itemName.Trim().ToLower()));
            }

            return false;
        }

        #endregion

        #region Xóa file or folder

        /// <summary>
        ///     Xóa file vật lý
        /// </summary>
        /// <param name="direction">Đường dẫn tới file</param>
        /// <returns></returns>
        public async Task<bool> DeletePhysical(string direction)
        {
            try
            {
                var fullPath = direction.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString());
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                }
                //else if (Directory.Exists(fullPath))
                //{
                //    Directory.Delete(fullPath, true); 
                //}
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        ///     Xóa file or folder cả db và vật lý
        /// </summary>
        /// <param name="file">file cần xóa</param>
        /// <param name="allFile">tất cả file</param>
        /// <returns></returns>
        public async Task<bool> DeleteFileOrFolder(FileManager file, List<FileManager> allFile, string rootPath)
        {
            try
            {
                if (file == null)
                {
                    return true;
                }

                var childs = allFile.Where(x => x.ParentId == file.Id).ToList();
                if (childs == null && !childs.Any())
                {
                    return true;
                }

                foreach (var item in childs)
                {
                    await DeleteFileOrFolder(item, allFile, rootPath);
                }

                if (file.IsDirectory != true)
                {
                    var direction = Path.Combine(rootPath, file.PhysicalPath);
                    await DeletePhysical(direction);
                }

                await DeleteAsync(file);
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        ///     Xóa nhiều file or folder
        /// </summary>
        /// <param name="ids">danh sách id tài liệu cần xóa</param>
        /// <param name="rootPath">thư mục lưu file vật lý</param>
        /// <returns></returns>
        public async Task<bool> DeleteFileorFolders(List<Guid> ids, string rootPath)
        {
            if (ids == null || !ids.Any())
            {
                return true;
            }

            var allFile = await GetQueryable().ToListAsync();
            foreach (var item in ids)
            {
                var obj = allFile.FirstOrDefault(x => x.Id == item);
                if (obj != null)
                {
                    await DeleteFileOrFolder(obj, allFile, rootPath);
                }
            }

            return true;
        }

        #endregion Xóa file or folder

        #region Tạo file or folder

        /// <summary>
        ///     Tạo folder trong db
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        public async Task<FileManagerDto> CreateFolderFromDB(FileManager folder)
        {
            try
            {
                if (folder == null)
                {
                    return null;
                }

                // tạo tên mới nếu trùng
                var name = await GenerateUniqueNameFromDB(folder.ParentId, folder.Name);

                // tạo đường đẫn
                var folderPath = await GetPath(folder.ParentId, folder.Name);

                folder.Path = folderPath;
                folder.Name = name;

                await CreateAsync(folder);

                var result = _mapper.Map<FileManager, FileManagerDto>(folder);
                result.Permission = new FilePermissionDto();

                return result;
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        ///     Tạo file trong db
        /// </summary>
        /// <param name="parentID">ID thư mục cha</param>
        /// <param name="file">file</param>
        /// <param name="physicalPath">đường dẫn vật lý</param>
        /// <returns></returns>
        public async Task<FileManagerDto> CreateFileFromDB(FileManagerUploadFileVM model, string physicalPath)
        {
            if (model.File == null || string.IsNullOrEmpty(physicalPath))
            {
                return new FileManagerDto(); // Avoid returning null, return empty object
            }

            try
            {
                // tạo tên hợp lệ
                var newName = await GenerateUniqueNameFromDB(model.ParentId, model.File.FileName);
                // tạo đường dẫn
                var filePath = await GetPath(model.ParentId, newName);

                var fileManager = new FileManagerDto();
                fileManager.Name = newName;
                fileManager.IsDirectory = false;
                fileManager.Path = filePath;
                fileManager.ParentId = model.ParentId ?? null;
                fileManager.Size = model.File.Length;
                fileManager.PhysicalPath = physicalPath;
                fileManager.LoaiVanBan = !string.IsNullOrWhiteSpace(model.LoaiVanBan) ? model.LoaiVanBan : null;
                fileManager.SoKyHieu = !string.IsNullOrWhiteSpace(model.SoKyHieu) ? model.SoKyHieu : null;
                fileManager.NgayBanHanh = model.NgayBanHanh.HasValue ? model.NgayBanHanh : null;
                fileManager.TrichYeu = !string.IsNullOrWhiteSpace(model.TrichYeu) ? model.TrichYeu : null;

                await CreateAsync(fileManager);

                if (!string.IsNullOrWhiteSpace(fileManager.LoaiVanBan))
                {
                    if (Guid.TryParse(fileManager.LoaiVanBan, out var loaiVanBanGuid))
                    {
                        var lvb = await (from loaiVanBan in _dM_DuLieuDanhMucRepository.GetQueryable()
                                         where loaiVanBan.Id == loaiVanBanGuid
                                         select loaiVanBan.Name).FirstOrDefaultAsync();

                        if (lvb != null) fileManager.TenLoaiVanBan = lvb;
                    }
                }

                return fileManager;
            }
            catch (Exception)
            {
                return new FileManagerDto(); // Avoid returning null, return empty object
            }
        }

        /// <summary>
        ///     Tạo file vật lý
        /// </summary>
        /// <param name="rootPath">Đường dẫn tới thư mục lưu file vật lý</param>
        /// <param name="file">File cần tạo</param>
        /// <returns>Tên file đã lưu</returns>
        public async Task<string> CreatePhysicalFile(string direction, IFormFile file)
        {
            var result = string.Empty;
            try
            {
                if (file == null || file.Length == 0)
                {
                    return result;
                }

                // Đảm bảo thư mục tồn tại
                if (!Directory.Exists(direction))
                {
                    Directory.CreateDirectory(direction);
                }

                // Đổi tên nếu file trùng
                var filePathToUse = Path.Combine(direction, GenerateUniqueNamePhysical(direction, file.FileName));


                using (var stream = new FileStream(filePathToUse, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                result = Path.GetFileName(filePathToUse);
            }
            catch (Exception ex)
            {
                return result;
            }

            return result;
        }


        /// <summary>
        ///     Tạo file cả vật lý và db
        /// </summary>
        /// <param name="rootPath">Đường dẫn thư mục lưu file vật lý</param>
        /// <param name="parentID">Id thư mục cha</param>
        /// <param name="file">file cần tạo</param>
        /// <returns>file db đã tạo</returns>
        public async Task<FileManagerDto?> CreateFile(string rootPath, FileManagerUploadFileVM model)
        {
            if (string.IsNullOrEmpty(rootPath) || model.File == null)
            {
                return null;
            }

            try
            {
                var fileNamePS = await CreatePhysicalFile(rootPath, model.File);
                if (string.IsNullOrEmpty(fileNamePS))
                {
                    return null;
                }

                var fileDB = await CreateFileFromDB(model, fileNamePS);
                if (fileDB != null)
                {
                    //var result = new FileManagerDto();
                    //result = _mapper.Map<FileManager, FileManagerDto>(fileDB);
                    fileDB.Permission = new FilePermissionDto();
                    return fileDB;
                }
                //return fileDB;
            }
            catch (Exception)
            {
                return null;
            }

            return null;

        }

        #endregion Tạo file or folder

        #region Cập nhật file or folder

        /// <summary>
        ///     Đổi tên file hoặc folder
        /// </summary>
        /// <param name="file">tài liệu cần đổi tên</param>
        /// <param name="newName">Tên mới</param>
        /// <returns>Tài liệu đã đổi tên</returns>
        public async Task<FileManager> RenameFileOrFolder(FileManager file, string newName)
        {
            if (file == null || string.IsNullOrWhiteSpace(newName))
            {
                return null;
            }

            try
            {
                // tạo tên hợp lệ
                var name = await GenerateUniqueNameFromDB(file.ParentId, newName);
                file.Name = name;

                // tạo path mới
                var path = await GetPath(file.ParentId, name);
                file.Path = path;

                await UpdateAsync(file);

                // cập nhật lại path cho tệp con
                await UpdatePathChilds(file);

                return file;
            }
            catch (Exception)
            {
                return null;
            }
        }

        /// <summary>
        ///     Copy file vật lý
        /// </summary>
        /// <param name="sourcePath">Đường dẫn tới file cần copy</param>
        /// <returns>Tên file mới</returns>
        public async Task<string> CopyFilePhysical(string sourcePath)
        {
            if (string.IsNullOrEmpty(sourcePath) || !File.Exists(sourcePath))
            {
                return string.Empty;
            }

            try
            {
                var directory = Path.GetDirectoryName(sourcePath)!;
                var originalFileName = Path.GetFileName(sourcePath);

                // Tạo tên file mới không trùng
                var newFileName = GenerateUniqueNamePhysical(directory, originalFileName);
                var newPath = Path.Combine(directory, newFileName);

                // Sao chép file
                File.Copy(sourcePath, newPath, false);

                return newFileName;
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }

        /// <summary>
        ///     Copy file or folder db và vật lý
        /// </summary>
        /// <param name="sourceItem">item cần copy</param>
        /// <param name="destinationFolder">thư mục chứa item copy</param>
        /// <param name="allFile">Danh sách tất cả tài liệu</param>
        /// <param name="rootPath">Đường dẫn file vật lý</param>
        /// <returns></returns>
        public async Task CopyFileOrFolder(FileManager sourceItem, FileManager? destinationFolder,
            List<FileManager> allFile, string rootPath)
        {
            var fileManager = new FileManager();

            // chuyển đến thư mục mới cần phải kiểm tra tên unique
            fileManager.Name = await GenerateUniqueNameFromDB(destinationFolder?.Id, sourceItem.Name);
            fileManager.IsDirectory = sourceItem.IsDirectory;
            fileManager.Path = (destinationFolder?.Path ?? "") + "/" + fileManager.Name;
            fileManager.ParentId = destinationFolder?.Id ?? null;
            fileManager.Size = sourceItem.Size;
            fileManager.FileExtension = sourceItem.FileExtension;
            fileManager.MimeType = sourceItem.MimeType;

            // copy file vật lý
            if (sourceItem.IsDirectory != true)
            {
                var sourcePath = Path.Combine(rootPath, sourceItem.PhysicalPath);
                fileManager.PhysicalPath = await CopyFilePhysical(sourcePath);
            }

            await CreateAsync(fileManager);

            // nếu là folder thì cần copy các tệp con
            if (sourceItem.IsDirectory == true)
            {
                var childs = allFile.Where(x => x.ParentId == sourceItem.Id).ToList();
                if (childs == null || !childs.Any())
                {
                    return;
                }

                foreach (var item in childs)
                {
                    await CopyFileOrFolder(item, fileManager, allFile, rootPath);
                }
            }
        }

        /// <summary>
        ///     Di chuyển file or folder
        /// </summary>
        /// <param name="sourceItem">item cần di chuyển</param>
        /// <param name="destinationFolder">folder đích</param>
        /// <param name="allFile">tất cả tài liệu</param>
        /// <returns></returns>
        public async Task MoveFileOrFolder(FileManager sourceItem, FileManager? destinationFolder,
            List<FileManager> allFile)
        {
            // nếu cắt/dán tại chỗ thì ko thực hiện
            if (sourceItem.ParentId == destinationFolder?.Id)
            {
                return;
            }

            sourceItem.Name = await GenerateUniqueNameFromDB(destinationFolder?.Id, sourceItem.Name);
            sourceItem.Path = (destinationFolder?.Path ?? "") + "/" + sourceItem.Name;
            sourceItem.ParentId = destinationFolder?.Id ?? null;

            await UpdateAsync(sourceItem);

            if (sourceItem.IsDirectory == true)
            {
                await UpdatePathChilds(sourceItem);
            }

        }


        /// <summary>
        /// Xóa thông tin phân quyền, chia sẻ
        /// </summary>
        /// <param name="listFilemanagers">danh sách tài liệu cần xóa</param>
        /// <returns></returns>
        public async Task<bool> RemoveSecurity(List<FileManager> listFilemanagers)
        {
            try
            {
                var ids = listFilemanagers.Select(x => x.Id).ToList();
                var dataDelete = await _fileSecurityRepository.GetQueryable()
                    .Where(x => ids.Contains(x.FileID)).ToListAsync();
                if (dataDelete.Any()) _fileSecurityRepository.DeleteRange(dataDelete);
                await _fileSecurityRepository.SaveChangesAsync();
            }
            catch (Exception)
            {
                return false;
            }
            return true;
        }

        /// <summary>
        ///     Lưu thông tin phân quyền/ chia sẻ
        /// </summary>
        /// <param name="fileSecurities">danh sách thông tin phân quyền/ chia sẻ</param>
        /// <param name="fileID">ID file được chia sẻ</param>
        /// <returns></returns>
        public async Task<bool> SaveSecurity(List<FileSecurity> fileSecurities, Guid fileID, Guid SharedById)
        {
            try
            {
                var oldData = _fileSecurityRepository
                    .FindBy(x => x.FileID == fileID && x.SharedByID == SharedById)
                    .ToList();

                if (oldData != null && oldData.Any())
                {
                    _fileSecurityRepository.DeleteRange(oldData);
                }

                if (fileSecurities != null && fileSecurities.Any())
                {
                    var lstAdds = fileSecurities
                        .Where(x => x.Permission != null && x.Permission.Trim() != string.Empty)
                        .ToList();

                    if (lstAdds.Any()) _fileSecurityRepository.AddRange(lstAdds);
                }

                await _fileSecurityRepository.SaveAsync();
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        ///     Lấy thông tin phân quyền chia sẻ
        /// </summary>
        /// <param name="fileID">id tài liệu được chia sẻ</param>
        /// <param name="sharedByID">id đối tượng được chia sẻ</param>
        /// <returns></returns>
        public async Task<List<FileSecurityDto>> GetShare(Guid fileID, Guid sharedByID)
        {
            try
            {
                var data = _fileSecurityRepository
                    .FindBy(x => x.FileID == fileID)
                    .Where(x => x.SharedByID == sharedByID)
                    .Select(x => new FileSecurityDto
                    {
                        SharedByID = x.SharedByID,
                        FileID = x.FileID,
                        SharedToType = x.SharedToType,
                        SharedToID = x.SharedToID,
                        Permission = x.Permission
                    }).ToList();

                if (!data.Any()) return data;

                // Lấy danh sách các ID cần truy vấn tên
                var userIds = data
                    .Where(x => x.SharedToType == FileManagerShareTypeConstant.USER)
                    .Select(x => x.SharedToID)
                    .Distinct()
                    .ToList();

                var roleIds = data
                    .Where(x => x.SharedToType == FileManagerShareTypeConstant.ROLE)
                    .Select(x => x.SharedToID)
                    .Distinct()
                    .ToList();

                var departmentIds = data
                    .Where(x => x.SharedToType == FileManagerShareTypeConstant.DEPARTMENT)
                    .Select(x => x.SharedToID)
                    .Distinct()
                    .ToList();

                // Truy vấn 1 lần theo từng loại
                var userTask = await _aspNetUsersRepository.GetQueryable()
                    .Select(x => new { x.Id, x.Name })
                    .Where(x => userIds.Contains(x.Id))
                    .ToDictionaryAsync(x => x.Id, x => x.Name);

                var roleTask = await _roleRepository.GetQueryable()
                    .Select(x => new { x.Id, x.Name })
                    .Where(x => roleIds.Contains(x.Id))
                    .ToDictionaryAsync(x => x.Id, x => x.Name);

                var deptTask = await _departmentRepository.GetQueryable()
                    .Select(x => new { x.Id, x.Name })
                    .Where(x => departmentIds.Contains(x.Id))
                    .ToDictionaryAsync(x => x.Id, x => x.Name);

                //await Task.WhenAll(userTask, roleTask, deptTask);

                //var userDict = userTask.Result;
                //var roleDict = roleTask.Result;
                //var deptDict = deptTask.Result;


                foreach (var item in data)
                {
                    if (item.SharedToType == FileManagerShareTypeConstant.USER)
                    {
                        item.SharedToName = userTask.GetValueOrDefault(item.SharedToID, string.Empty);
                    }
                    else if (item.SharedToType == FileManagerShareTypeConstant.ROLE)
                    {
                        item.SharedToName = roleTask.GetValueOrDefault(item.SharedToID, string.Empty);
                    }
                    else if (item.SharedToType == FileManagerShareTypeConstant.DEPARTMENT)
                    {
                        item.SharedToName = deptTask.GetValueOrDefault(item.SharedToID, string.Empty);
                    }
                    else item.SharedToName = string.Empty;
                }

                return data;
            }
            catch (Exception)
            {
                return new List<FileSecurityDto>();
            }
        }

        #endregion Cập nhật file or folder
    }
}
using Hinet.Api.Dto;
using Hinet.Api.Filter;
using Hinet.Model.Entities;
using Hinet.Service.AspNetUsersService;
using Hinet.Service.Constant;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DepartmentService;
using Hinet.Service.DM_DuLieuDanhMucService;
using Hinet.Service.FileManagerService;
using Hinet.Service.FileManagerService.Dto;
using Hinet.Service.FileManagerService.ViewModels;
using Hinet.Service.FileSecurityService.Dto;
using Hinet.Service.RoleService;
using Hinet.Service.TaiLieuDinhKemService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class FileManagerController : HinetController
    {
        private readonly IAspNetUsersService _aspNetUsersService;
        private readonly IDepartmentService _departmentService;
        private readonly IFileManagerService _fileManagerService;
        private readonly ILogger<FileManagerController> _logger;
        private readonly IMapper _mapper;
        private readonly IRoleService _roleService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IDM_DuLieuDanhMucService _duLieuDanhMucService;


        private readonly string rootPath =
            Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads/filemanager/uploads");

        private readonly string rootZipPathDownLoad =
            Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads/filemanager/downloads");

        public FileManagerController(
            IFileManagerService fileManagerService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<FileManagerController> logger
            ,
            IAspNetUsersService aspNetUsersService,
            IRoleService roleService,
            IDepartmentService departmentService,
            IDM_DuLieuDanhMucService duLieuDanhMucService)
        {
            _fileManagerService = fileManagerService;
            _taiLieuDinhKemService = taiLieuDinhKemService;
            _mapper = mapper;
            _logger = logger;
            _aspNetUsersService = aspNetUsersService;
            _roleService = roleService;
            _departmentService = departmentService;
            _duLieuDanhMucService = duLieuDanhMucService;
        }


        // Get all file/folder
        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<List<FileManagerDto>>> GetData([FromBody] FileManagerSearch search)
        {
            search.UserID = UserId ?? new Guid();
            if (HasRole(VaiTroConstant.FileManager) || HasRole(VaiTroConstant.Admin))
            {
                search.IsAdmin = true;
            }

            var data = await _fileManagerService.GetDataAll(search);
            return DataResponse<List<FileManagerDto>>.Success(data);
        }


        [HttpPost("SearchData")]
        public async Task<DataResponse<List<FileManagerDto>>> SearchData([FromBody] FileManagerSearch search)
        {
            search.UserID = UserId ?? new Guid();
            if (HasRole(VaiTroConstant.Admin))
            {
                search.IsAdmin = true;
            }

            var data = await _fileManagerService.SearchData(search);
            return DataResponse<List<FileManagerDto>>.Success(data);
        }


        [HttpPost("Download")]
        public async Task<DataResponse<string>> Download([FromBody] List<Guid> fileIDs)
        {
            try
            {
                if (fileIDs == null && !fileIDs.Any())
                {
                    return DataResponse<string>.False("Dữ liệu nhận được chưa đúng");
                }

                // Chuẩn hóa đường dẫn tuyệt đối
                var fullZipFolderPath = Path.GetFullPath(rootZipPathDownLoad);

                // Đảm bảo thư mục tồn tại
                if (!Directory.Exists(fullZipFolderPath))
                {
                    Directory.CreateDirectory(fullZipFolderPath);
                }

                var searchModel = new FileManagerSearch();
                searchModel.UserID = UserId ?? new Guid();
                if (HasRole(VaiTroConstant.FileManager) || HasRole(VaiTroConstant.Admin))
                {
                    searchModel.IsAdmin = true;
                }

                var zipFilePath = await _fileManagerService.Download(fileIDs, rootPath, fullZipFolderPath, searchModel);

                if (string.IsNullOrEmpty(zipFilePath) || !System.IO.File.Exists(zipFilePath))
                {
                    return DataResponse<string>.False("Không tạo được file zip");
                }

                var fileName = Path.GetFileName(zipFilePath);
                var downloadUrl = $"{Request.Scheme}://{Request.Host}/uploads/filemanager/downloads/{fileName}";

                return DataResponse<string>.Success(downloadUrl, "Lấy link tải xuống thành công!");
            }
            catch (Exception)
            {
                return DataResponse<string>.False("Lỗi tải xuống file");
            }
        }

        // Tạo folder
        [HttpPost("Create")]
        public async Task<DataResponse<FileManagerDto>> Create([FromBody] FileManagerCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<FileManagerCreateVM, FileManager>(model);
                var newFolder = await _fileManagerService.CreateFolderFromDB(entity);

                var userId = UserId ?? Guid.NewGuid();
                var security = new FileSecurity()
                {
                    SharedByID = userId,
                    FileID = newFolder.Id,
                    SharedToType = FileManagerShareTypeConstant.USER,
                    SharedToID = userId,
                    Permission = PermissionFileConstant.NguoiSoHuu,
                    CanRead = true,
                    CanWrite = true,
                    CanDelete = true,
                    CanShare = true,
                };
                await _fileManagerService.SaveSecurity(new List<FileSecurity> { security }, newFolder.Id, UserId ?? new Guid());

                if (newFolder == null)
                {
                    return DataResponse<FileManagerDto>.False("Tạo folder mới không thành công");
                }

                return DataResponse<FileManagerDto>.Success(newFolder, "Tạo folder mới thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo FileManager");
                return DataResponse<FileManagerDto>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }

        // Upload file
        [HttpPost("UploadFile")]
        public async Task<DataResponse<FileManagerDto>> UploadFile([FromForm] FileManagerUploadFileVM model)
        {
            try
            {
                if (model.File.Length <= 0)
                {
                    return DataResponse<FileManagerDto>.False("Không nhận được tài liệu");
                }

                var newFile = await _fileManagerService.CreateFile(rootPath, model);
                if (newFile != null)
                {
                    return DataResponse<FileManagerDto>.Success(newFile, "Tải lên tài liệu thành công");
                }

                return DataResponse<FileManagerDto>.False("Tải lên tài liệu thành công");
            }
            catch (Exception)
            {
                return DataResponse<FileManagerDto>.False("Đã xảy ra lỗi khi upload file");
            }
        }

        // Copy file/folder
        [HttpPost("Copy")]
        public async Task<DataResponse> Copy([FromBody] FileManagerCopyVM model)
        {
            try
            {
                if (model == null || model.SourceItems == null || !model.SourceItems.Any())
                {
                    return DataResponse.False("Đã có lỗi trong khi truyền dữ liệu");
                }

                var allFile = await _fileManagerService.GetQueryable().ToListAsync();
                foreach (var item in model.SourceItems)
                {
                    await _fileManagerService.CopyFileOrFolder(item, model.DestinationFolder, allFile, rootPath);
                }

                return DataResponse.Success(null, "Sao chép tài liệu thành công");
            }
            catch (Exception)
            {
                return DataResponse.False("Đã xảy ra lỗi trong khi sao chép tài liệu");
            }
        }

        // Move file/folder
        [HttpPost("Move")]
        public async Task<DataResponse> Move([FromBody] FileManagerCopyVM model)
        {
            try
            {
                if (model == null || model.SourceItems == null || !model.SourceItems.Any())
                {
                    return DataResponse.False("Đã có lỗi trong khi truyền dữ liệu");
                }

                // copy 
                var allFile = await _fileManagerService.GetQueryable().ToListAsync();
                foreach (var item in model.SourceItems)
                {
                    await _fileManagerService.MoveFileOrFolder(item, model.DestinationFolder, allFile);
                }

                // xóa thông tin phân quyền
                await _fileManagerService.RemoveSecurity(model.SourceItems);

                return DataResponse.Success(null, "Di chuyển tài liệu thành công");
            }
            catch (Exception)
            {
                return DataResponse.False("Đã xảy ra lỗi trong khi sao chép tài liệu");
            }
        }

        // Delete file/folder     
        [HttpPost("Delete")]
        public async Task<DataResponse> Delete([FromBody] List<Guid> ids)
        {
            try
            {
                if (ids == null || !ids.Any())
                {
                    return DataResponse.False("Dữ liệu nhận được không đúng");
                }

                if (await _fileManagerService.DeleteFileorFolders(ids, rootPath))
                {
                    return DataResponse.Success(null, "Xóa thành công");
                }

                return DataResponse.False("Xóa không thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa FileManager với Ids: {@Ids}", ids);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }

        // Rename file/folder
        [HttpGet("Rename")]
        public async Task<DataResponse> Rename(Guid id, string newName)
        {
            try
            {
                var file = _fileManagerService.FindBy(x => x.Id == id).FirstOrDefault();
                if (file == null)
                {
                    return DataResponse.False("Không tìm thấy tài liệu");
                }

                if (string.IsNullOrWhiteSpace(newName))
                {
                    return DataResponse.False("Tên mới bị rỗng");
                }

                var newFile = await _fileManagerService.RenameFileOrFolder(file, newName);

                return DataResponse.Success(newFile, "Đổi tên thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi đổi tên FileManager với Id: {@id}", id);
                return DataResponse.False("Đã xảy ra lỗi đổi tên.");
            }
        }

        // Get securities file/folder
        [HttpGet("GetSecurity/{id}")]
        public async Task<DataResponse<List<FileSecurityDto>>> GetSecurity(Guid id)
        {
            try
            {
                var lstData = await _fileManagerService.GetShare(id, UserId ?? new Guid());
                return DataResponse<List<FileSecurityDto>>.Success(lstData, "Lấy thông tin thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin security file với Id: {@id}", id);
                return DataResponse<List<FileSecurityDto>>.False("Đã xảy ra lỗi đổi tên.");
            }
        }

        // Save securities file/folder
        [HttpPost("SaveSecurity")]
        public async Task<DataResponse> SaveSecurity([FromBody] List<FileSecurity> fileSecurities,
            [FromQuery] Guid fileID)
        {
            try
            {
                var lstdata = fileSecurities ?? new List<FileSecurity>();
                if (lstdata.Any())
                {
                    foreach (var item in fileSecurities)
                    {
                        item.SharedByID = UserId ?? new Guid();
                    }
                }

                await _fileManagerService.SaveSecurity(lstdata, fileID, UserId ?? new Guid());
                return DataResponse.Success("Phân quyền/ chia sẻ thành công");
            }
            catch (Exception)
            {
                return DataResponse.False("Đã xảy ra lỗi khi phân quyền/ chia sẻ.");
            }
        }

        // Get object to security
        [HttpGet("GetDropdownObject")]
        public async Task<DataResponse<object>> GetDropdownObject()
        {
            try
            {
                var Data = new
                {
                    dropdownUser = await _aspNetUsersService.GetDropdownOptions(x => x.Name, x => x.Id),
                    dropdownRole = await _roleService.GetDropdownOptions(x => x.Name, x => x.Id),
                    dropdownDepartment = await _departmentService.GetDropdownOptions(x => x.Name, x => x.Id)
                };
                return DataResponse<object>.Success(Data, "lấy thông tin thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin dropdown object");
                return DataResponse<object>.False("Đã xảy ra lỗi khi lấy dropdownObject security.");
            }
        }


        [HttpGet("GetDropdownOption")]
        public async Task<DataResponse<object>> GetDropdownOption()
        {
            try
            {
                var Data = new
                {
                    dropdownLVB = await _duLieuDanhMucService.GetDropdownByGroupCode(MaDanhMucConstant.LVB),
                };
                return DataResponse<object>.Success(Data, "lấy thông tin thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin dropdown object");
                return DataResponse<object>.False("Đã xảy ra lỗi khi lấy dropdownObject security.");
            }
        }


    }
}
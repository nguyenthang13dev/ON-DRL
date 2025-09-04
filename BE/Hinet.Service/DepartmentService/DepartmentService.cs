using Hinet.Model.Entities;
using Hinet.Repository.DepartmentRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.DepartmentService.Dto;
using Hinet.Service.Common;
using Hinet.Service.DepartmentService.ViewModels;
using Hinet.Model.Entities;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.UserRoleRepository;
using Hinet.Service.Constant;
using Hinet.Repository.RoleRepository;
using Hinet.Service.Dto;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Caching.Memory;
using ZstdSharp.Unsafe;
using CommonHelper.String;
using DocumentFormat.OpenXml.Wordprocessing;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using Hinet.Service.DM_DuLieuDanhMucService;
using MongoDB.Driver.Linq;
using MongoDB.Driver.Linq;
using MongoDB.Driver;

namespace Hinet.Service.DepartmentService
{
    public class DepartmentService : Service<Department>, IDepartmentService
    {
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IAppUserRepository _appUserRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IMemoryCache _cache;
        private readonly TimeSpan _defaultCacheDuration = TimeSpan.FromHours(1);
        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentService(
            IDepartmentRepository departmentRepository,
            IUserRoleRepository userRoleRepository,
            IAppUserRepository appUserRepository,
            IRoleRepository roleRepository,
            IMemoryCache cache) : base(departmentRepository)
        {
            _userRoleRepository = userRoleRepository;
            _appUserRepository = appUserRepository;
            _roleRepository = roleRepository;
            _cache = cache;
            _departmentRepository = departmentRepository;
        }

        public async Task<PagedList<FormTemplateDto>> GetData(DepartmentSearch search)
        {
            var query = from q in GetQueryable()
                        select new FormTemplateDto
                        {
                            CreatedId = q.CreatedId,
                            UpdatedId = q.UpdatedId,
                            ParentId = q.ParentId,
                            Priority = q.Priority,
                            Name = q.Name,
                            Code = q.Code,
                            ShortName = q.ShortName,
                            DiaDanh = q.DiaDanh,
                            CapBac = q.CapBac,
                            Loai = q.Loai,
                            Level = q.Level,
                            IsActive = q.IsActive,
                            IsDelete = q.IsDelete,
                            Id = q.Id,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                        };

            if (search != null)
            {
                if (!string.IsNullOrEmpty(search.Name))
                    query = query.Where(x => x.Name.ToUpper().Contains(search.Name.Trim().ToUpper()));

                if (!string.IsNullOrEmpty(search.Code))
                    query = query.Where(x => x.Code.ToUpper().Contains(search.Code.Trim().ToUpper()));

                if (search.IsActive != null)
                    query = query.Where(x => x.IsActive == search.IsActive);

                if (search.Level != null)
                    query = query.Where(x => x.Level == search.Level);

                if (!string.IsNullOrEmpty(search.Loai))
                    query = query.Where(x => x.Loai.Equals(search.Loai));
            }

            query = query.OrderByDescending(x => x.CreatedDate);
            return await PagedList<FormTemplateDto>.CreateAsync(query, search);
        }
        public async Task<FormTemplateDto> GetDtoByCode(string code)
        {
            var q = await GetQueryable()
                         .FirstOrDefaultAsync(x => x.Code.Trim().ToLower() == code.Trim().ToLower());

            if (q == null) return null;
            var result = new FormTemplateDto
            {
                CreatedId = q.CreatedId,
                UpdatedId = q.UpdatedId,
                ParentId = q.ParentId,
                Priority = q.Priority,
                Name = q.Name,
                Code = q.Code,
                Loai = q.Loai,
                Level = q.Level,
                IsActive = q.IsActive,
                IsDelete = q.IsDelete,
                Id = q.Id,
                CreatedBy = q.CreatedBy,
                UpdatedBy = q.UpdatedBy,
                DeleteId = q.DeleteId,
                CreatedDate = q.CreatedDate,
                UpdatedDate = q.UpdatedDate,
                DeleteTime = q.DeleteTime,
            };

            return result;
        }
        public async Task<FormTemplateDto> GetDto(Guid id)
        {
            string cacheKey = $"Department_Dto_{id}";

            if (!_cache.TryGetValue(cacheKey, out FormTemplateDto dto))
            {
                dto = await (from q in GetQueryable().Where(x => x.Id == id)
                             select new FormTemplateDto
                             {
                                 CreatedId = q.CreatedId,
                                 UpdatedId = q.UpdatedId,
                                 ParentId = q.ParentId,
                                 Priority = q.Priority,
                                 Name = q.Name,
                                 Code = q.Code,
                                 Loai = q.Loai,
                                 Level = q.Level,
                                 IsActive = q.IsActive,
                                 IsDelete = q.IsDelete,
                                 Id = q.Id,
                                 CreatedBy = q.CreatedBy,
                                 UpdatedBy = q.UpdatedBy,
                                 DeleteId = q.DeleteId,
                                 CreatedDate = q.CreatedDate,
                                 UpdatedDate = q.UpdatedDate,
                                 DeleteTime = q.DeleteTime,
                             }).FirstOrDefaultAsync();

                if (dto != null)
                {
                    _cache.Set(cacheKey, dto, _defaultCacheDuration);
                }
            }

            return dto ?? throw new Exception("Department not found");
        }

        public async Task<FormTemplateDto> GetDetail(Guid id)
        {
            string cacheKey = $"Department_Detail_{id}";

            if (!_cache.TryGetValue(cacheKey, out FormTemplateDto result))
            {
                var currentDept = await GetByIdAsync(id) ?? throw new Exception("Department not found");

                var deptUser = new List<DepartmentUser>();
                if (currentDept.Loai.Equals(DepartmentTypeConstant.Department))
                {
                    var userIds = _userRoleRepository.GetQueryable().Where(x => x.DepartmentId.Equals(id)).Select(x => x.UserId);
                    deptUser = _appUserRepository
                        .GetQueryable()
                        .Where(x => userIds.Contains(x.Id))
                        .Select(x => new DepartmentUser
                        {
                            Id = x.Id,
                            Name = x.Name
                        }).ToList();
                }

                result = new FormTemplateDto
                {
                    CreatedId = currentDept.CreatedId,
                    UpdatedId = currentDept.UpdatedId,
                    ParentId = currentDept.ParentId,
                    Priority = currentDept.Priority,
                    Name = currentDept.Name,
                    Code = currentDept.Code,
                    Loai = currentDept.Loai,
                    Level = currentDept.Level,
                    IsActive = currentDept.IsActive,
                    IsDelete = currentDept.IsDelete,
                    Id = currentDept.Id,
                    CreatedBy = currentDept.CreatedBy,
                    UpdatedBy = currentDept.UpdatedBy,
                    DeleteId = currentDept.DeleteId,
                    CreatedDate = currentDept.CreatedDate,
                    UpdatedDate = currentDept.UpdatedDate,
                    DeleteTime = currentDept.DeleteTime,
                    Users = deptUser,
                };

                _cache.Set(cacheKey, result, _defaultCacheDuration);
            }

            return result;
        }

        public List<DepartmentHierarchy> GetDepartmentHierarchy()
        {
            string cacheKey = "Department_Hierarchy";

            if (!_cache.TryGetValue(cacheKey, out List<DepartmentHierarchy> result))
            {
                var departments = GetQueryable()
                    .Select(d => new DepartmentHierarchy
                    {
                        Id = d.Id,
                        Title = d.Name,
                        Code = d.Code,
                        ShortName = d.ShortName,
                        DiaDanh = d.DiaDanh,
                        CapBac = d.CapBac,
                        ParentId = d.ParentId,
                        Priority = d.Priority,
                        Level = d.Level,
                        Loai = d.Loai,
                        IsActive = d.IsActive,
                    })
                    .OrderBy(d => d.Priority).ToList();

                var departmentHierarchy = departments
                    .Where(d => d.ParentId == null)
                    .Select(d => new DepartmentHierarchy
                    {
                        Id = d.Id,
                        Title = d.Title,
                        Code = d.Code,
                        ParentId = d.ParentId,
                        Priority = d.Priority,
                        Level = d.Level,
                        Loai = d.Loai,
                        ShortName = d.ShortName,
                        DiaDanh = d.DiaDanh,
                        CapBac = d.CapBac,
                        IsActive = d.IsActive,
                        Children = GetChildren(d.Id, departments)
                    });

                result = departmentHierarchy.ToList();
                _cache.Set(cacheKey, result, _defaultCacheDuration);
            }

            return result;
        }

        private List<DepartmentHierarchy>? GetChildren(Guid parentId, List<DepartmentHierarchy> departments)
        {
            var children = departments
                .Where(d => d.ParentId == parentId)
                .Select(d => new DepartmentHierarchy
                {
                    Id = d.Id,
                    Title = d.Title,
                    Code = d.Code,
                    CapBac = d.CapBac,
                    DiaDanh = d.DiaDanh,
                    ShortName = d.ShortName,
                    ParentId = d.ParentId,
                    Priority = d.Priority,
                    Level = d.Level,
                    Loai = d.Loai,
                    IsActive = d.IsActive,
                    Children = GetChildren(d.Id, departments)
                })
                .ToList();
            return children.Any() ? children : null;
        }

        public async Task<List<DropdownOption>> GetDropDown(string? selected)
        {
            string cacheKey = $"Department_Dropdown_{selected}";

            if (!_cache.TryGetValue(cacheKey, out List<DropdownOption> result))
            {

                try
                {
                    result = await (from departmentTbl in GetQueryable()
                                    select new DropdownOption
                                    {
                                        Label = departmentTbl.Name,
                                        Value = departmentTbl.Code,
                                        Selected = selected != null ? selected == departmentTbl.Id.ToString() : false
                                    }).ToListAsync();

                    _cache.Set(cacheKey, result, _defaultCacheDuration);
                }
                catch (Exception ex)
                {
                    throw new Exception("Failed to retrieve dropdown options: " + ex.Message);
                }

            }

            return result;
        }

        public async Task<List<DropdownOption>> GetDropRolesInDepartment(Guid? departmentId, Guid? userId)
        {
            if (!departmentId.HasValue || !userId.HasValue)
                return new List<DropdownOption>();

            string cacheKey = $"Department_Roles_{departmentId}_{userId}";

            if (!_cache.TryGetValue(cacheKey, out List<DropdownOption> result))
            {
                try
                {
                    result = await (from departmentTbl in GetQueryable().Where(x => x.Id == departmentId)
                                    join userRoleTbl in _userRoleRepository.GetQueryable().Where(x => x.UserId == userId)
                                    on departmentTbl.Id equals userRoleTbl.DepartmentId
                                    into userRoleGr
                                    from userRoletData in userRoleGr.DefaultIfEmpty()
                                    join roleTbl in _roleRepository.GetQueryable()
                                    on userRoletData.RoleId equals roleTbl.Id
                                    select new DropdownOption
                                    {
                                        Label = roleTbl.Name,
                                        Value = roleTbl.Code,
                                    }).ToListAsync();

                    _cache.Set(cacheKey, result, _defaultCacheDuration);
                }
                catch (Exception ex)
                {
                    throw new Exception("Failed to retrieve roles in department: " + ex.Message);
                }
            }

            return result;
        }

        #region Hàm lấy dropdown value = Id phòng ban dưới dạng cây dùng trong TreeSelect của antd

        public async Task<List<DropdownOptionTree>> GetDropdownTreeOption(bool disabledParent = true)
        {
            string cacheKey = $"Department_TreeOption_{disabledParent}";

            if (!_cache.TryGetValue(cacheKey, out List<DropdownOptionTree> result))
            {
                var departments = await GetQueryable()
                    .Where(x => x.IsActive).ToListAsync();
                var rootDepartments = departments.Where(d => d.ParentId == null).ToList();
                result = new List<DropdownOptionTree>();

                foreach (var dept in rootDepartments)
                {
                    result.Add(BuildTree(dept, departments, disabledParent));
                }

                _cache.Set(cacheKey, result, _defaultCacheDuration);
            }

            return result;
        }

        #region Hàm lấy dropdown value= code phòng ban dưới dạng cây dùng trong TreeSelect của antd

        public async Task<List<DropdownOptionTree>> GetCodeDropdownTreeOption(bool disabledParent = true)
        {
            var departments = await GetQueryable()
                .Where(x => x.IsActive).ToListAsync();

            var rootDepartments = departments.Where(d => d.ParentId == null).ToList();
            var result = new List<DropdownOptionTree>();

            foreach (var dept in rootDepartments)
            {
                result.Add(GetCodeBuildTree(dept, departments, disabledParent));
            }

            return result;
        }

        public async Task<List<DropdownOptionTree>> GetDropdownTreeOptionByUserDepartment(bool disabledParent = true, Guid? donViId = null)
        {
            string cacheKey = $"Department_TreeOptionByUser_{disabledParent}_{donViId}";

            if (!_cache.TryGetValue(cacheKey, out List<DropdownOptionTree> result))
            {
                result = new List<DropdownOptionTree>();

                var departments = await GetQueryable()
                    .Where(x => x.IsActive).ToListAsync() ?? new List<Department>();

                List<Department>? rootDepartments;

                // nếu là admin thì lấy hết phòng ban
                if (donViId != null)
                {
                    var dpName = departments.FirstOrDefault(x => x.Id == donViId)?.Name;
                    result.Add(new DropdownOptionTree()
                    {
                        Children = null,
                        Disabled = false,
                        Title = dpName,
                        Value = donViId.ToString(),
                    });
                }
                // chỉ lấy chính phòng đó
                else
                {
                    rootDepartments = departments.Where(x => x.ParentId == donViId).ToList();
                    foreach (var dept in rootDepartments)
                    {
                        result.Add(BuildTree(dept, departments, disabledParent));
                    }
                }

                _cache.Set(cacheKey, result, _defaultCacheDuration);
            }

            return result;
        }

        public async Task<List<DropdownOptionTree>> GetSubAndCurrentUnitDropdownTreeByUserDepartment(bool disabledParent = true, Guid? donViId = null)
        {
            string cacheKey = $"Department_SubAndCurrent_{disabledParent}_{donViId}";

            if (!_cache.TryGetValue(cacheKey, out List<DropdownOptionTree> result))
            {
                result = new List<DropdownOptionTree>();
                var departments = await GetQueryable()
                    .Where(x => x.IsActive).ToListAsync() ?? new List<Department>();
                var department = departments.Where(x => x.Id == donViId).FirstOrDefault();

                if (department != null)
                {
                    result.Add(BuildTree(department, departments, disabledParent));
                }

                _cache.Set(cacheKey, result, _defaultCacheDuration);
            }

            return result;
        }

        private DropdownOptionTree BuildTree(Department department, List<Department> allDepartments, bool disabledParent)
        {
            var children = allDepartments.Where(d => d.ParentId == department.Id).ToList();

            return new DropdownOptionTree
            {
                Value = department.Id.ToString().ToLower(),
                Title = department.Name,
                Disabled = disabledParent && department.ParentId == null,
                Children = children.Any()
                    ? children.Select(child => BuildTree(child, allDepartments, disabledParent)).ToList()
                    : new List<DropdownOptionTree>()
            };
        }
        private DropdownOptionTree GetCodeBuildTree(Department department, List<Department> allDepartments, bool disabledParent)
        {
            var children = allDepartments.Where(d => d.ParentId == department.Id).ToList();

            return new DropdownOptionTree
            {
                Value = department.Code,
                Title = department.Name,
                Disabled = disabledParent && department.ParentId == null,
                Children = children.Any()
                    ? children.Select(child => GetCodeBuildTree(child, allDepartments, disabledParent)).ToList()
                    : new List<DropdownOptionTree>()
            };
        }

        #endregion

        public List<DepartmentVM> BuildDepartmentHierarchy()
        {
            string cacheKey = "Department_BuildHierarchy";

            if (!_cache.TryGetValue(cacheKey, out List<DepartmentVM> result))
            {
                var departments = GetQueryable().ToList();
                result = GetDepartmentHierarchy(departments, null);
                _cache.Set(cacheKey, result, _defaultCacheDuration);
            }

            return result;
        }

        private List<DepartmentVM> GetDepartmentHierarchy(List<Department> departments, Guid? parentId = null)
        {
            return departments
                .Where(d => d.ParentId == parentId)
                .Select(d => new DepartmentVM
                {
                    Id = d.Id,
                    Name = d.Name,
                    Code = d.Code,
                    ParentId = d.ParentId,
                    Priority = d.Priority,
                    Level = d.Level,
                    IsActive = d.IsActive,
                    DepartmentChilds = GetDepartmentHierarchy(departments, d.Id)
                })
                .ToList();
        }

        public async Task<List<DepartmentExport>> GetDepartmentExportData(string type)
        {
            var query = (from q in GetQueryable().Where(x => x.Loai.Equals(type))
                         join d in GetQueryable()
                         on q.ParentId equals d.Id into departmentGroup
                         from dept in departmentGroup.DefaultIfEmpty()
                         select new
                         {
                             Parent = dept != null ? dept.Name : "",
                             Name = q.Name,
                             Code = q.Code,
                             IsActive = q.IsActive,
                             CreatedDate = q.CreatedDate,
                         }).OrderByDescending(x => x.CreatedDate);

            var departments = await query.ToListAsync();
            return departments
                .Select((item, index) => new DepartmentExport
                {
                    STT = index + 1,
                    Name = item.Name,
                    Code = item.Code,
                    Status = item.IsActive ? "Hoạt động" : "Khoá",
                    Parent = item.Parent,
                    CreatedDate = item.CreatedDate.ToString("dd/MM/yyyy"),
                }).ToList();
        }

        public List<Guid> GetChildIds(List<Guid> ids)
        {
            string cacheKey = $"Department_ChildIds_{string.Join("_", ids)}";

            if (!_cache.TryGetValue(cacheKey, out List<Guid> result))
            {
                result = new List<Guid>();
                if (ids == null || !ids.Any()) return result;

                var childIds = GetQueryable().Where(x => x.ParentId != null && ids.Contains(x.ParentId.Value))
                    .Select(x => x.Id)
                    .ToList();

                if (childIds != null && childIds.Any())
                {
                    result.AddRange(childIds);
                    result.AddRange(GetChildIds(childIds));
                }

                _cache.Set(cacheKey, result, _defaultCacheDuration);
            }

            return result;
        }

        // Thêm các phương thức để xóa cache khi dữ liệu thay đổi
        public override async Task CreateAsync(Department entity)
        {
            ClearDepartmentCaches();
            await base.CreateAsync(entity);
        }

        public override async Task UpdateAsync(Department entity)
        {
            ClearDepartmentCaches();
            _cache.Remove($"Department_Dto_{entity.Id}");
            _cache.Remove($"Department_Detail_{entity.Id}");
            await base.UpdateAsync(entity);
        }

        public override async Task DeleteAsync(Department entity)
        {
            ClearDepartmentCaches();
            _cache.Remove($"Department_Dto_{entity.Id}");
            _cache.Remove($"Department_Detail_{entity.Id}");
            await base.DeleteAsync(entity);
        }

        private void ClearDepartmentCaches()
        {
            // Xóa cache chung
            _cache.Remove("Department_Hierarchy");
            _cache.Remove("Department_BuildHierarchy");

            // Các cache khác sẽ hết hạn theo thời gian
        }
        //Lấy userId dựa vào phòng và vai trò
        public Task<Guid> GetUserIdByRoleAndDepartment(Guid donViId, string maVaiTro)
        {
            var query = from user in _appUserRepository.GetQueryable().Where(x => x.DonViId == donViId)
                        join userRole in _userRoleRepository.GetQueryable()
                        on user.Id equals userRole.UserId
                        join role in _roleRepository.GetQueryable().Where(x => x.Code == maVaiTro)
                        on userRole.RoleId equals role.Id
                        select user.Id;
            return query.FirstOrDefaultAsync();
        }

        public async Task<List<DropdownOption>> GetDropDownByShortName(string? shortName)
        {
            shortName = shortName ?? "".Trim();
            var parentDeparment = await _departmentRepository.GetQueryable().FirstOrDefaultAsync(x => x.ParentId == null && x.ShortName.ToLower() == shortName.ToLower());
            if (parentDeparment == null)
            {
                return await (from departmentTbl in GetQueryable()
                              select new DropdownOption
                              {
                                  Label = departmentTbl.Name,
                                  Value = departmentTbl.Id.ToString(),
                              }).ToListAsync();
            }
            return await (from departmentTbl in GetQueryable().Where(x => x.ParentId == parentDeparment.Id)
                          select new DropdownOption
                          {
                              Label = departmentTbl.Name,
                              Value = departmentTbl.Id.ToString(),
                          }).ToListAsync();
        }
        #endregion
    }
}
using Hinet.Model.Entities;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.DM_DuLieuDanhMucService.Dto;
using Hinet.Service.Common;
using Microsoft.EntityFrameworkCore;
using Hinet.Repository.DM_NhomDanhMucRepository;
using Hinet.Service.Dto;
using Hinet.Repository.DepartmentRepository;
using Hinet.Repository.TaiLieuDinhKemRepository;
using Hinet.Service.Constant;
using Microsoft.Extensions.Caching.Memory;
using CommonHelper.Extenions;
using Microsoft.EntityFrameworkCore.Update;

namespace Hinet.Service.DM_DuLieuDanhMucService
{
    public class DM_DuLieuDanhMucService : Service<DM_DuLieuDanhMuc>, IDM_DuLieuDanhMucService
    {
        private readonly IDM_NhomDanhMucRepository _dM_NhomDanhMucRepository;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly ITaiLieuDinhKemRepository _taiLieuDinhKemRepository;
        private readonly IDM_DuLieuDanhMucRepository _dM_DuLieuDanhMucRepository;

        public DM_DuLieuDanhMucService(
            IDM_NhomDanhMucRepository dM_NhomDanhMucRepository,
            IDepartmentRepository departmentRepository,
            ITaiLieuDinhKemRepository taiLieuDinhKemRepository,
            IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository) : base(dM_DuLieuDanhMucRepository)
        {
            this._dM_NhomDanhMucRepository = dM_NhomDanhMucRepository;
            this._departmentRepository = departmentRepository;
            this._taiLieuDinhKemRepository = taiLieuDinhKemRepository;
            _dM_DuLieuDanhMucRepository = dM_DuLieuDanhMucRepository;

        }
        #region Private Method
        private DropdownOptionTree BuildTree(DM_NhomDanhMuc educationLevel, List<DM_DuLieuDanhMuc> allEducationLevel, bool disabledParent)
        {

            return new DropdownOptionTree
            {
                Value = educationLevel.Id.ToString().ToLower(),
                Title = educationLevel.GroupName,
                Disabled = disabledParent,
                Children = allEducationLevel.Any()
                    ? allEducationLevel.Select(child => BuildChildTree(child, allEducationLevel)).ToList()
                    : new List<DropdownOptionTree>()
            };
        }
        private DropdownOptionTree BuildChildTree(DM_DuLieuDanhMuc educationLevel, List<DM_DuLieuDanhMuc> allEducationLevel)
        {

            return new DropdownOptionTree
            {
                Value = educationLevel.Id.ToString().ToLower(),
                Title = educationLevel.Name,
                Children = []
            };
        }
        #endregion
        public async Task<PagedList<DM_DuLieuDanhMucDto>> GetData(DM_DuLieuDanhMucSearch search)
        {
            try
            {
                var query = from q in GetQueryable()
                            join donvi in _departmentRepository.GetQueryable()
                            on q.DonViId equals donvi.Id into jDonVi
                            from dv in jDonVi.DefaultIfEmpty()

                            join tailieu in _taiLieuDinhKemRepository.GetQueryable().Where(x => x.LoaiTaiLieu == LoaiTaiLieuConstant.FileDuLieuDanhMuc)
                            on q.FileDinhKem equals tailieu.Id into jtailieu
                            from tailieuinfo in jtailieu.DefaultIfEmpty()
                            select new DM_DuLieuDanhMucDto
                            {
                                CreatedId = q.CreatedId,
                                UpdatedId = q.UpdatedId,
                                GroupId = q.GroupId,
                                Name = q.Name,
                                Code = q.Code,
                                Note = q.Note,
                                Priority = q.Priority,
                                DonViId = q.DonViId,
                                DuongDanFile = tailieuinfo.DuongDanFile,
                                TenFileDinhKem = tailieuinfo.TenTaiLieu,
                                FileDinhKem = q.FileDinhKem,
                                NoiDung = q.NoiDung,
                                IsDelete = q.IsDelete,
                                Id = q.Id,
                                CreatedBy = q.CreatedBy,
                                UpdatedBy = q.UpdatedBy,
                                DeleteId = q.DeleteId,
                                CreatedDate = q.CreatedDate,
                                UpdatedDate = q.UpdatedDate,
                                DeleteTime = q.DeleteTime,
                                TenDonVi = dv.Name
                            };

                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.GroupId) && Guid.TryParse(search.GroupId, out var groupIdValue))
                        query = query.Where(x => x.GroupId == groupIdValue);

                    if (!string.IsNullOrEmpty(search.Name))
                        query = query.Where(x => x.Name.Trim().ToLower().Contains(search.Name.Trim().ToLower()));

                    if (!string.IsNullOrEmpty(search.Code))
                        query = query.Where(x => x.Code.Trim().ToLower().Contains(search.Code.Trim().ToLower()));
                }

                query = query.OrderBy(x => x.Priority);
                return await PagedList<DM_DuLieuDanhMucDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message);
            }
        }
        public async Task<DM_DuLieuDanhMucDto> GetDtoByCode(string Code)
        {
            var q = await GetQueryable().FirstOrDefaultAsync(x => x.Code.Trim().ToLower() == Code.Trim().ToLower());
            if (q == null) return null;
            var result = new DM_DuLieuDanhMucDto
            {
                CreatedId = q.CreatedId,
                UpdatedId = q.UpdatedId,
                GroupId = q.GroupId,
                Name = q.Name,
                Code = q.Code,
                Note = q.Note,
                Priority = q.Priority,
                DonViId = q.DonViId,
                DuongDanFile = q.DuongDanFile,
                NoiDung = q.NoiDung,
                IsDelete = q.IsDelete,
                Id = q.Id,
                CreatedBy = q.CreatedBy,
                UpdatedBy = q.UpdatedBy,
                DeleteId = q.DeleteId,
                CreatedDate = q.CreatedDate,
                UpdatedDate = q.UpdatedDate,
                DeleteTime = q.DeleteTime
            };
            return result;
        }
        public async Task<DM_DuLieuDanhMucDto> GetDto(Guid id)
        {
            try
            {
                var item = await (from q in GetQueryable().Where(x => x.Id == id)
                                  select new DM_DuLieuDanhMucDto
                                  {
                                      CreatedId = q.CreatedId,
                                      UpdatedId = q.UpdatedId,
                                      GroupId = q.GroupId,
                                      Name = q.Name,
                                      Code = q.Code,
                                      Note = q.Note,
                                      Priority = q.Priority,
                                      DonViId = q.DonViId,
                                      DuongDanFile = q.DuongDanFile,
                                      NoiDung = q.NoiDung,
                                      IsDelete = q.IsDelete,
                                      Id = q.Id,
                                      CreatedBy = q.CreatedBy,
                                      UpdatedBy = q.UpdatedBy,
                                      DeleteId = q.DeleteId,
                                      CreatedDate = q.CreatedDate,
                                      UpdatedDate = q.UpdatedDate,
                                      DeleteTime = q.DeleteTime,
                                  }).FirstOrDefaultAsync();

                return item ?? throw new Exception("Data not found for ID: " + id);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve DTO: " + ex.Message);
            }
        }

        public async Task<List<DropdownOption>> GetDropdownByGroupCode(string groupCode)
        {
            return await (from dulieu in GetQueryable()
                          where dulieu.ParentId == null
                          join nhom in _dM_NhomDanhMucRepository.GetQueryable()
                          on dulieu.GroupId equals nhom.Id
                          where nhom.GroupCode == groupCode
                          orderby dulieu.Priority
                          select new DropdownOption
                          {
                              Value = dulieu.Id.ToString(),
                              Label = dulieu.Name
                          }).ToListAsync();
        }

        public async Task<List<DropdownOption>> GetDropdownCodeByGroupCode(string groupCode)
        {
            return await (from dulieu in GetQueryable()
                          join nhom in _dM_NhomDanhMucRepository.GetQueryable()
                          on dulieu.GroupId equals nhom.Id
                          where nhom.GroupCode == groupCode
                          orderby dulieu.Priority
                          select new DropdownOption
                          {
                              Value = dulieu.Code,
                              Label = dulieu.Name
                          }).ToListAsync();
        }

        public async Task<List<DM_DuLieuDanhMucDto>> GetListDataByGroupCode(string groupCode)
        {
            try
            {
                var query = from q in GetQueryable()
                            join nhom in _dM_NhomDanhMucRepository.GetQueryable()
                            on q.GroupId equals nhom.Id
                            where nhom.GroupCode == groupCode
                            select new DM_DuLieuDanhMucDto
                            {
                                GroupId = q.GroupId,
                                Name = q.Name,
                                Code = q.Code,
                                Note = q.Note,
                                Priority = q.Priority,
                                DonViId = q.DonViId,
                                DuongDanFile = q.DuongDanFile,
                                NoiDung = q.NoiDung,
                                Id = q.Id,
                            };
                var data = await query.OrderBy(x => x.Priority).ToListAsync();
                return new List<DM_DuLieuDanhMucDto>(data);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message);
            }
        }
        public async Task<List<DropdownOptionTree>> GetDropdownOptionTrees (string groupCode)
        {
            var query = await (from q in GetQueryable().Where(x => x.Note == null)
                         join nhom in _dM_NhomDanhMucRepository.GetQueryable()
                         on q.GroupId equals nhom.Id
                         where nhom.GroupCode == groupCode
                         orderby q.Priority
                         join child in GetQueryable()
                         on q.Code equals child.Note into gChild
                         select new DropdownOptionTree
                         {
                             Title = q.Name,
                             Value = q.Id.ToString(),
                             Children = gChild
                             .Where(c => c.GroupId == nhom.Id && nhom.GroupCode == groupCode) 
                             .OrderBy(c => c.Priority)
                             .Select(c => new DropdownOptionTree {
                                 Title = c.Name,
                                 Value = c.Id.ToString(),
                             }).ToList(),
                             Disabled = gChild.Count() > 0? true: false
                         }).ToListAsync();

            return query;
        }
        public async Task<List<DropdownOption>> GetDropdownCodeByGroupCodeAndNote(string groupCode, string note)
        {
            return await (from dulieu in GetQueryable()
                          join nhom in _dM_NhomDanhMucRepository.GetQueryable()
                          on dulieu.GroupId equals nhom.Id
                          where nhom.GroupCode == groupCode && 
                          dulieu.Note == note   
                          orderby dulieu.Priority
                          select new DropdownOption
                          {
                              Value = dulieu.Code,
                              Label = dulieu.Name
                          }).ToListAsync();
        }
        public async Task<DropdownOptionTree> GetEduLevelTreeOption( Guid? idNhomDanhMuc,bool disabledParent = true)
        {
            //var rootEducationLevel = await _dM_NhomDanhMucRepository.Where(x=>x.GroupCode.ToUpper() == "TDHV").FirstOrDefaultAsync();
                if (!idNhomDanhMuc.HasValue)
                {
                    return new DropdownOptionTree();
                }
                var rootEducationLevel = await _dM_NhomDanhMucRepository.Where(x => x.Id == idNhomDanhMuc).FirstOrDefaultAsync();
                if (rootEducationLevel == null) 
                {
                    return new DropdownOptionTree();
                }
                var educationLevels = await _dM_DuLieuDanhMucRepository.Where(x=>x.GroupId == rootEducationLevel.Id && x.ParentId == null).ToListAsync();
                if(educationLevels == null)
                {
                    return new DropdownOptionTree();
                }
                var result = new DropdownOptionTree();
                result = BuildTree(rootEducationLevel, educationLevels,disabledParent);
            return result;
        }
        public async Task<List<DropdownOption>> GetDropDownByDonViId(Guid Id)
        {
            try
            {
               
                return await (from dulieu in GetQueryable()
                              where dulieu.ParentId == Id
                              select new DropdownOption
                              {
                                  Value = dulieu.Id.ToString(),
                                  Label = dulieu.Name
                              }).ToListAsync();
            }catch
            {
                throw;
            }
        }

    }
}
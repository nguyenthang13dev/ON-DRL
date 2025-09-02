using Hinet.Model.Entities;
using Hinet.Repository.ArcFontRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.ArcFontService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities.LuuTruBQP;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using Hinet.Repository.DM_NhomDanhMucRepository;
using Hinet.Repository.DepartmentRepository;



namespace Hinet.Service.ArcFontService
{
    public class ArcFontService : Service<ArcFont>, IArcFontService
    {

        public ArcFontService(
            IArcFontRepository arcFontRepository,
            IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository,
            IDM_NhomDanhMucRepository dM_NhomDanhMucRepository,
            IDepartmentRepository departmentRepository
            ) : base(arcFontRepository)
        {
            _DM_DuLieuDanhMucRepository = dM_DuLieuDanhMucRepository;
            _DM_NhomDanhMucRepository = dM_NhomDanhMucRepository;
            _DepartmentRepository = departmentRepository;
        }

        public IDM_DuLieuDanhMucRepository _DM_DuLieuDanhMucRepository { get; }
        public IDM_NhomDanhMucRepository _DM_NhomDanhMucRepository { get; }
        public IDepartmentRepository _DepartmentRepository { get; }


        public async Task<PagedList<ArcFontDto>> GetData(ArcFontSearch search)
        {
            var query = from q in GetQueryable()

                        join department in _DepartmentRepository.GetQueryable()
                        on q.Identifier equals department.Code into departmenttbl
                        from departmentInfo in departmenttbl.DefaultIfEmpty()

                        select new ArcFontDto()
                        {
                            Identifier = q.Identifier,
                            OrganId = q.OrganId,
                            FondName = q.FondName,
                            FondHistory = q.FondHistory,
                            ArchivesTime = q.ArchivesTime,
                            ArchivesTimeStart = q.ArchivesTimeStart,
                            ArchivesTimeEnd = q.ArchivesTimeEnd,
                            PaperTotal = q.PaperTotal,
                            PaperDigital = q.PaperDigital,
                            KeyGroups = q.KeyGroups,
                            OtherTypes = q.OtherTypes,
                            Language = q.Language,
                            LookupTools = q.LookupTools,
                            CopyNumber = q.CopyNumber,
                            Description = q.Description,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                            Identifier_Name = departmentInfo.Name,
                            
                        };
            if (search != null)
            {
                if (!string.IsNullOrEmpty(search.Identifier))
                {
                    query = query.Where(x => EF.Functions.Like(x.Identifier, $"%{search.Identifier}%"));
                }
                if (!string.IsNullOrEmpty(search.OrganId))
                {
                    query = query.Where(x => EF.Functions.Like(x.OrganId, $"%{search.OrganId}%"));
                }
                if (!string.IsNullOrEmpty(search.FondName))
                {
                    query = query.Where(x => EF.Functions.Like(x.FondName, $"%{search.FondName}%"));
                }
                if (search.ArchivesTimeStart.HasValue)
                {
                    query = query.Where(x => x.ArchivesTimeStart == search.ArchivesTimeStart);
                }
                if (search.ArchivesTimeEnd.HasValue)
                {
                    query = query.Where(x => x.ArchivesTimeEnd == search.ArchivesTimeEnd);
                }
                if (search.PaperTotal.HasValue)
                {
                    query = query.Where(x => x.PaperTotal == search.PaperTotal);
                }
                if (search.PaperDigital.HasValue)
                {
                    query = query.Where(x => x.PaperDigital == search.PaperDigital);
                }
                if (!string.IsNullOrEmpty(search.Language))
                {
                    query = query.Where(x => EF.Functions.Like(x.Language, $"%{search.Language}%"));
                }
            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<ArcFontDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<ArcFontDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)

                              select new ArcFontDto()
                              {
                                  Identifier = q.Identifier,
                                  OrganId = q.OrganId,
                                  FondName = q.FondName,
                                  FondHistory = q.FondHistory,
                                  ArchivesTime = q.ArchivesTime,
                                  ArchivesTimeStart = q.ArchivesTimeStart,
                                  ArchivesTimeEnd = q.ArchivesTimeEnd,
                                  PaperTotal = q.PaperTotal,
                                  PaperDigital = q.PaperDigital,
                                  KeyGroups = q.KeyGroups,
                                  OtherTypes = q.OtherTypes,
                                  Language = q.Language,
                                  LookupTools = q.LookupTools,
                                  CopyNumber = q.CopyNumber,
                                  Description = q.Description,
                                  CreatedBy = q.CreatedBy,
                                  UpdatedBy = q.UpdatedBy,
                                  IsDelete = q.IsDelete,
                                  DeleteId = q.DeleteId,
                                  CreatedDate = q.CreatedDate,
                                  UpdatedDate = q.UpdatedDate,
                                  DeleteTime = q.DeleteTime,
                                  Id = q.Id,
                              }).FirstOrDefaultAsync();

            return item;
        }
        public async Task<bool> CheckOrganID(string value,Guid? Id)
        {
            return await GetQueryable().Where(x => (x.OrganId??"").Trim() == (value ?? "").Trim() && x.Id != Id).AnyAsync();
        }

    }
}

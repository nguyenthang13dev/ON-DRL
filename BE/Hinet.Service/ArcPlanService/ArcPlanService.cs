using Hinet.Model.Entities;
using Hinet.Repository.ArcPlanRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.ArcPlanService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities.LuuTruBQP;
using Hinet.Repository.DM_NhomDanhMucRepository;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using Hinet.Service.Constant;



namespace Hinet.Service.ArcPlanService
{
    public class ArcPlanService : Service<ArcPlan>, IArcPlanService
    {

        private readonly IDM_NhomDanhMucRepository _dM_NhomDanhMucRepository;
        private readonly IDM_DuLieuDanhMucRepository _dM_DuLieuDanhMucRepository;



        public ArcPlanService(
            IArcPlanRepository arcPlanRepository
, IDM_NhomDanhMucRepository dM_NhomDanhMucRepository,
IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository) : base(arcPlanRepository)
        {
            _dM_NhomDanhMucRepository = dM_NhomDanhMucRepository;
            _dM_DuLieuDanhMucRepository = dM_DuLieuDanhMucRepository;
        }

        public async Task<PagedList<ArcPlanDto>> GetData(ArcPlanSearch search)
        {
            var duLieuDanhMuc = from dm in _dM_DuLieuDanhMucRepository.GetQueryable()
                                join nhom in _dM_NhomDanhMucRepository.GetQueryable()
                                on dm.GroupId equals nhom.Id
                                select new { dm.Code, dm.Name, nhom.GroupCode };

            var ttkhs = duLieuDanhMuc.Where(x => x.GroupCode == MaDanhMucConstant.TTKH);

            var query = from q in GetQueryable()
                        join ttkh in ttkhs on q.Status equals ttkh.Code into ttkhGroup
                        from ttkh in ttkhGroup.DefaultIfEmpty()

                        select new ArcPlanDto()
                        {
                            Description = q.Description,
                            EndDate = q.EndDate,
                            GhiChu = q.GhiChu,
                            Method = q.Method,
                            Name = q.Name,
                            Outcome = q.Outcome,
                            PlanID = q.PlanID,
                            StartDate = q.StartDate,
                            Status = q.Status,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                            StatusName = ttkh != null? ttkh.Name : "",

                        };
            if (search != null)
            {
                if (!string.IsNullOrEmpty(search.Description))
                {
                    query = query.Where(x => EF.Functions.Like(x.Description, $"%{search.Description}%"));
                }
                if (!string.IsNullOrEmpty(search.GhiChu))
                {
                    query = query.Where(x => EF.Functions.Like(x.GhiChu, $"%{search.GhiChu}%"));
                }
                if (!string.IsNullOrEmpty(search.Method))
                {
                    query = query.Where(x => EF.Functions.Like(x.Method, $"%{search.Method}%"));
                }
                if (!string.IsNullOrEmpty(search.Name))
                {
                    query = query.Where(x => EF.Functions.Like(x.Name, $"%{search.Name}%"));
                }
                if (!string.IsNullOrEmpty(search.Outcome))
                {
                    query = query.Where(x => EF.Functions.Like(x.Outcome, $"%{search.Outcome}%"));
                }
                if (!string.IsNullOrEmpty(search.PlanID))
                {
                    query = query.Where(x => EF.Functions.Like(x.PlanID, $"%{search.PlanID}%"));
                }
                if (!string.IsNullOrEmpty(search.Status))
                {
                    query = query.Where(x => EF.Functions.Like(x.Status, $"%{search.Status}%"));
                }
                if (search.StartDate.HasValue)
                {
                    query = query.Where(x => x.StartDate >= search.StartDate);
                }
                if (search.EndDate.HasValue)
                {
                    query = query.Where(x => x.EndDate <= search.EndDate);
                }
            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<ArcPlanDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<ArcPlanDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)

                              select new ArcPlanDto()
                              {
                                  Description = q.Description,
                                  EndDate = q.EndDate,
                                  GhiChu = q.GhiChu,
                                  Method = q.Method,
                                  Name = q.Name,
                                  Outcome = q.Outcome,
                                  PlanID = q.PlanID,
                                  StartDate = q.StartDate,
                                  Status = q.Status,
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

    }
}

using Hinet.Model.Entities;
using Hinet.Repository.ActivitiesRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.ActivitiesService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using Hinet.Repository.TaiLieuDinhKemRepository;



namespace Hinet.Service.ActivitiesService
{
    public class ActivitiesService : Service<Activities>, IActivitiesService
    {
        private readonly ITaiLieuDinhKemRepository _tailieuDinhKemRepository;

        public ActivitiesService(
            IActivitiesRepository activitiesRepository,
            ITaiLieuDinhKemRepository tailieuDinhKemRepository
            ) : base(activitiesRepository)
        {
            this._tailieuDinhKemRepository = tailieuDinhKemRepository;
        }

        public async Task<PagedList<ActivitiesDto>> GetData(ActivitiesSearch search)
        {
            var query = from q in GetQueryable()
                        join tailieus in _tailieuDinhKemRepository.GetQueryable()
                        on q.Id equals tailieus.Item_ID into tailieuGroup
                        from tailieu in tailieuGroup.DefaultIfEmpty()
                        select new ActivitiesDto()
                        {
                            StartDate = q.StartDate,
                            EndDate = q.EndDate,
                            Name = q.Name,
                            Description = q.Description,
                            QRPath = q.QRPath,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Thumbnail = tailieu,
                            Id = q.Id,
                        };
            if (search != null)
            {
                if (search.StartDate.HasValue)
                {
                    query = query.Where(x => x.StartDate > search.StartDate);
                }
                //if(!string.IsNullOrEmpty(search.EndDate))
                //{
                //	query = query.Where(x => EF.Functions.Like(x.EndDate, $"%{search.EndDate}%"));
                //}
                if (!string.IsNullOrEmpty(search.Name))
                {
                    query = query.Where(x => x.Name.Contains(search.Name));
                }
                if (!string.IsNullOrEmpty(search.Description))
                {
                    query = query.Where(x => x.Description.Contains(search.Description));
                }

            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<ActivitiesDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<ActivitiesDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)
                              join tailieus in _tailieuDinhKemRepository.GetQueryable()
                              on q.Id equals tailieus.Item_ID into tailieuGroup
                              from tailieu in tailieuGroup.DefaultIfEmpty()
                              select new ActivitiesDto()
                              {
                                  StartDate = q.StartDate,
                                  EndDate = q.EndDate,
                                  Name = q.Name,
                                  Description = q.Description,
                                  QRPath = q.QRPath,
                                  CreatedBy = q.CreatedBy,
                                  UpdatedBy = q.UpdatedBy,
                                  IsDelete = q.IsDelete,
                                  DeleteId = q.DeleteId,
                                  CreatedDate = q.CreatedDate,
                                  UpdatedDate = q.UpdatedDate,
                                  DeleteTime = q.DeleteTime,
                                  Thumbnail = tailieu,
                                  Id = q.Id,
                              }).FirstOrDefaultAsync();

            return item;
        }

    }
}

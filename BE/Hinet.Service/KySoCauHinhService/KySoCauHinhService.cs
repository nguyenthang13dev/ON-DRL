using Hinet.Model.Entities;
using Hinet.Repository.KySoCauHinhRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.KySoCauHinhService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using MongoDB.Driver.Linq;

namespace Hinet.Service.KySoCauHinhService
{
    public class KySoCauHinhService : Service<KySoCauHinh>, IKySoCauHinhService
    {
        public KySoCauHinhService(
            IKySoCauHinhRepository kySoCauHinhRepository
            ) : base(kySoCauHinhRepository)
        {
        }

        public async Task<PagedList<KySoCauHinhDto>> GetData(KySoCauHinhSearch search)
        {
            var query = from q in GetQueryable()

                        select new KySoCauHinhDto()
                        {
                            IdBieuMau = q.IdBieuMau,
                            IdDTTienTrinhXuLy = q.IdDTTienTrinhXuLy,
                            FontSize = q.FontSize,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                        };
            if (search != null)
            {
                if (search.IdBieuMau.HasValue)
                {
                    query = query.Where(x => x.IdBieuMau == search.IdBieuMau);
                }
                if (search.IdDTTienTrinhXuLy.HasValue)
                {
                    query = query.Where(x => x.IdDTTienTrinhXuLy == search.IdDTTienTrinhXuLy);
                }
                if (search.FontSize.HasValue)
                {
                    query = query.Where(x => x.FontSize == search.FontSize);
                }
            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<KySoCauHinhDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<KySoCauHinhDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)

                              select new KySoCauHinhDto()
                              {
                                  IdBieuMau = q.IdBieuMau,
                                  IdDTTienTrinhXuLy = q.IdDTTienTrinhXuLy,
                                  FontSize = q.FontSize,
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
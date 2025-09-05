using Hinet.Model.Entities;
using Hinet.Repository.KySoInfoRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.KySoInfoService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using MongoDB.Driver.Linq;



namespace Hinet.Service.KySoInfoService
{
    public class KySoInfoService : Service<KySoInfo>, IKySoInfoService
    {

        public KySoInfoService(
            IKySoInfoRepository kySoInfoRepository
            ) : base(kySoInfoRepository)
        {
            
        }

        public async Task<PagedList<KySoInfoDto>> GetData(KySoInfoSearch search)
        {
            var query = from q in GetQueryable()

                        select new KySoInfoDto()
                        {
                            UserId = q.UserId,
                            IdDoiTuong = q.IdDoiTuong,
                            LoaiDoiTuong = q.LoaiDoiTuong,
                            DuongDanFile = q.DuongDanFile,
                            ThongTin = q.ThongTin,
                            TrangThai = q.TrangThai,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                            ThoiGianKySo = q.CreatedDate,
                        };
            if(search != null )
            {
                if(search.UserId.HasValue)
				{
					query = query.Where(x => x.UserId == search.UserId);
				}
				if(search.IdDoiTuong.HasValue)
				{
					query = query.Where(x => x.IdDoiTuong == search.IdDoiTuong);
				}
				//if(!string.IsNullOrEmpty(search.LoaiDoiTuong))
				//{
				//	query = query.Where(x => EF.Functions.Like(x.LoaiDoiTuong, $"%{search.LoaiDoiTuong}%"));
				//}
				//if(!string.IsNullOrEmpty(search.DuongDanFile))
				//{
				//	query = query.Where(x => EF.Functions.Like(x.DuongDanFile, $"%{search.DuongDanFile}%"));
				//}
				//if(!string.IsNullOrEmpty(search.ThongTin))
				//{
				//	query = query.Where(x => EF.Functions.Like(x.ThongTin, $"%{search.ThongTin}%"));
				//}
				//if(!string.IsNullOrEmpty(search.TrangThai))
				//{
				//	query = query.Where(x => EF.Functions.Like(x.TrangThai, $"%{search.TrangThai}%"));
				//}
            }
            query = query.OrderByDescending(x=>x.CreatedDate);
            var result = await PagedList<KySoInfoDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<KySoInfoDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x=>x.Id == id)
                        
                        select new KySoInfoDto()
                        {
                            UserId = q.UserId,
							IdDoiTuong = q.IdDoiTuong,
							LoaiDoiTuong = q.LoaiDoiTuong,
							DuongDanFile = q.DuongDanFile,
							ThongTin = q.ThongTin,
							TrangThai = q.TrangThai,
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

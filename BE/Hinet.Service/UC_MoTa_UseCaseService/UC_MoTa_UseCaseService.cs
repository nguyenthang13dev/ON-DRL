using Hinet.Model.Entities;
using Hinet.Repository.UC_MoTa_UseCaseRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.UC_MoTa_UseCaseService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;
using Hinet.Service.UC_MoTa_UseCaseService.ViewModels;
using Microsoft.AspNetCore.Http;
using Hinet.Model.Entities.DuAn;
using Hinet.Service.DA_NhatKyTrienKhaiService.ViewModels;
using OfficeOpenXml;
using SharpCompress.Common;

namespace Hinet.Service.UC_MoTa_UseCaseService
{
    public class UC_MoTa_UseCaseService : Service<UC_MoTa_UseCase>, IUC_MoTa_UseCaseService
    {
        public UC_MoTa_UseCaseService(
            IUC_MoTa_UseCaseRepository uC_MoTa_UseCaseRepository
            ) : base(uC_MoTa_UseCaseRepository)
        {
        }

        public async Task<PagedList<UC_MoTa_UseCaseDto>> GetData(UC_MoTa_UseCaseSearch search)
        {
            var query = from q in GetQueryable()
                        select new UC_MoTa_UseCaseDto()
                        {
                            IdUseCase = q.IdUseCase,
                            HanhDong = q.HanhDong,
                            MoTaKiemThu = q.MoTaKiemThu,
                            TinhHuongKiemThu = q.TinhHuongKiemThu,
                            KetQuaMongDoi = q.KetQuaMongDoi,
                            TaiKhoan = q.TaiKhoan,
                            LinkHeThong = q.LinkHeThong,
                            TrangThai = q.TrangThai,
                            MoTaLoi = q.MoTaLoi,
                            GhiChu = q.GhiChu,
                            CreatedDate = q.CreatedDate
                        };
            if (search == null)
            {

            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<UC_MoTa_UseCaseDto>.CreateAsync(query, search);
            return result;


        }

        public async Task<UC_MoTa_UseCaseDto> GetDto(Guid id)
        {
            {
                var item = await (from q in GetQueryable().Where(x => x.Id == id)
                                  select new UC_MoTa_UseCaseDto()
                                  {
                                      IdUseCase = q.IdUseCase,
                                      HanhDong = q.HanhDong,
                                      MoTaKiemThu = q.MoTaKiemThu,
                                      TinhHuongKiemThu = q.TinhHuongKiemThu,
                                      KetQuaMongDoi = q.KetQuaMongDoi,
                                      TaiKhoan = q.TaiKhoan,
                                      LinkHeThong = q.LinkHeThong,
                                      TrangThai = q.TrangThai,
                                      MoTaLoi = q.MoTaLoi,
                                      GhiChu = q.GhiChu,
                                  }).FirstOrDefaultAsync();

                return item;
            }
        }

     
    }
}

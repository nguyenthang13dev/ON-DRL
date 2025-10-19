using Hinet.Model.MongoEntities;
using Hinet.Repository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.HoatDongNgoaiKhoaService.Dtos;
using Hinet.Service.HoatDongNgoaiKhoaService.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
namespace Hinet.Service.HoatDongNgoaiKhoaService
{
    public class HoatDongNgoaiKhoaService : Service<HoatDongNgoaiKhoa>, IHoatDongNgoaiKhoaService
    {


        public HoatDongNgoaiKhoaService(IRepository<HoatDongNgoaiKhoa> repository) : base(repository)
        {
        }


     
        public async Task<PagedList<HoatDongNgoaiKhoaDto>> GetData(HoatDongNgoaiKhoaSearchVM search)
        {
            var queryRes = GetQueryable().Select(
                            hoatDong =>
                            new HoatDongNgoaiKhoaDto
                            {
                                DanhSachDangKy = hoatDong.DanhSachDangKy,
                                CreatedDate = hoatDong.CreatedDate,
                                QrValue = hoatDong.QrValue,
                                Id = hoatDong.Id,
                                TenHoatDong = hoatDong.TenHoatDong,
                                Status = hoatDong.Status,
                            })
                ;
            queryRes = queryRes.OrderBy(t => t.CreatedDate);
            var result = await PagedList<HoatDongNgoaiKhoaDto>.CreateAsync(queryRes, search);
            return result;
        }
        public async Task<HoatDongNgoaiKhoaDto> GetDto(Guid Id)
        {
            var queryRes = await GetQueryable().Where(t => t.Id == Id)
                                .Select(t => new HoatDongNgoaiKhoaDto
                                {
                                    DanhSachDangKy = t.DanhSachDangKy,
                                    CreatedDate = t.CreatedDate,
                                    TenHoatDong = t.TenHoatDong,
                                    QrValue = t.QrValue,
                                    Status = t.Status,
                                    Id = t.Id
                                }).FirstOrDefaultAsync();

            return queryRes;
        }



    }
}

using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.HoatDongNgoaiKhoaService.Dtos;
using Hinet.Service.HoatDongNgoaiKhoaService.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.HoatDongNgoaiKhoaService
{
    public interface IHoatDongNgoaiKhoaService : IService<HoatDongNgoaiKhoa>
    {
        Task<PagedList<HoatDongNgoaiKhoaDto>> GetData(HoatDongNgoaiKhoaSearchVM search);
        Task<HoatDongNgoaiKhoaDto> GetDto(Guid Id);
    }
}

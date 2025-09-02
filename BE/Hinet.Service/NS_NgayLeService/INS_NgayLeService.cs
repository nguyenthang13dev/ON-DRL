using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.NS_NgayLeService.Dto;
using Hinet.Service.NS_NgayLeService.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.NS_NgayLeService
{
    public interface INS_NgayLeService : IService<NS_NgayLe>
    {
        Task<PagedList<NS_NgayLeDto>> GetData(NS_NgayLeSearch search);
        Task<NS_NgayLeDto?> GetDto(Guid id);
        Task<List<NS_NgayLeDto>> CreateManyAsync(List<NS_NgayLeCreateUpdateVM> models);
        Task<List<NS_NgayLeDto>> KeThuaDuLieuNamCu(KeThuaDuLieuNamCuDto models);
    }
}

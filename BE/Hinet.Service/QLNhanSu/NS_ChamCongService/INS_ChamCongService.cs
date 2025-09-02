using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.QLNhanSu.NS_ChamCongService.Dto;
using Hinet.Service.QLNhanSu.NS_ChamCongService.ViewModels;
using Hinet.Service.QLNhanSu.NS_NhanSuService.Dto;
using Hinet.Service.QLNhanSu.NS_NhanSuService.ViewModels;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_ChamCongService
{
    public interface INS_ChamCongService : IService<NS_ChamCong>
    {
        Task<PagedList<NS_ChamCongDto>> GetData(NS_ChamCongSearch search);
        Task<ImportChamCongResultDto> ImportChamCongAsync(IFormFile fileExcel);
        Task<List<DataTableChamCong>> DataTableChamCong(DataTableSearch search, Guid? UserId, List<string>? Roles);
        Task<List<DataChamCongDto>> DanhSachChamCongThang(DataTableSearch search, Guid UserId);
        Task<NS_NhanSu> UpdateListDataByMaNVAsync(UpdateDataListByMaNV updateDataListByMaNV);
    }
}

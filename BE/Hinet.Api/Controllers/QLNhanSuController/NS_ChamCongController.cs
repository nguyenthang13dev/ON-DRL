using Hinet.Api.Core.Attributes;
using Hinet.Api.Dto;
using Hinet.Api.Filter;
using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.QLNhanSu.NS_ChamCongService;
using Hinet.Service.QLNhanSu.NS_ChamCongService.Dto;
using Hinet.Service.QLNhanSu.NS_ChamCongService.ViewModels;
using Hinet.Service.QLNhanSu.NS_NhanSuService.Dto;
using Hinet.Service.QLNhanSu.NS_NhanSuService.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Api.Controllers.QLNhanSuController
{
    [Route("api/[controller]")]
    [ApiController]
    public class NS_ChamCongController : BaseController<NS_ChamCong, NS_ChamCongCreateVM, NS_ChamCongEditVM, NS_ChamCongDto>
    {
        private readonly INS_ChamCongService _nS_ChamCongService;
        public NS_ChamCongController(INS_ChamCongService service, IMapper mapper, INS_ChamCongService nS_ChamCongService)
            : base(service, mapper)
        {
            _nS_ChamCongService = nS_ChamCongService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<NS_ChamCongDto>>> GetData([FromBody] NS_ChamCongSearch search)
        {
            var data = await _nS_ChamCongService.GetData(search);
            return DataResponse<PagedList<NS_ChamCongDto>>.Success(data);
        }

        [HttpPost("ImportDuLieuChamCong")]
        public async Task<DataResponse<ImportChamCongResultDto>> ImportExcel(IFormFile file)
        {
            var result = await _nS_ChamCongService.ImportChamCongAsync(file);
            try
            {
                return DataResponse<ImportChamCongResultDto>.Success(result);
            }
            catch (Exception ex)
            {
                return DataResponse<ImportChamCongResultDto>.False("Đã xảy ra lỗi khi import dữ liệu chấm công: " + ex.Message);
            }
        }

        [CustomRoleAuthorize("QLCC")]
        [HttpPost("GetDataTableChamCong")]
        public async Task<DataResponse<List<DataTableChamCong>>> GetDataTableChamCong([FromBody] DataTableSearch search)
        {
            var userId = UserId;
            var roles = Roles;
            var data = await _nS_ChamCongService.DataTableChamCong(search, userId, roles);
            try
            {
                return DataResponse<List<DataTableChamCong>>.Success(data);
            }
            catch (Exception ex)
            {
                return DataResponse<List<DataTableChamCong>>.False("Đã xảy ra lỗi khi lấy dữ liệu bảng chấm công: " + ex.Message);
            }
        }

        [HttpGet("DanhSachChamCongThang/{MaNV}/{Month}/{Year}")]
        public async Task<DataResponse<List<DataChamCongDto>>> DanhSachChamCongThang(string MaNV, int? Month, int? Year)
        {
            var search = new DataTableSearch();
            search.Year = Year.HasValue ? Year.Value : DateTime.Now.Year;
            search.Month = Month.HasValue ? Month.Value : DateTime.Now.Month;
            search.MaNV = MaNV;

            var data = await _nS_ChamCongService.DanhSachChamCongThang(search, UserId.Value);
            try
            {
                return DataResponse<List<DataChamCongDto>>.Success(data);
            }
            catch (Exception ex)
            {
                return DataResponse<List<DataChamCongDto>>.False("Đã xảy ra lỗi khi lấy dữ liệu bảng chấm công: " + ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateDataListByMaNV")]
        public async Task<DataResponse<NS_NhanSu>> UpdateDataListByMaNV([FromBody] UpdateDataListByMaNV data)
        {
            try
            {
                var result = await _nS_ChamCongService.UpdateListDataByMaNVAsync(data);
                return DataResponse<NS_NhanSu>.Success(result);
            }
            catch (Exception ex)
            {
                return DataResponse<NS_NhanSu>.False("Đã xảy ra lỗi khi cập nhật dữ liệu chấm công: " + ex.Message);
            }
        }
    }
}

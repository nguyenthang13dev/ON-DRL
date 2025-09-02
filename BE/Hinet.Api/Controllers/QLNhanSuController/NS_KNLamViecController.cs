using Hinet.Api.Dto;
using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.QLNhanSu.NS_KNLamViecService;
using Hinet.Service.QLNhanSu.NS_KNLamViecService.Dto;
using Hinet.Service.QLNhanSu.NS_KNLamViecService.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Api.Controllers.QLNhanSuController
{
    [Route("api/[controller]")]
    [ApiController]
    public class NS_KNLamViecController : BaseController<NS_KinhNghiemLamViec,NS_KNLamViecCreateVM,NS_KNLamViecEditVM, NS_KNLamViecDto>
    {
        private readonly INS_KNLamViecService _nS_KNLamViecService;
        private readonly ILogger<NS_KNLamViecController> _logger;
        public NS_KNLamViecController(INS_KNLamViecService service, IMapper mapper, INS_KNLamViecService nS_KNLamViecService, ILogger<NS_KNLamViecController> logger)
            : base(service, mapper)
        {
            _nS_KNLamViecService = nS_KNLamViecService;
            _logger = logger;
        }
        [HttpPost("Create")]
        public override async Task<DataResponse<NS_KinhNghiemLamViec>> Create([FromBody] NS_KNLamViecCreateVM model)
            {
                model.TotalMonth = _nS_KNLamViecService.TotalWorkExperienceMonth(model.TuNgay,model.DenNgay);
                var result = await base.Create(model);
                return result;
        }
        [HttpPut("Update")]
        public override async Task<DataResponse<NS_KinhNghiemLamViec>> Update([FromBody] NS_KNLamViecEditVM model)
        {
            try
            {
                model.TotalMonth = _nS_KNLamViecService.TotalWorkExperienceMonth(model.TuNgay, model.DenNgay);
                var result = await base.Update(model);
                return result;
            }catch(Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật kinh nghiệm làm việc");
                return DataResponse<NS_KinhNghiemLamViec>.False("Đã xảy ra lỗi khi cập nhật dữ liệu.");
            }
        }
        [HttpGet("GetListDto/{idNhanSu}")]
        public async Task<DataResponse<PagedList<NS_KNLamViecDto>>> GetListDto(Guid idNhanSu)
        {
            try
            {
                var result = await _nS_KNLamViecService.GetListDto(idNhanSu);
                return DataResponse<PagedList<NS_KNLamViecDto>>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách kinh nghiệm làm việc");
                return DataResponse<PagedList<NS_KNLamViecDto>>.False("Đã xảy ra lỗi khi lấy dữ liệu.");
            }
        }
    }
}

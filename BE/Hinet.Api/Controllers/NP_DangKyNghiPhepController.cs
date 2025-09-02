using Hinet.Api.Dto;
using Hinet.Api.Filter;
using Hinet.Controllers;
using Hinet.Model.Entities;
using Hinet.Model.Entities.NghiPhep;
using Hinet.Service.AppUserService;
using Hinet.Service.Common;
using Hinet.Service.Constant.NghiPhep;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.QL_NghiPhep.NP_DangKyNghiPhepService;
using Hinet.Service.QL_NghiPhep.NP_DangKyNghiPhepService.Dto;
using Hinet.Service.QL_NghiPhep.NP_DangKyNghiPhepService.ViewModels;
using Hinet.Service.QLNhanSu.NS_NhanSuService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NP_DangKyNghiPhepController : HinetController
    {
        private readonly INP_DangKyNghiPhepService _DangKyNghiPhepService;
        private readonly IAppUserService _appUserService;
        private readonly INS_NhanSuService _nS_NhanSuService;
        private readonly IMapper _mapper;
        private readonly ILogger<NP_DangKyNghiPhepDto> _logger;

        public NP_DangKyNghiPhepController(
            INP_DangKyNghiPhepService nP_DangKyNghiPhepService,
            IAppUserService appUserService,
            INS_NhanSuService nS_NhanSuService,
            IMapper mapper,
            ILogger<NP_DangKyNghiPhepDto> logger
            )
        {
            _DangKyNghiPhepService = nP_DangKyNghiPhepService;
            _appUserService = appUserService;
            _nS_NhanSuService = nS_NhanSuService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<NP_DangKyNghiPhep>> Create([FromBody] NP_DangKyNghiPhepCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<NP_DangKyNghiPhepCreateVM, NP_DangKyNghiPhep>(model);
                var data = await _DangKyNghiPhepService.Create(entity, UserId);
                return DataResponse<NP_DangKyNghiPhep>.Success(data);
            }
            catch (Exception ex)
            {
                return DataResponse<NP_DangKyNghiPhep>.False(ex.Message ?? "Đã xảy ra lỗi khi thêm mới dữ liệu");
            }
        }

        [HttpPut("Update")]
        public async Task<DataResponse<NP_DangKyNghiPhep>> Update([FromBody] NP_DangKyNghiPhepEditVM model)
        {
            try
            {
                var entity = await _DangKyNghiPhepService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<NP_DangKyNghiPhep>.False("Đăng ký nghỉ phép không tồn tại");

                entity = _mapper.Map(model, entity);
                await _DangKyNghiPhepService.UpdateAsync(entity);
                return DataResponse<NP_DangKyNghiPhep>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật đăng ký nghỉ phép với Id: {Id}", model.Id);
                return new DataResponse<NP_DangKyNghiPhep>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<NP_DangKyNghiPhepDto>>> GetData([FromBody] NP_DangKyNghiPhepSearchDto search)
        {
            var data = await _DangKyNghiPhepService.GetData(search, UserId.HasValue ? UserId.Value : Guid.Empty);
            return DataResponse<PagedList<NP_DangKyNghiPhepDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                await _DangKyNghiPhepService.DeleteNghiPhep(id, UserId.Value);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }

        [HttpPost("ConfigUpload")]
        public async Task<DataResponse<ConfigUploadForm>> ConfigUpload([FromBody] ConfigUploadForm model)
        {
            try
            {
                var data = await _DangKyNghiPhepService.ConfigUploadDataUseLibreOffice(model);
                return DataResponse<ConfigUploadForm>.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse<ConfigUploadForm>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }

        [HttpGet("GetTaiLieuDinhKem")]
        public async Task<DataResponse<TaiLieuDinhKem>> GetTaiLieuDinhKem()
        {
            var dto = await _DangKyNghiPhepService.GetTaiLieuDinhKem();
            return DataResponse<TaiLieuDinhKem>.Success(dto);
        }

        [HttpPut("PheDuyet/{id}")]
        public async Task<DataResponse> PheDuyetNghiPhep(Guid id)
        {
            try
            {
                var data = await _DangKyNghiPhepService.PheDuyetNghiPhep(id, UserId.Value);
                return DataResponse.Success(data);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpPut("Trinh/{id}")]
        public async Task<DataResponse> TrinhNghiPhep(Guid id)
        {
            try
            {
                var data = await _DangKyNghiPhepService.TrinhNghiPhep(id, UserId.Value);
                return DataResponse.Success(data);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpPut("TuChoi/{id}")]
        public async Task<DataResponse> TuChoiNghiPhep(Guid id, TuChoiVM model)
        {
            try
            {
                var data = await _DangKyNghiPhepService.TuChoiNghiPhep(id, model, UserId.Value);
                return DataResponse.Success(data);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpGet("GetSoNgayPhep")]
        public async Task<DataResponse> GetSoNgayPhep()
        {
            try
            {
                var data = await _DangKyNghiPhepService.GetSoNgayPhep(UserId.Value);
                return DataResponse.Success(data);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpGet("Preview/{Id}")]
        public async Task<DataResponse<PreviewDto>> Preview(Guid Id)
        {
            try
            {
                var data = await _DangKyNghiPhepService.PreviewNghiPhep(UserId.Value, Id);
                return DataResponse<PreviewDto>.Success(data);
            }
            catch (Exception ex)
            {
                return DataResponse<PreviewDto>.False(ex.Message);
            }
        }

        [HttpGet("ThongKeNghiPhep")]
        public async Task<DataResponse<ThongKeNghiPhepDto>> ThongKeNghiPhep()
        {
            try
            {
                var data = await _DangKyNghiPhepService.ThongKeNghiPhep(UserId.Value);
                return DataResponse<ThongKeNghiPhepDto>.Success(data);
            }
            catch (Exception ex)
            {
                return DataResponse<ThongKeNghiPhepDto>.False(ex.Message);
            }
        }
    }
}

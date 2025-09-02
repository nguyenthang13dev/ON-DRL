using Hinet.Api.Dto;
using Hinet.Api.Filter;
using Hinet.Controllers;
using Hinet.Model.Entities.NghiPhep;
using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.QL_NghiPhep.NP_LoaiNghiPhepService;
using Hinet.Service.QL_NghiPhep.NP_LoaiNghiPhepService.Dto;
using Hinet.Service.QL_NghiPhep.NP_LoaiNghiPhepService.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NP_LoaiNghiPhepController : HinetController
    {
        private readonly INP_LoaiNghiPhepService _loaiNghiPhepService;
        private readonly IMapper _mapper;
        private readonly ILogger<NP_LoaiNghiPhepDto> _logger;

        public NP_LoaiNghiPhepController(
            INP_LoaiNghiPhepService nP_LoaiNghiPhepService,
            IMapper mapper,
            ILogger<NP_LoaiNghiPhepDto> logger
            )
        {
            _loaiNghiPhepService = nP_LoaiNghiPhepService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<NP_LoaiNghiPhep>> Create([FromBody] NP_LoaiNghiPhepCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<NP_LoaiNghiPhepCreateVM, NP_LoaiNghiPhep>(model);
                var loaiPhep = await _loaiNghiPhepService.GetByMa(model.MaLoaiPhep);
                if(loaiPhep != null)
                {
                    throw new Exception("Mã loại phép đã tồn tại");
                }
                await _loaiNghiPhepService.CreateAsync(entity);
                return DataResponse<NP_LoaiNghiPhep>.Success(entity);
            }
            catch (Exception ex)
            {
                return DataResponse<NP_LoaiNghiPhep>.False(ex.Message ?? "Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }

        [HttpPut("Update")]
        public async Task<DataResponse<NP_LoaiNghiPhep>> Update([FromBody] NP_LoaiNghiPhepEditVM model)
        {
            try
            {
                var entity = await _loaiNghiPhepService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<NP_LoaiNghiPhep>.False("Loại nghỉ phép không tồn tại");

                entity = _mapper.Map(model, entity);
                await _loaiNghiPhepService.UpdateAsync(entity);
                return DataResponse<NP_LoaiNghiPhep>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật loại nghỉ phép với Id: {Id}", model.Id);
                return new DataResponse<NP_LoaiNghiPhep>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<NP_LoaiNghiPhepDto>>> GetData([FromBody] NP_LoaiNghiPhepSearchDto search)
        {
            var data = await _loaiNghiPhepService.GetData(search);
            return DataResponse<PagedList<NP_LoaiNghiPhepDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _loaiNghiPhepService.GetByIdAsync(id);
                await _loaiNghiPhepService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa loại nghỉ phép với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }

        [HttpGet("GetDropdown")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropdown()
        {
            var result = await _loaiNghiPhepService.GetDropdown();

            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "Thành công",
                Status = true
            };
        }

        [HttpGet("GetDanhSach")]
        public async Task<DataResponse<List<NP_LoaiNghiPhep>>> GetDanhSach()
        {
            var result = await _loaiNghiPhepService.GetQueryable().ToListAsync();
            return new DataResponse<List<NP_LoaiNghiPhep>>
            {
                Data = result,
                Message = "Thành công",
                Status = true
            };
        }
    }
}

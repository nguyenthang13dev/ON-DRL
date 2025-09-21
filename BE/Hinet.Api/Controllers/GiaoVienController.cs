// Hinet.Api/Controllers/GiaoVienController.cs
using Hinet.Api.Dto;
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.GiaoVienService;
using Hinet.Service.GiaoVienService.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UglyToad.PdfPig.DocumentLayoutAnalysis;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class GiaoVienController : HinetController
    {
        private readonly IGiaoVienService _giaoVienService;
        private readonly IMapper _mapper;
        private readonly ILogger<GiaoVienController> _logger;

        public GiaoVienController(
            IGiaoVienService giaoVienService,
            IMapper mapper,
            ILogger<GiaoVienController> logger)
        {
            _giaoVienService = giaoVienService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<GiaoVienDto>>> GetData([FromBody] GiaoVienSearch search)
        {
            try
            {
                var result = await _giaoVienService.GetData(search);
                return DataResponse<PagedList<GiaoVienDto>>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting GiaoVien data");
                return DataResponse<PagedList<GiaoVienDto>>.False("Có lỗi xảy ra khi lấy dữ liệu");
            }
        }

        [HttpGet("{id}")]
        public async Task<DataResponse<GiaoVienDto>> GetById(Guid id)
        {
            var dto = await _giaoVienService.GetDto(id);
            if (dto == null)
                return DataResponse<GiaoVienDto>.False("Không tìm thấy giáo viên");
            return DataResponse<GiaoVienDto>.Success(dto);
        }

        [HttpPost("Create")]
        public async Task<DataResponse<GiaoVien>> Create([FromBody] GiaoVien model)
        {
            try
            {
                await _giaoVienService.CreateAsync(model);
                return DataResponse<GiaoVien>.Success(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating GiaoVien");
                return DataResponse<GiaoVien>.False("Có lỗi xảy ra khi tạo giáo viên");
            }
        }

        [HttpPut("Update/{id}")]
        public async Task<DataResponse<GiaoVien>> Update(Guid id, [FromBody] GiaoVien model)
        {
            try
            {
                var entity = await _giaoVienService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse<GiaoVien>.False("Không tìm thấy giáo viên");
                model.Id = id;
                await _giaoVienService.UpdateAsync(model);
                return DataResponse<GiaoVien>.Success(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating GiaoVien");
                return DataResponse<GiaoVien>.False("Có lỗi xảy ra khi cập nhật giáo viên");
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _giaoVienService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse.False("Không tìm thấy giáo viên");
                await _giaoVienService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting GiaoVien");
                return DataResponse.False("Có lỗi xảy ra khi xóa giáo viên");
            }
        }

        [HttpGet("DropdownByKhoa/{khoaId}")]
        public async Task<DataResponse<List<DropdownOption>>> DropdownByKhoa(Guid khoaId)
        {
            try
            {
                var result = await _giaoVienService.GetDropdownByKhoa(khoaId);
                return DataResponse<List<DropdownOption>>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting GiaoVien dropdown");
                return DataResponse<List<DropdownOption>>.False("Có lỗi xảy ra khi lấy danh sách dropdown");
            }
        }
    }
}

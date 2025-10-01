// Hinet.Api/Controllers/SinhVienController.cs
using Hinet.Api.Dto;
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.SinhVienService;
using Hinet.Service.SinhVienService.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class SinhVienController : HinetController
    {
        private readonly ISinhVienService _sinhVienService;
        private readonly IMapper _mapper;
        private readonly ILogger<SinhVienController> _logger;

        public SinhVienController(
            ISinhVienService sinhVienService,
            IMapper mapper,
            ILogger<SinhVienController> logger)
        {
            _sinhVienService = sinhVienService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<SinhVienDto>>> GetData([FromBody] SinhVienSearch search)
        {
            try
            {
                var result = await _sinhVienService.GetData(search);
                return DataResponse<PagedList<SinhVienDto>>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting SinhVien data");
                return DataResponse<PagedList<SinhVienDto>>.False("Có lỗi xảy ra khi lấy dữ liệu");
            }
        }

        [HttpGet("{id}")]
        public async Task<DataResponse<SinhVienDto>> GetById(Guid id)
        {
            var dto = await _sinhVienService.GetDto(id);
            if (dto == null)
                return DataResponse<SinhVienDto>.False("Không tìm thấy sinh viên");
            return DataResponse<SinhVienDto>.Success(dto);
        }

        [HttpPost("Create")]
        public async Task<DataResponse<SinhVien>> Create([FromBody] SinhVien model)
        {
            try
            {
                await _sinhVienService.CreateAsync(model);
                return DataResponse<SinhVien>.Success(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating SinhVien");
                return DataResponse<SinhVien>.False("Có lỗi xảy ra khi tạo sinh viên");
            }
        }

        [HttpPut("Update/{id}")]
        public async Task<DataResponse<SinhVien>> Update(Guid id, [FromBody] SinhVien model)
        {
            try
            {
                var entity = await _sinhVienService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse<SinhVien>.False("Không tìm thấy sinh viên");
                model.Id = id;
                await _sinhVienService.UpdateAsync(model);
                return DataResponse<SinhVien>.Success(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating SinhVien");
                return DataResponse<SinhVien>.False("Có lỗi xảy ra khi cập nhật sinh viên");
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _sinhVienService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse.False("Không tìm thấy sinh viên");
                await _sinhVienService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting SinhVien");
                return DataResponse.False("Có lỗi xảy ra khi xóa sinh viên");
            }
        }
    }
}


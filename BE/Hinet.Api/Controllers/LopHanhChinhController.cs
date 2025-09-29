// Hinet.Api/Controllers/LopHanhChinhController.cs
using Hinet.Api.Dto;
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.LopHanhChinhService;
using Hinet.Service.LopHanhChinhService.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class LopHanhChinhController : HinetController
    {
        private readonly ILopHanhChinhService _lopHanhChinhService;
        private readonly IMapper _mapper;
        private readonly ILogger<LopHanhChinhController> _logger;

        public LopHanhChinhController(
            ILopHanhChinhService lopHanhChinhService,
            IMapper mapper,
            ILogger<LopHanhChinhController> logger)
        {
            _lopHanhChinhService = lopHanhChinhService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<LopHanhChinhDto>>> GetData([FromBody] LopHanhChinhSearch search)
        {
            try
            {
                var result = await _lopHanhChinhService.GetData(search);
                return DataResponse<PagedList<LopHanhChinhDto>>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting LopHanhChinh data");
                return DataResponse<PagedList<LopHanhChinhDto>>.False("Có lỗi xảy ra khi lấy dữ liệu");
            }
        }

        [HttpGet("{id}")]
        public async Task<DataResponse<LopHanhChinhDto>> GetById(Guid id)
        {
            var dto = await _lopHanhChinhService.GetDto(id);
            if (dto == null)
                return DataResponse<LopHanhChinhDto>.False("Không tìm thấy lớp hành chính");
            return DataResponse<LopHanhChinhDto>.Success(dto);
        }

        [HttpPost("Create")]
        public async Task<DataResponse<LopHanhChinh>> Create([FromBody] LopHanhChinh model)
        {
            try
            {
                await _lopHanhChinhService.CreateAsync(model);
                return DataResponse<LopHanhChinh>.Success(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating LopHanhChinh");
                return DataResponse<LopHanhChinh>.False("Có lỗi xảy ra khi tạo lớp hành chính");
            }
        }

        [HttpPut("Update")]
        public async Task<DataResponse<LopHanhChinh>> Update([FromBody] LopHanhChinh model)
        {
            try
            {
                var entity = await _lopHanhChinhService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<LopHanhChinh>.False("Không tìm thấy lớp hành chính");
                await _lopHanhChinhService.UpdateAsync(model);
                return DataResponse<LopHanhChinh>.Success(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating LopHanhChinh");
                return DataResponse<LopHanhChinh>.False("Có lỗi xảy ra khi cập nhật lớp hành chính");
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _lopHanhChinhService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse.False("Không tìm thấy lớp hành chính");
                await _lopHanhChinhService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting LopHanhChinh");
                return DataResponse.False("Có lỗi xảy ra khi xóa lớp hành chính");
            }
        }

        //[HttpGet("DropdownByKhoa/{khoaId}")]
        //public async Task<DataResponse<List<DropdownOption>>> DropdownByKhoa(Guid khoaId)
        //{
        //    try
        //    {
        //        var result = await _lopHanhChinhService.GetDropdownByKhoa(khoaId);
        //        return DataResponse<List<DropdownOption>>.Success(result);
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Error getting LopHanhChinh dropdown");
        //        return DataResponse<List<DropdownOption>>.False("Có lỗi xảy ra khi lấy danh sách dropdown");
        //    }
        //}
    }
}

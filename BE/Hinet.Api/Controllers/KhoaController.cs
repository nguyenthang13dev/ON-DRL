using Hinet.Api.Dto;
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.KhoaService;
using Hinet.Service.KhoaService.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class KhoaController : HinetController
    {
        private readonly IKhoaService _khoaService;
        private readonly IMapper _mapper;
        private readonly ILogger<KhoaController> _logger;

        public KhoaController(
            IKhoaService khoaService,
            IMapper mapper,
            ILogger<KhoaController> logger)
        {
            _khoaService = khoaService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("GetData", Name = "Xem danh sách Khoa")]
        public async Task<DataResponse<PagedList<KhoaDto>>> GetData([FromBody] KhoaSearch search)
        {
            try
            {
                var listData = await _khoaService.GetData(search);

                return new DataResponse<PagedList<KhoaDto>>
                {
                    Data = listData,
                    Message = "GetData PagedList<KhoaDto> thành công",
                    Status = true
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Khoa data");
                return DataResponse<PagedList<KhoaDto>>.False("Có lỗi xảy ra khi lấy dữ liệu");
            }
        }

        [HttpGet("{id}")]
        public async Task<DataResponse<KhoaDto>> GetById(Guid id)
        {
            var entity = await _khoaService.GetDto(id);
            if (entity == null)
                return DataResponse<KhoaDto>.False("Không tìm thấy khoa");

            return DataResponse<KhoaDto>.Success(entity);
        }

        [HttpPost("Create")]
        public async Task<DataResponse<Khoa>> Create([FromBody] Khoa khoa)
        {
            try
            {
                await _khoaService.CreateAsync(khoa);
                return DataResponse<Khoa>.Success(khoa);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating Khoa");
                return DataResponse<Khoa>.False("Có lỗi xảy ra khi tạo khoa mới");
            }
        }

        [HttpPut("Update/{id}")]
        public async Task<DataResponse<Khoa>> Update(Guid id, [FromBody] Khoa khoa)
        {
            try
            {
                var entity = await _khoaService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse<Khoa>.False("Không tìm thấy khoa");

                khoa.Id = id;
                await _khoaService.UpdateAsync(khoa);
                return DataResponse<Khoa>.Success(khoa);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating Khoa");
                return DataResponse<Khoa>.False("Có lỗi xảy ra khi cập nhật khoa");
            }
        }


        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _khoaService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse.False("Không tìm thấy khoa");

                await _khoaService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting Khoa");
                return DataResponse.False("Có lỗi xảy ra khi xóa khoa");
            }
        }
    }
}
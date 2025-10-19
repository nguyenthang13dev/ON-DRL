using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.HoatDongNgoaiKhoaService;
using Hinet.Service.HoatDongNgoaiKhoaService.Dtos;
using Hinet.Service.HoatDongNgoaiKhoaService.ViewModels;
using Hinet.Service.KhoaService.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoatDongNgoaiKhoaController : HinetController
    {
        private readonly IHoatDongNgoaiKhoaService _hoatDongNgoaiKhoaService;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;

        public HoatDongNgoaiKhoaController(IHoatDongNgoaiKhoaService hoatDongNgoaiKhoaService, IMapper mapper)
        {
            _hoatDongNgoaiKhoaService = hoatDongNgoaiKhoaService;
            _mapper = mapper;
        }

        [HttpPost("GetData", Name = "Xem danh sách HoatDongNgoaiKhoa")]
        public async Task<DataResponse<PagedList<HoatDongNgoaiKhoaDto>>> GetData([FromBody] HoatDongNgoaiKhoaSearchVM search)
        {
            try
            {
                var listData = await _hoatDongNgoaiKhoaService.GetData(search);
                return new DataResponse<PagedList<HoatDongNgoaiKhoaDto>>
                {
                    Data = listData,
                    Message = "GetData PagedList<HoatDongNgoaiKhoaDto> thành công",
                    Status = true
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Khoa data");
                return DataResponse<PagedList<HoatDongNgoaiKhoaDto>>.False("Có lỗi xảy ra khi lấy dữ liệu");
            }
        }

        [HttpGet("{id}")]
        public async Task<DataResponse<HoatDongNgoaiKhoaDto>> GetById(Guid id)
        {
            var entity = await _hoatDongNgoaiKhoaService.GetDto(id);
            if (entity == null)
                return DataResponse<HoatDongNgoaiKhoaDto>.False("Không tìm thấy khoa");
            return DataResponse<HoatDongNgoaiKhoaDto>.Success(entity);
        }

        [HttpPost("Create")]
        public async Task<DataResponse<HoatDongNgoaiKhoa>> Create([FromBody] HoatDongNgoaiKhoaCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<HoatDongNgoaiKhoaCreateVM, HoatDongNgoaiKhoa>(model);
                entity.ThoiHanDangKy = DateTime.UtcNow;
                await _hoatDongNgoaiKhoaService.CreateAsync(entity);
                return DataResponse<HoatDongNgoaiKhoa>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating HoatDongNgoaiKhoa");
                return DataResponse<HoatDongNgoaiKhoa>.False("Có lỗi xảy ra khi tạo khoa mới");
            }
        }

        [HttpPut("Update/{id}")]
        public async Task<DataResponse<HoatDongNgoaiKhoa>> Update([FromBody] HoatDongNgoaiKhoaUpdateVM model)
        {
            try
            {
                var entity = await _hoatDongNgoaiKhoaService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<HoatDongNgoaiKhoa>.False("Không tìm thấy khoa");
                entity = _mapper.Map<HoatDongNgoaiKhoaUpdateVM, HoatDongNgoaiKhoa>(model);
                await _hoatDongNgoaiKhoaService.UpdateAsync(entity);
                return DataResponse<HoatDongNgoaiKhoa>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating Khoa");
                return DataResponse<HoatDongNgoaiKhoa>.False("Có lỗi xảy ra khi cập nhật khoa");
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _hoatDongNgoaiKhoaService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse.False("Không tìm thấy khoa");

                await _hoatDongNgoaiKhoaService.DeleteAsync(entity);
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

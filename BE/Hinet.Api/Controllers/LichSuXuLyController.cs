using Microsoft.AspNetCore.Mvc;
using Hinet.Service.LichSuXuLyService;
using Hinet.Service.LichSuXuLyService.ViewModels;
using Hinet.Service.LichSuXuLyService.Dto;
using Hinet.Model.Entities;
using Hinet.Service.Common;
using Microsoft.Extensions.Logging;
using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;
using Hinet.Api.Dto;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class LichSuXuLyController : HinetController
    {
        private readonly ILichSuXuLyService _service;
        private readonly ILogger<LichSuXuLyController> _logger;
        private readonly IMapper _mapper;

        public LichSuXuLyController(ILichSuXuLyService service, ILogger<LichSuXuLyController> logger, IMapper mapper)
        {
            _service = service;
            _logger = logger;
            _mapper = mapper;
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<LichSuXuLyDto>>> GetData([FromBody] LichSuXuLySearch search)
        {
            var result = await _service.GetData(search);
            return new DataResponse<PagedList<LichSuXuLyDto>>
            {
                Data = result,
                Message = "Lấy danh sách lịch sử xử lý thành công",
                Status = true
            };
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<LichSuXuLyDto>> Get(Guid id)
        {
            var result = await _service.GetDto(id);
            return new DataResponse<LichSuXuLyDto>
            {
                Data = result,
                Message = "Lấy chi tiết lịch sử xử lý thành công",
                Status = true
            };
        }

        [HttpGet("GetByItem/{itemId}/{itemType}")]
        public async Task<DataResponse<List<LichSuXuLyDto>>> GetByItem(Guid itemId, string itemType)
        {
            var result = await _service.GetByItemId(itemId, itemType);
            return new DataResponse<List<LichSuXuLyDto>>
            {
                Data = result,
                Message = "Lấy lịch sử xử lý theo item thành công",
                Status = true
            };
        }

        [HttpPost("Create")]
        public async Task<DataResponse> Create([FromBody] LichSuXuLyCreateVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = _mapper.Map<LichSuXuLyCreateVM, LichSuXuLy>(model);
                    await _service.CreateAsync(entity);
                    return DataResponse.Success(null);
                }
                catch (Exception ex)
                {
                    return DataResponse.False(ex.Message);
                }
            }
            return DataResponse.False("Dữ liệu không hợp lệ", ModelStateError);
        }

        [HttpPost("Update")]
        public async Task<DataResponse> Update([FromBody] LichSuXuLyEditVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _service.GetByIdAsync(model.Id);
                    if (entity == null)
                    {
                        return DataResponse.False("Không tìm thấy lịch sử xử lý với ID đã cho");
                    }
                    entity = _mapper.Map(model, entity);
                    await _service.UpdateAsync(entity);
                    return DataResponse.Success(null);
                }
                catch (Exception ex)
                {
                    return DataResponse.False(ex.Message);
                }
            }
            return DataResponse.False("Dữ liệu không hợp lệ", ModelStateError);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _service.GetByIdAsync(id);
                if (entity == null)
                {
                    return DataResponse.False("Không tìm thấy lịch sử xử lý với ID đã cho");
                }
                await _service.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }
    }
}
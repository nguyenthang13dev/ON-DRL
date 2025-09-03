using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.TinhService;
using Hinet.Service.TinhService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Api.Core.Permission;
using Hinet.Service.TinhService.ViewModels;

using Hinet.Service.TaiLieuDinhKemService.Dto;
using Hinet.Api.Dto;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class TinhController : HinetController
    {
        private readonly ITinhService _tinhService;
        private readonly IMapper _mapper;
        private readonly ILogger<TinhController> _logger;

        public TinhController(
            ITinhService tinhService,
            IMapper mapper,
            ILogger<TinhController> logger
            )
        {
            this._tinhService = tinhService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        [RequiredPermission(Permissions.Tinh.Create)]
        public async Task<DataResponse<Tinh>> Create([FromBody] TinhCreateVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = _mapper.Map<TinhCreateVM, Tinh>(model);
                    await _tinhService.CreateAsync(entity);
                    return new DataResponse<Tinh>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    return DataResponse<Tinh>.False("Error", new string[] { ex.Message });
                }
            }
            return DataResponse<Tinh>.False("Some properties are not valid", ModelStateError);
        }

        [HttpPost("Update")]
        public async Task<DataResponse<Tinh>> Update([FromBody] TinhEditVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _tinhService.GetByIdAsync(model.Id);
                    if (entity == null)
                        return DataResponse<Tinh>.False("Tinh not found");

                    entity = _mapper.Map(model, entity);
                    await _tinhService.UpdateAsync(entity);
                    return new DataResponse<Tinh>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    DataResponse<Tinh>.False(ex.Message);
                }
            }
            return DataResponse<Tinh>.False("Some properties are not valid", ModelStateError);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<TinhDto>> Get(Guid id)
        {
            var result = await _tinhService.GetDto(id);
            return new DataResponse<TinhDto>
            {
                Data = result,
                Message = "Get TinhDto thành công",
                Status = true
            };
        }

        [HttpPost("GetData", Name = "Xem danh sách tỉnh")]
        
        public async Task<DataResponse<PagedList<TinhDto>>> GetData([FromBody] TinhSearch search)
        {
            var result = await _tinhService.GetData(search);
            return new DataResponse<PagedList<TinhDto>>
            {
                Data = result,
                Message = "GetData PagedList<TinhDto> thành công",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _tinhService.GetByIdAsync(id);
                await _tinhService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpGet("GetDropdown")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropdown()
        {
            var result = await _tinhService.GetDropdown();
            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "GetDropdown List<DropdownOption> thành công",
                Status = true
            };
        }
    }
}
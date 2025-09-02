using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.XaService;
using Hinet.Service.XaService.Dto;
using Hinet.Service.XaService.ViewModels;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Service.UserRoleService.Dto;
using Hinet.Api.Dto;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class XaController : HinetController
    {
        private readonly IXaService _xaService;
        private readonly IMapper _mapper;
        private readonly ILogger<XaController> _logger;

        public XaController(
            IXaService xaService,
            IMapper mapper,
            ILogger<XaController> logger
            )
        {
            this._xaService = xaService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<Xa>> Create([FromBody] XaCreateVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = _mapper.Map<XaCreateVM, Xa>(model);
                    await _xaService.CreateAsync(entity);
                    return new DataResponse<Xa>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    return DataResponse<Xa>.False("Error", new string[] { ex.Message });
                }
            }
            return DataResponse<Xa>.False("Some properties are not valid", ModelStateError);
        }

        [HttpPost("Update")]
        public async Task<DataResponse<Xa>> Update([FromBody] XaEditVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _xaService.GetByIdAsync(model.Id);
                    if (entity == null)
                        return DataResponse<Xa>.False("Xa not found");

                    entity = _mapper.Map(model, entity);
                    await _xaService.UpdateAsync(entity);
                    return new DataResponse<Xa>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    DataResponse<Xa>.False(ex.Message);
                }
            }
            return DataResponse<Xa>.False("Some properties are not valid", ModelStateError);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<XaDto>> Get(Guid id)
        {
            var result = await _xaService.GetDto(id);
            return new DataResponse<XaDto>
            {
                Data = result,
                Message = "Get XaDto th�nh c�ng",
                Status = true
            };
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<XaDto>>> GetData([FromBody] XaSearch search)
        {
            var result = await _xaService.GetData(search);
            return new DataResponse<PagedList<XaDto>>
            {
                Data = result,
                Message = "GetData PagedList<XaDto> th�nh c�ng",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _xaService.GetByIdAsync(id);
                await _xaService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpGet("GetDropdown/{maHuyen}")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropdownByMaHuyen(string maHuyen)
        {
            var result = await _xaService.GetDropdownByMaHuyen(maHuyen);
            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "GetDropdownByMaHuyen List<DropdownOption> th�nh c�ng",
                Status = true
            };
        }
    }
}
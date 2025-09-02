using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.HuyenService;
using Hinet.Service.HuyenService.Dto;
using Hinet.Service.HuyenService.ViewModels;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Api.Dto;
//using Hinet.Service.GroupRoleService.Dto;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class HuyenController : HinetController
    {
        private readonly IHuyenService _huyenService;
        private readonly IMapper _mapper;
        private readonly ILogger<HuyenController> _logger;

        public HuyenController(
            IHuyenService huyenService,
            IMapper mapper,
            ILogger<HuyenController> logger
            )
        {
            this._huyenService = huyenService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<Huyen>> Create([FromBody] HuyenCreateVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = _mapper.Map<HuyenCreateVM, Huyen>(model);
                    await _huyenService.CreateAsync(entity);
                    return new DataResponse<Huyen>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    return DataResponse<Huyen>.False("Error", new string[] { ex.Message });
                }
            }
            return DataResponse<Huyen>.False("Some properties are not valid", ModelStateError);
        }

        [HttpPost("Update")]
        public async Task<DataResponse<Huyen>> Update([FromBody] HuyenEditVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _huyenService.GetByIdAsync(model.Id);
                    if (entity == null)
                        return DataResponse<Huyen>.False("Huyen not found");

                    entity = _mapper.Map(model, entity);
                    await _huyenService.UpdateAsync(entity);
                    return new DataResponse<Huyen>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    DataResponse<Huyen>.False(ex.Message);
                }
            }
            return DataResponse<Huyen>.False("Some properties are not valid", ModelStateError);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<HuyenDto>> Get(Guid id)
        {
            var result = await _huyenService.GetDto(id);

            return new DataResponse<HuyenDto>
            {
                Data = result,
                Message = "Get HuyenDto thành công",
                Status = true
            };
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<HuyenDto>>> GetData([FromBody] HuyenSearch search)
        {
            var result = await _huyenService.GetData(search);
            return new DataResponse<PagedList<HuyenDto>>
            {
                Data = result,
                Message = "GetData PagedList<HuyenDto> thành công",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _huyenService.GetByIdAsync(id);
                await _huyenService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpGet("GetDropdown/{maTinh}")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropdownByMaTinh(string MaTinh)
        {
            var result = await _huyenService.GetDropdownByMaTinh(MaTinh);

            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "GetDropdownByMaTinh List<DropdownOption> thành công",
                Status = true
            };
        }
    }
}
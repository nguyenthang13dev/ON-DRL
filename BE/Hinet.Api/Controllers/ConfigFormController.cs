using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.ConfigFormService;
using Hinet.Service.ConfigFormService.Dto;
using Hinet.Service.ConfigFormService.ViewsModels;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using CommonHelper.Excel;
using Hinet.Service.AppUserService.Dto;
using Hinet.Api.Dto;
using Microsoft.AspNetCore.Authorization;
using Hinet.Model.Entities.ConfigAssign;
using Hinet.Service.TaiLieuDinhKemService;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class ConfigFormController : HinetController
    {
        private readonly IConfigFormService _ConfigFormService;
        private readonly IMapper _mapper;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly ILogger<ConfigFormController> _logger;

        public ConfigFormController(
            IConfigFormService ConfigFormService,
            IMapper mapper,
            ILogger<ConfigFormController> logger
,
            ITaiLieuDinhKemService taiLieuDinhKemService)
        {
            this._ConfigFormService = ConfigFormService;
            this._mapper = mapper;
            _logger = logger;
            _taiLieuDinhKemService = taiLieuDinhKemService;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<ConfigForm>> Create([FromBody] ConfigFormCreateVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = _mapper.Map<ConfigFormCreateVM, ConfigForm>(model);
                    if (model.FileDinhKems is not null)
                    {
                        var fileDinhKes = await _taiLieuDinhKemService.GetByIdAsync(model.FileDinhKems);
                        entity.FileDinhKems =  fileDinhKes;
                    }
                    await _ConfigFormService.CreateAsync(entity);
                    return new DataResponse<ConfigForm>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    return DataResponse<ConfigForm>.False("Error", new string[] { ex.Message });
                }
            }
            return DataResponse<ConfigForm>.False("Some properties are not valid", ModelStateError);
        }
        
        [HttpPut("Update")]
        public async Task<DataResponse<ConfigForm>> Update([FromBody] ConfigFormEditVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _ConfigFormService.GetByIdAsync(model.Id);
                    if (entity == null)
                        return DataResponse<ConfigForm>.False("Không tìm thấy nhóm danh mục để sửa");
                    entity = _mapper.Map(model, entity);
                    await _ConfigFormService.UpdateAsync(entity);
                    return new DataResponse<ConfigForm>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    DataResponse<ConfigForm>.False(ex.Message);
                }
            }
            return DataResponse<ConfigForm>.False("Some properties are not valid", ModelStateError);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<ConfigFormDto>> Get(Guid id)
        {
            var result = await _ConfigFormService.GetDto(id);
            return new DataResponse<ConfigFormDto>
            {
                Data = result,
                Message = "Get ConfigFormDto thành công",
                Status = true
            };
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<ConfigFormDto>>> GetData([FromBody] ConfigFormSearchVM search)
        {
            var result = await _ConfigFormService.GetData(search);
            return new DataResponse<PagedList<ConfigFormDto>>
            {
                Data = result,
                Message = "GetData PagedList<ConfigFormDto> thành công",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _ConfigFormService.GetByIdAsync(id);
                await _ConfigFormService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }
        
    }
}
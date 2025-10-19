using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Model.Entities.ConfigAssign;
using Hinet.Service.ConfigFormKeyService;
using Hinet.Service.ConfigFormKeyService.Dto;
using Hinet.Service.ConfigFormKeyService.ViewModels;
using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    public class ConfigFormKeyController : HinetController
    {

        private readonly IMapper _mapper;
        private readonly ILogger<ConfigFormKeyController> _logger;
        private readonly IConfigFormKeyService _configFormKeyService;
        public ConfigFormKeyController(IConfigFormKeyService configFormKeyService, IMapper mapper, ILogger<ConfigFormKeyController> logger)
        {
            _configFormKeyService = configFormKeyService;
            _mapper = mapper;
            _logger = logger;
        }
        

        [HttpGet("GetAllConfigFields")]
        public async Task<DataResponse<List<ConfirFormKeyDto>>> GetConfigField([FromQuery] Guid Id)
        {
            var listConfigFormKey =  _configFormKeyService.GetQueryable().Where(t => t.FormId.Id == Id)
                .Select(x => new ConfirFormKeyDto
                {
                    FormId = x.FormId,
                    DefaultKey = x.DefaultKey,
                    KTT_KEY = x.KTT_KEY,
                    KTT_TYPE = x.KTT_TYPE,
                    Max = x.Max,
                    IsSystem = x.IsSystem,
                    Min = x.Min,
                    IsRequired = x.IsRequired
                }).ToList();
            return DataResponse<List<ConfirFormKeyDto>>.Success(listConfigFormKey);
        } 

        [HttpPost("EditByForm")]
        public async Task<DataResponse<ConfigFormKey>> EditByForm([FromBody] ConfigFormKeyEditVM model)
        {
            var exitsKey = await _configFormKeyService.GetConfigName(model.KTT_KEY, model.ConfigId);
            if (exitsKey != null)
            {
                exitsKey = _mapper.Map<ConfigFormKeyEditVM, ConfigFormKey>(model, exitsKey);
                await _configFormKeyService.UpdateAsync(exitsKey);
                return DataResponse<ConfigFormKey>.Success(exitsKey);
            } else
            {
                return DataResponse<ConfigFormKey>.False("Có lỗi xảy ra");
            }
        }

        [HttpGet("GetDetailKey")]
        public async Task<DataResponse<ConfigFormKey>> GetDetailKey([FromQuery] Guid FormId , [FromQuery] string Key)
        {
            var queryRes = await _configFormKeyService.GetConfigName(Key, FormId);
            return DataResponse<ConfigFormKey>.Success(queryRes);
        }
            
    }
}

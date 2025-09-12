using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Model.Entities.ConfigAssign;
using Hinet.Service.ConfigFormKeyService;
using Hinet.Service.ConfigFormKeyService.ViewModels;
using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost("EditByForm")]
        public async Task<DataResponse<ConfigFormKey>> EditByForm([FromBody] ConfigFormKeyEditVM model)
        {
            var exitsKey = await _configFormKeyService.GetConfigName(model.KTT_KEY, model.ConfigId);
            if (exitsKey != null)
            {
                exitsKey = _mapper.Map<ConfigFormKeyEditVM, ConfigFormKey>(model, exitsKey);
                exitsKey.KTT_TYPE = model.Type;
                exitsKey.DefautKey = model.DefaultKey;
                await _configFormKeyService.UpdateAsync(exitsKey);
                return DataResponse<ConfigFormKey>.Success(exitsKey);
            } else
            {
                return DataResponse<ConfigFormKey>.False("Có lỗi xảy ra");
            }
        }
    }
}

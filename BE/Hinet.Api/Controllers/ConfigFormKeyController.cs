using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Model.Entities.ConfigAssign;
using Hinet.Service.ConfigFormKeyService;
using Hinet.Service.ConfigFormKeyService.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Api.Controllers
{
    public class ConfigFormKeyController : HinetController
    {
        private readonly IConfigFormKeyService _configFormKeyService;
        public ConfigFormKeyController(IConfigFormKeyService configFormKeyService)
        {
            _configFormKeyService = configFormKeyService;
        }

        [HttpPost("EditByForm")]
        public async Task<DataResponse<ConfigFormKey>> EditByForm([FromBody] ConfigFormKeyEditVM model)
        {
            var exitsKey = await _configFormKeyService.GetConfigName(model.KTT_KEY, model.ConfigId);
            if (exitsKey != null)
            {
                exitsKey.KTT_TYPE = model.Type;
                await _configFormKeyService.UpdateAsync(exitsKey);
                return DataResponse<ConfigFormKey>.Success(exitsKey);
            } else
            {
                return DataResponse<ConfigFormKey>.False("Có lỗi xảy ra");
            }
        }
    }
}

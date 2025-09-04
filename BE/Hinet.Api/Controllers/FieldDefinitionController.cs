using Hinet.Api.Dto;
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DM_NhomDanhMucService.Dto;
using Hinet.Service.FieldDefinitionService;
using Hinet.Service.FieldDefinitionService.Dto;
using Hinet.Service.FormTemplateService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class FieldDefinitionController : HinetController
    {
        private readonly IFieldDefinitionService _fieldDefinitionService;
        private readonly IFormTemplateService _formTemplateService;
        private readonly IMapper _mapper;
        private readonly ILogger<FieldDefinitionController> _logger;

        public FieldDefinitionController(
            IFormTemplateService formTemplateService,
            IMapper mapper,
            ILogger<FieldDefinitionController> logger,
            IFieldDefinitionService fieldDefinitionService)
        {
            _formTemplateService = formTemplateService;
            _mapper = mapper;
            _logger = logger;
            _fieldDefinitionService = fieldDefinitionService;
        }

        //[HttpPut("update")]
        //public async Task<IActionResult> Update(string templateId, string fieldId, [FromBody] UpdateFieldRequest request)
        //{
        //    var template = await _formTemplates.Find(t => t.Id == templateId).FirstOrDefaultAsync();
        //    if (template == null) return NotFound();

        //    var field = template.Fields.FirstOrDefault(f => f.FieldId == fieldId);
        //    if (field == null) return NotFound();

        //    field.Label = request.Label;
        //    field.Type = request.Type;
        //    field.Required = request.Required;
        //    field.Options = string.IsNullOrWhiteSpace(request.Options)
        //        ? new List<string>()
        //        : request.Options.Split(',').Select(o => o.Trim()).ToList();

        //    await _formTemplates.ReplaceOneAsync(t => t.Id == templateId, template);

        //    return Ok(field);
        //}
    }
}
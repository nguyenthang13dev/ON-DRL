using Hinet.Api.Dto;
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DM_NhomDanhMucService.Dto;
using Hinet.Service.FormTemplateService;
using Hinet.Service.FormTemplateService.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class FormTemplateController : HinetController
    {
        private readonly IFormTemplateService _formTemplateService;
        private readonly IMapper _mapper;
        private readonly ILogger<DM_NhomDanhMucController> _logger;

        public FormTemplateController(
            IFormTemplateService formTemplateService,
            IMapper mapper,
            ILogger<DM_NhomDanhMucController> logger
        )
        {
            _formTemplateService = formTemplateService;
            _mapper = mapper;
            _logger = logger;
        }



        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<FormTemplateDto>>> GetData([FromBody] FormTemplateSearchDto search)
        {
            var result = await _formTemplateService.GetData(search);
            return new DataResponse<PagedList<FormTemplateDto>>
            {
                Data = result,
                Message = "Lấy dữ liệu thành công",
                Status = true
            };
        }


        [HttpPost("upload")]
        public async Task<DataResponse<FormTemplate>> UploadForm(IFormFile file)
        {

            try
            {
                var uploadResult = await _formTemplateService.UploadFormAsync(file);
                return new DataResponse<FormTemplate>() { Data = uploadResult, Status = true };
            }
            catch (Exception ex)
            {
                return DataResponse<FormTemplate>.False("Error", new string[] { ex.Message });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<DataResponse<FormTemplate>> GetFormTemplate(Guid id)
        {
            try
            {
                var template = await _formTemplateService.GetByIdAsync(id);
                return new DataResponse<FormTemplate>() { Data = template, Status = true };
            }
            catch (Exception ex)
            {
                return DataResponse<FormTemplate>.False("Error", new string[] { ex.Message });
            }
        }

        //[HttpPut("{templateId}/fields/{fieldId}")]
        //public async Task<IActionResult> UpdateField(string templateId,string fieldId,[FromBody] UpdateFieldRequest request)
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
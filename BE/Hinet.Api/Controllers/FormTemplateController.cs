using Hinet.Api.Dto;
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.FormTemplateService;
using Hinet.Service.FormTemplateService.Dto;
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
            ILogger<DM_NhomDanhMucController> logger)
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


        [HttpGet("GetDropdown")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropdown()
        {
            var result = await _formTemplateService.GetDropDown("Name", "Id");
            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "Lấy dữ liệu thành công",
                Status = true
            };
        }


        [HttpPost("CreateOrUpdate")]
        public async Task<DataResponse<FormTemplate>> CreateOrUpdate([FromForm] FormTemplateCreateUpdateDto dto)
        {
            try
            {
                var uploadResult = await _formTemplateService.CreateOrUpdateAsync(dto);
                return new DataResponse<FormTemplate>() { Data = uploadResult, Status = true };
            }
            catch (Exception ex)
            {
                return DataResponse<FormTemplate>.False("Error", new string[] { ex.Message });
            }
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


        [HttpPost("{templateId}/field/update")]
        public async Task<DataResponse<FormTemplate>> UpdateField(
            [FromRoute] Guid templateId,
            [FromBody] FieldDefinitionDto dto)
        {
            try
            {
                var template = await _formTemplateService.UpdateFieldAsync(templateId, dto);
                return new DataResponse<FormTemplate>() { Data = template, Status = true };
            }
            catch (Exception ex)
            {
                return DataResponse<FormTemplate>.False("Error", new string[] { ex.Message });
            }
        }

        [HttpGet("GenerateFormHtml/{id}")]
        public async Task<DataResponse<FormTemplate>> GenerateFormHtmlAsync(Guid id)
        {
            try
            {
                var template = await _formTemplateService.GenerateFormHtmlAsync(id);
                return new DataResponse<FormTemplate>() { Data = template, Status = true };
            }
            catch (Exception ex)
            {
                return DataResponse<FormTemplate>.False("Error", new string[] { ex.Message });
            }
        } 

        [HttpDelete("delete/{id}")]
        public async Task<DataResponse<FormTemplate>> Delete([FromRoute] Guid id)
        {
            try
            {
                var existingForm = await _formTemplateService.GetByIdAsync(id);
                if (existingForm == null) return DataResponse<FormTemplate>.False("Error", new string[] { "Không tìm thấy form" });
                await _formTemplateService.DeleteAsync(existingForm);
                return DataResponse<FormTemplate>.Success(existingForm, "Xoá thành công");
            }
            catch (Exception ex)
            {
                return DataResponse<FormTemplate>.False("Error", new string[] { ex.Message });
            }


        }



    }
}
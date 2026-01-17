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
using CommonHelper.Word;
using SharpCompress.Common;
using Hinet.Service.Constant;
using Hinet.Service.ConfigFormKeyService;
using System.Text.RegularExpressions;
using CommonHelper.String;
using Hinet.Service.ConfigFormKeyService.ViewModels;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class ConfigFormController : HinetController
    {
        private readonly IConfigFormService _ConfigFormService;
        private readonly IConfigFormKeyService _ConfigFormKeyService;
        private readonly IMapper _mapper;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly ILogger<ConfigFormController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ConfigFormController(
            IConfigFormService ConfigFormService,
            IMapper mapper,
            ILogger<ConfigFormController> logger
,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IWebHostEnvironment webHostEnvironment,
            IConfigFormKeyService configFormKeyService)
        {
            this._ConfigFormService = ConfigFormService;
            this._mapper = mapper;
            _logger = logger;
            _taiLieuDinhKemService = taiLieuDinhKemService;
            _webHostEnvironment = webHostEnvironment;
            _ConfigFormKeyService = configFormKeyService;
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
                    // Tạo danh sách form
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
                    if (model.FileDinhKems is not null)
                    {
                        var fileDinhKes = await _taiLieuDinhKemService.GetByIdAsync(model.FileDinhKems);
                        entity.FileDinhKems = fileDinhKes;
                    }
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
        
        [HttpGet("Config-preview")]
        public async Task<DataResponse<FormKeyConfig>> PreviewConfig([FromQuery] Guid Id)
        {
            var configForm = await _ConfigFormService.GetByIdAsync(Id);
            var file = await _ConfigFormService.GetTaiLieuDinhKem(Id);
            var formKeyDto = new FormKeyConfig();
            if (file != null)
            {
                var path = _webHostEnvironment.WebRootPath;
                var filePath = Path.Combine(path, "uploads",  file.DuongDanFile.Substring(1));
                var htmlFileName = Path.Combine("htmloutput", Path.GetFileNameWithoutExtension(filePath) + ".html");
                var htmlFilePath = Path.Combine(path, htmlFileName);

                var checkExitsFile = System.IO.File.Exists(htmlFilePath);

                var resHtmlContent = checkExitsFile ? System.IO.File.ReadAllText(htmlFilePath) :  WordHelper.ConvertWordToHtml(filePath);
                formKeyDto.HtmlContent = resHtmlContent;
                // Lấy ra 
                List<string> content = RegexHelper.ExtractKey(resHtmlContent);
                var existingKeys = await _ConfigFormKeyService.GetConfig(configForm.Id);
                var existingKeyNames = existingKeys.Select(t => t.KTT_KEY).ToHashSet();
                
                var newKeys = content
                    .Where(t => !existingKeyNames.Contains(t))
                    .Select(t => new ConfigFormKeyCreateVM
                    {
                        KTT_KEY = t,
                        KTT_TYPE = "",
                        IsRquired = false,
                        FormId = configForm
                    })
                    .ToList();
                if (newKeys.Any())
                {
                    var newEntities = _mapper.MapList<ConfigFormKeyCreateVM, ConfigFormKey>(newKeys);
                    await _ConfigFormKeyService.CreateAsync(newEntities);
                }
                return DataResponse<FormKeyConfig>.Success(formKeyDto, "Success");
            }
            else
            {
                return DataResponse<FormKeyConfig>.False("Có lỗi xảy ra trong quá trình xử lý");
            }
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

        [HttpPost("GetFormByUser")]
        public async Task<DataResponse<List<DanhSachFormDto>>> GetFormByUser([FromBody] ConfigFormSearchVM search)
        {
            search.UserId = UserId.Value;
            var isLopTruong = IsLopTruong;
            search.IsLopTruong = isLopTruong;
            search.IsGv = IsGV;
            var result = await _ConfigFormService.GetKeKhaiByUser(search);
            return new DataResponse<List<DanhSachFormDto>>
            {
                Data = result,
                Message = "GetData PagedList<ConfigFormDto> thành công",
                Status = true
            };
        }
        [HttpPost("GetDanhSachKeKhaiByUser")]
        public async Task<DataResponse<List<ListAssignConfig>>> GetDanhSachKeKhaiByUser([FromBody] ConfigFormSearchVM search)
        {
            search.UserId = UserId.Value;
            var isLopTruong = IsLopTruong;
            search.IsLopTruong = isLopTruong;
            var result = await _ConfigFormService.GetDanhSachKeKhaiByUser(search);
            return new DataResponse<List<ListAssignConfig>>
            {
                Data = result,
                Message = "GetData PagedList<ConfigFormDto> thành công",
                Status = true
            };
        }


    }
}
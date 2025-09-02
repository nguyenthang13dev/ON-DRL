using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.ModuleService;
using Hinet.Service.ModuleService.Dto;
using Hinet.Service.ModuleService.ViewModels;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Api.Filter;
using Hinet.Api.Core.Attributes;
using Hinet.Api.Hellper;
using Hinet.Service.HuyenService.Dto;
using Hinet.Api.Dto;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class ModuleController : HinetController
    {
        private readonly IModuleService _moduleService;
        private readonly IMapper _mapper;
        private readonly ILogger<ModuleController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ModuleController(
            IModuleService moduleService,
            IMapper mapper,
            ILogger<ModuleController> logger
        , IWebHostEnvironment webHostEnvironment)
        {
            this._moduleService = moduleService;
            this._mapper = mapper;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<Module>> Create([FromForm] ModuleCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<ModuleCreateVM, Module>(model);
                entity.Order = int.TryParse(model.Order, out var orderNum) ? orderNum : 0;

                if (model.FileIcon != null)
                {
                    entity.Icon = UploadFileHelper.UploadFile(model.FileIcon, "icons");
                }
                await _moduleService.CreateAsync(entity);

                return new DataResponse<Module>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            {
                return DataResponse<Module>.False("Error", new string[] { ex.Message });
            }
        }

        [HttpPut("Update")]
        public async Task<DataResponse<Module>> Update([FromForm] ModuleEditVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _moduleService.GetByIdAsync(model.Id);
                    if (entity == null)
                        return DataResponse<Module>.False("Module not found");
                    var oldIcon = entity.Icon;
                    entity = _mapper.Map(model, entity);
                    if (model.FileIcon != null)
                    {
                        entity.Icon = UploadFileHelper.UploadFile(model.FileIcon, "icons");
                    }
                    else
                    {
                        entity.Icon = oldIcon;
                    }
                    entity.Order = int.TryParse(model.Order, out var orderNum) ? orderNum : 0;
                    await _moduleService.UpdateAsync(entity);
                    return new DataResponse<Module>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    DataResponse<Module>.False(ex.Message);
                }
            }
            return DataResponse<Module>.False("Some properties are not valid", ModelStateError);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<ModuleDto>> Get(Guid id)
        {
            var result = await _moduleService.GetDto(id);
            return new DataResponse<ModuleDto>
            {
                Data = result,
                Message = "Get ModuleDto thành công",
                Status = true
            };
        }

        [HttpPost("GetData", Name = "Xem danh sách Chức năng")]
        [ServiceFilter(typeof(LogActionFilter))]
        //[CustomRoleAuthorize("ModuleGetData")]
        public async Task<DataResponse<PagedList<ModuleDto>>> GetData([FromBody] ModuleSearch search)
        {
            var listData = await _moduleService.GetData(search);

            if (listData != null)
            {
                foreach (var item in listData.Items)
                {
                    item.DuongDanIcon = item.Icon;
                    if (!string.IsNullOrEmpty(item.Icon))
                    {
                        item.Icon = ConvertToBase64.GetContentFile(item.Icon, _webHostEnvironment);
                    }
                }
            }
            return new DataResponse<PagedList<ModuleDto>>
            {
                Data = listData,
                Message = "GetData PagedList<ModuleDto> thành công",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _moduleService.GetByIdAsync(id);
                await _moduleService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpPost("GetDropModule")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropModule(string? selected)
        {
            var result = await _moduleService.GetDropDown(selected);
            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "GetDropModule List<DropdownOption> thành công",
                Status = true
            };
        }

        //Lấy danh sách các module theo vai trò
        [HttpGet("GetModuleGroupData")]
        public async Task<DataResponse<List<ModuleGroup>>> GetModuleGroupData(Guid roleId)
        {
            var result = await _moduleService.GetModuleGroupData(roleId);
            return new DataResponse<List<ModuleGroup>>
            {
                Data = result,
                Message = "GetDropModule List<ModuleGroup> thành công",
                Status = true
            };
        }
    }
}
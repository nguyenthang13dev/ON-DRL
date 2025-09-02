using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.GroupUserRoleService;
using Hinet.Service.GroupUserRoleService.Dto;
using Hinet.Service.GroupUserRoleService.ViewModels;
using Hinet.Service.Common;
using Hinet.Api.Filter;
using CommonHelper.Excel;
using Hinet.Web.Common;
using Hinet.Api.ViewModels.Import;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Api.Dto;
using MongoDB.Bson.Serialization.Serializers;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class GroupUserRoleController : HinetController
    {
        private readonly IGroupUserRoleService _groupUserRoleService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<GroupUserRoleController> _logger;

        public GroupUserRoleController(
            IGroupUserRoleService groupUserRoleService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<GroupUserRoleController> logger
            )
        {
            this._groupUserRoleService = groupUserRoleService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<GroupUserRole>> Create([FromBody] GroupUserRoleCreateVM model)
        {
            try
            {
                var oldRoles = _groupUserRoleService.FindBy(x => x.GroupUserId == model.GroupUserId).ToList();

                if (model.RoleId != null && model.RoleId.Any())
                {
                    var lstGroupUserRole = new List<GroupUserRole>();
                    foreach (var item in model.RoleId)
                    {
                        var groupUserRole = new GroupUserRole();
                        groupUserRole.GroupUserId = model.GroupUserId;
                        groupUserRole.RoleId = item;
                        lstGroupUserRole.Add(groupUserRole);
                    }
                    if (lstGroupUserRole.Any())
                    {
                        await _groupUserRoleService.CreateAsync(lstGroupUserRole);
                    }
                }

                if (oldRoles != null && oldRoles.Any())
                {
                    await _groupUserRoleService.DeleteAsync(oldRoles);
                }

                return DataResponse<GroupUserRole>.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo GroupUserRole");
                return DataResponse<GroupUserRole>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }


        [HttpPut("Update")]
        public async Task<DataResponse<GroupUserRole>> Update([FromBody] GroupUserRoleEditVM model)
        {
            try
            {
                var entity = await _groupUserRoleService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<GroupUserRole>.False("GroupUserRole không tồn tại");

                entity = _mapper.Map(model, entity);
                await _groupUserRoleService.UpdateAsync(entity);
                return DataResponse<GroupUserRole>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật GroupUserRole với Id: {Id}", model.Id);
                return new DataResponse<GroupUserRole>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<GroupUserRoleDto>> Get(Guid id)
        {
            var dto = await _groupUserRoleService.GetDto(id);
            return DataResponse<GroupUserRoleDto>.Success(dto);
        }

        [HttpPost("GetData", Name = "Xem danh sách GroupUserRole hệ thống")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<GroupUserRoleDto>>> GetData([FromBody] GroupUserRoleSearch search)
        {
            var data = await _groupUserRoleService.GetData(search);
            return DataResponse<PagedList<GroupUserRoleDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _groupUserRoleService.GetByIdAsync(id);
                await _groupUserRoleService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa GroupUserRole với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }


        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new GroupUserRoleSearch();
                var data = await _groupUserRoleService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<GroupUserRoleDto>(data?.Items);
                if (string.IsNullOrEmpty(base64Excel))
                {
                    return DataResponse.False("Kết xuất thất bại hoặc dữ liệu trống");
                }
                return DataResponse.Success(base64Excel);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Kết xuất thất bại");
            }
        }

        [HttpGet("ExportTemplateImport")]
        public async Task<DataResponse<string>> ExportTemplateImport()
        {
            try
            {
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "GroupUserRole");
                if (string.IsNullOrEmpty(base64))
                {
                    return DataResponse<string>.False("Kết xuất thất bại hoặc dữ liệu trống");
                }
                return DataResponse<string>.Success(base64);
            }
            catch (Exception)
            {
                return DataResponse<string>.False("Kết xuất thất bại");
            }
        }

        [HttpGet("Import")]
        public async Task<DataResponse> Import()
        {
            try
            {
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                ExcelImportExtention.CreateExcelWithDisplayNames<GroupUserRole>(rootPath, "GroupUserRole");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<GroupUserRole>();
                return DataResponse.Success(columns);
            }
            catch (Exception)
            {
                return DataResponse.False("Lấy dữ liệu màn hình import thất bại");
            }
        }

        [HttpPost("ImportExcel")]
        public async Task<DataResponse> ImportExcel([FromBody] DataImport data)
        {
            try
            {
                #region Config để import dữ liệu    
                var filePathQuery = await _taiLieuDinhKemService.GetPathFromId(data.IdFile);
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                string filePath = rootPath + filePathQuery;

                var importHelper = new ImportExcelHelperNetCore<GroupUserRole>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<GroupUserRole>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<GroupUserRole>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _groupUserRoleService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<GroupUserRole>();


                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception)
            {
                return DataResponse.False("Import thất bại");
            }
        }
    }
}
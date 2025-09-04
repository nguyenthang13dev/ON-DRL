using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.GroupUserService;
using Hinet.Service.GroupUserService.Dto;
using Hinet.Service.GroupUserService.ViewModels;
using Hinet.Service.Common;

using CommonHelper.Excel;
using Hinet.Web.Common;
using Hinet.Api.ViewModels.Import;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Api.Dto;
using Hinet.Service.Dto;
using Hinet.Service.Constant;
using MongoDB.Driver.Linq;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class GroupUserController : HinetController
    {
        private readonly IGroupUserService _groupUserService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<GroupUserController> _logger;

        public GroupUserController(
            IGroupUserService groupUserService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<GroupUserController> logger
            )
        {
            this._groupUserService = groupUserService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<GroupUser>> Create([FromBody] GroupUserCreateVM model)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(model.Code))
                {
                    if (await _groupUserService.Where(x => x.Code.Trim().ToLower().Equals(model.Code.Trim().ToLower())).AnyAsync())
                    {
                        return DataResponse<GroupUser>.False("Mã nhóm người sử dụng đã tồn tại");
                    }
                }

                var entity = _mapper.Map<GroupUserCreateVM, GroupUser>(model);
                if (!HasRole(VaiTroConstant.Admin)) entity.DepartmentId = DonViId;
                await _groupUserService.CreateAsync(entity);
                return DataResponse<GroupUser>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo GroupUser");
                return DataResponse<GroupUser>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }


        [HttpPut("Update")]
        public async Task<DataResponse<GroupUser>> Update([FromBody] GroupUserEditVM model)
        {
            try
            {
                var entity = await _groupUserService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<GroupUser>.False("Nhóm người sử dụng không tồn tại");

                if (!string.IsNullOrWhiteSpace(model.Code))
                {
                    if (await _groupUserService.Where(x => x.Id != model.Id && x.Code.Trim().ToLower().Equals(model.Code.Trim().ToLower())).AnyAsync())
                    {
                        return DataResponse<GroupUser>.False("Mã nhóm người sử dụng đã tồn tại");
                    }
                }

                entity = _mapper.Map(model, entity);
                if (!HasRole(VaiTroConstant.Admin)) entity.DepartmentId = DonViId;
                await _groupUserService.UpdateAsync(entity);
                return DataResponse<GroupUser>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật GroupUser với Id: {Id}", model.Id);
                return new DataResponse<GroupUser>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<GroupUserDto>> Get(Guid id)
        {
            var dto = await _groupUserService.GetDto(id);
            return DataResponse<GroupUserDto>.Success(dto);
        }

        [HttpPost("GetData", Name = "Xem danh sách GroupUser hệ thống")]
        
        public async Task<DataResponse<PagedList<GroupUserDto>>> GetData([FromBody] GroupUserSearch search)
        {
            if (search == null)
            {
                search = new GroupUserSearch();
            }
            if (!HasRole(VaiTroConstant.Admin))
            {
                search.DepartmentId = DonViId;
            }
            var data = await _groupUserService.GetData(search);
            return DataResponse<PagedList<GroupUserDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _groupUserService.GetByIdAsync(id);
                await _groupUserService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa GroupUser với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }

        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new GroupUserSearch();
                var data = await _groupUserService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<GroupUserDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "GroupUser");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<GroupUser>(rootPath, "GroupUser");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<GroupUser>();
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

                var importHelper = new ImportExcelHelperNetCore<GroupUser>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<GroupUser>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<GroupUser>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _groupUserService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<GroupUser>();


                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception)
            {
                return DataResponse.False("Import thất bại");
            }
        }

        [HttpGet("GetDropdown")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropdown()
        {
            var data = await _groupUserService.GetDropDown("Name", "Id");
            return DataResponse<List<DropdownOption>>.Success(data);
        }
    }
}
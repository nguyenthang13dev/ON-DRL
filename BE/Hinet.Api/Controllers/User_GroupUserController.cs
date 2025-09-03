using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.User_GroupUserService;
using Hinet.Service.User_GroupUserService.Dto;
using Hinet.Service.User_GroupUserService.ViewModels;
using Hinet.Service.Common;

using CommonHelper.Excel;
using Hinet.Web.Common;
using Hinet.Api.ViewModels.Import;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Api.Dto;
using System.Net.WebSockets;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class User_GroupUserController : HinetController
    {
        private readonly IUser_GroupUserService _user_GroupUserService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<User_GroupUserController> _logger;

        public User_GroupUserController(
            IUser_GroupUserService user_GroupUserService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<User_GroupUserController> logger
            )
        {
            this._user_GroupUserService = user_GroupUserService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<User_GroupUser>> Create([FromBody] User_GroupUserCreateVM model)
        {
            try
            {
                // nhóm cũ
                var lstOlds = _user_GroupUserService.FindBy(x => x.UserId == model.UserId).ToList();

                if (model.GroupUserId != null && model.GroupUserId.Any())
                {
                    // thêm nhóm mới
                    var userGroupUsers = new List<User_GroupUser>();
                    foreach (var item in model.GroupUserId)
                    {
                        var userGroupUser = new User_GroupUser();
                        userGroupUser.UserId = model.UserId;
                        userGroupUser.GroupUserId = item;
                        userGroupUsers.Add(userGroupUser);
                    }

                    if (userGroupUsers.Any())
                    {
                        await _user_GroupUserService.CreateAsync(userGroupUsers);
                    }
                }
                // xóa hết nhóm cũ 
                if (lstOlds != null && lstOlds.Any())
                {
                    await _user_GroupUserService.DeleteAsync(lstOlds);
                }

                return DataResponse<User_GroupUser>.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo User_GroupUser");
                return DataResponse<User_GroupUser>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }

        [HttpPut("Update")]
        public async Task<DataResponse<User_GroupUser>> Update([FromBody] User_GroupUserEditVM model)
        {
            try
            {
                var entity = await _user_GroupUserService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<User_GroupUser>.False("User_GroupUser không tồn tại");

                entity = _mapper.Map(model, entity);
                await _user_GroupUserService.UpdateAsync(entity);
                return DataResponse<User_GroupUser>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật User_GroupUser với Id: {Id}", model.Id);
                return new DataResponse<User_GroupUser>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<User_GroupUserDto>> Get(Guid id)
        {
            var dto = await _user_GroupUserService.GetDto(id);
            return DataResponse<User_GroupUserDto>.Success(dto);
        }

        [HttpPost("GetData", Name = "Xem danh sách User_GroupUser hệ thống")]
        
        public async Task<DataResponse<PagedList<User_GroupUserDto>>> GetData([FromBody] User_GroupUserSearch search)
        {
            var data = await _user_GroupUserService.GetData(search);
            return DataResponse<PagedList<User_GroupUserDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _user_GroupUserService.GetByIdAsync(id);
                await _user_GroupUserService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa User_GroupUser với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }

        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new User_GroupUserSearch();
                var data = await _user_GroupUserService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<User_GroupUserDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "User_GroupUser");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<User_GroupUser>(rootPath, "User_GroupUser");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<User_GroupUser>();
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

                var importHelper = new ImportExcelHelperNetCore<User_GroupUser>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<User_GroupUser>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<User_GroupUser>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _user_GroupUserService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<User_GroupUser>();


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
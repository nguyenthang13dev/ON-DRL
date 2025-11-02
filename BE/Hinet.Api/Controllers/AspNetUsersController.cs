using CommonHelper.Excel;
using CommonHelper.String;
using Hinet.Api.Dto;
using Hinet.Api.ViewModels.Import;
using Hinet.Model.Entities;
using Hinet.Service.AspNetUsersService;
using Hinet.Service.AspNetUsersService.Dto;
using Hinet.Service.AspNetUsersService.ViewModels;
using Hinet.Service.Common;
using Hinet.Service.Constant;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DepartmentService;
using Hinet.Service.Dto;
using Hinet.Service.RoleService;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Service.UserRoleService;
using Hinet.Web.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using MongoDB.Driver.Linq;
using MongoDB.Driver;
using Hinet.Service.AppUserService;
using Hinet.Service.AppUserService.ViewModels;
using CommonHelper.QrHelper;

namespace Hinet.Controllers
{
    [Route("api/User")]
    public class AspNetUsersController : HinetController
    {

        private readonly IAspNetUsersService _aspNetUsersService;
        private readonly IMapper _mapper;
        private readonly ILogger<AspNetUsersController> _logger;
        private readonly UserManager<AppUser> _userManager;
        private readonly IRoleService _roleService;
        private readonly IUserRoleService _userRoleService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IDepartmentService _departmentService;
        private readonly IAppUserService _appUserService;

        public AspNetUsersController(
            IAspNetUsersService aspNetUsersService,
            IMapper mapper,
            ILogger<AspNetUsersController> logger,
            UserManager<AppUser> userManager,
            IRoleService roleService,
            IUserRoleService userRoleService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IDepartmentService departmentService
            ,
            IAppUserService appUserService
            )
        {
            _aspNetUsersService = aspNetUsersService;
            _mapper = mapper;
            _logger = logger;
            _userManager = userManager;
            _roleService = roleService;
            _userRoleService = userRoleService;
            _taiLieuDinhKemService = taiLieuDinhKemService;
            _departmentService = departmentService;
            this._appUserService = appUserService;
        }


        [HttpPost("AddOrEditOtp")]
        public async Task<DataResponse<bool>> EditOtp([FromBody] EditOtp model)
        {
            model.AppUserId = UserId.Value;
            var res = await _appUserService.ChangePassOtp(model);
            return DataResponse<bool>.Success(res);
        }



        [HttpGet("GetChuKySo/{id}")]
        public async Task<DataResponse<AnhChuKySo>> GetChuKySo(Guid id)
        {
            var user = await _aspNetUsersService.GetByIdAsync(id);
            if (user == null)
            {
                return new DataResponse<AnhChuKySo>()
                {
                    Data = null,
                    Message = "Người dùng không tồn tại",
                    Status = false,
                };
            }

            var fileAnhChuKy = _taiLieuDinhKemService.FindBy(x => x.Item_ID == id).FirstOrDefault();
            if (fileAnhChuKy == null)
            {
                return new DataResponse<AnhChuKySo>()
                {
                    Data = null,
                    Message = "Chưa được gán chữ ký số",
                    Status = true,
                };
            }

            var obj = new AnhChuKySo();
            obj.UserId = user.Id;
            obj.TaiLieuDinhKemId = fileAnhChuKy.Id;
            obj.TenFile = fileAnhChuKy.TenTaiLieu;
            obj.DuongDanFile = fileAnhChuKy.DuongDanFile;

            return new DataResponse<AnhChuKySo>()
            {
                Data = obj,
                Message = "Lấy chữ ký số thành công",
                Status = true,
            };

        }
        [HttpPost("GanChuKySo")]
        public async Task<DataResponse<bool>> GanChuKySo([FromBody] AnhChuKySo model)
        {
            var taiLieuDinhKem = _taiLieuDinhKemService.FindBy(x => x.Id == model.TaiLieuDinhKemId).FirstOrDefault();
            if (taiLieuDinhKem == null)
            {
                return new DataResponse<bool>()
                {
                    Data = false,
                    Message = "File không tồn tại",
                    Status = false,
                };
            }

            var user = _aspNetUsersService.FindBy(x => x.Id == model.UserId).FirstOrDefault();
            if (user == null)
            {
                return new DataResponse<bool>()
                {
                    Data = false,
                    Message = "Không tìm thấy thông tin người dùng",
                    Status = false,
                };
            }

            taiLieuDinhKem.Item_ID = model.UserId;
            await _taiLieuDinhKemService.UpdateAsync(taiLieuDinhKem);

            return new DataResponse<bool>()
            {
                Data = true,
                Message = "",
                Status = true,
            };

        }

        [HttpPost("Create")]
        public async Task<DataResponse<AppUser>> Create([FromBody] AspNetUsersCreateVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = _mapper.Map<AspNetUsersCreateVM, AppUser>(model);
                    entity.Gender = int.TryParse(model.Gender, out int dd) ? dd : 1;
                    if (Guid.TryParse(model.DepartmentId, out var departmentId))
                    {
                        entity.DonViId = departmentId;
                    }         

                    var result = await _userManager.CreateAsync(entity, model.MatKhau);

                    if (result.Succeeded)
                    {
                        return new DataResponse<AppUser>() { Data = entity, Status = true };
                    }
                    else
                    {
                        return DataResponse<AppUser>.False("Error", new string[] { "Thêm mới thất bại" });
                    }
                }
                catch (Exception ex)
                {
                    return DataResponse<AppUser>.False("Error", new string[] { ex.Message });           
                }
            }
            return DataResponse<AppUser>.False("Some properties are not valid", ModelStateError);
        }

        [HttpPut("Update")]
        public async Task<DataResponse<AppUser>> Update([FromBody] AspNetUsersEditVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _aspNetUsersService.GetByIdAsync(model.Id);
                    if (entity == null)
                        return DataResponse<AppUser>.False("Người dùng không tồn tại");

                    entity.Name = model.Name;
                    entity.DonViId = model.DonViId;
                    entity.PhoneNumber = model.PhoneNumber;
                    entity.NgaySinh = model.NgaySinh;
                    entity.Gender = int.TryParse(model.Gender, out int dd) ? dd : 1;
                    entity.DiaChi = model.DiaChi;
                    entity.Type = model.Type;
                    entity.Email = model.Email;

                    if (Guid.TryParse(model.DepartmentId, out var departmentId))
                    {
                        entity.DonViId = departmentId;
                    }

                    await _aspNetUsersService.UpdateAsync(entity);

                    return new DataResponse<AppUser>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    DataResponse<AppUser>.False(ex.Message);
                }
            }
            return DataResponse<AppUser>.False("Dữ liệu không hợp lệ", ModelStateError);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<AspNetUsersDto>> Get(Guid id)
        {
            var result = await _aspNetUsersService.GetDto(id);
            return new DataResponse<AspNetUsersDto>
            {
                Data = result,
                Message = "Get AspNetUsersDto thành công",
                Status = true
            };
        }

        [HttpPost("GetData", Name = "Xem danh sách tài khoản")]
        //
        //[IpAddressAuthorized]
        public async Task<DataResponse<PagedList<UserDto>>> GetData([FromBody] AspNetUsersSearch search)
        {
            var userDto = new UserDto();
            userDto.Id = UserId ?? new Guid();
            userDto.DonViId = DonViId ?? new Guid();

            if (HasRole(VaiTroConstant.Admin))
            {
                userDto = null;
            }

            var result = await _aspNetUsersService.GetData(search, userDto);

            return new DataResponse<PagedList<UserDto>>
            {
                Data = result,
                Message = "GetData PagedList<UserDto> thành công",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _aspNetUsersService.GetByIdAsync(id);
                await _aspNetUsersService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpDelete("Lock/{id}")]
        public async Task<DataResponse> LockUser(Guid id)
        {
            var obj = await _aspNetUsersService.GetByIdAsync(id);
            if (obj == null)
            {
                return DataResponse.False("Không tìm thấy thông tin tài khoản");
            }
            try
            {
                obj.LockoutEnabled = !obj.LockoutEnabled;
                await _aspNetUsersService.UpdateAsync(obj);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Không khóa/mở khóa được tài khoản");
            }
            return DataResponse.Success(null);
        }

        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new AspNetUsersSearch();
                search.PageIndex = 1;
                search.PageSize = 20;
                //var data = await _aspNetUsersService.GetData(search);
                //var base64Excel = await ExportExcelHelperNetCore.Export<UserDto>(data?.Data?.Items);

                var exportData = await _aspNetUsersService.GetData(search);

                var base64Excel = exportData != null && exportData?.Items != null
                         ? ExportExcelHelperNetCore.ExportExcel(exportData.Items)
                            : null;
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

        [HttpGet("exportTemplateImport")]
        public async Task<DataResponse> ExportTemplateImport()
        {
            try
            {
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "AppUser");
                if (string.IsNullOrEmpty(base64))
                {
                    return DataResponse.False("Kết xuất thất bại hoặc dữ liệu trống");
                }
                return DataResponse.Success(base64);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Kết xuất thất bại");
            }
        }

        [HttpGet("import")]
        public async Task<DataResponse> import()
        {
            try
            {
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                ExcelImportExtention.CreateExcelWithDisplayNames<AppUser>(rootPath, "AppUser");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<AppUser>();
                return DataResponse.Success(columns);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Lấy dữ liệu màn hình import thất bại");
            }
        }

        [HttpPost("importExcel")]
        public async Task<DataResponse> ImportExcel([FromBody] DataImport data)
        {
            try
            {
                #region Config để import dữ liệu

                var filePathQuery = await _taiLieuDinhKemService.GetPathFromId(data.IdFile);
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                string filePath = rootPath + filePathQuery;

                var importHelper = new ImportExcelHelperNetCore<AppUser>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<AppUser>(data.Collection);

                #endregion Config để import dữ liệu

                var rsl = importHelper.Import();

                var listImportReponse = new List<AppUser>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _aspNetUsersService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<AppUser>();

                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Import thất bại");
            }
        }

        [HttpGet("GetDropDown")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropdown()
        {
            var thuongHieuDropdown = await _aspNetUsersService.GetQueryable().Select(x => new DropdownOption
            {
                Label = string.IsNullOrEmpty(x.Name) ? x.UserName : x.Name,
                Value = x.Id.ToString().ToLower()
            }).ToListAsync();
            return new DataResponse<List<DropdownOption>>() { Data = thuongHieuDropdown, Status = true };
        }
        [HttpGet("GetDropDownByIdDonVi")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropDownByIdDonVi(Guid IdDonVi)
        {
            var listUser = await _aspNetUsersService.GetUserByIdDonVi(IdDonVi);
            var result = listUser.Select(x => new DropdownOption
            {
                Label = string.IsNullOrEmpty(x.Name) ? x.UserName : x.Name,
                Value = x.Id.ToString().ToLower()
            }).ToList();
            return new DataResponse<List<DropdownOption>>() { Data = result, Status = true };
        }
        [HttpGet("GetProfile")]
        public async Task<DataResponse<AspNetUsersDto>> GetProfile()
        {
            var result = await _aspNetUsersService.GetDto(UserId.Value);
            return new DataResponse<AspNetUsersDto>
            {
                Data = result,
                Message = "Get Profile thành công",
                Status = true
            };
        }
        [HttpPost("UploadAvatar")]
        public async Task<DataResponse> UploadAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return DataResponse.False("File không hợp lệ");
            }
            const string BASE_PATH = "wwwroot/uploads";
            var info = await _aspNetUsersService.GetDto(UserId.Value);
            if (!string.IsNullOrEmpty(info.Picture))
            {
                var oldFilePath = Path.Combine(BASE_PATH, info.Picture.TrimStart('/'));
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }

            var filePath = UploadFileHelper.UploadFile(file, "Avatars");


            info.Picture = filePath;
            await _aspNetUsersService.UpdateAsync(info);
            return DataResponse.Success(filePath);
        }


        [HttpPost("UploadQRCCCD")]
        public async Task<DataResponse> UploadQRCCCD(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return DataResponse.False("File không hợp lệ");
            }
            const string BASE_PATH = "wwwroot/uploads";
            var info = await _aspNetUsersService.GetByIdAsync(UserId.Value);
            if (!string.IsNullOrEmpty(info.QRCCCD))
            {
                var oldFilePath = Path.Combine(BASE_PATH, info.QRCCCD.TrimStart('/'));
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }
            var filePath = UploadFileHelper.UploadFile(file, "QRCCCD");
            info.QRCCCD = filePath;
            await _aspNetUsersService.UpdateAsync(info);
            return DataResponse.Success(filePath);
        }

        [HttpPost("CheckOtp")]       
        public async Task<DataResponse<bool>> CheckOtp([FromBody] CheckAuth model)
        {
            model.AppUserId = UserId.Value;
            var check = await _aspNetUsersService.CheckAuth(model.OtpCode, model.AppUserId.Value);
            return DataResponse<bool>.Success(check);
        }

        [HttpPost("CheckQRCCCD")]
        public async Task<DataResponse<bool>> CheckQRCCCD([FromForm] IFormFile file)
        {
            var user = await _aspNetUsersService.GetByIdAsync(UserId.Value);
            if (string.IsNullOrEmpty(user.QRCCCD))
            {
                return DataResponse<bool>.Success(false, "Thất bại");
            }
            const string basePath = "wwwroot/uploads";
            var check = QrHelper.CheckkDecode(file, basePath + user.QRCCCD);
            return  DataResponse<bool>.Success(check);  
        }


        [AllowAnonymous]
        [HttpGet("GenerateUsers")]
        public async Task<string> GenerateUsers()
        {
            string successMes = "Tạo thành công \n";
            string errorMess = "";

            var roles = await _roleService.GetQueryable().ToListAsync();
            var rls = new[]
            {
                new {name = "Chánh Thanh Tra ", code = "ctt_", roleCode = VaiTroConstant.ChanhThanhTra},
                new {name = "Phó Chánh Thanh Tra ", code = "pctt_", roleCode = VaiTroConstant.PhoChanhThanhTra },
                new {name = "Thanh Tra Viên ", code = "ttv_", roleCode = VaiTroConstant.ThanhTraVien},
            };

            var departments = await _departmentService.GetQueryable().ToListAsync();
            if (departments != null && departments.Any())
            {
                foreach (var item in departments)
                {
                    // generate tên tài khoản
                    var shortNameDepartment = GetShortNameDeparment(item.Name);

                    foreach (var r in rls)
                    {
                        try
                        {
                            var appU = new AppUser();
                            appU.Name = r.name + item.Name;
                            appU.UserName = r.code + shortNameDepartment;
                            appU.Gender = 1;
                            appU.DonViId = item.Id;
                            appU.Email = r.code + shortNameDepartment + "@gmail.com";

                            var result = await _userManager.CreateAsync(appU, "12345678");

                            if (result.Succeeded)
                            {
                                // thêm role 
                                var role = roles.FirstOrDefault(x => x.Code == r.roleCode);
                                var newUserRole = new UserRole();
                                newUserRole.UserId = appU.Id;
                                newUserRole.RoleId = role.Id;
                                newUserRole.DepartmentId = item.Id;

                                await _userRoleService.CreateAsync(newUserRole);

                                successMes += "Tạo thành công: " + item.Name + ": " + r.name + shortNameDepartment + "\n";
                            }
                            else
                            {
                                errorMess += "Lỗi tạo tk cho: " + r.name + item.Name + "\n";
                            }
                        }
                        catch (Exception)
                        {
                            errorMess += "Lỗi tạo tk cho: " + r.name + item.Name + "\n";
                        }
                    }

                }
            }

            return successMes + "--------------------- \n" + errorMess;

        }
        private string GetShortNameDeparment(string departmentName)
        {
            if (string.IsNullOrWhiteSpace(departmentName)) return string.Empty;
            string result = "";
            string strCopare = departmentName.Trim().ToLower();
            if (strCopare.Contains("Bộ".ToLower())
                 && strCopare.Contains("Chỉ".ToLower())
                 && strCopare.Contains("Huy".ToLower())
                 && strCopare.Contains("BĐBP".ToLower())
                 )
            {
                int index = strCopare.IndexOf("tỉnh");
                if (index != -1)
                {
                    result = strCopare.Substring(index + "tỉnh".Length).Trim();
                    result = "bdbp_" + result.ConvertToVN().Replace(" ", "").ToLower();
                    return result;
                }
            }

            if (strCopare.Contains("Quân khu".ToLower()))
            {
                result = strCopare.ConvertToVN().RemoveSpecialCharacters().ToLower();
                return result;
            }

            if (strCopare.Contains("Sư đoàn F324"))
            {
                result = "sudoan_f324";
                return result;
            }

            if (strCopare.CountWords() >= 7)
            {
                result = strCopare.ConvertToVN().GetFirstLetters().ToLower();
            }

            result = strCopare.ConvertToVN().RemoveSpecialCharacters().ToLower();

            return result;
        }
    }
}
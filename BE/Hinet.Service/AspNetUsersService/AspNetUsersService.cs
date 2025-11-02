using Hinet.Model.Entities;
using Hinet.Repository.AspNetUsersRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.AspNetUsersService.Dto;
using Hinet.Service.Common;
using Hinet.Model.Entities;
using Hinet.Repository.UserRoleRepository;
using Hinet.Repository.RoleRepository;
using Hinet.Repository.DepartmentRepository;
using System.Net.WebSockets;
using Hinet.Repository.User_GroupUserRepository;
using Hinet.Service.GroupUserService;
using Hinet.Service.DepartmentService;
using CommonHelper.Extenions;
using MongoDB.Driver.Linq;
using MongoDB.Driver;
using Hinet.Service.AspNetUsersService.ViewModels;

namespace Hinet.Service.AspNetUsersService
{
    public class AspNetUsersService : Service<AppUser>, IAspNetUsersService
    {
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IUser_GroupUserRepository _user_GroupUserRepository;
        private readonly IGroupUserService _groupUserService;
        private readonly IDepartmentService _departmentService;

        public AspNetUsersService(
            IAspNetUsersRepository aspNetUsersRepository,
            IUserRoleRepository userRoleRepository,
            IRoleRepository roleRepository,
            IDepartmentRepository departmentRepository,
            IUser_GroupUserRepository user_GroupUserRepository,
            IGroupUserService groupUserService,
            IDepartmentService departmentService) : base(aspNetUsersRepository)
        {
            _userRoleRepository = userRoleRepository;
            _roleRepository = roleRepository;
            _departmentRepository = departmentRepository;
            _user_GroupUserRepository = user_GroupUserRepository;
            _groupUserService = groupUserService;
            _departmentService = departmentService;
        }


   

        public async Task<PagedList<UserDto>> GetData(AspNetUsersSearch search, UserDto userDto = null)
        {
            // lấy các phòng con
            //var deparmentIds = userDto != null ? 
            //    await _departmentRepository.GetQueryable()
            //        .Where(x => x.ParentId == userDto.DonViId)
            //        .Select(x => x.Id)
            //        .ToListAsync() : new List<Guid>();
            //var lstIds = new List<Guid>();
            //if (userDto != null && userDto.DonViId != null)
            //{
            //    lstIds.Add(userDto.DonViId ?? new Guid());
            //}
            //var deparmentIds = _departmentService.GetChildIds(lstIds);
            try
            {
                var query = from user in GetQueryable()
                            select new UserDto
                            {
                                LockoutEnabled = user.LockoutEnabled,
                                Name = user.Name,
                                Gender = user.Gender.ToString(),
                                Picture = user.Picture,
                                UserName = user.UserName,
                                PhoneNumber = user.PhoneNumber,
                                Email = user.Email,
                                Id = user.Id,
                                DiaChi = user.DiaChi,
                                DonViId = user.DonViId,
                                NgaySinh = user.NgaySinh,
                                GioiTinh_txt = user.Gender == 1 ? "Nam" : "Nữ",
                                GroupRole_txt = user.GroupRole,
                            };

                //if (userDto != null)
                //{
                //        query = query.Where(x => x.DonViId != null && deparmentIds.Contains((Guid)x.DonViId));
                //}

                if (userDto != null && userDto.DonViId != Guid.Empty)
                {
                    query = query.Where(x => x.DonViId != null && x.DonViId == userDto.DonViId);
                    query = query.Where(x => x.Id != userDto.Id);
                }

                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.Email))
                        query = query.Where(x => !string.IsNullOrEmpty(x.Email) && x.Email.Contains(search.Email));

                    if (!string.IsNullOrEmpty(search.Name))
                        query = query.Where(x => !string.IsNullOrEmpty(x.Name) && x.Name.Contains(search.Name));

                    if (!string.IsNullOrEmpty(search.UserName))
                        query = query.Where(x => !string.IsNullOrEmpty(x.UserName) && x.UserName.Contains(search.UserName));

                    if (!string.IsNullOrEmpty(search.DiaChi))
                        query = query.Where(x => !string.IsNullOrEmpty(x.DiaChi) && x.DiaChi.Contains(search.DiaChi));

                    if (search.DonViId != null && search.ParentDonViId == null)
                        query = query.Where(x => x.DonViId == search.DonViId);

                    if (search.VaiTro != null && search.VaiTro.Any())
                    {
                        var lstRole = _roleRepository.GetQueryable().Where(x => search.VaiTro.Contains(x.Code)).Select(x => x.Id).ToList();
                        var listUserId = _userRoleRepository.GetQueryable().Where(x => lstRole.Contains(x.RoleId)).Select(x => x.UserId).ToList();
                        query = query.Where(x => listUserId.Contains(x.Id));
                    }

                    if (search.DepartmentId != null)
                    {
                        query = query.Where(x => x.DonViId == search.DepartmentId);
                    }
                }

                query = query.OrderByDescending(x => x.Id);
                var result = await PagedList<UserDto>.CreateAsync(query, search);

                var listUser_GroupUser = _user_GroupUserRepository.GetQueryable()
                    .Join(_groupUserService.GetQueryable(),
                    ugu => ugu.GroupUserId,
                    gu => gu.Id,
                    (ugu, gu) => new { ugu.UserId, ugu.GroupUserId, gu.Name })
                    .ToList();

                foreach (var item in result.Items)
                {
                    var listRoleId = _userRoleRepository.GetQueryable().Where(x => x.UserId == item.Id).Select(x => x.RoleId).ToList();
                    var listDepartmentId = _userRoleRepository.GetQueryable().Where(x => x.UserId == item.Id).Select(x => x.DepartmentId).ToList();

                    var lstRole = _roleRepository.GetQueryable().Where(x => listRoleId.Contains(x.Id)).ToList();
                    var listRoleCode = lstRole.Select(x => x.Code).ToList();
                    item.VaiTro_response = string.Join(",", listRoleCode);
                    item.VaiTro_txt_response = lstRole.Select(x => x.Name).ToList();
                    item.vaiTro = lstRole.Select(x => x.Code).ToList();

                    //var lstDept = _departmentRepository.GetQueryable().Where(x => listDepartmentId.Contains(x.Id)).ToList();
                    var lstDept = _departmentRepository.GetQueryable().Where(x => x.Id == item.DonViId).ToList();
                    item.ListPhongBan = lstDept.Select(x => x.Code).ToList();

                    item.GroupRole_response = !string.IsNullOrEmpty(item.GroupRole_txt) ? item.GroupRole_txt.Split(',').ToList() : new List<string>();

                    item.DepartmentId = lstDept.FirstOrDefault()?.Id.ToString() ?? string.Empty;
                    item.Department_txt = lstDept.FirstOrDefault()?.Name ?? string.Empty;

                    item.NhomNguoi = listUser_GroupUser
                        .Where(x => x.UserId == item.Id).Select(x => x.GroupUserId).Distinct().ToList();

                    item.NhomNguoi_txt = listUser_GroupUser
                        .Where(x => x.UserId == item.Id).Select(x => x.Name).Distinct().ToList();
                }

                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve user data: " + ex.Message);
            }
        }



        public async Task<bool> CheckAuth(string code, Guid UserId)
        {
            var appUser = GetQueryable()
                            .Where(t => t.Id == UserId)
                            .FirstOrDefault();

            if (appUser == null)
                throw new Exception("Không tìm thấy người dùng");

            if (appUser.OTP != code)
                throw new Exception("Mã 2FA không chính xác");
            return true;
        }



        public async Task<AspNetUsersDto> GetDto(Guid id)
        {
            try
            {
                var item = await (from q in GetQueryable().Where(x => x.Id == id)
                                  join donvi in _departmentRepository.GetQueryable()
                                  on q.DonViId equals donvi.Id into jDonVi
                                  from donvi in jDonVi.DefaultIfEmpty()
                                  select new AspNetUsersDto
                                  {
                                      LockoutEnd = q.LockoutEnd,
                                      AccessFailedCount = q.AccessFailedCount,
                                      EmailConfirmed = q.EmailConfirmed,
                                      PhoneNumberConfirmed = q.PhoneNumberConfirmed,
                                      TwoFactorEnabled = q.TwoFactorEnabled,
                                      LockoutEnabled = q.LockoutEnabled,
                                      Name = q.Name,
                                      Gender = q.Gender,
                                      Picture = q.Picture,
                                      Type = q.Type,
                                      DonViId = q.DonViId,
                                      Permissions = q.Permissions,
                                      UserName = q.UserName,
                                      PhoneNumber = q.PhoneNumber,
                                      NormalizedUserName = q.NormalizedUserName,
                                      Email = q.Email,
                                      NormalizedEmail = q.NormalizedEmail,
                                      PasswordHash = q.PasswordHash,
                                      SecurityStamp = q.SecurityStamp,
                                      ConcurrencyStamp = q.ConcurrencyStamp,
                                      Id = q.Id,
                                      TenDonVi_txt = donvi.Name,
                                      NgaySinh = q.NgaySinh,
                                      DiaChi = q.DiaChi,
                                      OTP = q.OTP,
                                      QRCCCD = q.QRCCCD
                                  }).FirstOrDefaultAsync();


                // lấy list role theo vai trò (nhóm quyền)
                var roleFromUser = await _userRoleRepository.GetQueryable().Where(x => x.UserId == item.Id)
                    .Join(_roleRepository.GetQueryable(),
                    userRole => userRole.RoleId,
                    role => role.Id,
                    (userRole, role) => new { role.Name })
                    .Select(x => x.Name)
                    .Distinct()
                    .ToListAsync() ?? new List<string>();

                item.ListRole = roleFromUser;
                return item ?? throw new Exception("User not found for ID: " + id);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve user DTO: " + ex.Message);
            }
        }

        public async Task<List<AppUser>> GetUserByCanBoIds(List<Guid> canboIds)
        {
            try
            {
                return await GetQueryable().Where(x => x.CanBoId != null && canboIds.Contains(x.CanBoId.Value)).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve users by CanBo IDs: " + ex.Message);
            }
        }

        public async Task<AppUser> GetUserByCanBoId(Guid? canboId)
        {
            try
            {
                return await GetQueryable().FirstOrDefaultAsync(x => x.CanBoId != null && x.CanBoId.Equals(canboId))
                    ?? throw new Exception("User not found for CanBo ID: " + canboId);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve user by CanBo ID: " + ex.Message);
            }
        }
        private static Guid ConvertToGuid(object id)
        {
            if (id is byte[] bytes)
            {
                // Kiểm tra độ dài mảng byte
                if (bytes.Length == 16)
                {
                    return new Guid(bytes); // Tạo Guid từ mảng byte 16 phần tử
                }
                else
                {
                    // Xử lý trường hợp độ dài không đúng (trả về Guid.Empty hoặc ghi log)
                    Console.WriteLine($"Invalid byte array length: {bytes.Length}");
                    return Guid.Empty;
                }
            }
            else if (id is string str)
            {
                return Guid.TryParse(str, out var guid) ? guid : Guid.Empty;
            }
            return Guid.Empty; // Trường hợp không xác định        }
        }
        public async Task<List<AppUser>> GetUserByIdDonVi(Guid IdDonVi)
        {
            try
            {
                return await GetQueryable().Where(x => x.DonViId == IdDonVi).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve users by CanBo IDs: " + ex.Message);
            }
        }
        public async Task<List<AppUser>> GetUserByIdDonViAndIdRole(Guid IdDonVi, Guid IdRole)
        {
            try
            {
                var query = await (from userRole in _userRoleRepository.GetQueryable()
                                   join user in GetQueryable() on userRole.UserId equals user.Id
                                   where userRole.RoleId == IdRole && user.DonViId == IdDonVi
                                   select user).ToListAsync();

                return query;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve users by CanBo IDs: " + ex.Message);
            }
        }

    }
}
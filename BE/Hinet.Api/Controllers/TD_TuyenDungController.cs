using Hinet.Api.Dto;
using Hinet.Model.Entities;
using Hinet.Model.Entities.TuyenDung;
using Hinet.Service.AspNetUsersService;
using Hinet.Service.Common;
using Hinet.Service.Common.TelegramNotificationService;
using Hinet.Service.Core.Mapper;
using Hinet.Service.NotificationService;
using Hinet.Service.NotificationService.Dto;
using Hinet.Service.NotificationService.ViewModels;
using Hinet.Service.RoleService;
using Hinet.Service.TD_TuyenDungService.ViewModel;
using Hinet.Service.TD_ViTriTuyenDungService;
using Hinet.Service.TD_ViTriTuyenDungService.Dto;
using Hinet.Service.TD_ViTriTuyenDungService.ViewModel;
using Hinet.Service.UserRoleService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class TD_TuyenDungController : HinetController
    {
        private readonly ITD_TuyenDungService _service;
        private readonly IAspNetUsersService _aspNetUsersService;
        private readonly INotificationService _notificationService;
        private readonly ITelegramNotificationService _telegramNotificationService;
        private readonly IRoleService _roleService;
        private readonly IUserRoleService _userRoleService;

        private readonly ILogger<TD_TuyenDungController> _logger;
        private readonly IMapper _mapper;

        public TD_TuyenDungController(IRoleService roleService, ITelegramNotificationService telegramNotificationService, IUserRoleService userRoleService, INotificationService notificationService, IAspNetUsersService aspNetUsersService, ITD_TuyenDungService service, ILogger<TD_TuyenDungController> logger, IMapper mapper)
        {
            _service = service;
            _roleService = roleService;
            _userRoleService = userRoleService;
            _telegramNotificationService = telegramNotificationService;
            _logger = logger;
            _notificationService = notificationService;
            _mapper = mapper;
            _aspNetUsersService = aspNetUsersService;
        }

        [HttpPost("GetData")]
        [AllowAnonymous]
        public async Task<DataResponse<PagedList<TD_TuyenDungDto>>> GetData([FromBody] TD_TuyenDungSearchVM search)
        {
            var result = await _service.GetData(search);
            return new DataResponse<PagedList<TD_TuyenDungDto>>
            {
                Data = result,
                Message = "Lấy danh sách vị trí tuyển dụng thành công",
                Status = true
            };
        }

        [HttpGet("Get/{id}")]
        [AllowAnonymous]
        public async Task<DataResponse<TD_TuyenDungDto>> Get(Guid id)
        {
            var result = await _service.GetDto(id);
            return new DataResponse<TD_TuyenDungDto>
            {
                Data = result,
                Message = "Lấy chi tiết vị trí tuyển dụng thành công",
                Status = true
            };
        }

        [HttpPost("Create")]
        [Authorize]
        public async Task<DataResponse> Create([FromBody] TD_TuyenDungCreateVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    if (UserId == null || UserId == Guid.Empty)
                        return DataResponse.False("Không lấy được thông tin người dùng");
                    var user = await _aspNetUsersService.GetByIdAsync(UserId ?? Guid.Empty);
                    model.PhongBanId = user?.DonViId ?? Guid.Empty;
                    if (model.PhongBanId == Guid.Empty)
                        return DataResponse.False("Không lấy được thông tin phòng ban của người dùng");

                    var roleTRUONGBAN = await _roleService.GetQueryable().Where(x => x.Code == "TRUONGBAN").FirstOrDefaultAsync();
                    var userRoleTRUONGBANs = await _userRoleService.GetQueryable().Where(x => x.RoleId == roleTRUONGBAN.Id).ToListAsync();
                    if(!userRoleTRUONGBANs.Any(x=>x.UserId == UserId))
                        return DataResponse.False("Bạn không có quyền tạo vị trí tuyển dụng, chỉ có trưởng ban mới có quyền này");

                    var entity = _mapper.Map<TD_TuyenDungCreateVM, TD_TuyenDung>(model);
                    await _service.CreateAsync(entity);

                    var roleHR = await _roleService.GetQueryable().Where(x => x.Code == "HR").FirstOrDefaultAsync();
                    var userRoles = await _userRoleService.GetQueryable().Where(x => x.RoleId == roleHR.Id).ToListAsync();
                    string tinhTrangTiengViet = entity.TinhTrang switch
                    {
                        TinhTrang_TuyenDung.DangTuyen => "Đang tuyển",
                        TinhTrang_TuyenDung.DaDong => "Đã đóng",
                        TinhTrang_TuyenDung.Hoan => "Hoãn",
                        _ => "Không xác định"
                    };
                    foreach (var userRole in userRoles)
                    {
                        // Gửi thông báo cho người dùng
                        var notification = new Notification
                        {
                            TieuDe = $"Có yêu cầu tuyển dụng {tinhTrangTiengViet} mới",
                            IsRead = false,
                            Type = "TUYENDUNG",
                            ItemName = "TUYENDUNG",
                            Message = $"Có yêu cầu tuyển dụng {tinhTrangTiengViet} mới",
                            NoiDung = $"Có một yêu cầu yêu cầu tuyển dụng '{entity.TenViTri}' mới",
                            ItemId = entity.Id,
                            FromUser = UserId,
                            ToUser = userRole.UserId,
                            Link = $"/TD_TuyenDung/{entity.Id}",
                        };
                        await _notificationService.CreateAsync(notification);
                        await _telegramNotificationService.SendToUsers(new List<Guid>{ notification.ToUser.Value},notification.NoiDung);
                    }
                    return DataResponse.Success(null);
                }
                catch (Exception ex)
                {
                    return DataResponse.False(ex.Message);
                }
            }
            return DataResponse.False("Dữ liệu không hợp lệ", ModelStateError);
        }

        [HttpPost("Update")]
        [Authorize]
        public async Task<DataResponse> Update([FromBody] TD_TuyenDungEditVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    if (UserId == null || UserId == Guid.Empty)
                        return DataResponse.False("Không lấy được thông tin người dùng");
                    var user = await _aspNetUsersService.GetByIdAsync(UserId ?? Guid.Empty);

                    if (user == null)
                        return DataResponse.False("Không lấy được thông tin người dùng");

                    var entity = await _service.GetByIdAsync(model.Id);
                    if (entity == null)
                    {
                        return DataResponse.False("Không tìm thấy vị trí tuyển dụng với ID đã cho");
                    }

                    if (entity.PhongBanId != user.DonViId)
                        return DataResponse.False("Không thể cập nhật vị trí tuyển dụng của phòng ban khác");
                    model.PhongBanId = entity.PhongBanId;

                    entity = _mapper.Map(model, entity);
                    await _service.UpdateAsync(entity);

                    var roleHR = await _roleService.GetQueryable().Where(x => x.Code == "HR").FirstOrDefaultAsync();
                    var userRoles = await _userRoleService.GetQueryable().Where(x => x.RoleId == roleHR.Id).ToListAsync();
                    string tinhTrangTiengViet = entity.TinhTrang switch
                    {
                        TinhTrang_TuyenDung.DangTuyen => "Đang tuyển",
                        TinhTrang_TuyenDung.DaDong => "Đã đóng",
                        TinhTrang_TuyenDung.Hoan => "Hoãn",
                        _ => "Không xác định"
                    };
                    foreach (var userRole in userRoles)
                    {
                        // Gửi thông báo cho người dùng
                        var notification = new Notification
                        {
                            TieuDe = $"Có yêu cầu tuyển dụng {tinhTrangTiengViet} được sửa đổi",
                            IsRead = false,
                            Type = "TUYENDUNG",
                            ItemName = "TUYENDUNG",
                            Message = $"Có yêu cầu tuyển dụng {tinhTrangTiengViet} được sửa đổi",
                            NoiDung = $"Có một yêu cầu tuyển dụng '{entity.TenViTri}' đã được sửa",
                            ItemId = entity.Id,
                            FromUser = UserId,
                            ToUser = userRole.UserId,
                            Link = $"/TD_TuyenDung/{entity.Id}",
                        };
                        await _notificationService.CreateAsync(notification);
                        await _telegramNotificationService.SendToUsers(new List<Guid> { notification.ToUser.Value }, notification.NoiDung);
                    }

                    return DataResponse.Success(null);
                }
                catch (Exception ex)
                {
                    return DataResponse.False(ex.Message);
                }
            }
            return DataResponse.False("Dữ liệu không hợp lệ", ModelStateError);
        }

        [HttpDelete("Delete/{id}")]
        [Authorize]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _service.GetByIdAsync(id);
                if (entity == null)
                {
                    return DataResponse.False("Không tìm thấy vị trí tuyển dụng với ID đã cho");
                }
                await _service.DeleteAsync(entity);

                var roleHR = await _roleService.GetQueryable().Where(x => x.Code == "HR").FirstOrDefaultAsync();
                var userRoles =await _userRoleService.GetQueryable().Where(x => x.RoleId == roleHR.Id).ToListAsync();
                string tinhTrangTiengViet = entity.TinhTrang switch
                {
                    TinhTrang_TuyenDung.DangTuyen => "Đang tuyển",
                    TinhTrang_TuyenDung.DaDong => "Đã đóng",
                    TinhTrang_TuyenDung.Hoan => "Hoãn",
                    _ => "Không xác định"
                };
                foreach (var userRole in userRoles)
                {
                    // Gửi thông báo cho người dùng
                    var notification = new Notification
                    {
                        TieuDe = $"Có yêu cầu tuyển dụng {tinhTrangTiengViet} được xóa",
                        Type = "TUYENDUNG",
                        IsRead = false,
                        ItemName = "TUYENDUNG",
                        Message = $"Có yêu cầu tuyển dụng {tinhTrangTiengViet} được xóa",
                        NoiDung = $"Có một yêu cầu yêu cầu tuyển dụng '{entity.TenViTri}' đã được xóa",
                        ItemId = entity.Id,
                        FromUser = UserId,
                        ToUser = userRole.UserId
                    };
                    await _notificationService.CreateAsync(notification);
                    await _telegramNotificationService.SendToUsers(new List<Guid> { notification.ToUser.Value }, notification.NoiDung);
                }
                return DataResponse.Success(null);

            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }
        [HttpPost("UpdateStatus")]
        [Authorize]
        public async Task<DataResponse> UpdateStatus([FromBody] TD_TuyenDungUpdateStatusVM model)
        {
            if (model.Id == Guid.Empty)
                return DataResponse.False("Thiếu Id vị trí tuyển dụng");

            if (UserId == null || UserId == Guid.Empty)
                return DataResponse.False("Không lấy được thông tin người dùng");
            var user = await _aspNetUsersService.GetByIdAsync(UserId ?? Guid.Empty);

            if (user == null)
                return DataResponse.False("Không lấy được thông tin người dùng");

            var entity = await _service.GetByIdAsync(model.Id);
            if (entity == null)
            {
                return DataResponse.False("Không tìm thấy vị trí tuyển dụng với ID đã cho");
            }

            if (entity.PhongBanId != user.DonViId)
                return DataResponse.False("Không thể cập nhật vị trí tuyển dụng của phòng ban khác");
            entity.TinhTrang = model.TrangThai;

            await _service.UpdateAsync(entity);

            // Chuyển đổi trạng thái sang tiếng Việt
            string tinhTrangTiengViet = entity.TinhTrang switch
            {
                TinhTrang_TuyenDung.DangTuyen => "Đang tuyển",
                TinhTrang_TuyenDung.DaDong => "Đã đóng",
                TinhTrang_TuyenDung.Hoan => "Hoãn",
                _ => "Không xác định"
            };

            // Gửi thông báo cho người dùng
            var notification = new Notification
            {
                TieuDe = $"Có yêu cầu tuyển dụng {tinhTrangTiengViet} cập nhật",
                Type = "TUYENDUNG",
                IsRead = false,
                ItemName = "TUYENDUNG",
                Message = $"Có yêu cầu tuyển dụng {tinhTrangTiengViet} cập nhật",
                NoiDung = $"Yêu cầu tuyển dụng '{entity.TenViTri}' đã được chuyển sang trạng thái {tinhTrangTiengViet}",
                ItemId = entity.Id,
                FromUser = UserId,
                ToUser = entity.CreatedId,
                Link = $"/TD_TuyenDung/{entity.Id}",
            };
            await _notificationService.CreateAsync(notification);
            await _telegramNotificationService.SendToUsers(new List<Guid> { notification.ToUser.Value }, notification.NoiDung);

            return DataResponse.Success(entity, "Cập nhật trạng thái vị trí tuyển dụng thành công");
        }
    }
}
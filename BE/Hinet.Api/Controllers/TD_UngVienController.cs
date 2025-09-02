using DocumentFormat.OpenXml.Office2010.Excel;
using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Core.Email;
using Hinet.Model.Entities;
using Hinet.Model.Entities.TuyenDung;
using Hinet.Service.AspNetUsersService;
using Hinet.Service.Common;
using Hinet.Service.Common.TelegramNotificationService;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.EmailService;
using Hinet.Service.EmailService.Dto;
using Hinet.Service.NotificationService;
using Hinet.Service.NotificationService.ViewModels;
using Hinet.Service.RoleService;
using Hinet.Service.TD_UngVienService;
using Hinet.Service.TD_UngVienService.Dto;
using Hinet.Service.TD_UngVienService.ViewModel;
using Hinet.Service.TD_ViTriTuyenDungService;
using Hinet.Service.UserRoleService;
using Hinet.Service.UserRoleService.ViewModels;
using MailKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Web;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class TD_UngVienController : HinetController
    {
        private readonly ITD_UngVienService _service;
        private readonly ITD_TuyenDungService _viTriUngTuyenService;
        private readonly ILogger<TD_UngVienController> _logger;
        private readonly IMapper _mapper;
        private readonly IEmailService _emailService;
        private readonly IUserRoleService _userRoleService;
        private readonly INotificationService _notificationService;
        private readonly ITelegramNotificationService _telegramNotificationService;
        private readonly IRoleService _roleService;

        public TD_UngVienController(ITelegramNotificationService telegramNotificationService, INotificationService notificationService, IRoleService roleService, IUserRoleService userRoleService, ITD_UngVienService service, ILogger<TD_UngVienController> logger, IMapper mapper, IEmailService emailService, ITD_TuyenDungService viTriUngTuyenService)
        {
            _service = service;
            _logger = logger;
            _telegramNotificationService = telegramNotificationService;
            _notificationService = notificationService;
            _mapper = mapper;
            _emailService = emailService;
            _userRoleService = userRoleService;
            _roleService = roleService;
            _viTriUngTuyenService = viTriUngTuyenService;
        }

        [HttpPost("GetData")]
        [Authorize]

        public async Task<DataResponse<PagedList<TD_UngVienDto>>> GetData([FromBody] TD_UngVienSearch search)
        {
            try
            {
                var result = await _service.GetData(search);
                return new DataResponse<PagedList<TD_UngVienDto>>
                {
                    Data = result,
                    Message = "Lấy danh sách ứng viên thành công",
                    Status = true
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }

        [HttpGet("Get/{id}")]
        [Authorize]

        public async Task<DataResponse<TD_UngVienDto>> Get(Guid id)
        {
            var result = await _service.GetDto(id);
            return new DataResponse<TD_UngVienDto>
            {
                Data = result,
                Message = "Lấy chi tiết ứng viên thành công",
                Status = true
            };
        }
        [HttpPost("Create")]
        [Authorize]
        public async Task<DataResponse<TD_UngVien>> Create([FromForm] TD_UngVienCreateVM model)
        {
            if (!ModelState.IsValid)
                return DataResponse<TD_UngVien>.False("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường bắt buộc.");
            try
            {
                var viTriTuyenDung = await _viTriUngTuyenService.GetByIdAsync(model.TuyenDungId);
                if (viTriTuyenDung == null)
                    return DataResponse<TD_UngVien>.False("Không tìm thấy vị trí tuyển dụng");

                if (viTriTuyenDung.TinhTrang != TinhTrang_TuyenDung.DangTuyen)
                    return DataResponse<TD_UngVien>.False("Vị trí tuyển dụng không còn hoạt động hoặc đã đóng tuyển");

                var existUngVien = _service.GetQueryable()
                    .Where(x => (x.Email == model.Email || x.SoDienThoai == x.SoDienThoai) && x.TuyenDungId == model.TuyenDungId);

                if (existUngVien != null && existUngVien.Any(x => x.Email == model.Email))
                    return DataResponse<TD_UngVien>.False($"Email {model.Email} đã ứng tuyển trước đó");

                if (existUngVien != null && existUngVien.Any(x => x.SoDienThoai == model.SoDienThoai))
                    return DataResponse<TD_UngVien>.False($"Số điện thoại {model.SoDienThoai} đã ứng tuyển trước đó");

                var file = model.CVFile;
                if (file == null || file.Length == 0)
                {
                    return DataResponse<TD_UngVien>.False("File không hợp lệ");
                }

                var allowedExtensions = new[] { ".pdf", ".docx" };

                const long maxFileSize = 10 * 1024 * 1024; // 10MB

                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(ext))
                    return DataResponse<TD_UngVien>.False($"File {file.FileName} không đúng định dạng cho phép.");

                if (file.Length > maxFileSize)
                    return DataResponse<TD_UngVien>.False($"File {file.FileName} vượt quá dung lượng tối đa 10MB.");

                var filePath = UploadFileHelper.UploadFile(file, "TD_UngVien");

                var entity = _mapper.Map<TD_UngVienCreateVM, TD_UngVien>(model);
                entity.Id = Guid.NewGuid();
                entity.CVFile = filePath;
                entity.NgayUngTuyen = DateTime.Now;
                await _service.CreateAsync(entity);
                string trangThaiTiengViet = model.TrangThai switch
                {
                    TrangThai_UngVien.ChuaXetDuyet => "Chưa xét duyệt",
                    TrangThai_UngVien.DaXetDuyet => "Đã xét duyệt",
                    TrangThai_UngVien.DangChoPhongVan => "Đang chờ phỏng vấn",
                    TrangThai_UngVien.DaNhanViec => "Đã nhận việc",
                    TrangThai_UngVien.DaTuChoi => "Đã từ chối",
                    TrangThai_UngVien.DatPhongVan => "Đạt phỏng vấn",
                    _ => "Không xác định"
                };
                // Gửi thông báo cho người dùng
                var notification = new Notification
                {
                    TieuDe = $"Có một ứng viên {trangThaiTiengViet}",
                    IsRead = false,
                    Type = "TUYENDUNG",
                    ItemName = "TUYENDUNG",
                    Message = $"Có một ứng viên {trangThaiTiengViet}",
                    NoiDung = $"Bạn có 1 ứng viên mới cho yêu cầu tuyển dụng '{viTriTuyenDung.TenViTri}'",
                    ItemId = entity.Id,
                    FromUser = UserId,
                    ToUser = viTriTuyenDung.CreatedId,
                    Link = $"/TD_TuyenDung/{viTriTuyenDung.Id}",
                };
                await _notificationService.CreateAsync(notification);
                await _telegramNotificationService.SendToUsers(new List<Guid> { viTriTuyenDung.CreatedId.Value }, $"Có một ứng viên mới cho vị trí '{viTriTuyenDung.TenViTri}' - {entity.HoTen}");
                return DataResponse<TD_UngVien>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi thêm hồ sơ ứng tuyển");
                return DataResponse<TD_UngVien>.False("Đã xảy ra lỗi khi tạo dữ liệu");
            }
        }

        [HttpPost("Update")]
        [Authorize]
        // Không sử dụng FromBody do trong body có sử dụng File
        public async Task<DataResponse> Update([FromForm] TD_UngVienEditVM model)
        {
            if (model.Id == null || model.Id == Guid.Empty)
                return DataResponse.False("Thiếu Id ứng viên");

            var entity = await _service.GetByIdAsync(model.Id.Value);
            if (entity == null)
                return DataResponse.False("Không tìm thấy ứng viên");

            var viTriTuyenDung = await _viTriUngTuyenService.GetByIdAsync(entity.TuyenDungId);
            // Cập nhật các trường thông tin
            entity.HoTen = model.HoTen;
            entity.NgaySinh = model.NgaySinh;
            entity.GioiTinh = model.GioiTinh;
            entity.Email = model.Email;
            entity.SoDienThoai = model.SoDienThoai;
            entity.DiaChi = model.DiaChi;
            entity.TrinhDoHocVan = model.TrinhDoHocVan;
            entity.KinhNghiem = model.KinhNghiem;
            entity.NgayUngTuyen = model.NgayUngTuyen;
            entity.ThoiGianPhongVan = model.ThoiGianPhongVan;
            entity.TrangThai = model.TrangThai;
            entity.GhiChuUngVien = model.GhiChuUngVien;
            entity.TuyenDungId = model.TuyenDungId;

            // Xử lý file CV nếu có upload mới
            var file = model.CVFile;
            if (file != null && file.Length > 0)
            {
                var allowedExtensions = new[] { ".pdf", ".docx" };
                const long maxFileSize = 10 * 1024 * 1024; // 10MB
                var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

                if (!allowedExtensions.Contains(ext))
                    return DataResponse.False($"File {file.FileName} không đúng định dạng cho phép.");

                if (file.Length > maxFileSize)
                    return DataResponse.False($"File {file.FileName} vượt quá dung lượng tối đa 10MB.");

                var filePath = UploadFileHelper.UploadFile(file, "TD_UngVien");
                entity.CVFile = filePath;
            }
            // Gửi thông báo cho người dùng
            var notification = new Notification
            {
                TieuDe = $"Có một ứng viên được cập nhật",
                IsRead = false,
                Type = "TUYENDUNG",
                ItemName = "TUYENDUNG",
                Message = "Có một ứng viên được cập nhật",
                NoiDung = $"Bạn có 1 ứng viên được cập nhật cho yêu cầu tuyển dụng '{viTriTuyenDung.TenViTri}'",
                ItemId = entity.Id,
                FromUser = UserId,
                ToUser = viTriTuyenDung.CreatedId,
                Link = $"/TD_TuyenDung/{viTriTuyenDung.Id}",
            };
            await _notificationService.CreateAsync(notification);
            await _telegramNotificationService.SendToUsers(new List<Guid> { viTriTuyenDung.CreatedId.Value }, $"Có một ứng viên được cập nhật cho vị trí '{viTriTuyenDung.TenViTri}' - {entity.HoTen}");
            await _service.UpdateAsync(entity);
            return DataResponse.Success(entity, "Cập nhật ứng viên thành công");
        }

        [HttpGet("downloadCV/{idUngVien}")]
        public async Task<IActionResult> Download([FromRoute] Guid idUngVien)
        {
            try
            {
                var entity = await _service.GetByIdAsync(idUngVien);
                var downloadData = UploadFileHelper.GetDownloadData(entity.CVFile);
                var contentType = "application/octet-stream";
                return File(downloadData.FileBytes, contentType, downloadData.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, DataResponse.False(ex.Message));
            }
        }

        [HttpGet("viewCV/{idUngVien}")]
        public async Task<IActionResult> ViewCV([FromRoute] Guid idUngVien)
        {
            try
            {
                var entity = await _service.GetByIdAsync(idUngVien);
                if (entity == null || string.IsNullOrEmpty(entity.CVFile))
                    return NotFound();
                var downloadData = UploadFileHelper.GetDownloadData(entity.CVFile);
                var ext = Path.GetExtension(downloadData.FileName).ToLowerInvariant();
                string contentType = ext switch
                {
                    ".pdf" => "application/pdf",
                    ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    _ => "application/octet-stream"
                };
                return File(downloadData.FileBytes, contentType, downloadData.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, DataResponse.False(ex.Message));
            }
        }

        [HttpDelete("Delete/{id}")]
        [Authorize]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _service.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse.False("Không tìm thấy vị ứng viên với ID đã cho");

                var tuyenDung = await _viTriUngTuyenService.GetByIdAsync(entity.TuyenDungId);
                var roleHR = await _roleService.GetQueryable().Where(x => x.Code == "HR").FirstOrDefaultAsync();
                var userRoles = await _userRoleService.GetQueryable().Where(x => x.RoleId == roleHR.Id).ToListAsync();

                if (!userRoles.Any(x => x.UserId == UserId) && UserId != entity.CreatedId && UserId != tuyenDung?.CreatedId)
                    return DataResponse.False("Bạn không có quyền xóa Ứng viên này");

                await _service.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        private static readonly Dictionary<TrangThai_UngVien, string> TrangThaiTiengViet = new()
        {
            { TrangThai_UngVien.ChuaXetDuyet, "Chưa xét duyệt" },
            { TrangThai_UngVien.DaXetDuyet, "Đã xét duyệt" },
            { TrangThai_UngVien.DangChoPhongVan, "Đang chờ phỏng vấn" },
            { TrangThai_UngVien.DaNhanViec, "Đã nhận việc" },
            { TrangThai_UngVien.DaTuChoi, "Đã từ chối" },
            { TrangThai_UngVien.DatPhongVan, "Đạt phỏng vấn" }
        };
        private string GetTrangThaiTiengViet(TrangThai_UngVien trangThai)
            => TrangThaiTiengViet.TryGetValue(trangThai, out var value) ? value : "Không xác định";

        private bool IsValidTransition(TrangThai_UngVien from, TrangThai_UngVien to)
        {
            return from switch
            {
                TrangThai_UngVien.ChuaXetDuyet => to == TrangThai_UngVien.DaXetDuyet || to == TrangThai_UngVien.DaTuChoi,
                TrangThai_UngVien.DaXetDuyet => to == TrangThai_UngVien.DangChoPhongVan || to == TrangThai_UngVien.ChuaXetDuyet || to == TrangThai_UngVien.DaTuChoi,
                TrangThai_UngVien.DangChoPhongVan => to == TrangThai_UngVien.DatPhongVan || to == TrangThai_UngVien.DaXetDuyet || to == TrangThai_UngVien.DaTuChoi,
                TrangThai_UngVien.DatPhongVan => to == TrangThai_UngVien.DaNhanViec || to == TrangThai_UngVien.DaTuChoi,
                TrangThai_UngVien.DaTuChoi => to == TrangThai_UngVien.ChuaXetDuyet,
                _ => false
            };
        }

        private async Task SendNotificationsAsync(
            IEnumerable<Guid> userIds,
            string tieuDe,
            string message,
            string noiDung,
            Guid? itemId,
            string link)
        {
            foreach (var userId in userIds)
            {
                var notification = new Notification
                {
                    TieuDe = tieuDe,
                    IsRead = false,
                    Type = "TUYENDUNG",
                    ItemName = "TUYENDUNG",
                    Message = message,
                    NoiDung = noiDung,
                    ItemId = itemId,
                    FromUser = UserId,
                    ToUser = userId,
                    Link = link,
                };
                await _notificationService.CreateAsync(notification);
                await _telegramNotificationService.SendToUsers(new List<Guid> { userId }, message);
            }
        }

        [HttpPost("UpdateStatus")]
        [Authorize]
        public async Task<DataResponse> UpdateStatus([FromBody] TD_UngVienUpdateStatusVM dto)
        {
            try
            {
                var errorList = new List<object>();
                int countHR = 0;
                int countCreator = 0;
                string tenViTri = string.Empty;
                Guid? IdViTri = null;
                Guid? creatorId = null;

                // Lấy role HR và userRoles 1 lần
                var roleHR = await _roleService.GetQueryable().Where(x => x.Code == "HR").FirstOrDefaultAsync();
                var userRoles = await _userRoleService.GetQueryable().Where(x => x.RoleId == roleHR.Id).ToListAsync();
                var userRoleIds = userRoles.Select(x => x.UserId).ToHashSet();

                // Lấy danh sách ứng viên và vị trí tuyển dụng 1 lần
                var ungViens = await _service.GetQueryable().Where(x => dto.Ids.Contains(x.Id)).ToListAsync();
                var viTriIds = ungViens.Select(x => x.TuyenDungId).Distinct().ToList();
                var viTriTuyenDungs = await _viTriUngTuyenService.GetQueryable().Where(x => viTriIds.Contains(x.Id)).ToListAsync();
                var viTriDict = viTriTuyenDungs.ToDictionary(x => x.Id, x => x);

                foreach (var id in dto.Ids)
                {
                    var ungVien = ungViens.FirstOrDefault(x => x.Id == id);
                    if (ungVien == null)
                    {
                        errorList.Add(new { Id = id, Error = "Không tìm thấy ứng viên" });
                        continue;
                    }
                    if (!ungVien.ThoiGianPhongVan.HasValue && dto.TrangThai == TrangThai_UngVien.DangChoPhongVan)
                    {
                        errorList.Add(new { Id = id, Error = $"Ứng viên '{ungVien.HoTen}' chưa có thời gian phỏng vấn" });
                        continue;
                    }
                    if (!viTriDict.TryGetValue(ungVien.TuyenDungId, out var viTriTuyenDung))
                    {
                        errorList.Add(new { Id = id, Error = "Không tìm thấy vị trí tuyển dụng" });
                        continue;
                    }
                    if (UserId == null || UserId == Guid.Empty)
                    {
                        errorList.Add(new { Id = id, Error = "Không xác định được người dùng" });
                        continue;
                    }
                    if (UserId != viTriTuyenDung.CreatedId && !userRoleIds.Contains(UserId.Value))
                    {
                        errorList.Add(new { Id = id, Error = "Không có quyền cập nhật ứng viên này" });
                        continue;
                    }
                    try
                    {
                        // Kiểm tra trình tự chuyển đổi trạng thái hợp lệ
                        if (!IsValidTransition(ungVien.TrangThai, dto.TrangThai))
                        {
                            string fromStatus = GetTrangThaiTiengViet(ungVien.TrangThai);
                            string toStatus = GetTrangThaiTiengViet(dto.TrangThai);
                            errorList.Add(new { Id = id, Error = $"Không thể chuyển trạng thái từ '{fromStatus}' sang '{toStatus}'" });
                            continue;
                        }
                        ungVien.TrangThai = dto.TrangThai;
                        if (!string.IsNullOrEmpty(dto.GhiChu))
                            ungVien.GhiChuUngVien = dto.GhiChu;
                        await _service.UpdateAsync(ungVien);
                        // Lưu lại thông tin vị trí và creator cho thông báo sau vòng lặp
                        tenViTri = viTriTuyenDung.TenViTri;
                        IdViTri = viTriTuyenDung.Id;
                        creatorId = viTriTuyenDung.CreatedId;
                        // Đếm số lượng theo nhóm trạng thái
                        if (dto.TrangThai == TrangThai_UngVien.DaXetDuyet
                            || dto.TrangThai == TrangThai_UngVien.DatPhongVan
                            || dto.TrangThai == TrangThai_UngVien.DaTuChoi)
                        {
                            countHR++;
                        }
                        else if (dto.TrangThai == TrangThai_UngVien.DangChoPhongVan
                            || dto.TrangThai == TrangThai_UngVien.DaNhanViec)
                        {
                            countCreator++;
                        }
                    }
                    catch (Exception ex)
                    {
                        errorList.Add(new { Id = id, Error = ex.Message + (ex.InnerException != null ? " - " + ex.InnerException.Message : "") });
                        continue;
                    }
                }
                // Gửi thông báo sau khi cập nhật xong
                if (countHR > 0 && IdViTri != null && !string.IsNullOrEmpty(tenViTri))
                {
                    var message = $"Có {dto.Ids.Count} ứng viên cho vị trí '{tenViTri}' vừa được cập nhật trạng thái: {GetTrangThaiTiengViet(dto.TrangThai)}";
                    await SendNotificationsAsync(userRoleIds, $"Có {dto.Ids.Count} ứng viên {GetTrangThaiTiengViet(dto.TrangThai)}", message, message, IdViTri, $"/TD_TuyenDung/{IdViTri}");
                }
                if (countCreator > 0 && creatorId != null && !string.IsNullOrEmpty(tenViTri))
                {
                    var message = $"Bạn có {dto.Ids.Count} ứng viên được cập nhật trạng thái: {GetTrangThaiTiengViet(dto.TrangThai)} cho yêu cầu tuyển dụng '{tenViTri}'";
                    await SendNotificationsAsync(new List<Guid> { creatorId.Value }, $"Có {dto.Ids.Count} ứng viên {GetTrangThaiTiengViet(dto.TrangThai)}", message, message, IdViTri, $"/TD_TuyenDung/{IdViTri}");
                }

                if (errorList.Count == 0)
                {
                    switch (dto.TrangThai)
                    {
                        case TrangThai_UngVien.DangChoPhongVan:
                            await _service.SendMailToUngViens(dto.Ids, null, "INVITEINTERVIEW");
                            var message1 = $"Đã gửi mail cho  {dto.Ids.Count} ứng viên ở vị trí '{tenViTri}' vừa được cập nhật trạng thái: {GetTrangThaiTiengViet(dto.TrangThai)}";
                            await SendNotificationsAsync([UserId.Value], $"Đã gửi mail cho {dto.Ids.Count} ứng viên {GetTrangThaiTiengViet(dto.TrangThai)}", message1, message1, IdViTri, $"/TD_TuyenDung/{IdViTri}");
                            break;
                        case TrangThai_UngVien.DaTuChoi:
                            await _service.SendMailToUngViens(dto.Ids, null, "FALSEINTERVIEW");
                            var message2 = $"Đã gửi mail cho  {dto.Ids.Count} ứng viên ở vị trí '{tenViTri}' vừa được cập nhật trạng thái: {GetTrangThaiTiengViet(dto.TrangThai)}";
                            await SendNotificationsAsync([UserId.Value], $"Đã gửi mail cho {dto.Ids.Count} ứng viên {GetTrangThaiTiengViet(dto.TrangThai)}", message2, message2, IdViTri, $"/TD_TuyenDung/{IdViTri}");
                            break;
                        case TrangThai_UngVien.DatPhongVan:
                            await _service.SendMailToUngViens(dto.Ids, null, "SUCCESSFULINTERVIEW");
                            var message3 = $"Đã gửi mail cho  {dto.Ids.Count} ứng viên ở vị trí '{tenViTri}' vừa được cập nhật trạng thái: {GetTrangThaiTiengViet(dto.TrangThai)}";
                            await SendNotificationsAsync([UserId.Value], $"Đã gửi mail cho {dto.Ids.Count} ứng viên {GetTrangThaiTiengViet(dto.TrangThai)}", message3, message3, IdViTri, $"/TD_TuyenDung/{IdViTri}");
                            break;
                        default:
                            break;
                    }
                    return DataResponse.Success("Cập nhật trạng thái ứng viên thành công");
                }
                return DataResponse.False("Có lỗi khi cập nhật trạng thái một số ứng viên", errorList.Select(e => e.GetType().GetProperty("Error")?.GetValue(e, null)?.ToString() ?? "").ToList());
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Lỗi khi cập nhật trạng thái ứng viên");
                return DataResponse.False("Cập nhật trạng thái ứng viên thất bại. Vui lòng thử lại sau. " + e.Message + (e.InnerException != null ? " - " + e.InnerException.Message : ""));
            }
        }

        [HttpPost("UpdateInterviewTime")]
        [Authorize]
        public async Task<DataResponse> UpdateInterviewTime([FromBody] TD_UngVienUpdateInterviewTimeVM model)
        {
            var roleHR = await _roleService.GetQueryable().Where(x => x.Code == "HR").FirstOrDefaultAsync();
            var userRoles = await _userRoleService.GetQueryable().Where(x => x.UserId == UserId && x.RoleId == roleHR.Id).ToListAsync();
            if (userRoles == null || !userRoles.Any())
                return DataResponse.False("Chỉ có HR mới cập nhật được thời gian phỏng vấn");

            if (model.Id == Guid.Empty)
                return DataResponse.False("Thiếu Id ứng viên");

            var entity = await _service.GetByIdAsync(model.Id);
            if (entity == null)
                return DataResponse.False("Không tìm thấy ứng viên");

            entity.ThoiGianPhongVan = model.ThoiGianPhongVan;
            await _service.UpdateAsync(entity);

            return DataResponse.Success(entity, "Cập nhật thời gian phỏng vấn thành công");
        }
        [HttpGet("GetInterviewList")]
        [Authorize]
        public async Task<DataResponse<List<TD_UngVienDto>>> GetInterviewList(Guid? vitriTuyenDungId, DateTime? interviewFrom = null, DateTime? interviewTo = null)
        {
            var viTriIds = await _viTriUngTuyenService.GetQueryable()
                .Where(x => x.CreatedId == UserId)
                .Select(x => x.Id)
                .ToListAsync();
            if (vitriTuyenDungId != null && vitriTuyenDungId != Guid.Empty)
                viTriIds = viTriIds.Where(x => x == vitriTuyenDungId).ToList();

            var query = _service.GetQueryable()
                .Where(x => viTriIds.Contains(x.TuyenDungId) && x.TrangThai == TrangThai_UngVien.DangChoPhongVan);

            if (interviewFrom.HasValue)
                query = query.Where(x => x.ThoiGianPhongVan.HasValue && x.ThoiGianPhongVan.Value >= interviewFrom.Value);
            if (interviewTo.HasValue)
                query = query.Where(x => x.ThoiGianPhongVan.HasValue && x.ThoiGianPhongVan.Value <= interviewTo.Value);

            var ungViens = await query
                .OrderBy(x => x.ThoiGianPhongVan)
                .ToListAsync();

            var result = new List<TD_UngVienDto>();
            foreach (var q in ungViens)
            {
                var tuyenDung = await _viTriUngTuyenService.GetByIdAsync(q.TuyenDungId);
                result.Add(new TD_UngVienDto()
                {
                    Id = q.Id,
                    HoTen = q.HoTen,
                    NgaySinh = q.NgaySinh,
                    GioiTinh = q.GioiTinh,
                    Email = q.Email,
                    SoDienThoai = q.SoDienThoai,
                    DiaChi = q.DiaChi,
                    TrinhDoHocVan = q.TrinhDoHocVan,
                    KinhNghiem = q.KinhNghiem,
                    CVFile = q.CVFile,
                    NgayUngTuyen = q.NgayUngTuyen,
                    ThoiGianPhongVan = q.ThoiGianPhongVan,
                    TrangThai = q.TrangThai,
                    GhiChuUngVien = q.GhiChuUngVien,
                    TuyenDungId = q.TuyenDungId,
                    TrangThaiText = q.TrangThai.ToString(),
                    ViTriTuyenDungText = tuyenDung?.TenViTri ?? "Không xác định",
                    GioiTinhText = q.GioiTinh.ToString()
                });
            }

            return DataResponse<List<TD_UngVienDto>>.Success(result, "Lấy danh sách ứng viên chờ phỏng vấn thành công");
        }

        [HttpPost("SendMailToUngViens")]
        [Authorize]
        public async Task<DataResponse> SendMailToUngViens([FromBody] SendMailUngVienVM model)
        {
            await _service.SendMailToUngViens(model.UngVienIds, model.EmailTemplateId,null);
            var uv = await _service.GetByIdAsync(model.UngVienIds.FirstOrDefault());
            if (uv != null)
            {
                var viTriTuyenDung = await _viTriUngTuyenService.GetByIdAsync(uv.TuyenDungId);
                if (viTriTuyenDung != null)
                {
                    var notification = new Notification
                    {
                        TieuDe = $"Đã gửi mail cho '{model.UngVienIds.Count}' ứng viên",
                        IsRead = false,
                        Type = "TUYENDUNG",
                        ItemName = "TUYENDUNG",
                        Message = $"Đã gửi mail cho '{model.UngVienIds.Count}' ứng viên",
                        NoiDung = $"Đã gửi mail cho '{model.UngVienIds.Count}' ứng viên",
                        FromUser = UserId,
                        ToUser = UserId,
                        Link = $"/TD_TuyenDung/{viTriTuyenDung.Id}",
                    };
                    await _notificationService.CreateAsync(notification);
                    await _telegramNotificationService.SendToUsers(new List<Guid> { UserId.Value }, $"Đã gửi mail cho '{model.UngVienIds.Count}' ứng viên cho vị trí '{viTriTuyenDung.TenViTri}'");
                }
            }

            return DataResponse.Success("Đã gửi email cho các ứng viên");
        }

        [HttpGet("GetOverview")]
        [Authorize]
        public async Task<DataResponse<TD_UngVienTongQuanVM>> GetOverview()
        {
            var ungViens = await _service.GetQueryable().ToListAsync();
            var totalCandidates = ungViens.Count;
            var daNhanViec = ungViens.Count(x => x.TrangThai == TrangThai_UngVien.DaNhanViec);
            var dangChoPhongVan = ungViens.Count(x => x.TrangThai == TrangThai_UngVien.DangChoPhongVan);
            var daXetDuyet = ungViens.Count(x => x.TrangThai == TrangThai_UngVien.DaXetDuyet);
            var daTuChoi = ungViens.Count(x => x.TrangThai == TrangThai_UngVien.DaTuChoi);
            var chuaXetDuyet = ungViens.Count(x => x.TrangThai == TrangThai_UngVien.ChuaXetDuyet);
            var datPhongVan = ungViens.Count(x => x.TrangThai == TrangThai_UngVien.DatPhongVan);

            // Phỏng vấn tuần này
            var now = DateTime.Now;
            var startOfWeek = now.Date.AddDays(-(int)now.DayOfWeek + (int)DayOfWeek.Monday);
            var endOfWeek = startOfWeek.AddDays(7);
            var interviewThisWeek = ungViens.Count(x => x.ThoiGianPhongVan.HasValue && x.ThoiGianPhongVan.Value >= startOfWeek && x.ThoiGianPhongVan.Value < endOfWeek);

            // Phỏng vấn tháng này
            var startOfMonth = new DateTime(now.Year, now.Month, 1);
            var endOfMonth = startOfMonth.AddMonths(1);
            var interviewThisMonth = ungViens.Count(x => x.ThoiGianPhongVan.HasValue && x.ThoiGianPhongVan.Value >= startOfMonth && x.ThoiGianPhongVan.Value < endOfMonth);

            // Trung bình ứng viên phỏng vấn 1 ngày (trong tháng này)
            var daysInMonth = (endOfMonth - startOfMonth).Days;
            var avgInterviewPerDay = daysInMonth > 0 ? Math.Round((double)interviewThisMonth / daysInMonth, 2) : 0;

            // Tỷ lệ chuyển đổi
            var conversionRate = totalCandidates > 0 ? Math.Round((double)daNhanViec / totalCandidates * 100, 2) : 0;
            // Tỷ lệ phỏng vấn
            var interviewRate = totalCandidates > 0 ? Math.Round((double)dangChoPhongVan / totalCandidates * 100, 2) : 0;

            // Số ứng viên phỏng vấn hôm nay
            var today = now.Date;
            var interviewToday = ungViens.Count(x => x.ThoiGianPhongVan.HasValue && x.ThoiGianPhongVan.Value.Date == today && x.TrangThai == TrangThai_UngVien.DangChoPhongVan);

            var stats = new TD_UngVienTongQuanVM
            {
                totalCandidates = totalCandidates,
                daNhanViec = daNhanViec,
                dangChoPhongVan = dangChoPhongVan,
                daXetDuyet = daXetDuyet,
                daTuChoi = daTuChoi,
                chuaXetDuyet = chuaXetDuyet,
                datPhongVan = datPhongVan,
                interviewThisWeek = interviewThisWeek,
                interviewThisMonth = interviewThisMonth,
                avgInterviewPerDay = avgInterviewPerDay,
                conversionRate = conversionRate,
                interviewRate = interviewRate,
                interviewToday = interviewToday
            };
            return DataResponse<TD_UngVienTongQuanVM>.Success(stats, "Thống kê tổng quan ứng viên");
        }
    }
}

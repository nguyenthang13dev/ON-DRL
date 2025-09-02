using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Model.Entities;
using Hinet.Model.Entities.TuyenDung;
using Hinet.Service.Common;
using Hinet.Service.CvAnalyzerService;
using Hinet.Service.CvAnalyzerService.Dto;
using Hinet.Service.GeminiService;
using Hinet.Service.NotificationService;
using Hinet.Service.TD_UngVienService;
using Hinet.Service.TD_ViTriTuyenDungService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class UploadCVController : HinetController
    {
        private readonly ICvAnalyzerService _cvAnalyzerService;
        private readonly ITD_UngVienService _tdUngVienService;
        private readonly ITD_TuyenDungService _tD_TuyenDungService;
        private readonly INotificationService _notificationService;

        public UploadCVController(ITD_TuyenDungService tD_TuyenDungService, ICvAnalyzerService cvAnalyzerService, INotificationService notificationService, ITD_UngVienService tD_UngVienService)
        {
            _cvAnalyzerService = cvAnalyzerService;
            _tdUngVienService = tD_UngVienService;
            _tD_TuyenDungService = tD_TuyenDungService;
            _notificationService = notificationService;
        }

        [HttpPost("analyze")]
        public async Task<DataResponse<List<TD_UngVien>>> Analyze([FromForm] UploadCVDto upload)
        {
            var response = new DataResponse<List<TD_UngVien>>();
            var results = new List<TD_UngVien>();
            var fileError = new StringBuilder();
            var fileWarning = new StringBuilder();
            var allowedExtensions = new[] { ".pdf", ".docx" };
            const long maxFileSize = 10 * 1024 * 1024; // 10MB

            if (upload.TuyenDungId == Guid.Empty)
            {
                return new DataResponse<List<TD_UngVien>>
                {
                    Data = null,
                    Message = "Không có mã tuyển dụng",
                    Status = false
                };
            }

            if (upload.Files == null || upload.Files.Count == 0)
            {
                return new DataResponse<List<TD_UngVien>>
                {
                    Data = null,
                    Message = "Không có file nào được gửi lên.",
                    Status = false
                };
            }

            int countFile = upload.Files.Count;

            foreach (var file in upload.Files)
            {
                if (file == null || file.Length == 0)
                {
                    fileError.AppendLine($"+ {file?.FileName ?? "File rỗng"}: File trống.");
                    continue;
                }

                var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(extension))
                {
                    fileError.AppendLine($"+ {file.FileName}: Định dạng không hợp lệ.");
                    continue;
                }


                if (file.Length > maxFileSize)
                {
                    fileError.AppendLine($"+ {file.FileName}: File có kích thước quá lớn ( > 10MB).");
                    continue;
                }

                var result = await _cvAnalyzerService.AnalyzeCvAsync(file);
                if (result == null)
                {
                    fileError.AppendLine($"+ {file.FileName}: Phân tích thất bại.");
                    continue;
                }


                if (!DateTime.TryParse(result.DateOfBirth, out var parsedDate))
                {
                }

                if (string.IsNullOrEmpty(result.FullName))
                {
                    fileError.AppendLine($"+ {file.FileName}: Không thể phân tích được tên ứng viên.");
                    continue;
                }

                if (string.IsNullOrEmpty(result.Email) && string.IsNullOrEmpty(result.PhoneNumber))
                {
                    fileError.AppendLine($"+ {file.FileName}: Không thể phân tích được đồng thời email và số điện thoại.");
                    continue;
                }

                var filePath = UploadFileHelper.UploadFile(file, "TD_UngVien");
                var ungVien = new TD_UngVien
                {
                    Id = Guid.NewGuid(),
                    HoTen = result.FullName,
                    NgaySinh = parsedDate,
                    Email = result.Email,
                    SoDienThoai = result.PhoneNumber,
                    DiaChi = result.Hometown,
                    CVFile = filePath,
                    NgayUngTuyen = DateTime.Now,
                    TuyenDungId = upload.TuyenDungId,
                    TrangThai = TrangThai_UngVien.ChuaXetDuyet,
                    GhiChuUngVien = ""

                };

                //Kiểm tra trùng lặp ở cùng vị trí
                bool isDuplicate1 = false;
                bool isDuplicate2 = false;
                if (!string.IsNullOrEmpty(ungVien.Email))
                {
                     isDuplicate1 = await _tdUngVienService.GetQueryable()
                   .AnyAsync(u => (u.TuyenDungId == upload.TuyenDungId) && (u.Email == ungVien.Email));
                }
                if (!string.IsNullOrEmpty(ungVien.SoDienThoai))
                {
                     isDuplicate2 = await _tdUngVienService.GetQueryable()
                   .AnyAsync(u => (u.TuyenDungId == upload.TuyenDungId) && (u.SoDienThoai == ungVien.SoDienThoai));
                }
                if (isDuplicate1 || isDuplicate2)
                {
                    fileError.AppendLine($"+ {file.FileName}: Ứng viên đã tồn tại và đã ứng tuyển tại vị trí này.");
                    continue;
                }

                //KHi ứng viên đã có data trong CSDL
                var existUngVien = await _tdUngVienService.GetQueryable()
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == ungVien.Email && u.SoDienThoai == ungVien.SoDienThoai);

                if (existUngVien != null)
                {
                    if(existUngVien.TrangThai == TrangThai_UngVien.DaTuChoi)
                    {
                        await _tdUngVienService.CreateAsync(ungVien);
                        results.Add(ungVien);
                    }
                    else
                    {
                        fileError.AppendLine($"+ {file.FileName}: Ứng viên đã tồn tại và đang ứng tuyển tại vị trí khác.");
                        continue;

                    }
                    //fileWarning.AppendLine($"+ {file.FileName}: Ứng viên đã tồn tại và đã ứng tuyển tại vị trí khác.");
                    //existUngVien.TuyenDungId = upload.TuyenDungId;
                    //existUngVien.GhiChuUngVien = $"Ứng viên đã từng ứng tuyển và {existUngVien.TrangThai}";
                    //existUngVien.TrangThai = TrangThai_UngVien.ChuaXetDuyet;
                    //existUngVien.CVFile = filePath;

                    //await _tdUngVienService.UpdateAsyncFixTracked(existUngVien); // OK vì đã AsNoTracking
                    //results.Add(existUngVien);
                    //continue;
                }
                else
                {
                    await _tdUngVienService.CreateAsync(ungVien);
                    results.Add(ungVien);
                }


            }
            var viTriTuyenDung = await _tD_TuyenDungService.GetByIdAsync(upload.TuyenDungId);
            var notification = new Notification
                    {
                        TieuDe = $"Có '{results.Count}' ứng viên mới Chưa xét duyệt'",
                        IsRead = false,
                        Type = "TUYENDUNG",
                        ItemName = "TUYENDUNG",
                        Message = $"Có '{results.Count}' ứng viên mới Chưa xét duyệt",
                        NoiDung = $"Bạn có '{results.Count}' ứng viên mới cho yêu cầu tuyển dụng '{viTriTuyenDung.TenViTri}'",
                        ItemId = viTriTuyenDung.Id,
                        FromUser = UserId,
                        ToUser = viTriTuyenDung.CreatedId,
                        Link = $"/TD_TuyenDung/{viTriTuyenDung.Id}",
                    };
                    await _notificationService.CreateAsync(notification);
            response.Data = results;
            response.Status = true;
            response.Message = $"Phân tích thành công {results.Count}/{countFile} file." +
                               (fileError.Length > 0 ? $"\nChi tiết lỗi:\n{fileError} " : "");

            return response;

        }

    }
}

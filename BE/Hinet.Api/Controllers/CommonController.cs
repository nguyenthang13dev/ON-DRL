using Aspose.Cells;
using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Extensions;
using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Constant;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.HuyenService;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Service.TaiLieuDinhKemService.Dto;
using Hinet.Service.TinhService;
using Hinet.Service.XaService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonController : HinetController
    {
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<CommonController> _logger;
        private readonly ITinhService _tinhService;
        private readonly IHuyenService _huyenService;
        private readonly IXaService _xaService;

        public CommonController(
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<CommonController> logger
,
            ITinhService tinhService,
            IHuyenService huyenService,
            IXaService xaService)
        {
            _logger = logger;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _tinhService = tinhService;
            _huyenService = huyenService;
            _xaService = xaService;
        }

        //CreatedBy:TruongTD
        [HttpPost("upload")]
        public async Task<DataResponse<List<TaiLieuDinhKem>>> UploadFile(UploadFileDto form)
        {
            var result = new List<TaiLieuDinhKem>();
            if (form.Files == null || form.Files.Count == 0)
            {
                throw new Exception("Không có file nào được chọn");
            }
            foreach (var file in form.Files)
            {
                // Kiểm tra file rỗng
                if (file == null || file.Length == 0)
                {
                    return DataResponse<List<TaiLieuDinhKem>>.False("Uploaded file is empty ", ModelStateError);
                }

                // Kiểm tra loại file
                var fileExtension = Path.GetExtension(file.FileName).ToLower();
                if (!AppSettings.FileSetting.AllowExtensions.Contains(fileExtension))
                {
                    return DataResponse<List<TaiLieuDinhKem>>
                        .False($"Uploaded file extension must be {string.Join(",", AppSettings.FileSetting.AllowExtensions)}", ModelStateError);
                }
                //kiểm tra dung lượng file
                if (file.Length > AppSettings.FileSetting.MaxSize)
                {
                    return DataResponse<List<TaiLieuDinhKem>>
                         .False($"Uploaded file sized must less than or equal to  {AppSettings.FileSetting.MaxSize}", ModelStateError);
                }

                var filePath = UploadFileHelper.UploadFile(file, form.FileType);
                Guid? itemId = null;

                if (form.FileType.Trim().ToLower().Equals(LoaiTaiLieuConstant.TaiLieuDonVi.ToLower())) itemId = DonViId;
                if (string.IsNullOrEmpty(filePath)) throw new Exception("Failed to upload file");
                var newTaiLieu = new TaiLieuDinhKem()
                {
                    TenTaiLieu = file.FileName,
                    DinhDangFile = fileExtension,
                    DuongDanFile = filePath,
                    LoaiTaiLieu = form.FileType ?? "",
                    NgayPhatHanh = DateTime.Now,
                    KichThuoc = file.Length / 1024,
                    DonViPhatHanh = " ",
                    NgayKy = " ",
                    NguoiKy = " ",
                    KeyTieuChiKeKhai = " ",
                    DuongDanFilePDF = " ",
                    MoTa = form.MoTa ?? "",
                    Guid = " ",
                    Item_ID = itemId,
                    IdBieuMau = form.IdBieuMau ?? null,
                };
                await _taiLieuDinhKemService.CreateAsync(newTaiLieu);
                result.Add(newTaiLieu);
            }
            return DataResponse<List<TaiLieuDinhKem>>.Success(result);
        }

        [HttpPost("uploadDonVi")]
        public async Task<DataResponse<List<TaiLieuDinhKem>>> uploadDonVi(UploadFileDto form)
        {
            var result = new List<TaiLieuDinhKem>();
            if (form.Files == null || form.Files.Count == 0)
            {
                throw new Exception("Không có file nào được chọn");
            }
            foreach (var file in form.Files)
            {
                // Kiểm tra file rỗng
                if (file == null || file.Length == 0)
                {
                    return DataResponse<List<TaiLieuDinhKem>>.False("Uploaded file is empty ", ModelStateError);
                }

                // Kiểm tra loại file
                var fileExtension = Path.GetExtension(file.FileName).ToLower();
                if (!AppSettings.FileSetting.AllowExtensions.Contains(fileExtension))
                {
                    return DataResponse<List<TaiLieuDinhKem>>
                        .False($"Uploaded file extension must be {string.Join(",", AppSettings.FileSetting.AllowExtensions)}", ModelStateError);
                }
                //kiểm tra dung lượng file
                if (file.Length > AppSettings.FileSetting.MaxSize)
                {
                    return DataResponse<List<TaiLieuDinhKem>>
                         .False($"Uploaded file sized must less than or equal to  {AppSettings.FileSetting.AllowExtensions}", ModelStateError);
                }

                var filePath = UploadFileHelper.UploadFile(file, form.FileType);
                Guid? itemId = form.ItemId;

                if (form.FileType.Trim().ToLower().Equals(LoaiTaiLieuConstant.TaiLieuDonVi.ToLower())) itemId = DonViId;
                if (string.IsNullOrEmpty(filePath)) throw new Exception("Failed to upload file");
                var newTaiLieu = new TaiLieuDinhKem()
                {
                    TenTaiLieu = file.FileName,
                    DinhDangFile = fileExtension,
                    DuongDanFile = filePath,
                    LoaiTaiLieu = form.FileType ?? "",
                    NgayPhatHanh = DateTime.Now,
                    KichThuoc = file.Length / 1024,
                    DonViPhatHanh = "",
                    NgayKy = "",
                    NguoiKy = "",
                    KeyTieuChiKeKhai = "",
                    DuongDanFilePDF = "",
                    Item_ID = itemId
                };
                await _taiLieuDinhKemService.CreateAsync(newTaiLieu);
                result.Add(newTaiLieu);
            }
            return DataResponse<List<TaiLieuDinhKem>>.Success(result);
        }

        //Xoá file temp dựa theo path
        [HttpPost("deleteTempFile")]
        public IActionResult DeleteTempFile(DeleteFileRequest request)
        {
            try
            {
                UploadFileHelper.RemoveFile(request.UploadedUrl);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(DataResponse<List<Guid>>.False($"An error occurs when removing file", ModelStateError));
            }
        }

        [HttpPost("removeFile")]
        public async Task<IActionResult> RemoveFiles(List<Guid> form)
        {
            try
            {
                foreach (var id in form)
                {
                    var existingFile = await _taiLieuDinhKemService.GetByIdAsync(id);
                    if (existingFile == null) return BadRequest(DataResponse<List<Guid>>.False($"No attachment match to {id}", ModelStateError));
                    UploadFileHelper.RemoveFile(existingFile.DuongDanFile);
                    await _taiLieuDinhKemService.DeleteAsync(existingFile);
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(DataResponse<List<Guid>>.False($"An error occurs when removing file", ModelStateError));
            }
        }

        [HttpGet("download/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Download([FromRoute] Guid id)
        {
            try
            {
                var entity = await _taiLieuDinhKemService.GetByIdAsync(id);
                var downloadData = UploadFileHelper.GetDownloadData(entity.DuongDanFile);
                var contentType = "application/octet-stream";
                return File(downloadData.FileBytes, contentType, downloadData.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, DataResponse.False(ex.Message));
            }
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<DataResponse<string>> ChuyenDoi()
        {
            try
            {
                var workbook = new Workbook("input.html");
                workbook.Save("Output.svg");
                return new DataResponse<string>() { Data = "1" };
            }
            catch (Exception ex)
            {
                return DataResponse<string>.False("Error", new string[] { ex.Message });
            }
        }

        //Cập nhật dữ liệu tỉnh, huyện, xã
        [HttpGet("InitTinhHuyenXa")]
        [AllowAnonymous]
        public async Task<string> InitTinhHuyenXa()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "CommonFiles", "TinhHuyenXa.xlsx");
            if (!System.IO.File.Exists(path))
                DataResponse.False("File not found: " + path);

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var package = new ExcelPackage(path))
            {
                var sheet = package.Workbook.Worksheets.First();
                var end = sheet.Dimension.End.Row;
                var provinces = new List<Tinh>();
                var districts = new List<Huyen>();
                var wards = new List<Xa>();

                for (int i = 2; i < end; i++)
                {
                    var provinceCode = sheet.Cells[i, 2].Value?.ToString()?.Trim();
                    var districtCode = sheet.Cells[i, 4].Value?.ToString()?.Trim();
                    var wardCode = sheet.Cells[i, 6].Value?.ToString()?.Trim();

                    if (!provinces.Any(x => x.MaTinh == provinceCode))
                    {
                        provinces.Add(new Tinh()
                        {
                            MaTinh = provinceCode,
                            TenTinh = sheet.Cells[i, 1].Value?.ToString()?.Trim()
                        });
                    }
                    if (!districts.Any(x => x.MaHuyen == districtCode))
                    {
                        districts.Add(new Huyen()
                        {
                            MaTinh = provinceCode,
                            MaHuyen = districtCode,
                            TenHuyen = sheet.Cells[i, 3].Value?.ToString()?.Trim()
                        });
                    }
                    if (!wards.Any(x => x.MaXa == wardCode))
                    {
                        wards.Add(new Xa()
                        {
                            MaHuyen = districtCode,
                            MaXa = wardCode,
                            TenXa = sheet.Cells[i, 5].Value?.ToString()?.Trim()
                        });
                    }
                }
                await _huyenService.CreateAsync(districts);
                await _xaService.CreateAsync(wards);
                await _tinhService.CreateAsync(provinces);
            }

            return "ok";
        }
    }

    public class DeleteFileRequest
    {
        public string? UploadedUrl { get; set; }
    }
}
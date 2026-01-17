using System.Management.Automation.Runspaces;
using CommonHelper.Excel;
using CommonHelper.Extenions;
using CommonHelper.File;
using Hinet.Api.Dto;
using Hinet.Api.ViewModels.Import;
using Hinet.Model.Entities;
using Hinet.Model.MongoEntities;
using Hinet.Service.AspNetUsersService;
using Hinet.Service.Common;
using Hinet.Service.Constant;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.KySoCauHinhService;
using Hinet.Service.KySoCauHinhService.Dto;
using Hinet.Service.KySoCauHinhService.ViewModels;
using Hinet.Service.KySoInfoService;
using Hinet.Service.KySoInfoService.Dto;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Web.Common;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class KySoCauHinhController : HinetController
    {
        private readonly IKySoCauHinhService _kySoCauHinhService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<KySoCauHinhController> _logger;
        private readonly IKySoInfoService _kySoInfoService;
        private readonly IAspNetUsersService _aspNetUsersService;
        public KySoCauHinhController(
            IKySoCauHinhService kySoCauHinhService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<KySoCauHinhController> logger,
            IKySoInfoService kySoInfoService,
            IAspNetUsersService aspNetUsersService)
        {
            this._kySoCauHinhService = kySoCauHinhService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
            _kySoInfoService = kySoInfoService;
            _aspNetUsersService = aspNetUsersService;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<KySoCauHinh>> Create([FromBody] KySoCauHinhCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<KySoCauHinhCreateVM, KySoCauHinh>(model);
                await _kySoCauHinhService.CreateAsync(entity);
                return DataResponse<KySoCauHinh>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo KySoCauHinh");
                return DataResponse<KySoCauHinh>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }

        [HttpPut("Update")]
        public async Task<DataResponse<KySoCauHinh>> Update([FromBody] KySoCauHinhEditVM model)
        {
            try
            {
                var entity = await _kySoCauHinhService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<KySoCauHinh>.False("KySoCauHinh không tồn tại");

                entity = _mapper.Map(model, entity);
                await _kySoCauHinhService.UpdateAsync(entity);
                return DataResponse<KySoCauHinh>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật KySoCauHinh với Id: {Id}", model.Id);
                return new DataResponse<KySoCauHinh>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }


        [HttpPost("Save")]
        public async Task<DataResponse<KySoInfoDto>> Save([FromForm] KySoCauHinhSaveVM model)
        {
            try
            {
                var appUser = await _aspNetUsersService.GetByIdAsync(UserId.Value);

                var listCauHinh = _kySoCauHinhService
                    .FindBy(x => x.IdBieuMau == model.IdBieuMau && x.IdDTTienTrinhXuLy == model.IdDTTienTrinhXuLy && x.appUser.Id == UserId.Value)
                    .ToList();
                //Xóa hết dữ liệu cũ
                if (listCauHinh.Any())
                {
                    await _kySoCauHinhService.DeleteAsync(listCauHinh);
                }

                // Deserialize và lưu listCauHinh
                if (!string.IsNullOrEmpty(model.ListCauHinh))
                {
                    try
                    {
                        // With this corrected line:
                        var listCauHinhNew = JsonConvert.DeserializeObject<List<KySoCauHinh>>(model.ListCauHinh);
                        if (listCauHinhNew != null && listCauHinhNew.Any())
                        {
                            //var listCauHinhEntities = _mapper.Map<List<KySoCauHinhCreateVM>, List<KySoCauHinh>>(listCauHinhNew);

                            listCauHinhNew.ForEach(x =>
                            {
                                x.appUser = appUser;
                            });

                            await _kySoCauHinhService.CreateAsync(listCauHinhNew);
                        }
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Lỗi khi deserialize ListCauHinh");
                        return DataResponse<KySoInfoDto>.False("Dữ liệu ListCauHinh không hợp lệ");
                    }
                }
                if (model.File is { Length: > 0 })
                {
                    var uploadsFolder = Path.Combine("wwwroot", "uploads", "TAILIEU_KYSO", "FormTemplate", "Temp");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var filePath = Path.Combine(uploadsFolder, model.File.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.File.CopyToAsync(stream);
                    }
                    var kySoInfo = _kySoInfoService.FindBy(x => x.IdDoiTuong == model.IdBieuMau && x.UserId == UserId.Value).FirstOrDefault();
                    if (kySoInfo != null)
                    {
                        //UploadFileHelper.RemoveFile(kySoInfo.DuongDanFileTemp);
                        kySoInfo.DuongDanFileTemp = Path.Combine("TAILIEU_KYSO", "FormTemplate", "Temp", model.File.FileName);
                        await _kySoInfoService.UpdateAsync(kySoInfo);
                    }
                    else
                    {
                        kySoInfo = new KySoInfo()
                        {
                            UserId = UserId.GetValueOrDefault(),
                            IdDoiTuong = model.IdBieuMau,
                            ThongTin = model.IdDTTienTrinhXuLy.ToString(),
                            DuongDanFileTemp = Path.Combine("TAILIEU_KYSO", "FormTemplate", "Temp", model.File.FileName),
                            LoaiDoiTuong = nameof(FormTemplate),
                            TrangThai = TrangThaiKySoConstant.CHUAKYSO,
                        };
                        await _kySoInfoService.CreateAsync(kySoInfo);
                    }
                    //
                    var entity = _mapper.Map<KySoInfo, KySoInfoDto>(kySoInfo);
                    if (!string.IsNullOrEmpty(entity.DuongDanFile))
                    {
                        //entity.ListCertificateInfo = PdfHelper.GetSignaturePdf(entity.DuongDanFile);
                    }
                    return DataResponse<KySoInfoDto>.Success(entity);
                }
                ;
                return DataResponse<KySoInfoDto>.False("Không có tệp tin nào được tải lên.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lưu cấu hình", model.IdBieuMau, model.IdDTTienTrinhXuLy);
                return DataResponse<KySoInfoDto>.False("Đã xảy ra lỗi");
            }
        }
        [HttpPost("SaveLuuTru")]
        public async Task<DataResponse<KySoInfoDto>> SaveLuuTru([FromForm] KySoCauHinhSaveVM model)
        {
            try
            {
                var listCauHinh = _kySoCauHinhService
                    .FindBy(x => x.IdBieuMau == model.IdBieuMau && x.IdDTTienTrinhXuLy == model.IdDTTienTrinhXuLy)
                    .ToList();
                //Xóa hết dữ liệu cũ
                if (listCauHinh.Any())
                {
                    await _kySoCauHinhService.DeleteAsync(listCauHinh);
                }

                // Deserialize và lưu listCauHinh
                if (!string.IsNullOrEmpty(model.ListCauHinh))
                {
                    try
                    {
                        // With this corrected line:
                        var listCauHinhNew = JsonConvert.DeserializeObject<List<KySoCauHinh>>(model.ListCauHinh);
                        if (listCauHinhNew != null && listCauHinhNew.Any())
                        {
                            //var listCauHinhEntities = _mapper.Map<List<KySoCauHinhCreateVM>, List<KySoCauHinh>>(listCauHinhNew);
                            await _kySoCauHinhService.CreateAsync(listCauHinhNew);
                        }
                    }
                    catch (JsonException ex)
                    {
                        _logger.LogError(ex, "Lỗi khi deserialize ListCauHinh");
                        return DataResponse<KySoInfoDto>.False("Dữ liệu ListCauHinh không hợp lệ");
                    }
                }
                if (model.File is { Length: > 0 })
                {
                    var uploadsFolder = Path.Combine("wwwroot", "uploads", "TAILIEU_KYSO", "SoHoaVanBan", "Temp");
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    var filePath = Path.Combine(uploadsFolder, model.File.FileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await model.File.CopyToAsync(stream);
                    }
                    var kySoInfo = _kySoInfoService.FindBy(x => x.IdDoiTuong == model.IdBieuMau && x.ThongTin == model.IdDTTienTrinhXuLy.ToString()).FirstOrDefault();
                    if (kySoInfo != null)
                    {
                        //UploadFileHelper.RemoveFile(kySoInfo.DuongDanFileTemp);
                        kySoInfo.DuongDanFileTemp = Path.Combine("TAILIEU_KYSO", "SoHoaVanBan", "Temp", model.File.FileName);
                        await _kySoInfoService.UpdateAsync(kySoInfo);
                    }
                    else
                    {
                        kySoInfo = new KySoInfo()
                        {
                            UserId = UserId.GetValueOrDefault(),
                            IdDoiTuong = model.IdBieuMau,
                            ThongTin = model.IdDTTienTrinhXuLy.ToString(),
                            DuongDanFileTemp = Path.Combine("TAILIEU_KYSO", "SoHoaVanBan", "Temp", model.File.FileName),
                            LoaiDoiTuong = "SoHoaVanBan",
                            TrangThai = TrangThaiKySoConstant.CHUAKYSO,
                        };
                        await _kySoInfoService.CreateAsync(kySoInfo);
                    }
                    //
                    var entity = _mapper.Map<KySoInfo, KySoInfoDto>(kySoInfo);
                    if (!string.IsNullOrEmpty(entity.DuongDanFile))
                    {
                        //entity.ListCertificateInfo = PdfHelper.GetSignaturePdf(entity.DuongDanFile);
                    }
                    return DataResponse<KySoInfoDto>.Success(entity);
                }
                ;
                return DataResponse<KySoInfoDto>.False("Không có tệp tin nào được tải lên.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lưu cấu hình", model.IdBieuMau, model.IdDTTienTrinhXuLy);
                return DataResponse<KySoInfoDto>.False("Đã xảy ra lỗi");
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<KySoCauHinhDto>> Get(Guid id)
        {
            var dto = await _kySoCauHinhService.GetDto(id);
            return DataResponse<KySoCauHinhDto>.Success(dto);
        }

        [HttpGet("GetByThongTin")]
        public async Task<DataResponse<List<KySoCauHinh>>> GetByThongTin(Guid idBieuMau, Guid idDTTienTrinhXuLy)
        {
            var listCauHinh = _kySoCauHinhService.FindBy(x => x.IdBieuMau == idBieuMau && x.IdDTTienTrinhXuLy == idDTTienTrinhXuLy).ToList();
            return DataResponse<List<KySoCauHinh>>.Success(listCauHinh);
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<KySoCauHinhDto>>> GetData([FromBody] KySoCauHinhSearch search)
        {
            var data = await _kySoCauHinhService.GetData(search);
            return DataResponse<PagedList<KySoCauHinhDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _kySoCauHinhService.GetByIdAsync(id);
                await _kySoCauHinhService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa KySoCauHinh với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }

        [HttpGet("GetDropdowns")]
        public async Task<DataResponse<Dictionary<string, List<DropdownOption>>>> GetDropdowns([FromQuery] string[] types)
        {
            var result = new Dictionary<string, List<DropdownOption>>()
            {
            };

            return DataResponse<Dictionary<string, List<DropdownOption>>>.Success(result);
        }

        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new KySoCauHinhSearch();
                var data = await _kySoCauHinhService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<KySoCauHinhDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "KySoCauHinh");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<KySoCauHinh>(rootPath, "KySoCauHinh");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<KySoCauHinh>();
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

                var importHelper = new ImportExcelHelperNetCore<KySoCauHinh>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<KySoCauHinh>(data.Collection);

                #endregion Config để import dữ liệu

                var rsl = importHelper.Import();

                var listImportReponse = new List<KySoCauHinh>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _kySoCauHinhService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<KySoCauHinh>();

                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception)
            {
                return DataResponse.False("Import thất bại");
            }
        }

        [HttpPost("upload")]
        public async Task<DataResponse<string>> UploadFile([FromForm] IFormFile file)
        {
            // Kiểm tra null
            if (file == null || file.Length == 0)
                return DataResponse<string>.False("Không có file");

            // Ví dụ: lưu file vào thư mục wwwroot/uploads
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "FileAnhChuKy", "images");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Trả lại đường dẫn (hoặc URL nếu có StaticFile middleware)
            var relativePath = $"FileAnhChuKy/images/{uniqueFileName}";

            return DataResponse<string>.Success(relativePath);
        }

        [HttpGet("image")]
        public async Task<DataResponse<byte[]>> GetImage([FromQuery] string path)
        {
            if (string.IsNullOrWhiteSpace(path))
            {
                return DataResponse<byte[]>.False("Đường dẫn là bắt buộc");
            }

            var fullPath = FileHelper.GetAbsoluteFilePath(path);

            if (!System.IO.File.Exists(fullPath))
            {
                return DataResponse<byte[]>.False("Không tìm thấy tệp");
            }

            try
            {
                var fileBytes = System.IO.File.ReadAllBytes(fullPath);
                return DataResponse<byte[]>.Success(fileBytes, "Tải tệp thành công");
            }
            catch (Exception ex)
            {
                return DataResponse<byte[]>.False("Lỗi khi đọc tệp", new[] { ex.Message });
            }
        }
        
        
        [HttpGet("UpdateStatus")]
        public async Task<DataResponse<bool>> UpdateStatus([FromQuery] Guid Id)
        {
            try
            {
                var kySoInfor = _kySoInfoService.GetQueryable().Where(t => t.IdDoiTuong == Id && t.UserId == UserId.Value).FirstOrDefault();
                if (kySoInfor != null)
                {
                    kySoInfor.TrangThai = "DAKYSO";
                    await _kySoInfoService.UpdateAsync(kySoInfor);
                }

                // 
                var listKySoCauHinh = _kySoCauHinhService.GetQueryable().Where(t => t.IdBieuMau == Id && t.UpdatedId == UserId.Value).ToList();
                // Update =
                if (listKySoCauHinh.Any())
                {
                    listKySoCauHinh.ForEach(x =>
                    {
                        x.IdDTTienTrinhXuLy = kySoInfor.Id;
                    });

                    await _kySoCauHinhService.UpdateAsync(listKySoCauHinh);
                }
                return DataResponse<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return DataResponse<bool>.False(ex.Message);
            }
            
        
        }


        
        

        
    }

    public class File
    {
        public byte[]? Content { get; set; }
        public string? ContentType { get; set; }
    }
}
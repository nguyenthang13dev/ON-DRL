using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.DA_NoiDungCuocHopService;
using Hinet.Service.DA_NoiDungCuocHopService.Dto;
using Hinet.Service.DA_NoiDungCuocHopService.ViewModels;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Api.Filter;
using CommonHelper.Excel;
using Hinet.Web.Common;
using Hinet.Api.ViewModels.Import;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Api.Dto;
using Hinet.Service.DA_KeHoachThucHienService.ViewModels;
using Hinet.Service.DA_KeHoachThucHienService.Dto;
using System.Reflection.Metadata;
using Hinet.Service.Constant;
using CommonHelper.String;
using OpenXmlPowerTools;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class DA_NoiDungCuocHopController : HinetController
    {
        private readonly IDA_NoiDungCuocHopService _dA_NoiDungCuocHopService;
        private readonly IMapper _mapper;
        private readonly ILogger<DA_NoiDungCuocHopController> _logger;
        ITaiLieuDinhKemService _taiLieuDinhKemService;
        public DA_NoiDungCuocHopController(
            IDA_NoiDungCuocHopService DA_NoiDungCuocHopService,
            IMapper mapper,
            ILogger<DA_NoiDungCuocHopController> logger,
             ITaiLieuDinhKemService taiLieuDinhKemService
            )
        {
            this._dA_NoiDungCuocHopService = DA_NoiDungCuocHopService;
            this._mapper = mapper;
            _logger = logger;
            _taiLieuDinhKemService = taiLieuDinhKemService;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<DA_NoiDungCuocHop>> Create([FromBody] DA_NoiDungCuocHopCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<DA_NoiDungCuocHopCreateVM, DA_NoiDungCuocHop>(model);
                entity.ThoiGianHop = model.ThoiGianHop.ToUniversalTime();
                await _dA_NoiDungCuocHopService.CreateAsync(entity);
                if (!string.IsNullOrWhiteSpace(model.TaiLieuDinhKem))
                {
                    var lstID = model.TaiLieuDinhKem.Split(',').Where(x => !string.IsNullOrEmpty(x)).Select(x => x.Trim().ToGuid()).ToList();
                    var file = _taiLieuDinhKemService.FindBy(x => lstID.Contains(x.Id)).ToList();
                    if (file != null && file.Any())
                    {
                        foreach (var item in file)
                        {
                            item.Item_ID = entity.Id;
                            await _taiLieuDinhKemService.UpdateAsync(item);
                        }
                    }
                }
                return DataResponse<DA_NoiDungCuocHop>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo DA_NoiDungCuocHop");
                return new DataResponse<DA_NoiDungCuocHop>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi tạo dữ liệu."
                };
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<DA_NoiDungCuocHop>> Update([FromBody] DA_NoiDungCuocHopEditVM model)
        {
            try
            {
                var entity = await _dA_NoiDungCuocHopService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<DA_NoiDungCuocHop>.False("DA_NoiDungCuocHop không tồn tại");

                entity = _mapper.Map(model, entity);
                await _dA_NoiDungCuocHopService.UpdateAsync(entity);
                if (!string.IsNullOrWhiteSpace(model.TaiLieuDinhKem))
                {
                    var lstID = model.TaiLieuDinhKem.Split(',').Where(x => !string.IsNullOrEmpty(x)).Select(x => x.Trim().ToGuid()).ToList();
                    var file = _taiLieuDinhKemService.FindBy(x => lstID.Contains(x.Id)).ToList();
                    if (file != null && file.Any())
                    {
                        foreach (var item in file)
                        {
                            item.Item_ID = entity.Id;
                            await _taiLieuDinhKemService.UpdateAsync(item);
                        }
                    }
                }
                return new DataResponse<DA_NoiDungCuocHop>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật DA_NoiDungCuocHop với Id: {Id}", model.Id);
                return new DataResponse<DA_NoiDungCuocHop>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<DA_NoiDungCuocHopDto?>> Get(Guid id)
        {
            var data = await _dA_NoiDungCuocHopService.GetDto(id);
            return DataResponse<DA_NoiDungCuocHopDto?>.Success(data);
        }

        [HttpPost("GetData", Name = "Xem danh sách DA_NoiDungCuocHop hệ thống")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<DA_NoiDungCuocHopDto>>> GetData([FromBody] DA_NoiDungCuocHopSearch search)
        {
            var data = await _dA_NoiDungCuocHopService.GetData(search);
            return DataResponse<PagedList<DA_NoiDungCuocHopDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _dA_NoiDungCuocHopService.GetByIdAsync(id);
                await _dA_NoiDungCuocHopService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa DA_NoiDungCuocHop với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }



        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new DA_NoiDungCuocHopSearch();
                var data = await _dA_NoiDungCuocHopService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<DA_NoiDungCuocHopDto>(data.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "DA_NoiDungCuocHop");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<DA_NoiDungCuocHop>(rootPath, "DA_NoiDungCuocHop");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<DA_NoiDungCuocHop>();
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

                var importHelper = new ImportExcelHelperNetCore<DA_NoiDungCuocHop>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<DA_NoiDungCuocHop>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<DA_NoiDungCuocHop>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _dA_NoiDungCuocHopService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<DA_NoiDungCuocHop>();


                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Import thất bại");
            }
        }
        //[HttpPost("upload-meeting-docs")] 
        /*public async Task<IActionResult> UploadMeetingDocuments(
    [FromForm] string meetingId,
    [FromForm] List<IFormFile> files) // Đổi từ IEnumerable sang List để dễ xử lý
        {
            try
            {
                // Validate input
                if (string.IsNullOrEmpty(meetingId))
                {
                    return BadRequest(new { success = false, message = "Meeting ID is required" });
                }

                if (files == null || files.Count == 0)
                {
                    return BadRequest(new { success = false, message = "No files uploaded" });
                }
                var tailieuOld = _taiLieuDinhKemService.FindBy(x => x.Item_ID == meetingId.ToGuid() && x.LoaiTaiLieu == LoaiTaiLieuConstant.NoiDungCuocHop).ToList();
                _taiLieuDinhKemService.DeleteRange(tailieuOld);
                var uploadResults = new List<FileUploadResult>();
                var taiLieuDinhKems = new List<TaiLieuDinhKem>();
                var uploadFolder = Path.Combine("Uploads", "NoiDungCuocHop", meetingId);

                // Tạo thư mục nếu chưa tồn tại
                Directory.CreateDirectory(uploadFolder);

                foreach (var file in files)
                {
                    // Validate file
                    if (file.Length == 0) continue;

                    if (file.Length > 10 * 1024 * 1024) // 10MB limit
                    {
                        return BadRequest(new
                        {
                            success = false,
                            message = $"File {file.FileName} exceeds size limit (10MB)"
                        });
                    }

                    // Tạo tên file an toàn
                    var fileName = DateTime.Now.ToString("ddMMyyyyHHss") + file.FileName;
                    var fileExtension = Path.GetExtension(file.FileName).ToLower();
                    var safeFileName = $"{fileExtension}";
                    var filePath = Path.Combine(uploadFolder, fileName);
                    // Lưu file vật lý
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    // Tạo kết quả trả về
                    uploadResults.Add(new FileUploadResult
                    {
                        OriginalName = file.FileName,
                        StoredName = fileName,
                        FilePath = $"/Uploads/NoiDungCuocHop/{meetingId}/{fileName}",
                        Size = file.Length,
                        ContentType = file.ContentType,
                        UploadDate = DateTime.Now
                    });
                    // Tạo kết quả trả về
                    taiLieuDinhKems.Add(new TaiLieuDinhKem
                    { 
                        TenTaiLieu = fileName,
                        DuongDanFile = $"/Uploads/NoiDungCuocHop/{meetingId}/{fileName}",
                        KichThuoc = file.Length,
                        MoTa = fileExtension,
                        NgayPhatHanh = DateTime.Now,
                        LoaiTaiLieu = LoaiTaiLieuConstant.NoiDungCuocHop,
                        DinhDangFile = fileExtension,
                        Item_ID = meetingId.ToGuid()
                    });

                }
                await _taiLieuDinhKemService.CreateAsync(taiLieuDinhKems);

                // Lưu thông tin vào database nếu cần
                // await _fileService.SaveFileInfoAsync(uploadResults);

                return Ok(new
                {
                    success = true,
                    message = "Files uploaded successfully",
                    files = uploadResults
                });
            }
            catch (Exception ex)
            {
                // Log lỗi
                _logger.LogError(ex, "Error uploading files");

                return StatusCode(500, new
                {
                    success = false,
                    message = "Internal server error",
                    error = ex.Message
                });
        }
        }*/

    }
}
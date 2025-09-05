using CommonHelper.Excel;
using CommonHelper.Extenions;
using CommonHelper.File;
using Hinet.Api.Dto;
using Hinet.Api.ViewModels.Import;
using Hinet.Model.Entities;
using Hinet.Service.AspNetUsersService;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.KySoCauHinhService;
using Hinet.Service.KySoInfoService;
using Hinet.Service.KySoInfoService.Dto;
using Hinet.Service.KySoInfoService.ViewModels;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Web.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class KySoInfoController : HinetController
    {
        private readonly IKySoInfoService _kySoInfoService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<KySoInfoController> _logger;
        private readonly IAspNetUsersService _aspNetUsersService;
        private readonly IKySoCauHinhService _kySoCauHinhService;

        public KySoInfoController(
            IKySoInfoService kySoInfoService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<KySoInfoController> logger,
            IAspNetUsersService aspNetUsersService,
            IKySoCauHinhService kySoCauHinhService)
        {
            this._kySoInfoService = kySoInfoService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
            _aspNetUsersService = aspNetUsersService;
            _kySoCauHinhService = kySoCauHinhService;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<KySoInfo>> Create([FromBody] KySoInfoCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<KySoInfoCreateVM, KySoInfo>(model);
                await _kySoInfoService.CreateAsync(entity);
                return DataResponse<KySoInfo>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo KySoInfo");
                return DataResponse<KySoInfo>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }

        [HttpPut("Update")]
        public async Task<DataResponse<KySoInfo>> Update([FromBody] KySoInfoEditVM model)
        {
            try
            {
                var entity = await _kySoInfoService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<KySoInfo>.False("KySoInfo không tồn tại");

                entity = _mapper.Map(model, entity);
                await _kySoInfoService.UpdateAsync(entity);
                return DataResponse<KySoInfo>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật KySoInfo với Id: {Id}", model.Id);
                return new DataResponse<KySoInfo>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<KySoInfoDto>> Get(Guid id)
        {
            var dto = await _kySoInfoService.GetDto(id);
            return DataResponse<KySoInfoDto>.Success(dto);
        }

        [HttpGet("GetByThongTin")]
        public async Task<DataResponse<KySoInfoDto>> GetByThongTin(Guid idDoiTuong, string loaiDoiTuong)
        {
            var dto = _kySoInfoService.FindBy(x => x.IdDoiTuong == idDoiTuong && x.LoaiDoiTuong == loaiDoiTuong).FirstOrDefault();
            if (dto == null)
            {
                return DataResponse<KySoInfoDto>.False("Chưa có file ký số");
            }
            var entity = _mapper.Map<KySoInfo, KySoInfoDto>(dto);
            if (!string.IsNullOrEmpty(entity.DuongDanFile))
            {
                //entity.ListCertificateInfo = PdfHelper.GetSignaturePdf(entity.DuongDanFile);
            }
            return DataResponse<KySoInfoDto>.Success(entity);
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<KySoInfoDto>>> GetData([FromBody] KySoInfoSearch search)
        {
            var data = await _kySoInfoService.GetData(search);
            return DataResponse<PagedList<KySoInfoDto>>.Success(data);
        }

        [AllowAnonymous]
        [HttpGet("GetDataAPI")]
        public async Task<DataResponse<PagedList<KySoInfoDto>>> GetDataAPI(Guid userId, int pageIndex, int pageSize = 10)
        {
            var searchModel = new KySoInfoSearch()
            {
                UserId = userId,
                PageIndex = pageIndex,
                PageSize = pageSize,
            };
            var data = await _kySoInfoService.GetData(searchModel);
            return DataResponse<PagedList<KySoInfoDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _kySoInfoService.GetByIdAsync(id);
                await _kySoInfoService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa KySoInfo với Id: {Id}", id);
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
                var search = new KySoInfoSearch();
                var data = await _kySoInfoService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<KySoInfoDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "KySoInfo");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<KySoInfo>(rootPath, "KySoInfo");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<KySoInfo>();
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

                var importHelper = new ImportExcelHelperNetCore<KySoInfo>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<KySoInfo>(data.Collection);

                #endregion Config để import dữ liệu

                var rsl = importHelper.Import();

                var listImportReponse = new List<KySoInfo>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _kySoInfoService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<KySoInfo>();

                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception)
            {
                return DataResponse.False("Import thất bại");
            }
        }

        [AllowAnonymous]
        [HttpPost("UploadFileDaKy")]
        public async Task<DataResponse<bool>> UploadFileDaKy([FromForm] KySoInfoVM kySoInfo, IFormFile file)
        {
            var user = _aspNetUsersService.FindBy(x => x.UserName == kySoInfo.UserName).FirstOrDefault();
            if (user == null)
            {
                return DataResponse<bool>.False("Không tìm thấy thông tin");
            }
            try
            {
                var kySoInfoEntity = new KySoInfo()
                {
                    IdDoiTuong = kySoInfo.IdDoiTuong,
                    UserId = user.Id,
                    LoaiDoiTuong = kySoInfo.LoaiDoiTuong,
                    DuongDanFile = "",
                    ThongTin = kySoInfo.ThongTin,
                    TrangThai = "DAKYSO"
                };
                var path = $"TAILIEU_KYSO\\{kySoInfo.LoaiDoiTuong}\\{DateTime.Now.Year}_{kySoInfo.IdDoiTuong}_{kySoInfo.ThongTin}.pdf";
                string convertedPath = path.Replace("\\", "/");
                //Xoá file ký số cũ nếu có
                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                }

                var fullPath = FileHelper.GetAbsoluteFilePath(path);
                var dir = Path.GetDirectoryName(fullPath);
                if (!Directory.Exists(dir))
                {
                    Directory.CreateDirectory(dir);
                }
                if (System.IO.File.Exists(fullPath))
                {
                    System.IO.File.Delete(fullPath);
                }

                // Ghi file upload vào thư mục đích
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var kySoInfoExists = _kySoInfoService
                    .FindBy(x => x.IdDoiTuong == kySoInfo.IdDoiTuong && x.LoaiDoiTuong == kySoInfo.LoaiDoiTuong && x.ThongTin == kySoInfo.ThongTin)
                    .FirstOrDefault();

                if (kySoInfoExists == null)
                {
                    kySoInfoEntity.DuongDanFile = convertedPath;
                    kySoInfoEntity.TrangThai = "DAKYSO";
                    await _kySoInfoService.CreateAsync(kySoInfoEntity);
                }
                else
                {
                    // Cập nhật giá trị mới
                    kySoInfoExists.DuongDanFile = convertedPath;
                    kySoInfoExists.ThongTin = kySoInfo.ThongTin;
                    kySoInfoExists.UserId = user.Id;
                    kySoInfoExists.TrangThai = "DAKYSO";
                    await _kySoInfoService.UpdateAsync(kySoInfoExists);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return DataResponse<bool>.Success(true);
        }
    }
}
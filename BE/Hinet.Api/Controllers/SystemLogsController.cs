using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.SystemLogsService;
using Hinet.Service.SystemLogsService.Dto;
using Hinet.Service.SystemLogsService.ViewModels;
using Hinet.Service.Common;
using Hinet.Api.Filter;
using CommonHelper.Excel;
using CommonHelper.Extenions;
using Hinet.Web.Common;
using Hinet.Api.ViewModels.Import;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Api.Dto;
using Hinet.Service.Dto;
using Hinet.Service.Constant;
using Hinet.Service.AppUserService;
using Hinet.Service.DM_DuLieuDanhMucService;
using Microsoft.AspNetCore.Hosting;
using Spire.Doc;
using Spire.Doc.Documents;
using TextAlignment = Spire.Doc.Documents.TextAlignment;
using Spire.Doc.Fields;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class SystemLogsController : HinetController
    {
        private readonly ISystemLogsService _systemLogsService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
		private readonly IAppUserService _appUserService;
		private readonly IDM_DuLieuDanhMucService _dM_DuLieuDanhMucService;
        private readonly IMapper _mapper;
        private readonly ILogger<SystemLogsController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public SystemLogsController(
            ISystemLogsService systemLogsService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
			IAppUserService appUserService,
			IDM_DuLieuDanhMucService dM_DuLieuDanhMucService,
            IMapper mapper,
            ILogger<SystemLogsController> logger,
            IWebHostEnvironment webHostEnvironment
            )
        {
            this._systemLogsService = systemLogsService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
			this._appUserService = appUserService;
			this._dM_DuLieuDanhMucService = dM_DuLieuDanhMucService;
            this._mapper = mapper;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<SystemLogs>> Create([FromBody] SystemLogsCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<SystemLogsCreateVM, SystemLogs>(model);
                await _systemLogsService.CreateAsync(entity);
                return DataResponse<SystemLogs>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo SystemLogs");
                return DataResponse<SystemLogs>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<SystemLogs>> Update([FromBody] SystemLogsEditVM model)
        {
            try
            {
                var entity = await _systemLogsService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<SystemLogs>.False("SystemLogs không tồn tại");

                entity = _mapper.Map(model, entity);
                await _systemLogsService.UpdateAsync(entity);
                return DataResponse<SystemLogs>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật SystemLogs với Id: {Id}", model.Id);
                return new DataResponse<SystemLogs>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<SystemLogsDto>> Get(Guid id)
        {
            var dto = await _systemLogsService.GetDto(id);
            return DataResponse<SystemLogsDto>.Success(dto);
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<SystemLogsDto>>> GetData([FromBody] SystemLogsSearch search)
        {
            var data = await _systemLogsService.GetData(search);
            return DataResponse<PagedList<SystemLogsDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _systemLogsService.GetByIdAsync(id);
                await _systemLogsService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa SystemLogs với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }

        [HttpGet("GetDropdowns")]
        public async Task<DataResponse<Dictionary<string, List<DropdownOption>>>> GetDropdowns([FromQuery] string[] types)
        {
            var dropdowns = await (
					_appUserService.GetDropdownOptions(x => x.Name, x => x.Id),
					_dM_DuLieuDanhMucService.GetDropdownByGroupCode(MaDanhMucConstant.MaQuanLy)
			);
			var result = new Dictionary<string, List<DropdownOption>>()
			{
				{ "AppUser", dropdowns.Item1 },
				{"MaQuanLy",dropdowns.Item2},
				{ "LogLevel", ConstantExtension.GetDropdownOptions<LogLevelConstant>() },
			};

            return DataResponse<Dictionary<string, List<DropdownOption>>>.Success(result);
        }

        [HttpPost("Export")]
        public async Task<DataResponse> ExportExcel(SystemLogsSearch search)
        {
            try
            {
                var data = await _systemLogsService.GetData(search);

                var dataExport = _mapper.MapList<SystemLogsDto, SystemLogExportDto>(data?.Items);
                var base64Excel = await ExportExcelHelperNetCore.Export<SystemLogExportDto>(dataExport);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "SystemLogs");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<SystemLogs>(rootPath, "SystemLogs");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<SystemLogs>();
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

                var importHelper = new ImportExcelHelperNetCore<SystemLogs>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<SystemLogs>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<SystemLogs>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _systemLogsService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<SystemLogs>();


                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception)
            {
                return DataResponse.False("Import thất bại");
            }
        }

        [HttpPost("ExportPdf")]
        public async Task<DataResponse> ExportPdf(SystemLogsSearch search)
        {
            try
            {
                var data = await _systemLogsService.GetData(search);
                var dataExport = _mapper.MapList<SystemLogsDto, SystemLogExportDto>(data?.Items);

                var danhMucTemplate = await _dM_DuLieuDanhMucService.GetListDataByGroupCode(MaDanhMucConstant.MAUNHATKYHETHONG);
                if (danhMucTemplate == null || danhMucTemplate.First().DuongDanFile == null)
                {
                    return DataResponse.False("Không có file mẫu");
                }
                var relativePath = danhMucTemplate.First().DuongDanFile.TrimStart('/');
                var filePath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads",relativePath);
                string folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "temps");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                string outputPath = Path.Combine(folderPath, $"SystemLog_{DateTime.Now:yyyyMMddHHmmss}.pdf");
                Document document = new Document();
                document.LoadFromFile(filePath);

                Table targetTable = null;

                // Duyệt qua các bảng trong tài liệu
                foreach (Section section in document.Sections)
                {
                    foreach (Table table in section.Tables)
                    {
                        if (table.Title == "tblSystemLog")
                        {
                            targetTable = table;
                            break;
                        }
                    }
                }

                if (targetTable == null)
                {
                    return DataResponse.False("Không tìm thấy bảng có Title = 'tblSystemLog'");
                }

                // Thêm dữ liệu
                int i = 1;
                foreach (var item in dataExport)
                {
                    TableRow row = targetTable.AddRow();
                    
                    SetCellText(row.Cells[0], i.ToString(), HorizontalAlignment.Center);
                    SetCellText(row.Cells[1], item.UserName, HorizontalAlignment.Left);
                    SetCellText(row.Cells[2], item.Timestamp.HasValue ? item.Timestamp.Value.ToString("dd/MM/yyyy") : "", HorizontalAlignment.Left);
                    SetCellText(row.Cells[3], item.IPAddress, HorizontalAlignment.Left);
                    SetCellText(row.Cells[4], item.Level, HorizontalAlignment.Left);
                    SetCellText(row.Cells[5], item.Message, HorizontalAlignment.Left);
                    i++;
                }

                // Lưu thành PDF
                document.SaveToFile(outputPath, FileFormat.PDF);
               

                // Trả file PDF về cho người dùng
                var fileBytes = System.IO.File.ReadAllBytes(outputPath);
                var fileName = Path.GetFileName(outputPath);
                string base64 = Convert.ToBase64String(fileBytes);
                return DataResponse.Success(base64);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Kết xuất thất bại");
            }
        }
        private void SetCellText(TableCell cell, string text, HorizontalAlignment alignment)
        {
            var para = cell.AddParagraph();
            para.AppendText(text);
            para.Format.HorizontalAlignment = alignment;
            para.Format.FirstLineIndent = 0f;
        }
    }
}
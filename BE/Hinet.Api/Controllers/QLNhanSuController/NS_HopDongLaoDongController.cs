using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
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
using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Constant.QLNhanSu;
using Microsoft.AspNetCore.Authorization;
using Hinet.Service.DM_DuLieuDanhMucService;
using Hinet.Api.Helper;
using Hinet.Service.QLNhanSu.NS_HopDongLaoDongService;
using Hinet.Service.QLNhanSu.NS_HopDongLaoDongService.Dto;
using Hinet.Service.QLNhanSu.NS_HopDongLaoDongService.ViewModels;


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class NS_HopDongLaoDongController : HinetController
    {
        private readonly INS_HopDongLaoDongService _nS_HopDongLaoDongService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<NS_HopDongLaoDongController> _logger;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IDM_DuLieuDanhMucService dM_DuLieuDanhMucService;
        public NS_HopDongLaoDongController(
            INS_HopDongLaoDongService nS_HopDongLaoDongService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<NS_HopDongLaoDongController> logger,
            IWebHostEnvironment webHostEnvironment,
            IDM_DuLieuDanhMucService dM_DuLieuDanhMucService
            )
        {
            this._nS_HopDongLaoDongService = nS_HopDongLaoDongService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
            this.dM_DuLieuDanhMucService = dM_DuLieuDanhMucService;
        }
        #region Private Method
        private string GenerateFileUrl(string fileName, string outputDir)
        {
            string searchTerm = @"wwwroot\";
            int startIndex = outputDir.IndexOf(searchTerm) + searchTerm.Length;
            outputDir = outputDir.Substring(startIndex);
            var relativePath = Path.Combine(outputDir, fileName)
                .Replace("\\", "/");
            return relativePath;
        }
        #endregion
        [HttpPost("Create")]
        public async Task<DataResponse<NS_HopDongLaoDong>> Create([FromBody] NS_HopDongLaoDongCreateVM model)
        {
            try
            {
                if (model.LoaiHopDong == LoaiHopDongLaoDongConstant.VoThoiHan || model.NgayHetHan == null)
                {
                    model.NgayHetHan = DateTime.MaxValue;
                }
                var entity = _mapper.Map<NS_HopDongLaoDongCreateVM, NS_HopDongLaoDong>(model);
                await _nS_HopDongLaoDongService.CreateAsync(entity);
                return DataResponse<NS_HopDongLaoDong>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo hợp đồng lao động");
                return DataResponse<NS_HopDongLaoDong>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<NS_HopDongLaoDong>> Update([FromBody] NS_HopDongLaoDongEditVM model)
        {
            try
            {
                var entity = await _nS_HopDongLaoDongService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<NS_HopDongLaoDong>.False("Hợp đồng lao động không tồn tại.");
                if (model.LoaiHopDong == LoaiHopDongLaoDongConstant.VoThoiHan)
                {
                    model.NgayHetHan = DateTime.MaxValue;
                }
                entity = _mapper.Map(model, entity);
                await _nS_HopDongLaoDongService.UpdateAsync(entity);
                return DataResponse<NS_HopDongLaoDong>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật hợp đồng lao động với Id: {Id}", model.Id);
                return new DataResponse<NS_HopDongLaoDong>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<NS_HopDongLaoDongDto>> Get(Guid id)
        {
            var dto = await _nS_HopDongLaoDongService.GetDto(id);
            return DataResponse<NS_HopDongLaoDongDto>.Success(dto);
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<NS_HopDongLaoDongDto>>> GetData([FromBody] NS_HopDongLaoDongSearch search)
        {
            var data = await _nS_HopDongLaoDongService.GetData(search);
            return DataResponse<PagedList<NS_HopDongLaoDongDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _nS_HopDongLaoDongService.GetByIdAsync(id);
                await _nS_HopDongLaoDongService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa hợp đồng lao động với Id: {Id}", id);
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


        [AllowAnonymous]
        [HttpPost("ExportHopDongLaoDongDocx")]
        public async Task<DataResponse<string>> ExportHopDongLaoDongDocx(ExportHopDongLaoDongRequest request)
        {
            var tempDocxPath = string.Empty;
            var outputDocxPath = string.Empty;
            var outputFileName = string.Empty;
            var outputDir = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", "NS_HopDongLaoDong", "docx");
            Directory.CreateDirectory(outputDir);

            try
            {
                var mauHopDong = dM_DuLieuDanhMucService.Where(x => x.Code.ToUpper() == request.MaBieuMau.ToUpper()).FirstOrDefault();
                var HopDongLaoDongObj = await _nS_HopDongLaoDongService.GetExportDto(request.HopDongLaoDongId);
                if (mauHopDong == null || HopDongLaoDongObj == null || string.IsNullOrEmpty(mauHopDong.DuongDanFile))
                {
                    return DataResponse<string>.False("Mẫu hợp đồng hoặc hợp đồng không tồn tại!");
                }
                var inputPath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", mauHopDong.DuongDanFile.TrimStart('/', '\\'));
                if (!System.IO.File.Exists(inputPath))
                {
                    return DataResponse<string>.False("File mẫu hợp đồng không tồn tại trong hệ thống."); 
                }
                var tempDir = Path.Combine(Path.GetTempPath(), "export_hop_dong_lao_dong_docx");
                Directory.CreateDirectory(tempDir);
                tempDocxPath = Path.Combine(tempDir, $"{Guid.NewGuid()}.docx");
                System.IO.File.Copy(inputPath, tempDocxPath, true);

                ExportWordCustom.ExportHopDongLaoDongAsync(tempDocxPath, HopDongLaoDongObj);
                outputFileName = $"HopDongLaoDong_{HopDongLaoDongObj.Id}.docx";
                outputDocxPath = Path.Combine(outputDir, outputFileName);
                System.IO.File.Copy(tempDocxPath, outputDocxPath, true);
                return DataResponse<string>.Success(GenerateFileUrl(outputFileName,outputDir));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi export docx");
                return DataResponse<string>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
            finally
            {
                if (System.IO.File.Exists(tempDocxPath))
                {
                    System.IO.File.Delete(tempDocxPath);
                }
            }

        }

        [HttpGet("Import")]
        public async Task<DataResponse> Import()
        {
            try
            {
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                ExcelImportExtention.CreateExcelWithDisplayNames<NS_HopDongLaoDong>(rootPath, "NS_HopDongLaoDong");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<NS_HopDongLaoDong>();
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

                var importHelper = new ImportExcelHelperNetCore<NS_HopDongLaoDong>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<NS_HopDongLaoDong>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<NS_HopDongLaoDong>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _nS_HopDongLaoDongService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<NS_HopDongLaoDong>();


                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception)
            {
                return DataResponse.False("Import thất bại");
            }
        }
    }
}
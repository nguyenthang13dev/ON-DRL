using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.ArcFileService;
using Hinet.Service.ArcFileService.Dto;
using Hinet.Service.ArcFileService.ViewModels;
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
using Hinet.Model.Entities.LuuTruBQP;
using Hinet.Service.DM_DuLieuDanhMucService;


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class ArcFileController : HinetController
    {
        private readonly IArcFileService _arcFileService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<ArcFileController> _logger;
        private readonly IDM_DuLieuDanhMucService _dm_DuLieuDanhMucService;

        public ArcFileController(
            IArcFileService arcFileService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<ArcFileController> logger
,
            IDM_DuLieuDanhMucService dm_DuLieuDanhMucService)
        {
            this._arcFileService = arcFileService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
            _dm_DuLieuDanhMucService = dm_DuLieuDanhMucService;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<ArcFile>> Create([FromBody] ArcFileCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<ArcFileCreateVM, ArcFile>(model);
                await _arcFileService.CreateAsync(entity);
                return DataResponse<ArcFile>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo ArcFile");
                return DataResponse<ArcFile>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }


        [HttpPut("Update")]
        public async Task<DataResponse<ArcFile>> Update([FromBody] ArcFileEditVM model)
        {
            try
            {
                var entity = await _arcFileService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<ArcFile>.False("ArcFile không tồn tại");

                entity = _mapper.Map(model, entity);
                await _arcFileService.UpdateAsync(entity);
                return DataResponse<ArcFile>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật ArcFile với Id: {Id}", model.Id);
                return new DataResponse<ArcFile>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<ArcFileDto>> Get(Guid id)
        {
            var dto = await _arcFileService.GetDto(id);
            return DataResponse<ArcFileDto>.Success(dto);
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<ArcFileDto>>> GetData([FromBody] ArcFileSearch search)
        {
            var data = await _arcFileService.GetData(search);
            return DataResponse<PagedList<ArcFileDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _arcFileService.GetByIdAsync(id);
                await _arcFileService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa ArcFile với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }

        [HttpGet("GetDropdowns")]
        public async Task<DataResponse<Dictionary<string, List<DropdownOption>>>> GetDropdowns([FromQuery] string[] types)
        {
            var dropdownMaintence = await _dm_DuLieuDanhMucService.GetDropdownCodeByGroupCode(MaDanhMucConstant.THBQ);
            var dropdownOrgan = new List<DropdownOption>();
            var dropdownLang = await _dm_DuLieuDanhMucService.GetDropdownCodeByGroupCode(MaDanhMucConstant.LANG);
            var dropdownFormat = await _dm_DuLieuDanhMucService.GetDropdownCodeByGroupCode(MaDanhMucConstant.TTVL);

            var result = new Dictionary<string, List<DropdownOption>>()
            {
                {"dropdownMaintence", dropdownMaintence },
                {"dropdownOrgan", dropdownOrgan },
                {"dropdownLang", dropdownLang },
                {"dropdownFormat", dropdownFormat },
            };

            return DataResponse<Dictionary<string, List<DropdownOption>>>.Success(result);
        }


        [HttpPost("ExportExcel")]
        public async Task<DataResponse> ExportExcel([FromBody] ArcFileSearch searchModel)
        {
            try
            {
                var data = await _arcFileService.GetData(searchModel);
                var base64Excel = await ExportExcelHelperNetCore.Export<ArcFileDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "ArcFile");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<ArcFile>(rootPath, "ArcFile");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<ArcFile>();
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

                var importHelper = new ImportExcelHelperNetCore<ArcFile>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<ArcFile>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<ArcFile>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _arcFileService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<ArcFile>();


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
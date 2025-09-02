using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.ArcFontService;
using Hinet.Service.ArcFontService.Dto;
using Hinet.Service.ArcFontService.ViewModels;
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
    public class ArcFontController : HinetController
    {
        private readonly IArcFontService _arcFontService;
        private readonly IDM_DuLieuDanhMucService _dM_DuLieuDanhMucService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<ArcFontController> _logger;

        public ArcFontController(
            IArcFontService arcFontService,
            IDM_DuLieuDanhMucService dMDuLieuDanhMucService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<ArcFontController> logger
            )
        {
            this._arcFontService = arcFontService;
            this._dM_DuLieuDanhMucService = dMDuLieuDanhMucService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<ArcFont>> Create([FromBody] ArcFontCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<ArcFontCreateVM, ArcFont>(model);
                await _arcFontService.CreateAsync(entity);
                return DataResponse<ArcFont>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo ArcFont");
                return DataResponse<ArcFont>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }


        [HttpPut("Update")]
        public async Task<DataResponse<ArcFont>> Update([FromBody] ArcFontEditVM model)
        {
            try
            {
                var entity = await _arcFontService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<ArcFont>.False("ArcFont không tồn tại");

                entity = _mapper.Map(model, entity);
                await _arcFontService.UpdateAsync(entity);
                return DataResponse<ArcFont>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật ArcFont với Id: {Id}", model.Id);
                return new DataResponse<ArcFont>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<ArcFontDto>> Get(Guid id)
        {
            var dto = await _arcFontService.GetDto(id);
            return DataResponse<ArcFontDto>.Success(dto);
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<ArcFontDto>>> GetData([FromBody] ArcFontSearch search)
        {
            var data = await _arcFontService.GetData(search);
            return DataResponse<PagedList<ArcFontDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _arcFontService.GetByIdAsync(id);
                await _arcFontService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa ArcFont với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }


        [HttpPost("CheckOrganId")]
        public async Task<IActionResult> CheckOrganId(string? value, Guid? id)
        {
            var isExist = await _arcFontService.CheckOrganID(value, id);
            return Ok(isExist);
        }


        [HttpGet("GetDropdowns")]
        public async Task<DataResponse<Dictionary<string, List<DropdownOption>>>> GetDropdowns([FromQuery] string[] types)
        {
            try
            {
                var dropdowns = await (
                    _dM_DuLieuDanhMucService.GetDropdownCodeByGroupCode(MaDanhMucConstant.LANG),
                    _dM_DuLieuDanhMucService.GetDropdownCodeByGroupCode(MaDanhMucConstant.CCTC),
                    _dM_DuLieuDanhMucService.GetDropdownCodeByGroupCode(MaDanhMucConstant.LTL),
                    _dM_DuLieuDanhMucService.GetDropdownCodeByGroupCode(MaDanhMucConstant.DVT));
                var result = new Dictionary<string, List<DropdownOption>>()
                {
                    { "Lang", dropdowns.Item1 }, // Removed incorrect 'Item1' reference
                    {"CCTC",dropdowns.Item2 }, // Removed incorrect 'Item1' reference
                    {"LTL",dropdowns.Item3 }, // Removed incorrect 'Item1' reference
                    {"DVT",dropdowns.Item4 }
                };

                return DataResponse<Dictionary<string, List<DropdownOption>>>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while fetching dropdowns");
                return DataResponse<Dictionary<string, List<DropdownOption>>>.False("Failed to fetch dropdown data.");
            }
        }


        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new ArcFontSearch();
                var data = await _arcFontService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<ArcFontDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "ArcFont");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<ArcFont>(rootPath, "ArcFont");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<ArcFont>();
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

                var importHelper = new ImportExcelHelperNetCore<ArcFont>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<ArcFont>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<ArcFont>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _arcFontService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<ArcFont>();


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
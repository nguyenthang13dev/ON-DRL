using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.ArcPlanService;
using Hinet.Service.ArcPlanService.Dto;
using Hinet.Service.ArcPlanService.ViewModels;
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
    public class ArcPlanController : HinetController
    {
        private readonly IArcPlanService _arcPlanService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly IDM_DuLieuDanhMucService _dM_DuLieuDanhMucService;
        private readonly ILogger<ArcPlanController> _logger;

        public ArcPlanController(
            IArcPlanService arcPlanService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            IDM_DuLieuDanhMucService dM_DuLieuDanhMucService,
            ILogger<ArcPlanController> logger
            )
        {
            this._arcPlanService = arcPlanService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            this._dM_DuLieuDanhMucService = dM_DuLieuDanhMucService;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<ArcPlan>> Create([FromBody] ArcPlanCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<ArcPlanCreateVM, ArcPlan>(model);
                await _arcPlanService.CreateAsync(entity);
                return DataResponse<ArcPlan>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo ArcPlan");
                return DataResponse<ArcPlan>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<ArcPlan>> Update([FromBody] ArcPlanEditVM model)
        {
            try
            {
                var entity = await _arcPlanService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<ArcPlan>.False("ArcPlan không tồn tại");

                entity = _mapper.Map(model, entity);
                await _arcPlanService.UpdateAsync(entity);
                return DataResponse<ArcPlan>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật ArcPlan với Id: {Id}", model.Id);
                return new DataResponse<ArcPlan>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<ArcPlanDto>> Get(Guid id)
        {
            var dto = await _arcPlanService.GetDto(id);
            return DataResponse<ArcPlanDto>.Success(dto);
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<ArcPlanDto>>> GetData([FromBody] ArcPlanSearch search)
        {
            var data = await _arcPlanService.GetData(search);
            return DataResponse<PagedList<ArcPlanDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _arcPlanService.GetByIdAsync(id);
                await _arcPlanService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa ArcPlan với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }

        [HttpGet("GetDropdowns")]
        public async Task<DataResponse<Dictionary<string, List<DropdownOption>>>> GetDropdowns([FromQuery] string[] types)
        {
            var dropdownTTKH = await _dM_DuLieuDanhMucService
                .GetDropdownCodeByGroupCode(MaDanhMucConstant.TTKH)
                ?? new List<DropdownOption>();

            var result = new Dictionary<string, List<DropdownOption>>()
            {
                {"dropdownTTKH", dropdownTTKH },
               
            };

            return DataResponse<Dictionary<string, List<DropdownOption>>>.Success(result);
        }


        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new ArcPlanSearch();
                var data = await _arcPlanService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<ArcPlanDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "ArcPlan");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<ArcPlan>(rootPath, "ArcPlan");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<ArcPlan>();
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

                var importHelper = new ImportExcelHelperNetCore<ArcPlan>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<ArcPlan>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<ArcPlan>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _arcPlanService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<ArcPlan>();


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
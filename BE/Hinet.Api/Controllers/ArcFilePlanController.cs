using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.ArcFilePlanService;
using Hinet.Service.ArcFilePlanService.Dto;
using Hinet.Service.ArcFilePlanService.ViewModels;
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


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class ArcFilePlanController : HinetController
    {
        private readonly IArcFilePlanService _arcFilePlanService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<ArcFilePlanController> _logger;

        public ArcFilePlanController(
            IArcFilePlanService arcFilePlanService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<ArcFilePlanController> logger
            )
        {
            this._arcFilePlanService = arcFilePlanService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<ArcFilePlan>> Create([FromBody] ArcFilePlanCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<ArcFilePlanCreateVM, ArcFilePlan>(model);
                await _arcFilePlanService.CreateAsync(entity);
                return DataResponse<ArcFilePlan>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo ArcFilePlan");
                return DataResponse<ArcFilePlan>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<ArcFilePlan>> Update([FromBody] ArcFilePlanEditVM model)
        {
            try
            {
                var entity = await _arcFilePlanService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<ArcFilePlan>.False("ArcFilePlan không tồn tại");

                entity = _mapper.Map(model, entity);
                await _arcFilePlanService.UpdateAsync(entity);
                return DataResponse<ArcFilePlan>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật ArcFilePlan với Id: {Id}", model.Id);
                return new DataResponse<ArcFilePlan>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<ArcFilePlanDto>> Get(Guid id)
        {
            var dto = await _arcFilePlanService.GetDto(id);
            return DataResponse<ArcFilePlanDto>.Success(dto);
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<ArcFilePlanDto>>> GetData([FromBody] ArcFilePlanSearch search)
        {
            var data = await _arcFilePlanService.GetData(search);
            return DataResponse<PagedList<ArcFilePlanDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _arcFilePlanService.GetByIdAsync(id);
                await _arcFilePlanService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa ArcFilePlan với Id: {Id}", id);
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
                var search = new ArcFilePlanSearch();
                var data = await _arcFilePlanService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<ArcFilePlanDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "ArcFilePlan");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<ArcFilePlan>(rootPath, "ArcFilePlan");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<ArcFilePlan>();
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

                var importHelper = new ImportExcelHelperNetCore<ArcFilePlan>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<ArcFilePlan>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<ArcFilePlan>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _arcFilePlanService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<ArcFilePlan>();


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
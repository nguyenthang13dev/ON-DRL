using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.ActivitiesService;
using Hinet.Service.ActivitiesService.Dto;
using Hinet.Service.ActivitiesService.ViewModels;
using Hinet.Service.Common;
using CommonHelper.Excel;
using CommonHelper.Extenions;
using Hinet.Web.Common;
using Hinet.Api.ViewModels.Import;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Api.Dto;
using Hinet.Service.Dto;
using Hinet.Service.Constant;


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class ActivitiesController : HinetController
    {
        private readonly IActivitiesService _activitiesService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<ActivitiesController> _logger;

        public ActivitiesController(
            IActivitiesService activitiesService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<ActivitiesController> logger
            )
        {
            this._activitiesService = activitiesService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<Activities>> Create([FromBody] ActivitiesCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<ActivitiesCreateVM, Activities>(model);
                await _activitiesService.CreateAsync(entity);
                if (model.Image.HasValue)
                {
                    await _taiLieuDinhKemService.UpdateItemIdAsync(model.Image.Value.ToString(), entity.Id);
                }
                return DataResponse<Activities>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo Activities");
                return DataResponse<Activities>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<Activities>> Update([FromBody] ActivitiesEditVM model)
        {
            try
            {
                var entity = await _activitiesService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<Activities>.False("Activities không tồn tại");

                entity = _mapper.Map(model, entity);
                await _activitiesService.UpdateAsync(entity);
                if (model.Image.HasValue)
                {
                    await _taiLieuDinhKemService.UpdateItemIdAsync(model.Image.Value.ToString(), entity.Id);
                }
                return DataResponse<Activities>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật Activities với Id: {Id}", model.Id);
                return new DataResponse<Activities>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<ActivitiesDto>> Get(Guid id)
        {
            var dto = await _activitiesService.GetDto(id);
            return DataResponse<ActivitiesDto>.Success(dto);
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<ActivitiesDto>>> GetData([FromBody] ActivitiesSearch search)
        {
            var data = await _activitiesService.GetData(search);
            return DataResponse<PagedList<ActivitiesDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _activitiesService.GetByIdAsync(id);
                await _activitiesService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa Activities với Id: {Id}", id);
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
                var search = new ActivitiesSearch();
                var data = await _activitiesService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<ActivitiesDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "Activities");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<Activities>(rootPath, "Activities");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<Activities>();
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

                var importHelper = new ImportExcelHelperNetCore<Activities>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<Activities>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<Activities>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _activitiesService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<Activities>();


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
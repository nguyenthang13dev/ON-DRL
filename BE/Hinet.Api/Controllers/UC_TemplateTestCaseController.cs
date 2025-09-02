using CommonHelper.Excel;
using Hinet.Api.Dto;
using Hinet.Api.Filter;
using Hinet.Api.ViewModels.Import;
using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DM_DuLieuDanhMucService;
using Hinet.Service.DM_NhomDanhMucService;
using Hinet.Service.Dto;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Service.UC_TemplateTestCaseService;
using Hinet.Service.UC_TemplateTestCaseService.Dto;
using Hinet.Service.UC_TemplateTestCaseService.ViewModels;
using Hinet.Web.Common;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class UC_TemplateTestCaseController : HinetController
    {
        private readonly IUC_TemplateTestCaseService _uC_TemplateTestCaseService;
        private readonly IMapper _mapper;
        private readonly ILogger<UC_TemplateTestCaseController> _logger;
        ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IDM_DuLieuDanhMucService _dM_DuLieuDanhMucService;
        private readonly IDM_NhomDanhMucService _dM_NhomDanhMucService;
        public UC_TemplateTestCaseController(
            IUC_TemplateTestCaseService UC_TemplateTestCaseService,
            IMapper mapper,
            ILogger<UC_TemplateTestCaseController> logger,
            IDM_DuLieuDanhMucService dM_DuLieuDanhMucService,
            IDM_NhomDanhMucService dM_NhomDanhMucService,
             ITaiLieuDinhKemService taiLieuDinhKemService
            )
        {
            this._uC_TemplateTestCaseService = UC_TemplateTestCaseService;
            this._mapper = mapper;
            _logger = logger;
            this._dM_DuLieuDanhMucService = dM_DuLieuDanhMucService;
            this._dM_NhomDanhMucService = dM_NhomDanhMucService;
            _taiLieuDinhKemService = taiLieuDinhKemService;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<UC_TemplateTestCase>> Create([FromBody] UC_TemplateTestCaseCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<UC_TemplateTestCaseCreateVM, UC_TemplateTestCase>(model);
                await _uC_TemplateTestCaseService.CreateAsync(entity);
                return new DataResponse<UC_TemplateTestCase>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo UC_TemplateTestCase");
                return new DataResponse<UC_TemplateTestCase>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi tạo dữ liệu."
                };
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<UC_TemplateTestCase>> Update([FromBody] UC_TemplateTestCaseEditVM model)
        {
            try
            {
                var entity = await _uC_TemplateTestCaseService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<UC_TemplateTestCase>.False("UC_TemplateTestCase không tồn tại");

                entity = _mapper.Map(model, entity);
                await _uC_TemplateTestCaseService.UpdateAsync(entity);
                return new DataResponse<UC_TemplateTestCase>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật UC_TemplateTestCase với Id: {Id}", model.Id);
                return new DataResponse<UC_TemplateTestCase>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<UC_TemplateTestCaseDto>> Get(Guid id)
        {
            try
            {
                var data = await _uC_TemplateTestCaseService.GetDto(id);
                return new DataResponse<UC_TemplateTestCaseDto>()
                {
                    Message = "Lấy thông tin thành công",
                    Data = data,
                    Status = true
                };
            }
            catch (Exception ex)
            {
                return new DataResponse<UC_TemplateTestCaseDto>()
                {
                    Message = "Lỗi lấy thông tin Template",
                    Status = true,
                    Errors = new string[] { ex.Message }
                };
            }
        }

        [HttpPost("GetData", Name = "Xem danh sách UC_TemplateTestCase hệ thống")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<UC_TemplateTestCaseDto>>> GetData([FromBody] UC_TemplateTestCaseSearch search)
        {
            try
            {

                return new DataResponse<PagedList<UC_TemplateTestCaseDto>>()
                {
                    Data = await _uC_TemplateTestCaseService.GetData(search),
                    Message = "Lấy thông tin thành công",
                    Status = true

                };
            }
            catch (Exception ex)
            {
                return new DataResponse<PagedList<UC_TemplateTestCaseDto>>()
                {
                    Message = "Lỗi lấy thông tin Template",
                    Status = true,
                    Errors = new string[] { ex.Message }
                };
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _uC_TemplateTestCaseService.GetByIdAsync(id);
                await _uC_TemplateTestCaseService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa UC_TemplateTestCase với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }



        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new UC_TemplateTestCaseSearch();
                var data = await _uC_TemplateTestCaseService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<UC_TemplateTestCaseDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "UC_TemplateTestCase");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<UC_TemplateTestCase>(rootPath, "UC_TemplateTestCase");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<UC_TemplateTestCase>();
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

                var importHelper = new ImportExcelHelperNetCore<UC_TemplateTestCase>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<UC_TemplateTestCase>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<UC_TemplateTestCase>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _uC_TemplateTestCaseService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<UC_TemplateTestCase>();


                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Import thất bại");
            }
        }

        [HttpPost("GenerateUseCaseStrings")]
        public async Task<DataResponse<List<UseCaseGenerateResultDto>>> GenerateUseCaseStrings([FromBody] List<UseCaseInputDto> inputList)
        {
            try
            {
                var result = await _uC_TemplateTestCaseService.GenerateUseCaseStrings(inputList);
                return new DataResponse<List<UseCaseGenerateResultDto>>()
                {
                    Data = result,
                    Status = true,
                    Message = "Sinh danh sách thành công"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi sinh danh sách use case string");
                return new DataResponse<List<UseCaseGenerateResultDto>>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi sinh danh sách."
                };
            }
        }
        [HttpGet("GetDoPhucTapCode")]
        public async Task<List<DropdownOption>> GetDoPhucTapCode()
        {
            var result = await _dM_DuLieuDanhMucService.GetDropdownCodeByGroupCode("DoPhucTap");
            if (result == null || !result.Any())
            {
                DM_NhomDanhMuc dM_NhomDanhMuc = new DM_NhomDanhMuc
                {
                    GroupCode = "DoPhucTap",
                    GroupName = "Độ Phức Tạp",
                };
                await _dM_NhomDanhMucService.CreateAsync(dM_NhomDanhMuc);
            }
            result = await _dM_DuLieuDanhMucService.GetDropdownCodeByGroupCode("DoPhucTap");

            return result;
        }
    }
}
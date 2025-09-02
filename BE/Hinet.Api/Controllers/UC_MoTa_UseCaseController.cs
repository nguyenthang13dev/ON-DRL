using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.UC_MoTa_UseCaseService;
using Hinet.Service.UC_MoTa_UseCaseService.Dto;
using Hinet.Service.UC_MoTa_UseCaseService.ViewModels;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Api.Filter; 
using CommonHelper.Excel;
using Hinet.Web.Common;
using Hinet.Api.ViewModels.Import;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Api.Dto;
using Hinet.Api.Controllers;
using Hinet.Service.UC_MoTa_UseCaseService.Dto;
using Hinet.Service.UC_MoTa_UseCaseService.ViewModels;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class UC_MoTa_UseCaseController : HinetController
    {
        private readonly IUC_MoTa_UseCaseService _uC_MoTa_UseCaseService;
        private readonly IMapper _mapper;
        private readonly ILogger<UC_MoTa_UseCaseController> _logger;
        ITaiLieuDinhKemService _taiLieuDinhKemService;
        public UC_MoTa_UseCaseController(
            IUC_MoTa_UseCaseService UC_MoTa_UseCaseService,
            IMapper mapper, 
            ILogger<UC_MoTa_UseCaseController> logger,
             ITaiLieuDinhKemService taiLieuDinhKemService
            )
        {
            this._uC_MoTa_UseCaseService = UC_MoTa_UseCaseService;
            this._mapper = mapper;
            _logger = logger;
            _taiLieuDinhKemService = taiLieuDinhKemService;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<UC_MoTa_UseCase>> Create([FromBody] UC_MoTa_UseCaseCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<UC_MoTa_UseCaseCreateVM, UC_MoTa_UseCase>(model);
                await _uC_MoTa_UseCaseService.CreateAsync(entity);
                return new DataResponse<UC_MoTa_UseCase>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            { 
                return new DataResponse<UC_MoTa_UseCase>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi tạo dữ liệu." + ex.Message
                };
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<UC_MoTa_UseCase>> Update([FromBody] UC_MoTa_UseCaseEditVM model)
        {
            try
            {
                var entity = await _uC_MoTa_UseCaseService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<UC_MoTa_UseCase>.False("UC_MoTa_UseCase không tồn tại");

                entity = _mapper.Map(model, entity);
                await _uC_MoTa_UseCaseService.UpdateAsync(entity);
                return new DataResponse<UC_MoTa_UseCase>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            { 
                return new DataResponse<UC_MoTa_UseCase>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu." + ex.Message
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<UC_MoTa_UseCaseDto>> Get(Guid id)
        {
            try
            {
                var data = await _uC_MoTa_UseCaseService.GetDto(id);
                return new DataResponse<UC_MoTa_UseCaseDto>()
                {
                    Message = "Lấy thông tin thành công",
                    Data = data,
                    Status = true
                };
            }
            catch (Exception ex)
            {
                return new DataResponse<UC_MoTa_UseCaseDto>()
                {
                    Message = "Lỗi lấy thông tin Template",
                    Status = true,
                    Errors = new string[] { ex.Message }
                };
            }
        }

        [HttpPost("GetData", Name = "Xem danh sách UC_MoTa_UseCase hệ thống")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<UC_MoTa_UseCaseDto>>> GetData([FromBody] UC_MoTa_UseCaseSearch search)
        {
            try
            {

                return new DataResponse<PagedList<UC_MoTa_UseCaseDto>>()
                {
                    Data = await _uC_MoTa_UseCaseService.GetData(search),
                    Message = "Lấy thông tin thành công",
                    Status = true

                };
            }
            catch (Exception ex)
            {
                return new DataResponse<PagedList<UC_MoTa_UseCaseDto>>()
                {
                    Message = "Lỗi lấy thông tin Template",
                    Status = true,
                    Errors = new string[] { ex.Message }
                };
            }
        }

        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new UC_MoTa_UseCaseSearch();
                var data = await _uC_MoTa_UseCaseService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<UC_MoTa_UseCaseDto>(data?.Items);
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



        [HttpGet("import")]
        public async Task<DataResponse> import()
        {
            try
            {
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                ExcelImportExtention.CreateExcelWithDisplayNames<UC_MoTa_UseCase>(rootPath, "UC_MoTa_UseCase");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<UC_MoTa_UseCase>();
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

                var importHelper = new ImportExcelHelperNetCore<UC_MoTa_UseCase>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<UC_MoTa_UseCase>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<UC_MoTa_UseCase>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _uC_MoTa_UseCaseService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<UC_MoTa_UseCase>();


                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Import thất bại");
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var res = _uC_MoTa_UseCaseService.FindBy(x => x.Id == id);
                if(res != null)
                {
                    await _uC_MoTa_UseCaseService.DeleteAsync(res);
                    return DataResponse.Success("Xoá thành công");
                }
                return DataResponse.False("Lỗi không tìm thấy Id Mô tả Use case");

            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message + ex.StackTrace);
                return DataResponse.False("Lỗi hệ thống");


            }
        }
    }
}
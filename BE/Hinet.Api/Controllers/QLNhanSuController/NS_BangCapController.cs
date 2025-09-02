using CommonHelper.Excel;
using Hinet.Api.Dto;
using Hinet.Api.Filter;
using Hinet.Api.ViewModels.Import;
using Hinet.Controllers;
using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.QLNhanSu.NS_BangCapService;
using Hinet.Service.QLNhanSu.NS_BangCapService.Dto;
using Hinet.Service.QLNhanSu.NS_BangCapService.ViewModels;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Web.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    public class NS_BangCapController : HinetController
    {
        private readonly INS_BangCapService _nS_BangCapService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<NS_BangCapDto> _logger;

        public NS_BangCapController(
            INS_BangCapService nS_BangCapService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<NS_BangCapDto> logger
            )
        {
            _nS_BangCapService = nS_BangCapService;
            _taiLieuDinhKemService = taiLieuDinhKemService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<NS_BangCap>> Create([FromBody] NS_BangCapCreateVM model)
        {
            try
            {
                
                var entity = _mapper.Map<NS_BangCapCreateVM, NS_BangCap>(model);
                await _nS_BangCapService.CreateAsync(entity);
                return DataResponse<NS_BangCap>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo bằng cấp");
                return DataResponse<NS_BangCap>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<NS_BangCap>> Update([FromBody] NS_BangCapEditVM model)
        {
            try
            {
                var entity = await _nS_BangCapService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<NS_BangCap>.False("Bằng cấp không tồn tại");

                entity = _mapper.Map(model, entity);
                await _nS_BangCapService.UpdateAsync(entity);
                return DataResponse<NS_BangCap>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật bằng cấp với Id: {Id}", model.Id);
                return new DataResponse<NS_BangCap>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<NS_BangCap>> Get(Guid id)
        {
            var dto = await _nS_BangCapService.GetDto(id);
            return DataResponse<NS_BangCap>.Success(dto);
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<NS_BangCapDto>>> GetData([FromBody] NS_BangCapSearch search)
        {
             var data = await _nS_BangCapService.GetData(search);
            return DataResponse<PagedList<NS_BangCapDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _nS_BangCapService.GetByIdAsync(id);
                await _nS_BangCapService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa bằng cấp với Id: {Id}", id);
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
                var search = new NS_BangCapSearch();
                var data = await _nS_BangCapService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<NS_BangCap>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "NS_BangCap");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<NS_BangCap>(rootPath, "NS_BangCap");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<NS_BangCap>();
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

                var importHelper = new ImportExcelHelperNetCore<NS_BangCap>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<NS_BangCap>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<NS_BangCap>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _nS_BangCapService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<NS_BangCap>();


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

using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.FileSecurityService;
using Hinet.Service.FileSecurityService.Dto;
using Hinet.Service.FileSecurityService.ViewModels;
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


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class FileSecurityController : HinetController
    {
        private readonly IFileSecurityService _fileSecurityService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<FileSecurityController> _logger;

        public FileSecurityController(
            IFileSecurityService fileSecurityService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<FileSecurityController> logger
            )
        {
            this._fileSecurityService = fileSecurityService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<FileSecurity>> Create([FromBody] FileSecurityCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<FileSecurityCreateVM, FileSecurity>(model);
                await _fileSecurityService.CreateAsync(entity);
                return DataResponse<FileSecurity>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo FileSecurity");
                return DataResponse<FileSecurity>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }


        [HttpPut("Update")]
        public async Task<DataResponse<FileSecurity>> Update([FromBody] FileSecurityEditVM model)
        {
            try
            {
                var entity = await _fileSecurityService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<FileSecurity>.False("FileSecurity không tồn tại");

                entity = _mapper.Map(model, entity);
                await _fileSecurityService.UpdateAsync(entity);
                return DataResponse<FileSecurity>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật FileSecurity với Id: {Id}", model.Id);
                return new DataResponse<FileSecurity>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<FileSecurityDto>> Get(Guid id)
        {
            var dto = await _fileSecurityService.GetDto(id);
            return DataResponse<FileSecurityDto>.Success(dto);
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<FileSecurityDto>>> GetData([FromBody] FileSecuritySearch search)
        {
            var data = await _fileSecurityService.GetData(search);
            return DataResponse<PagedList<FileSecurityDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _fileSecurityService.GetByIdAsync(id);
                await _fileSecurityService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa FileSecurity với Id: {Id}", id);
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
                var search = new FileSecuritySearch();
                var data = await _fileSecurityService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<FileSecurityDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "FileSecurity");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<FileSecurity>(rootPath, "FileSecurity");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<FileSecurity>();
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

                var importHelper = new ImportExcelHelperNetCore<FileSecurity>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<FileSecurity>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<FileSecurity>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _fileSecurityService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<FileSecurity>();


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
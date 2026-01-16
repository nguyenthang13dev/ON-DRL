using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.ChuKyService;
using Hinet.Service.ChuKyService.Dto;
using Hinet.Service.ChuKyService.ViewModels;
using Hinet.Service.Common;
using CommonHelper.Excel;
using CommonHelper.Extenions;
using Hinet.Web.Common;
using Hinet.Api.ViewModels.Import;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Api.Dto;
using Hinet.Service.Dto;
using Hinet.Service.Constant;
using CommonHelper.File;


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class ChuKyController : HinetController
    {
        private readonly IChuKyService _chuKyService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<ChuKyController> _logger;

        public ChuKyController(
            IChuKyService chuKyService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<ChuKyController> logger
            )
        {
            this._chuKyService = chuKyService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Save")]
        public async Task<DataResponse<ChuKy>> Save([FromForm] ChuKyCreateVM model)
        {
            try
            {
                var uploadsFolder = Path.Combine("wwwroot", "uploads", "CHUKY", UserId.ToString());
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(model.File.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.File.CopyToAsync(stream);
                }

                var entity = new ChuKy
                {
                    Id = Guid.NewGuid(),
                    UserId = UserId.Value,
                    DuongDanFile = "/" + Path.Combine("CHUKY", UserId.ToString(), fileName),
                    CreatedDate = DateTime.Now,
                    IsDelete = false
                };
                await _chuKyService.CreateAsync(entity);
                return DataResponse<ChuKy>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo ChuKy");
                return DataResponse<ChuKy>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<ChuKy>> Update([FromBody] ChuKyEditVM model)
        {
            try
            {
                var entity = await _chuKyService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<ChuKy>.False("ChuKy không tồn tại");

                entity = _mapper.Map(model, entity);
                await _chuKyService.UpdateAsync(entity);
                return DataResponse<ChuKy>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật ChuKy với Id: {Id}", model.Id);
                return new DataResponse<ChuKy>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get")]
        public async Task<DataResponse<List<ChuKyDto>>> Get()
        {
            var dto = await _chuKyService.GetChuKy(UserId);
            return DataResponse<List<ChuKyDto>>.Success(dto);
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<ChuKyDto>>> GetData([FromBody] ChuKySearch search)
        {
            var data = await _chuKyService.GetData(search);
            return DataResponse<PagedList<ChuKyDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _chuKyService.GetByIdAsync(id);
                await _chuKyService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa ChuKy với Id: {Id}", id);
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
                var search = new ChuKySearch();
                var data = await _chuKyService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<ChuKyDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "ChuKy");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<ChuKy>(rootPath, "ChuKy");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<ChuKy>();
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

                var importHelper = new ImportExcelHelperNetCore<ChuKy>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<ChuKy>(data.Collection);
                #endregion
                var rsl = importHelper.Import();
                var listImportReponse = new List<ChuKy>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _chuKyService.CreateAsync(rsl.ListTrue);
                }
                var response = new ResponseImport<ChuKy>();
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
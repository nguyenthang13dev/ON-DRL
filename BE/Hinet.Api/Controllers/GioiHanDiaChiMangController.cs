using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.GioiHanDiaChiMangService;
using Hinet.Service.GioiHanDiaChiMangService.Dto;
using Hinet.Service.GioiHanDiaChiMangService.ViewModels;
using Hinet.Service.Common;
using Hinet.Api.Filter;
using CommonHelper.Excel;
using Hinet.Web.Common;
using Hinet.Api.ViewModels.Import;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Api.Dto;
using Microsoft.AspNetCore.Authorization;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class GioiHanDiaChiMangController : HinetController
    {
        private readonly IGioiHanDiaChiMangService _gioiHanDiaChiMangService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<GioiHanDiaChiMangController> _logger;

        public GioiHanDiaChiMangController(
            IGioiHanDiaChiMangService gioiHanDiaChiMangService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<GioiHanDiaChiMangController> logger
            )
        {
            this._gioiHanDiaChiMangService = gioiHanDiaChiMangService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
        }


        [HttpGet("Allowed/{id}")]
        public async Task<DataResponse> Allowed(Guid id)
        {
            try
            {
                var ipaddr = await _gioiHanDiaChiMangService.GetByIdAsync(id);
                if (ipaddr == null) return DataResponse.False("Không tìm thấy thông tin");

                ipaddr.Allowed = !ipaddr.Allowed;
                await _gioiHanDiaChiMangService.UpdateAsync(ipaddr);

                return DataResponse.Success("Đã xảy ra lỗi");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi Allowed với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi");
            }

        }

        [HttpPost("Create")]
        public async Task<DataResponse<GioiHanDiaChiMang>> Create([FromBody] GioiHanDiaChiMangCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<GioiHanDiaChiMangCreateVM, GioiHanDiaChiMang>(model);
                await _gioiHanDiaChiMangService.CreateAsync(entity);
                return DataResponse<GioiHanDiaChiMang>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo GioiHanDiaChiMang");
                return DataResponse<GioiHanDiaChiMang>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }

        [HttpPut("Update")]
        public async Task<DataResponse<GioiHanDiaChiMang>> Update([FromBody] GioiHanDiaChiMangEditVM model)
        {
            try
            {
                var entity = await _gioiHanDiaChiMangService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<GioiHanDiaChiMang>.False("GioiHanDiaChiMang không tồn tại");

                entity = _mapper.Map(model, entity);
                await _gioiHanDiaChiMangService.UpdateAsync(entity);
                return DataResponse<GioiHanDiaChiMang>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật GioiHanDiaChiMang với Id: {Id}", model.Id);
                return new DataResponse<GioiHanDiaChiMang>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<GioiHanDiaChiMangDto>> Get(Guid id)
        {
            var dto = await _gioiHanDiaChiMangService.GetDto(id);
            return DataResponse<GioiHanDiaChiMangDto>.Success(dto);
        }

        [HttpPost("GetData", Name = "Xem danh sách GioiHanDiaChiMang hệ thống")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<GioiHanDiaChiMangDto>>> GetData([FromBody] GioiHanDiaChiMangSearch search)
        {
            var ipAdress = HttpContext.Connection.RemoteIpAddress?.ToString();

            var check = await _gioiHanDiaChiMangService.AnyAsync(x => x.IPAddress == ipAdress && x.Allowed == true);

            var data = await _gioiHanDiaChiMangService.GetData(search);
            return DataResponse<PagedList<GioiHanDiaChiMangDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _gioiHanDiaChiMangService.GetByIdAsync(id);
                await _gioiHanDiaChiMangService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa GioiHanDiaChiMang với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }



        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new GioiHanDiaChiMangSearch();
                var data = await _gioiHanDiaChiMangService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<GioiHanDiaChiMangDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "GioiHanDiaChiMang");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<GioiHanDiaChiMang>(rootPath, "GioiHanDiaChiMang");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<GioiHanDiaChiMang>();
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

                var importHelper = new ImportExcelHelperNetCore<GioiHanDiaChiMang>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<GioiHanDiaChiMang>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<GioiHanDiaChiMang>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _gioiHanDiaChiMangService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<GioiHanDiaChiMang>();


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
using System.Collections.Generic;
using DocumentFormat.OpenXml.Drawing.Charts;
using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Model.Entities.DuAn;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DA_NhatKyTrienKhaiService;
using Hinet.Service.DA_NhatKyTrienKhaiService.Dto;
using Hinet.Service.DA_NhatKyTrienKhaiService.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DA_NhatKyTrienKhaiController : BaseController<DA_NhatKyTrienKhai, DA_NhatKyTrienKhaiCreateVM, DA_NhatKyTrienKhaiEditVM, DA_NhatKyTrienKhaiDto>
    {
        private readonly IMapper _mapper;
        private readonly IDA_NhatKyTrienKhaiService _service;
        private readonly ILogger<DA_NhatKyTrienKhaiController> _logger;

        public DA_NhatKyTrienKhaiController(IDA_NhatKyTrienKhaiService service, IMapper mapper, ILogger<DA_NhatKyTrienKhaiController> logger) : base(service, mapper)
        {
            _service = service;
            _logger = logger;
            _mapper = mapper;
        }


        [HttpPost("ReadNhatKyTrienKhaiFromFile")]
        public async Task<DataResponse<DA_NhatKyTrienKhaiReponseImportExcel>> ImportFileNhatKyTrienKhai(IFormFile file, [FromQuery] Guid idDuAn)
        {
            if (file == null || file.Length == 0)
            {
                return DataResponse<DA_NhatKyTrienKhaiReponseImportExcel>.False("Không có tệp để tải lên");
            }
            if (file.Length > 10 * 1024 * 1024)
            {

                return DataResponse<DA_NhatKyTrienKhaiReponseImportExcel>.False("Dữ Liệu không lớn hơn 10mb");
            }
            try
            {
                var res = await _service.ReadNhatKyTrienKhai(file, idDuAn);
                return DataResponse<DA_NhatKyTrienKhaiReponseImportExcel>.Success(res, "Read thành công ");
            }
            catch (Exception ex)
            {
                return DataResponse<DA_NhatKyTrienKhaiReponseImportExcel>.False("Lỗi khi nhập tệp: " + ex.Message);
            }
        }


        [HttpPost("CreateNhatKyTrienKhaiRange")]
        public async Task<DataResponse<List<DA_NhatKyTrienKhai>>> createRange(List<DA_NhatKyTrienKhaiCreateVM>  listCreateVM)
        {
            try
            {
                if (listCreateVM == null || listCreateVM.Count == 0)
                {
                    return DataResponse<List<DA_NhatKyTrienKhai>>.False("Danh sách nhật ký triển khai không được để trống");
                }
                //mapper
                var listCreateDo = listCreateVM
                .Select(item => _mapper.Map<DA_NhatKyTrienKhaiCreateVM, DA_NhatKyTrienKhai>(item))
                .ToList();

                await _service.InsertRange(listCreateDo);

                return DataResponse<List<DA_NhatKyTrienKhai>>.Success(listCreateDo, "Tạo danh sách nhật ký triển khai thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.StackTrace, "Lỗi khi tạo danh sách nhật ký triển khai");
                return DataResponse<List<DA_NhatKyTrienKhai>>.False("Không thể tạo danh sách nhật ký triển khai: ");
            }
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<DA_NhatKyTrienKhaiDto>>> GetData([FromBody] DA_NhatKyTrienKhaiSearchVM search)
        {
            try
            {
                var data = await _service.GetData(search);

                return DataResponse<PagedList<DA_NhatKyTrienKhaiDto>>.Success(data, "Lấy dữ liệu thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy dữ liệu nhật ký triển khai");
                return DataResponse<PagedList<DA_NhatKyTrienKhaiDto>>.False("Lỗi khi lấy dữ liệu: " + ex.Message);
            }
        }

        [HttpGet("EportWordNhatKyTrienKhai")]
        public async Task<DataResponse<UrlFilePath>> ExportWordNhatKyTrienKhai([FromQuery] Guid duAnId) 
        {
            try
            {
                var fileStream = await _service.ExportWordNhatKyTrienKhai(duAnId);
                if (fileStream == null)
                {
                    return DataResponse<UrlFilePath>.False("Không tìm thấy dữ liệu nhật ký triển khai cho dự án này hoặc không có nhật ký nào được tạo.");
                }
                return    DataResponse<UrlFilePath>.Success(fileStream,"Tải dữ liệu thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xuất Word nhật ký triển khai");
                return DataResponse<UrlFilePath>.False("Lỗi hệ thống");
            }
        }

        [HttpGet("ExportWordNhatKyTrienKhaiTuKeHoachThucHien")]
        public async Task<DataResponse<UrlFilePath>> ExportWordNhatKyTrienKhaiTuKeHoachThucHien([FromQuery] Guid duAnId,bool isDay)
        {
            try
            {
                var fileStream = await _service.ExportWordNhatKyTrienKhaiTuKeHoachThucHien(duAnId, isDay);
                if (fileStream == null)
                {
                    return DataResponse<UrlFilePath>.False("Không tìm thấy dữ liệu nhật ký triển khai cho dự án này hoặc không có nhật ký nào được tạo.");
                }
                return DataResponse<UrlFilePath>.Success(fileStream, "Tải dữ liệu thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xuất Word nhật ký triển khai");
                return DataResponse<UrlFilePath>.False("Lỗi hệ thống");
            }
        }

    }
}

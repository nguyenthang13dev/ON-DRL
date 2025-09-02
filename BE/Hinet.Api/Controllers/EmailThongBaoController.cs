using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.EmailThongBaoService;
using Hinet.Service.EmailThongBaoService.Dto;
using Hinet.Service.EmailThongBaoService.ViewModels;
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
using Hinet.Service.EmailService;


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class EmailThongBaoController : HinetController
    {
        private readonly IEmailThongBaoService _emailThongBaoService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;
        private readonly ILogger<EmailThongBaoController> _logger;

        public EmailThongBaoController(
            IEmailThongBaoService emailThongBaoService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            IEmailService emailService,
            ILogger<EmailThongBaoController> logger
            )
        {
            this._emailThongBaoService = emailThongBaoService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._emailService = emailService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<EmailThongBao>> Create([FromBody] EmailThongBaoCreateVM model)
        {
            try
            {
                if (_emailThongBaoService.FindBy(x => x.Ma.Equals(model.Ma)).Any())
                {
                    return DataResponse<EmailThongBao>.False("Mã email thông báo đã tồn tại!");
                }
                var entity = _mapper.Map<EmailThongBaoCreateVM, EmailThongBao>(model);
                await _emailThongBaoService.CreateAsync(entity);
                return DataResponse<EmailThongBao>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo EmailThongBao");
                return DataResponse<EmailThongBao>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<EmailThongBao>> Update([FromBody] EmailThongBaoEditVM model)
        {
            try
            {
                var entity = await _emailThongBaoService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<EmailThongBao>.False("EmailThongBao không tồn tại");

                if (_emailThongBaoService.FindBy(x => x.Ma.Equals(model.Ma) && x.Id != model.Id).Any())
                {
                    return DataResponse<EmailThongBao>.False("Mã email thông báo đã tồn tại!");
                }

                entity = _mapper.Map(model, entity);
                await _emailThongBaoService.UpdateAsync(entity);
                return DataResponse<EmailThongBao>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật EmailThongBao với Id: {Id}", model.Id);
                return new DataResponse<EmailThongBao>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<EmailThongBaoDto>> Get(Guid id)
        {
            var dto = await _emailThongBaoService.GetDto(id);
            return DataResponse<EmailThongBaoDto>.Success(dto);
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<EmailThongBaoDto>>> GetData([FromBody] EmailThongBaoSearch search)
        {
            var data = await _emailThongBaoService.GetData(search);
            return DataResponse<PagedList<EmailThongBaoDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _emailThongBaoService.GetByIdAsync(id);
                await _emailThongBaoService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa EmailThongBao với Id: {Id}", id);
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
                var search = new EmailThongBaoSearch();
                var data = await _emailThongBaoService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<EmailThongBaoDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "EmailThongBao");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<EmailThongBao>(rootPath, "EmailThongBao");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<EmailThongBao>();
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

                var importHelper = new ImportExcelHelperNetCore<EmailThongBao>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<EmailThongBao>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<EmailThongBao>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _emailThongBaoService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<EmailThongBao>();


                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception)
            {
                return DataResponse.False("Import thất bại");
            }
        }

        [HttpPost("SendEmail")]
        public async Task<DataResponse> SendEmail([FromForm] string subject, [FromForm] string body, [FromForm] string toAddress/*, [FromForm] string iditem*/)
        {
            try
            {
                //Guid? idguid = Guid.TryParse(iditem, out var guid) ? guid : (Guid?)null;
                //var entity = await _emailThongBaoService.GetByIdAsync(idguid);
                //if (entity == null) return DataResponse.False("Không tìm được nội dung mail");
                await _emailService.SendEmailAsync(toAddress, subject, body);
                return DataResponse.Success("Gửi email thành công");
            }
            catch (Exception ex)
            {
                return DataResponse.False("Gửi email thất bại");
            }
        }
    }
}
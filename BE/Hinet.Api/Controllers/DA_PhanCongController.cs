using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.DA_PhanCongService;
using Hinet.Service.DA_PhanCongService.Dto;
using Hinet.Service.DA_PhanCongService.ViewModels;
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
using Hinet.Service.NotificationService;
using Hinet.Repository.Common;


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class DA_PhanCongController : HinetController
    {
        private readonly IDA_PhanCongService _dA_PhanCongService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IUnitOfWorkRepository _unitOfWorkRepository;
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;
        private readonly ILogger<DA_PhanCongController> _logger;

        public DA_PhanCongController(
            IDA_PhanCongService dA_PhanCongService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IUnitOfWorkRepository unitOfWorkRepository,
            INotificationService notificationService,
            IMapper mapper,
            ILogger<DA_PhanCongController> logger
            )
        {
            this._dA_PhanCongService = dA_PhanCongService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            _unitOfWorkRepository = unitOfWorkRepository;
            _notificationService = notificationService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<DA_PhanCong>> Create([FromBody] DA_PhanCongCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<DA_PhanCongCreateVM, DA_PhanCong>(model);
                await _dA_PhanCongService.CreateAsync(entity);
                return DataResponse<DA_PhanCong>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo DA_PhanCong");
                return DataResponse<DA_PhanCong>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<DA_PhanCong>> Update([FromBody] DA_PhanCongEditVM model)
        {
            try
            {
                var entity = await _dA_PhanCongService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<DA_PhanCong>.False("DA_PhanCong không tồn tại");

                entity = _mapper.Map(model, entity);
                await _dA_PhanCongService.UpdateAsync(entity);
                return DataResponse<DA_PhanCong>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật DA_PhanCong với Id: {Id}", model.Id);
                return new DataResponse<DA_PhanCong>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<DA_PhanCongDto>> Get(Guid id)
        {
            var dto = await _dA_PhanCongService.GetDto(id);
            return DataResponse<DA_PhanCongDto>.Success(dto);
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<DA_PhanCongDto>>> GetData([FromBody] DA_PhanCongSearch search)
        {
            var data = await _dA_PhanCongService.GetData(search);
            return DataResponse<PagedList<DA_PhanCongDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _dA_PhanCongService.GetByIdAsync(id);
                await _dA_PhanCongService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa DA_PhanCong với Id: {Id}", id);
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
                var search = new DA_PhanCongSearch();
                var data = await _dA_PhanCongService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<DA_PhanCongDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "DA_PhanCong");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<DA_PhanCong>(rootPath, "DA_PhanCong");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<DA_PhanCong>();
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

                var importHelper = new ImportExcelHelperNetCore<DA_PhanCong>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<DA_PhanCong>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<DA_PhanCong>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _dA_PhanCongService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<DA_PhanCong>();


                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception)
            {
                return DataResponse.False("Import thất bại");
            }
        }

        [HttpPost("saveList")]
        public async Task<DataResponse<bool>> SaveList([FromQuery] Guid duAnId, [FromBody] List<DA_PhanCongCreateVM> list)
        {
            try
            {
                _unitOfWorkRepository.CreateTransaction();
                // Xóa toàn bộ phân công cũ của dự án
                await _dA_PhanCongService.DeleteRange(x => x.DuAnId == duAnId);

                // Thêm mới các phân công từ list
                if (list != null && list.Count > 0)
                {
                    foreach (var item in list)
                    {
                        var entity = _mapper.Map<DA_PhanCongCreateVM,DA_PhanCong>(item);
                        entity.DuAnId = duAnId;
                        await _dA_PhanCongService.CreateAsync(entity);
                    }
                }
                // Gửi thông báo nếu có phân công mới
                if (list != null && list.Count > 0)
                {
                    var fromUser =UserId;
                    await _notificationService.CreateOrUpdateNotificationPhanCong(list, duAnId, fromUser.Value);
                }
               await  _unitOfWorkRepository.Commit();
                return DataResponse<bool>.Success(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lưu danh sách phân công dự án {duAnId}", duAnId);
                return DataResponse<bool>.False("Đã xảy ra lỗi khi lưu danh sách phân công.");
            }
        }

        [HttpGet("GetListByDuAnId/{duAnId}")]
        public async Task<DataResponse<List<DA_PhanCongEditVM>>> GetListByDuAnId(Guid duAnId)
        {
            try
            {
                var list = await _dA_PhanCongService.GetByDuAn(duAnId);
                return DataResponse<List<DA_PhanCongEditVM>>.Success(list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách phân công dự án {duAnId}", duAnId);
                return DataResponse<List<DA_PhanCongEditVM>>.False("Đã xảy ra lỗi khi lấy danh sách phân công.");
            }
        }

        [HttpGet("GetListByDuAnIdDto/{duAnId}")]
        public async Task<DataResponse<List<DA_PhanCongDto>>> GetListByDuAnIdDto(Guid duAnId)
        {
            try
            {
                var list = await _dA_PhanCongService.ListPhanCong(duAnId);
                return DataResponse<List<DA_PhanCongDto>>.Success(list);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách phân công dự án {duAnId}", duAnId);
                return DataResponse<List<DA_PhanCongDto>>.False("Đã xảy ra lỗi khi lấy danh sách phân công.");
            }
        }
    }
}
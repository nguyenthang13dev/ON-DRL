using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.DA_KeHoachThucHienService;
using Hinet.Service.DA_KeHoachThucHienService.Dto;
using Hinet.Service.DA_KeHoachThucHienService.ViewModels;
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
using Microsoft.EntityFrameworkCore;
using Microsoft.Office.Interop.Word;
using Hinet.Api.Core.Attributes;
using Hinet.Service.NotificationService;
using Hinet.Service.AspNetUsersService;
using Hinet.Service.EmailTemplateService;
using Hinet.Service.Constant.DuAn;
using System.Text.RegularExpressions;
using Hinet.Service.EmailService;
using Hinet.Repository.DA_KeHoachThucHienRepository;
using Hinet.Service.DA_DuAnService;


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class DA_KeHoachThucHienController : HinetController
    {
        private readonly IDA_KeHoachThucHienService _dA_KeHoachThucHienService;
        private readonly IDA_DuAnService _dA_DuAnService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly INotificationService _notificationService;
        private readonly IAspNetUsersService _aspNetUsersService;
        private readonly IMapper _mapper;
        private readonly IEmailTemplateService _emailTemplateService;
        private readonly IEmailService _emailService;
        private readonly ILogger<DA_KeHoachThucHienController> _logger;

        public DA_KeHoachThucHienController(
            IDA_KeHoachThucHienService dA_KeHoachThucHienService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            INotificationService notificationService,
            IAspNetUsersService aspNetUsersService,
            IDA_DuAnService dA_DuAnService,
            IMapper mapper,
            IEmailTemplateService emailTemplateService,
            IEmailService emailService,
            ILogger<DA_KeHoachThucHienController> logger
            )
        {
            this._dA_KeHoachThucHienService = dA_KeHoachThucHienService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            _notificationService = notificationService;
            _aspNetUsersService = aspNetUsersService;
            this._dA_DuAnService = dA_DuAnService;
            this._mapper = mapper;
            _emailTemplateService = emailTemplateService;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpGet("GetFormByDuAn")]
        public async Task<DataResponse<DA_KeHoachThucHienFormVM>> GetFormByDuAn(Guid id, bool isKeHoachNoiBo)
        {
            try
            {
                var model = new DA_KeHoachThucHienFormVM();
                var data = await _dA_KeHoachThucHienService.Where(x => x.DuAnId == id).ToListAsync();
                model.KeHoachThucHienList = data;
                model.DuAnId = id;
                model.IsKeHoachNoiBo = isKeHoachNoiBo;
                return DataResponse<DA_KeHoachThucHienFormVM>.Success(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách DA_KeHoachThucHien");
                return DataResponse<DA_KeHoachThucHienFormVM>.False("Đã xảy ra lỗi khi lấy dữ liệu.");
            }
        }



        [HttpPost("Create")]
        public async Task<DataResponse<DA_KeHoachThucHien>> Create([FromBody] DA_KeHoachThucHienCreateVM model)
        {
            try
            {
               var HangMucNoiDung = await _dA_KeHoachThucHienService.GetByIdAsync(model.GroupNoiDungId);
                if (HangMucNoiDung == null)
                    return DataResponse<DA_KeHoachThucHien>.False("Hạng mục không tồn tại");
                if(model.NgayKetThuc.HasValue && (model.NgayKetThuc.Value > HangMucNoiDung.NgayKetThuc.Value.ToLocalTime() || model.NgayKetThuc < HangMucNoiDung.NgayBatDau.Value.ToLocalTime()))
                    return DataResponse<DA_KeHoachThucHien>.False($"Ngày kết thúc kế hoạch thực hiện phải nằm trong thời gian của hạng mục {HangMucNoiDung.NgayBatDau.Value.ToLocalTime()} - {HangMucNoiDung.NgayKetThuc.Value.ToLocalTime()}");
                if (model.NgayBatDau.HasValue && (model.NgayBatDau.Value < HangMucNoiDung.NgayBatDau || model.NgayBatDau > HangMucNoiDung.NgayKetThuc))
                    return DataResponse<DA_KeHoachThucHien>.False($"Ngày bắt đầu kế hoạch thực hiện phải nằm trong thời gian hạng mục {HangMucNoiDung.NgayBatDau.Value.ToLocalTime()} - {HangMucNoiDung.NgayKetThuc.Value.ToLocalTime()}");
                var entity = _mapper.Map<DA_KeHoachThucHienCreateVM, DA_KeHoachThucHien>(model);
                await _dA_KeHoachThucHienService.CreateAsync(entity);
                return DataResponse<DA_KeHoachThucHien>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo DA_KeHoachThucHien");
                return DataResponse<DA_KeHoachThucHien>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
            }


        [HttpPost("SaveRange")]
        public async Task<DataResponse<List<DA_KeHoachThucHien>>> SaveRange([FromBody] List<DA_KeHoachThucHienCreateVM> model, [FromQuery] Guid duAnId, [FromQuery] bool isKeHoachNoiBo)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return DataResponse<List<DA_KeHoachThucHien>>.False("Lỗi  dữ liệu truyền vào");
                }
                if (model != null && model.Any() && duAnId != null)
                {
                    var listKHCU = _dA_KeHoachThucHienService.GetQueryable().Where(x => x.DuAnId == duAnId && x.IsKeHoachNoiBo == isKeHoachNoiBo).ToList();
                    _dA_KeHoachThucHienService.DeleteRange(listKHCU);

                    var listData = new List<DA_KeHoachThucHien>();
                    var groupData = model.Where(x => !string.IsNullOrEmpty(x.NoiDungCongViec)).GroupBy(x => x.Group).ToList();

                    foreach (var group in groupData)
                    {

                        // Lưu nhóm công việc trước
                        var groupEntity = _mapper.Map<DA_KeHoachThucHienCreateVM, DA_KeHoachThucHien>(group.FirstOrDefault(x => x.IsGroup == true));
                        await _dA_KeHoachThucHienService.CreateAsync(groupEntity); // Id sẽ được cập nhật nếu là Identity

                        // Lưu các công việc con gắn groupId
                        var listChild = group.Where(x => x.IsGroup != true).ToList();
                        if (!listChild.IsNullOrEmpty())
                        {
                            foreach (var child in listChild)
                            {
                                var entity = _mapper.Map<DA_KeHoachThucHienCreateVM, DA_KeHoachThucHien>(child);
                                entity.GroupNoiDungId = groupEntity.Id; // Lúc này ID đã có
                                listData.Add(entity);
                            }
                        }
                    }
                    CreateNotification(listData, true, duAnId);

                    await _dA_KeHoachThucHienService.InsertRange(listData);

                    return DataResponse<List<DA_KeHoachThucHien>>.Success(listData);
                }
                else
                {
                    return DataResponse<List<DA_KeHoachThucHien>>.False("Không có dữ liệu để lưu.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo DA_KeHoachThucHien");
                return DataResponse<List<DA_KeHoachThucHien>>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<DA_KeHoachThucHien>> Update([FromBody] DA_KeHoachThucHienEditVM model)
        {
            try
            {
                var entity = await _dA_KeHoachThucHienService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<DA_KeHoachThucHien>.False("DA_KeHoachThucHien không tồn tại");

                entity = _mapper.Map(model, entity);

                await _dA_KeHoachThucHienService.UpdateAsync(entity);
                return DataResponse<DA_KeHoachThucHien>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật DA_KeHoachThucHien với Id: {Id}", model.Id);
                return new DataResponse<DA_KeHoachThucHien>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<DA_KeHoachThucHienDto>> Get(Guid id)
        {
            var dto = await _dA_KeHoachThucHienService.GetDto(id);
            return DataResponse<DA_KeHoachThucHienDto>.Success(dto);
        }

        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<DA_KeHoachThucHienDto>>> GetData([FromBody] DA_KeHoachThucHienSearch search)
        {
            var data = await _dA_KeHoachThucHienService.GetData(search);
            return DataResponse<PagedList<DA_KeHoachThucHienDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _dA_KeHoachThucHienService.GetByIdAsync(id);
                await _dA_KeHoachThucHienService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa DA_KeHoachThucHien với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }



        [HttpDelete("DeleteByDuAn")]
        public async Task<DataResponse> DeleteByDuAn(Guid id, bool isKeHoachNoiBo)
        {
            try
            {
                await _dA_KeHoachThucHienService.DeleteRange(x => x.DuAnId == id && x.IsKeHoachNoiBo == isKeHoachNoiBo);
                return DataResponse.Success("Xoá kế hoạch triển khai thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa kế hoạch by dự án: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }


        [HttpGet("GetDropdowns")]
        public async Task<DataResponse<List<DA_KeHoachThucHienTree>>> GetDropdowns([FromQuery] Guid id, [FromQuery] bool isKeHoachNoiBo)
        {
            try
            {

                var data = await _dA_KeHoachThucHienService.getDropDownKeHoachThuchien(id, isKeHoachNoiBo);


                return DataResponse<List<DA_KeHoachThucHienTree>>.Success(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy dữ liệu cây DA_KeHoachThucHien");
                return DataResponse<List<DA_KeHoachThucHienTree>>.False("Đã xảy ra lỗi khi lấy dữ liệu.");
            }
        }


        [HttpGet("GetDropdownsHangMucCongViec")]
        public async Task<DataResponse<List<DA_KeHoachThucHienTree>>> GetDropdownsHangMucCongViec([FromQuery] Guid id, [FromQuery] bool isKeHoachNoiBo)
        {
            try
            {

                var data = await _dA_KeHoachThucHienService.getDropDownKeHoachThuchien(id, isKeHoachNoiBo);
                data= data.Where(data => data.GroupNoiDungId == null).ToList();
                return DataResponse<List<DA_KeHoachThucHienTree>>.Success(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy dữ liệu cây DA_KeHoachThucHien");
                return DataResponse<List<DA_KeHoachThucHienTree>>.False("Đã xảy ra lỗi khi lấy dữ liệu.");
            }
        }



        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new DA_KeHoachThucHienSearch();
                var data = await _dA_KeHoachThucHienService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<DA_KeHoachThucHienDto>(data?.Items);
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
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "DA_KeHoachThucHien");
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
                ExcelImportExtention.CreateExcelWithDisplayNames<DA_KeHoachThucHien>(rootPath, "DA_KeHoachThucHien");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<DA_KeHoachThucHien>();
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

                var importHelper = new ImportExcelHelperNetCore<DA_KeHoachThucHien>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<DA_KeHoachThucHien>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<DA_KeHoachThucHien>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _dA_KeHoachThucHienService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<DA_KeHoachThucHien>();


                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception)
            {
                return DataResponse.False("Import thất bại");
            }
        }

        [HttpGet("ExportKeHoacThucHiemDA")]
        public async Task<DataResponse<string>> ExportKeHoacThucHiemDA(Guid DuAnId, bool isKeHoachNoiBo)
        {
            try
            {
                if (DuAnId == Guid.Empty)
                {
                    return DataResponse<string>.False("Dự án không hợp lệ");
                }

                var data = await _dA_KeHoachThucHienService.ExportKeHoachThucHien(DuAnId, isKeHoachNoiBo);
                if (string.IsNullOrEmpty(data))
                {
                    return DataResponse<string>.False("Không có dữ liệu để xuất");
                }

                // Tạo tên file dựa trên thời gian hiện tại để đảm bảo tính duy nhất
                string fileName = $"KeHoachThucHien_{DuAnId}_{DateTime.Now:yyyyMMddHHmmss}.xlsx";

                // Đường dẫn thư mục lưu trữ
                string directoryPath = Path.Combine("uploads", "DA_KeHoachNoiBo");
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                string fullDirectoryPath = Path.Combine(rootPath, directoryPath);

                // Đảm bảo thư mục tồn tại
                if (!Directory.Exists(fullDirectoryPath))
                {
                    Directory.CreateDirectory(fullDirectoryPath);
                }

                // Đường dẫn đầy đủ của file
                string fullPath = Path.Combine(fullDirectoryPath, fileName);

                // Chuyển đổi base64 thành file và lưu
                byte[] bytes = Convert.FromBase64String(data);
                await System.IO.File.WriteAllBytesAsync(fullPath, bytes);

                // Trả về đường dẫn tương đối của file
                string relativePath = $"/DA_KeHoachNoiBo/{fileName}";

                return DataResponse<string>.Success(relativePath, "Kết xuất dữ liệu thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xuất kế hoạch thực hiện dự án");
                return DataResponse<string>.False("Kết xuất thất bại");
            }
        }

        [HttpPost("SaveImportExcel")]
        public async Task<DataResponse<List<DA_KeHoachThucHien>>> SaveImportExcel([FromBody] List<DA_KeHoachThucHienCreateVM> model, [FromQuery] Guid duAnId, [FromQuery] bool isKeHoachNoiBo)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return DataResponse<List<DA_KeHoachThucHien>>.False("Lỗi  dữ liệu truyền vào");
                }
                if (model != null && model.Any() && duAnId != null)
                {
                    var res = await _dA_KeHoachThucHienService.SaveImportDataIntoExcel(model, duAnId, isKeHoachNoiBo);
                    return DataResponse<List<DA_KeHoachThucHien>>.Success(res, "Lưu dữ liệu thành công");
                }
                else
                {
                    return DataResponse<List<DA_KeHoachThucHien>>.False("Không có dữ liệu để lưu.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo DA_KeHoachThucHien");
                return DataResponse<List<DA_KeHoachThucHien>>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }



        [HttpPut("updateKHTrienKhai")]

        public async Task<DataResponse<DA_KeHoachThucHien>> updateKHTrienKhai([FromBody] DA_KeHoachThucHienEditVM model)
        {
            try
            {
                var entity = await _dA_KeHoachThucHienService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<DA_KeHoachThucHien>.False("DA_KeHoachThucHien không tồn tại");

                // Cập nhật các trường cần thiết
                model.NgayBatDau = model.NgayBatDau?.ToLocalTime();
                model.NgayKetThuc = model.NgayKetThuc?.ToLocalTime();
                model.GroupNoiDungId = entity.GroupNoiDungId;
                model.DuAnId = entity.DuAnId;
                model.IsKeHoachNoiBo = entity.IsKeHoachNoiBo;
                model.NoiDungCongViec = entity.NoiDungCongViec;


                entity = _mapper.Map(model, entity);

                // Cập nhật entity
                await _dA_KeHoachThucHienService.UpdateAsync(entity);
                var listdata = new List<DA_KeHoachThucHien>();
                listdata.Add(entity);
                CreateNotification(listdata, true, entity.DuAnId);
                return DataResponse<DA_KeHoachThucHien>.Success(entity, "Cập nhật kế hoạch thực hiện thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật DA_KeHoachThucHien với Id: {Id}", model.Id);
                return new DataResponse<DA_KeHoachThucHien>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }


        [HttpPut("updateProgress")]

        public async Task<DataResponse<DA_KeHoachThucHien>> updateProgress([FromBody] DA_KeHoachThucHienEditVM model)
        {
            try
            {
                var entity = await _dA_KeHoachThucHienService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<DA_KeHoachThucHien>.False("DA_KeHoachThucHien không tồn tại");

                entity.Progress = model.Progress;
                // Cập nhật entity
                await _dA_KeHoachThucHienService.UpdateAsync(entity);
                return DataResponse<DA_KeHoachThucHien>.Success(entity, "Cập nhật kế hoạch thực hiện thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật DA_KeHoachThucHien với Id: {Id}", model.Id);
                return new DataResponse<DA_KeHoachThucHien>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }


        [HttpGet("getTemplateKeHoachTrienKhai")]
        public async Task<DataResponse<List<DA_KeHoachThucHienTree>>> getTemplateKeHoachTrienKhai(Guid duAnId,bool isKeHoachNoiBo = false)
        {
            try
            {
                var res = await _dA_KeHoachThucHienService.getDropDownKeHoachThuchienTemplate(duAnId, isKeHoachNoiBo);
                if(res == null || !res.Any())
                {
                    return DataResponse<List<DA_KeHoachThucHienTree>>.False("Không có dữ liệu mẫu kế hoạch triển khai");
                }
                return DataResponse<List<DA_KeHoachThucHienTree>>.Success(res, "Lấy dữ liệu mẫu kế hoạch triển khai thành công");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy dữ liệu mẫu kế hoạch triển khai");
                return DataResponse<List<DA_KeHoachThucHienTree>>.False("Lỗi khi lấy dữ liệu mẫu kế hoạch triển khai");
            }
        }


        #region ham ho tro noti

        private void CreateNotification(List<DA_KeHoachThucHien> listData, bool isKeHoachNoiBo, Guid IdDuAn, Guid? fromUserId = null)
        {
            try
            {
                if (isKeHoachNoiBo)
                {
                    var groupedNotifications = new Dictionary<DateTime, List<Notification>>();

                    foreach (var keHoach in listData)
                    {
                        if (keHoach.Progress != 100 && keHoach.NgayKetThuc.HasValue && !string.IsNullOrEmpty(keHoach.PhanCong))
                        {
                            var assignedUserIds = keHoach.PhanCong
                                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                                .Select(id => Guid.TryParse(id.Trim(), out var guid) ? guid : (Guid?)null)
                                .Where(id => id.HasValue)
                                .Select(id => id.Value)
                                .ToList();

                            if (assignedUserIds.Any())
                            {
                                var users = _aspNetUsersService.GetQueryable();
                                var template = _emailTemplateService.GetQueryable()
                                    .FirstOrDefault(x => x.Code == KeHoachThucHienConstant.CodeEmailTemplate);

                                if (template == null) throw new Exception("Không tìm thấy template");

                                foreach (var userId in assignedUserIds)
                                {
                                    var user = users.FirstOrDefault(u => u.Id == userId);
                                    if (user != null)
                                    {
                                        var notificationDate = keHoach.NgayKetThuc.Value.Date.AddDays(-2).AddHours(9);
                                        if (!groupedNotifications.ContainsKey(notificationDate))
                                            groupedNotifications[notificationDate] = new List<Notification>();

                                        var notification = new Notification
                                        {
                                            Message = $"Công việc con '{keHoach.NoiDungCongViec}' sắp đến hạn",
                                            ItemId = IdDuAn,
                                            ToUser = userId,
                                            Email = user.Email,
                                            TieuDe = "Thông báo công việc sắp đến hạn",
                                            NoiDung = $"Công việc '{keHoach.NoiDungCongViec}' trong dự án có ID {IdDuAn} sắp đến hạn vào {keHoach.NgayKetThuc:dd/MM/yyyy}.",
                                            IsRead = false,
                                            Link = $"/DuAn/detail/{IdDuAn}",
                                            FromUser = fromUserId,
                                            Type = "TaskReminder",
                                            SendToFrontEndUser = true,
                                            ItemName = keHoach.NoiDungCongViec,
                                            NguoiTao = fromUserId,
                                            IsDisplay = true,
                                            DonViId = null,
                                            LoaiThongBao = "Reminder"
                                        };

                                        groupedNotifications[notificationDate].Add(notification);

                                        // Chuẩn bị nội dung email
                                        var data = new Dictionary<string, string>
                                            {
                                                { "TenNhanVien", user.Name ?? user.Email },
                                                { "NhiemVuDenHan", keHoach.NoiDungCongViec ?? "Nhiệm vụ" },
                                                { "HanHoanThanh", keHoach.NgayKetThuc?.ToString("dd/MM/yyyy") ?? "Chưa xác định" },
                                                { "NamHienTai", DateTime.Now.Year.ToString() }
                                            };

                                        string body = Regex.Replace(
                                            template.Content,
                                            @"\{\{(\w+)\}\}",
                                            m => data.TryGetValue(m.Groups[1].Value, out var val) ? val : m.Value
                                        );

                                        var delay = notificationDate > DateTime.Now ? notificationDate - DateTime.Now : TimeSpan.Zero;

                                        if (delay == TimeSpan.Zero)
                                        {
                                            _emailService.SendEmailAsync(user.Email, template.Name, body);
                                        }
                                        else
                                        {
                                            // Lên lịch gửi email với Hangfire
                                            Hangfire.BackgroundJob.Schedule(() =>
                                                _emailService.SendEmailAsync(user.Email, template.Name, body), delay);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Lên lịch gửi notification
                    foreach (var group in groupedNotifications)
                    {
                        var delay = group.Key > DateTime.Now ? group.Key - DateTime.Now : TimeSpan.Zero;

                        if (delay == TimeSpan.Zero)
                        {
                            _notificationService.InsertRange(group.Value);
                        }
                        else
                        {
                            Hangfire.BackgroundJob.Schedule<NotificationService>(
                                x => x.InsertRange(group.Value), delay);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // Log hoặc throw tùy vào chiến lược xử lý lỗi của bạn
                throw ex;
            }
        }

        #endregion
    }
}
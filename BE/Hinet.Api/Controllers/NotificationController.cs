using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.NotificationService;
using Hinet.Service.NotificationService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Service.NotificationService.ViewModels;

using Hinet.Service.EmailService;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Model.Entities;
using Hinet.Service.ModuleService.Dto;
using Hinet.Api.Dto;
using MongoDB.Driver.Linq;
using MongoDB.Driver;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class NotificationController : HinetController
    {
        private readonly INotificationService _notificationService;
        private readonly IMapper _mapper;
        private readonly ILogger<NotificationController> _logger;
        private readonly IEmailService _emailService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;

        public NotificationController(
            INotificationService notificationService,
            IMapper mapper,
            ILogger<NotificationController> logger,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IEmailService emailService
            )
        {
            this._notificationService = notificationService;
            this._mapper = mapper;
            _logger = logger;
            _emailService = emailService;
            _taiLieuDinhKemService = taiLieuDinhKemService;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<Notification>> Create([FromBody] NotificationCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<NotificationCreateVM, Notification>(model);
                if (string.IsNullOrEmpty(model.Message)) entity.Message = ".";
                //entity.FromUser = model.FromUser != null ? new Guid(model.FromUser) : null;
                //entity.ToUser = model.ToUser != null ? new Guid(model.ToUser) : null;
                if (string.IsNullOrEmpty(model.ItemName)) entity.ItemName = ".";
                await _notificationService.CreateAsync(entity);

                if (!string.IsNullOrEmpty(model.FileDinhKem))
                {
                    var file = await _taiLieuDinhKemService.GetByIdAsync(new Guid(model.FileDinhKem));
                    if (file != null)
                    {
                        file.Item_ID = entity.Id;
                        await _taiLieuDinhKemService.UpdateAsync(file);
                    }
                }

                return new DataResponse<Notification>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo rà soát");
                return new DataResponse<Notification>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi tạo dữ liệu."
                };
            }
        }

        [HttpPost("CreateNhacNho")]
        public async Task<DataResponse<bool>> CreateNhacNho([FromBody] NotificationNhacNho model)
        {
            var entity = _mapper.Map<NotificationNhacNho, Notification>(model);
            var result = await _notificationService.CreateNhacNho(entity);
            return new DataResponse<bool>
            {
                Data = result,
                Message = "CreateNhacNho bool thành công",
                Status = true
            };
        }

        [HttpPut("Update")]
        public async Task<DataResponse<Notification>> Update([FromBody] NotificationEditVM model)
        {
            try
            {
                var entity = await _notificationService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<Notification>.False("Notification not found");

                entity = _mapper.Map(model, entity);
                if (string.IsNullOrEmpty(model.Message)) entity.Message = ".";
                //entity.FromUser = model.FromUser != null ? new Guid(model.FromUser) : null;
                //entity.ToUser = model.ToUser != null ? new Guid(model.ToUser) : null;
                if (string.IsNullOrEmpty(model.ItemName)) entity.ItemName = ".";
                await _notificationService.UpdateAsync(entity);

                if (!string.IsNullOrEmpty(model.FileDinhKem))
                {
                    var removedAttachments = await _taiLieuDinhKemService.GetQueryable().Where(x => x.LoaiTaiLieu.Equals("FileNotification")
                            && x.Item_ID.Equals(entity.Id)).ToListAsync();
                    await _taiLieuDinhKemService.DeleteAsync(removedAttachments);
                    var file = await _taiLieuDinhKemService.GetByIdAsync(new Guid(model.FileDinhKem));
                    if (file != null)
                    {
                        file.Item_ID = entity.Id;
                        await _taiLieuDinhKemService.UpdateAsync(file);
                    }
                }

                return new DataResponse<Notification>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo rà soát");
                return new DataResponse<Notification>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<NotificationDto>> Get(Guid id)
        {
            var data = await _notificationService.GetDto(id);
            return new DataResponse<NotificationDto> { Data = data, Status = true };
        }

        [HttpPost("GetData", Name = "Xem danh sách thông báo")]
        
        public async Task<DataResponse<PagedList<NotificationDto>>> GetData([FromBody] NotificationSearch search)
        {
            var data = await _notificationService.GetData(search);

            return new DataResponse<PagedList<NotificationDto>> { Data = data, Status = true };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            var entity = await _notificationService.GetByIdAsync(id);
            await _notificationService.DeleteAsync(entity);
            return DataResponse.Success(null);
        }

        [HttpPost("GetNotification", Name = "Xem danh sách thông báo chưa đọc")]
        
        public async Task<DataResponse<PagedList<NotificationDto>>> GetNotification()
        {
            var data = await _notificationService.GetNotification(UserId, 5);

            return new DataResponse<PagedList<NotificationDto>> { Data = data, Status = true };
        }

        [HttpPost("GetDataDoanhNghiep", Name = "Xem danh sách thông báo doanh nghiệp")]
        
        public async Task<DataResponse<PagedList<NotificationDto>>> GetDataDoanhNghiep([FromBody] NotificationSearch search)
        {
            var data = await _notificationService.GetDataDoanhNghiep(search);

            return new DataResponse<PagedList<NotificationDto>> { Data = data, Status = true };
        }

        [HttpPost("GetDataSanPham", Name = "Xem danh sách thông báo sản phẩm")]
        
        public async Task<DataResponse<PagedList<NotificationDto>>> GetDataSanPham([FromBody] NotificationSearch search)
        {
            var data = await _notificationService.GetDataSanPham(search);

            return new DataResponse<PagedList<NotificationDto>> { Data = data, Status = true };
        }

        [HttpGet("ToggleLock/{id}")]
        public async Task<DataResponse> ToggleLock(Guid id)
        {
            var res = new DataResponse();
            try
            {
                var obj = await _notificationService.GetByIdAsync(id);
                if (obj == null)
                {
                    res.Status = false;
                    res.Message = "Không tìm thấy thông tin!";
                    return res;
                }
                if (obj.IsXuatBan == true)
                {
                    obj.IsXuatBan = false;
                    res.Message = "Khóa thành công";
                    res.Status = true;
                }
                else
                {
                    obj.IsXuatBan = true;
                    res.Message = "Mở khóa thành công";
                    res.Status = true;
                }
                await _notificationService.UpdateAsync(obj);

                return res;
            }
            catch (Exception)
            {
                res.Status = false;
                res.Message = "Đã xảy ra lỗi!";
                return res;
            }
        }

        [HttpGet("MarkAsRead/{id}")]
        public async Task<DataResponse> MarkAsRead(Guid id)
        {
            var obj = await _notificationService.GetDto(id);
            if(obj != null)
            {
                obj.IsRead = true;
                await _notificationService.UpdateAsync(obj);
            }
            return DataResponse.Success("Cập nhật trạng thái thông báo");
        }


        [HttpPost("GetDataByUser")]
        public async Task<DataResponse<PagedList<NotificationDto>>> GetDataByUser([FromBody] NotificationSearch search)
        {
            search.ToUser = UserId.GetValueOrDefault();
            var data = await _notificationService.GetData(search);

            return new DataResponse<PagedList<NotificationDto>> { Data = data, Status = true };
        }
    }
}
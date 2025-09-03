using Hinet.Model.Entities;
using Hinet.Service.NotificationService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.NotificationService
{
    public interface INotificationService : IService<Notification>
    {
        Task<bool> CreateNhacNho(Notification newNoTi);

        Task<PagedList<NotificationDto>> GetData(NotificationSearch search);

        Task<NotificationDto> GetDto(Guid id);

        Task<PagedList<NotificationDto>> GetNotification(Guid? id, int size = 10);

        Task<PagedList<NotificationDto>> GetDataDoanhNghiep(NotificationSearch search);

        Task<PagedList<NotificationDto>> GetDataSanPham(NotificationSearch search);


    }
}
using Hinet.Model.Entities;

namespace Hinet.Service.NotificationService.Dto
{
    public class NotificationDto : Notification
    {
        public string FromUserName { get; set; }
        public FileDinhKem? FileTaiLieu { get; set; }
    }

    public class FileDinhKem
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
    }
}

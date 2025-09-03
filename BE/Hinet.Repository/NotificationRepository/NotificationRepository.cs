using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.NotificationRepository
{
    public class NotificationRepository : Repository<Notification>, INotificationRepository
    {
        public NotificationRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

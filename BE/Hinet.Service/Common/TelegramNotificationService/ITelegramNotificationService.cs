using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Common.TelegramNotificationService
{
    public interface ITelegramNotificationService
    {
        Task<bool> SendByEventType(List<string>? eventTypeCode, string message);
        Task<bool> SendToGroups(IEnumerable<Guid> groupIds, string message);
        Task<bool> SendToUsers(IEnumerable<Guid> userIds, string message);
        Task<bool> SendMessageAsync(string message, string chatId = null);

    }
}

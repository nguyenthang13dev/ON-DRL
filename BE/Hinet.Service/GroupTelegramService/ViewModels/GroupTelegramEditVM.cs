using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.GroupTelegramService.ViewModels
{
    public class GroupTelegramEditVM: GroupTelegramCreateVM
    {
        public Guid Id { get; set; } // Id của nhóm Telegram
    }
}

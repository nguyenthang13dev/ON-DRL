using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;

namespace Hinet.Repository.GroupTelegramRepository
{
    public class GroupTelegramRepository : Repository<GroupTelegram>, IGroupTelegramRepository
    {
        public GroupTelegramRepository(DbContext context) : base(context)
        {
        }
    }
}
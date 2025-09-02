using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;

namespace Hinet.Repository.UserTelegramRepository
{
    public class UserTelegramRepository : Repository<UserTelegram>, IUserTelegramRepository
    {
        public UserTelegramRepository(DbContext context) : base(context)
        {
        }
    }
}
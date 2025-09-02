using Hinet.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Repository.UserRoleRepository
{
    public class UserDonViRepository : Repository<UserDonVi>, IUserDonViRepository
    {
        public UserDonViRepository(DbContext context) : base(context)
        {
        }
    }
}
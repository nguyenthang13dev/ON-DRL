using Hinet.Model.Entities;
using Hinet.Model;


namespace Hinet.Repository.AspNetUsersRepository
{
    public class AspNetUsersRepository : Repository<AppUser>, IAspNetUsersRepository
    {
        public AspNetUsersRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

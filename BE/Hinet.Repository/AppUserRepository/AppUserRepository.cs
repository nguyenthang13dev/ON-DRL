using Hinet.Model;
using Hinet.Model.Entities;
using Hinet.Model.Entities;

namespace Hinet.Repository.AppUserRepository
{
    public class AppUserRepository : Repository<AppUser>, IAppUserRepository
    {
        public AppUserRepository(HinetMongoContext context) : base(context)
        {

        }
    }
}

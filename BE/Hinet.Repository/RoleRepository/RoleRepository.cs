using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.RoleRepository
{
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        public RoleRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

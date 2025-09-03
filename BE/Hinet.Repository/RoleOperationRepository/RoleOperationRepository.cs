using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.RoleOperationRepository
{
    public class RoleOperationRepository : Repository<RoleOperation>, IRoleOperationRepository
    {
        public RoleOperationRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

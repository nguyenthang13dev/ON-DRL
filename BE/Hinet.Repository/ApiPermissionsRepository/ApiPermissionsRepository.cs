using Hinet.Model.Entities;
using Hinet.Model.Entities;
using Hinet.Model;


namespace Hinet.Repository.ApiPermissionsRepository
{
    public class ApiPermissionsRepository : Repository<ApiPermissions>, IApiPermissionsRepository
    {
        public ApiPermissionsRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

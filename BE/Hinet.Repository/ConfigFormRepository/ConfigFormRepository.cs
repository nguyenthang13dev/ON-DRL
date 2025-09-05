using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;
using Hinet.Model.Entities.ConfigAssign;
using Hinet.Model;


namespace Hinet.Repository.ConfigFormRepository
{
    public class ConfigFormRepository : Repository<ConfigForm>, IConfigFormRepository
    {
        public ConfigFormRepository(HinetMongoContext context) : base(context)
        {

        }
    }
}
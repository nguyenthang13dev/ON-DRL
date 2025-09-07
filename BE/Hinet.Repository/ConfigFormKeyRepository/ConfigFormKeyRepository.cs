using Hinet.Model;
using Hinet.Model.Entities.ConfigAssign;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.ConfigFormKeyRepository
{
    public class ConfigFormKeyRepository : Repository<ConfigFormKey>, IConfigFormKeyRepository
    {
        public ConfigFormKeyRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

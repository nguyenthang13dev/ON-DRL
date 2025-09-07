using Hinet.Model.Entities.ConfigAssign;
using Hinet.Service.Common.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.ConfigFormKeyService
{
    public interface IConfigFormKeyService : IService<ConfigFormKey>
    {
        Task<List<ConfigFormKey>> GetConfig(Guid ConfigId);
        Task<ConfigFormKey> GetConfigName(string name, Guid ConfigId);
    }
}

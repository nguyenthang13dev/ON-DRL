using Hinet.Model.Entities.ConfigAssign;
using Hinet.Repository;
using Hinet.Repository.ConfigFormKeyRepository;
using Hinet.Service.Common.Service;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.ConfigFormKeyService
{
    public class ConfigFormKeyService : Service<ConfigFormKey>, IConfigFormKeyService
    {
        private readonly IConfigFormKeyRepository _configFormKeyRepository;

        public ConfigFormKeyService(IRepository<ConfigFormKey> repository, IConfigFormKeyRepository configFormKeyRepository) : base(repository)
        {
            _configFormKeyRepository = configFormKeyRepository;
        }

        public async Task<ConfigFormKey> GetConfigName(string name, Guid ConfigId)
        {
            var query =  _configFormKeyRepository.GetQueryable()
                .Where(t => t.FormId.Id == ConfigId)
                                .FirstOrDefault(t => t.KTT_KEY == name);
            return query;
        }
        public async Task<List<ConfigFormKey>> GetConfig(Guid ConfigId)
        {
            var query =  _configFormKeyRepository.GetQueryable()
                            .Where(t => t.FormId.Id == ConfigId)
                            .ToList();
            return query;
        }




    }
}

using Hinet.Model.MongoEntities;
using Hinet.Repository;
using Hinet.Repository.SoLieuKeKhaiRepostiory;
using Hinet.Service.Common.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.SoLieuKeKhaiService
{
    public class SoLieuKeKhaiService : Service<SoLieuKeKhai>, ISoLieuKeKhaiService
    {
        public SoLieuKeKhaiService(IRepository<SoLieuKeKhai> repository) : base(repository)
        {

        }


        public async Task<List<SoLieuKeKhai>> GetConfsByFormId(Guid Id)
        {
            var res = GetQueryable()
                               .Where(x => x.ConfigForm.Id == Id).ToList();
            return res;
        }

        public async Task<List<SoLieuKeKhai>> GetConfsByFormIdAndUser(Guid Id, Guid UserId)
        {
            var res = GetQueryable()
                               .Where(x => x.ConfigForm.Id == Id && x.UserId.Id == UserId).ToList();
            return res;
        }
    }
}

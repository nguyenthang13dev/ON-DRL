using Hinet.Model;
using Hinet.Model.MongoEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.SoLieuKeKhaiRepostiory
{
    public class SoLieuKeKhaiRepository : Repository<SoLieuKeKhai>, ISoLieuKeKhaiRepository
    {
        public SoLieuKeKhaiRepository(HinetMongoContext context) : base(context)
        {

        }
    }
}

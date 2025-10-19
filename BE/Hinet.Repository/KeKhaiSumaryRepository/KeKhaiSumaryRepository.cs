using Hinet.Model;
using Hinet.Model.MongoEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.KeKhaiSumaryRepository
{
    public class KeKhaiSumaryRepository : Repository<KeKhaiSummary>, IKeKhaiSumaryRepository
    {
        public KeKhaiSumaryRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

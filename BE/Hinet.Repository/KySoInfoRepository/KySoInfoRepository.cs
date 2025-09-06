using MongoDB.Driver.Linq;
using Hinet.Model.Entities;
using Hinet.Model;


namespace Hinet.Repository.KySoInfoRepository
{
    public class KySoInfoRepository : Repository<KySoInfo>, IKySoInfoRepository
    {
        public KySoInfoRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

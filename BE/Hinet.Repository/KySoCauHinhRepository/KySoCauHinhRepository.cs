using MongoDB.Driver.Linq;
using Hinet.Model.Entities;
using Hinet.Model;


namespace Hinet.Repository.KySoCauHinhRepository
{
    public class KySoCauHinhRepository : Repository<KySoCauHinh>, IKySoCauHinhRepository
    {
        public KySoCauHinhRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

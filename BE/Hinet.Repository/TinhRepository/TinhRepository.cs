using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.TinhRepository
{
    public class TinhRepository : Repository<Tinh>, ITinhRepository
    {
        public TinhRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

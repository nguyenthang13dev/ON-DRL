using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.XaRepository
{
    public class XaRepository : Repository<Xa>, IXaRepository
    {
        public XaRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.HuyenRepository
{
    public class HuyenRepository : Repository<Huyen>, IHuyenRepository
    {
        public HuyenRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

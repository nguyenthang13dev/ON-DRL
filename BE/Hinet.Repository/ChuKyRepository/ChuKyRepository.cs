using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;
using Hinet.Model;


namespace Hinet.Repository.ChuKyRepository
{
    public class ChuKyRepository : Repository<ChuKy>, IChuKyRepository
    {
        public ChuKyRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;
using Hinet.Model.Entities.LuuTruBQP;


namespace Hinet.Repository.ArcFilePlanRepository
{
    public class ArcFilePlanRepository : Repository<ArcFilePlan>, IArcFilePlanRepository
    {
        public ArcFilePlanRepository(DbContext context) : base(context)
        {
        }
    }
}

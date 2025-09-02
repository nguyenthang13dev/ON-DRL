using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;
using Hinet.Model.Entities.LuuTruBQP;


namespace Hinet.Repository.ArcPlanRepository
{
    public class ArcPlanRepository : Repository<ArcPlan>, IArcPlanRepository
    {
        public ArcPlanRepository(DbContext context) : base(context)
        {
        }
    }
}

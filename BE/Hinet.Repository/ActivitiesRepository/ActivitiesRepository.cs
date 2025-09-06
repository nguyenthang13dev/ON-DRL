using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;
using Hinet.Model;


namespace Hinet.Repository.ActivitiesRepository
{
    public class ActivitiesRepository : Repository<Activities>, IActivitiesRepository
    {
        public ActivitiesRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.SystemLogsRepository
{
    public class SystemLogsRepository : Repository<SystemLogs>, ISystemLogsRepository
    {
        public SystemLogsRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

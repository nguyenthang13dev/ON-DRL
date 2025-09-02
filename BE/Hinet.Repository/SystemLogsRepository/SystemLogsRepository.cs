using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.SystemLogsRepository
{
    public class SystemLogsRepository : Repository<SystemLogs>, ISystemLogsRepository
    {
        public SystemLogsRepository(DbContext context) : base(context)
        {
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;
using Hinet.Model.Entities.LuuTruBQP;


namespace Hinet.Repository.ArcFileRepository
{
    public class ArcFileRepository : Repository<ArcFile>, IArcFileRepository
    {
        public ArcFileRepository(DbContext context) : base(context)
        {
        }
    }
}

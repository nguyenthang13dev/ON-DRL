using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;
using Hinet.Model.Entities.LuuTruBQP;


namespace Hinet.Repository.ArcFontRepository
{
    public class ArcFontRepository : Repository<ArcFont>, IArcFontRepository
    {
        public ArcFontRepository(DbContext context) : base(context)
        {
        }
    }
}

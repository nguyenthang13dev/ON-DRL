using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.GioiHanDiaChiMangRepository
{
    public class GioiHanDiaChiMangRepository : Repository<GioiHanDiaChiMang>, IGioiHanDiaChiMangRepository
    {
        public GioiHanDiaChiMangRepository(DbContext context) : base(context)
        {
        }
    }
}

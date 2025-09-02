using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.HuyenRepository
{
    public class HuyenRepository : Repository<Huyen>, IHuyenRepository
    {
        public HuyenRepository(DbContext context) : base(context)
        {
        }
    }
}

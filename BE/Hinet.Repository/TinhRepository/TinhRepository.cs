using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.TinhRepository
{
    public class TinhRepository : Repository<Tinh>, ITinhRepository
    {
        public TinhRepository(DbContext context) : base(context)
        {
        }
    }
}

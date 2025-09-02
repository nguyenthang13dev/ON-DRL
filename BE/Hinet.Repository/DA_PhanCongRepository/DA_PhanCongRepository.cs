using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.DA_PhanCongRepository
{
    public class DA_PhanCongRepository : Repository<DA_PhanCong>, IDA_PhanCongRepository
    {
        public DA_PhanCongRepository(DbContext context) : base(context)
        {
        }
    }
}

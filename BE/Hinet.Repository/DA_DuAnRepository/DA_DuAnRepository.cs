using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.DA_DuAnRepository
{
    public class DA_DuAnRepository : Repository<DA_DuAn>, IDA_DuAnRepository
    {
        public DA_DuAnRepository(DbContext context) : base(context)
        {
        }
    }
}

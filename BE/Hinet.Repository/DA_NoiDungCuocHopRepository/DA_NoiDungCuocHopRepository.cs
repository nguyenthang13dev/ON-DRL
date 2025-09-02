using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.DA_NoiDungCuocHopRepository
{
    public class DA_NoiDungCuocHopRepository : Repository<DA_NoiDungCuocHop>, IDA_NoiDungCuocHopRepository
    {
        public DA_NoiDungCuocHopRepository(DbContext context) : base(context)
        {
        }
    }
}

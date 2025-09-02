using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.DA_KeHoachThucHienRepository
{
    public class DA_KeHoachThucHienRepository : Repository<DA_KeHoachThucHien>, IDA_KeHoachThucHienRepository
    {
        public DA_KeHoachThucHienRepository(DbContext context) : base(context)
        {
        }
    }
}

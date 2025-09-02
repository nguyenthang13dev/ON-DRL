using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;
using Hinet.Model.Entities.QLNhanSu;


namespace Hinet.Repository.QLNhanSu.NS_HopDongLaoDongRepository
{
    public class NS_HopDongLaoDongRepository : Repository<NS_HopDongLaoDong>, INS_HopDongLaoDongRepository
    {
        public NS_HopDongLaoDongRepository(DbContext context) : base(context)
        {
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities.QLNhanSu;


namespace Hinet.Repository.QLNhanSu.NS_NhanSuRepository
{
    public class NS_NhanSuRepository : Repository<NS_NhanSu>, INS_NhanSuRepository
    {
        public NS_NhanSuRepository(DbContext context) : base(context)
        {
        }
    }
}

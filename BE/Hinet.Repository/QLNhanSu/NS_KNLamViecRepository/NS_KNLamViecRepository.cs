using Hinet.Model.Entities.QLNhanSu;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.QLNhanSu.NS_KNLamViecRepository
{
    public class NS_KNLamViecRepository : Repository<NS_KinhNghiemLamViec>,INS_KNLamViecRepository
    {
        public NS_KNLamViecRepository(DbContext context) : base(context)
        {
        }
    }
}

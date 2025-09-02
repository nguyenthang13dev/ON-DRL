using Hinet.Model.Entities.QLNhanSu;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.QLNhanSu.NS_ChamCongRepository
{
    public class NS_ChamCongRepository :  Repository<NS_ChamCong> , INS_ChamCongRepository
    {
        public NS_ChamCongRepository(DbContext context) : base(context)
        {
        }
    }
}

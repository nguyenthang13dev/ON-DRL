using Hinet.Model.Entities.QLNhanSu;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.QLNhanSu.NS_BangCapRepository
{
    public class NS_BangCapRepository : Repository<NS_BangCap>, INS_BangCapRepository
    {
        public NS_BangCapRepository(DbContext context) : base(context)
        {
        }
    }
}

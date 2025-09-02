using Hinet.Model.Entities.QLNhanSu;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.NS_NgayLeRepository
{
    public class NS_NgayLeRepository : Repository<NS_NgayLe>, INS_NgayLeRepository
    {
        public NS_NgayLeRepository(DbContext context) : base(context)
        {
        }
    }
}

using Hinet.Model.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.QLThongBaoRepository
{
    public class QLThongBaoRepository : Repository<QLThongBao>, IQLThongBaoRepository
    {
        public QLThongBaoRepository(DbContext context) : base(context)
        {
        }
    }

    
}

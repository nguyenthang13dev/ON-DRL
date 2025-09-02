using Hinet.Model.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.LienHeRepository
{
    public class LienHeRepository : Repository<LienHe>, ILienHeRepository
    {
        public LienHeRepository(DbContext context) : base(context)
        {
        }
         
    }
}

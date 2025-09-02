using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Model.Entities.DuAn;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Repository.DA_NhatKyTrienKhaiRepository
{
    public class DA_NhatKyTrienKhaiRepository : Repository<DA_NhatKyTrienKhai>, IDA_NhatKyTrienKhaiRepository
    {
        public DA_NhatKyTrienKhaiRepository(DbContext context) : base(context)
        {

        }
    }
}

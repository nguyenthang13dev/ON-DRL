using Hinet.Model.Entities.TuyenDung;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.TD_TuyenDungRepository
{
   public class TD_TuyenDungRepository : Repository<TD_TuyenDung>, ITD_TuyenDungRepository
    {
        public TD_TuyenDungRepository(DbContext context) : base(context)
        {
        }
    }
}

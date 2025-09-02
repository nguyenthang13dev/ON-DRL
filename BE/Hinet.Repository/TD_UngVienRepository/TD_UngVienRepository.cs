using Hinet.Model.Entities.TuyenDung;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.TD_UngVienRepository
{
    public class TD_UngVienRepository : Repository<TD_UngVien>, ITD_UngVienRepository
    {
        public TD_UngVienRepository(DbContext context) : base(context) { }
    }
}

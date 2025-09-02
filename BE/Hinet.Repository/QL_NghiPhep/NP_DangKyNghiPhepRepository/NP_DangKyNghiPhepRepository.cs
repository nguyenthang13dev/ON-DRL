using Hinet.Model.Entities.NghiPhep;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.NghiPhep.NP_DonXinNghiPhepRepository
{
    public class NP_DangKyNghiPhepRepository : Repository<NP_DangKyNghiPhep>, INP_DangKyNghiPhepRepository
    {
        public NP_DangKyNghiPhepRepository(DbContext context) : base(context)
        {
        }
    }
}

using Hinet.Model.Entities.NghiPhep;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.NghiPhep.NP_LoaiNghiPhepRepository
{
    public class NP_LoaiNghiPhepRepository : Repository<NP_LoaiNghiPhep>, INP_LoaiNghiPhepRepository
    {
        public NP_LoaiNghiPhepRepository(DbContext context) : base(context)
        {
        }
    }
}

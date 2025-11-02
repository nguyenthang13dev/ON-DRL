using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Model.MongoEntities;
using Hinet.Model;
using Hinet.Repository.LopHocPhanRepository;

namespace Hinet.Repository.SinhVienRepository
{
    public class SinhVienRepository : Repository<SinhVien>, ISinhVienRepository
    {
        public SinhVienRepository(HinetMongoContext context) : base(context)
        {
        }



    }
}

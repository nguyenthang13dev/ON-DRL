using Hinet.Model;
using Hinet.Model.MongoEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.HoatDongNgoaiKhoaRepository
{
    public class HoatDongNgoaiKhoaRepository : Repository<HoatDongNgoaiKhoa>, IHoatDongNgoaiKhoaRepository
    {
        public HoatDongNgoaiKhoaRepository(HinetMongoContext context) : base(context)
        {

        }
    }
}

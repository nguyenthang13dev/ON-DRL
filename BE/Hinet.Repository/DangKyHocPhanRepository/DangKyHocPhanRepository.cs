// Hinet.Repository/DangKyHocPhanRepository/DangKyHocPhanRepository.cs
using Hinet.Model;
using Hinet.Model.MongoEntities;

namespace Hinet.Repository.DangKyHocPhanRepository
{
    public class DangKyHocPhanRepository : Repository<DangKyHocPhan>, IDangKyHocPhanRepository
    {
        public DangKyHocPhanRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

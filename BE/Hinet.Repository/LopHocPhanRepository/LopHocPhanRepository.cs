// Hinet.Repository/LopHocPhanRepository/LopHocPhanRepository.cs
using Hinet.Model;
using Hinet.Model.MongoEntities;

namespace Hinet.Repository.LopHocPhanRepository
{
    public class LopHocPhanRepository : Repository<LopHocPhan>, ILopHocPhanRepository
    {
        public LopHocPhanRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

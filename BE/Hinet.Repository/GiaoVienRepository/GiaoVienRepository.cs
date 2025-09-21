// Hinet.Repository/GiaoVienRepository/GiaoVienRepository.cs
using Hinet.Model;
using Hinet.Model.MongoEntities;

namespace Hinet.Repository.GiaoVienRepository
{
    public class GiaoVienRepository : Repository<GiaoVien>, IGiaoVienRepository
    {
        public GiaoVienRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}


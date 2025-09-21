// Hinet.Repository/LopHanhChinhRepository/LopHanhChinhRepository.cs
using Hinet.Model;
using Hinet.Model.MongoEntities;

namespace Hinet.Repository.LopHanhChinhRepository
{
    public class LopHanhChinhRepository : Repository<LopHanhChinh>, ILopHanhChinhRepository
    {
        public LopHanhChinhRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}


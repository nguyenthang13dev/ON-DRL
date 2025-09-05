// Hinet.Repository/KhoaRepository/KhoaRepository.cs
using Hinet.Model;
using Hinet.Model.MongoEntities;

namespace Hinet.Repository.KhoaRepository
{
    public class KhoaRepository : Repository<Khoa>, IKhoaRepository
    {
        public KhoaRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

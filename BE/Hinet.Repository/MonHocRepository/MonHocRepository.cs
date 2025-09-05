// Hinet.Repository/MonHocRepository/MonHocRepository.cs
using Hinet.Model;
using Hinet.Model.MongoEntities;

namespace Hinet.Repository.MonHocRepository
{
    public class MonHocRepository : Repository<MonHoc>, IMonHocRepository
    {
        public MonHocRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

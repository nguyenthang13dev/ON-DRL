using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.UC_UseCaseMongoRepository
{
    public class UC_UseCaseMongoRepository : MongoRepository<UC_UseCase>, IUC_UseCaseMongoRepository
    {
        public UC_UseCaseMongoRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

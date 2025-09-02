using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.UC_MoTa_UseCaseMongoRepository
{
    public class UC_MoTa_UseCaseMongoRepository : MongoRepository<UC_MoTa_UseCase>, IUC_MoTa_UseCaseMongoRepository
    {
        public UC_MoTa_UseCaseMongoRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

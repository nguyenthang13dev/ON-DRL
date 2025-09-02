using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.NhomUseCaseMongoRepository
{
    public class NhomUseCaseMongoRepository : MongoRepository<NhomUseCase>, INhomUseCaseMongoRepository
    {
        public NhomUseCaseMongoRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.OperationRepository
{
    public class OperationRepository : Repository<Operation>, IOperationRepository
    {
        public OperationRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

using Hinet.Model;
using Hinet.Model.MongoEntities;


namespace Hinet.Repository.FormResponseRepository
{
    public class FormResponseRepository : Repository<FormResponse>, IFormResponseRepository
    {
        public FormResponseRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

using Hinet.Model;
using Hinet.Model.MongoEntities;


namespace Hinet.Repository.FieldDefinitionRepository
{
    public class FieldDefinitionRepository : Repository<FieldDefinition>, IFieldDefinitionRepository
    {
        public FieldDefinitionRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

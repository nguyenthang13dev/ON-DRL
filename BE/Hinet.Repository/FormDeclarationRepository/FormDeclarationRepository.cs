using Hinet.Model;
using Hinet.Model.MongoEntities;


namespace Hinet.Repository.FormDeclarationRepository
{
    public class FormDeclarationRepository : Repository<FormDeclaration>, IFormDeclarationRepository
    {
        public FormDeclarationRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

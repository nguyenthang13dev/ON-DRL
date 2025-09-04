using Hinet.Model;
using Hinet.Model.MongoEntities;


namespace Hinet.Repository.FormTemplateRepository
{
    public class FormTemplateRepository : Repository<FormTemplate>, IFormTemplateRepository
    {
        public FormTemplateRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

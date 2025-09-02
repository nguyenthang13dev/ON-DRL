using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.UC_TemplateTestCaseMongoRepository
{
    public class UC_TemplateTestCaseMongoRepository : MongoRepository<UC_TemplateTestCase>, IUC_TemplateTestCaseMongoRepository
    {
        public UC_TemplateTestCaseMongoRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

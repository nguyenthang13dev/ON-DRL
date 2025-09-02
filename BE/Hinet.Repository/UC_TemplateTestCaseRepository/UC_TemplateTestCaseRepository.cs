using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.UC_TemplateTestCaseRepository
{
    public class UC_TemplateTestCaseRepository : Repository<UC_TemplateTestCase>, IUC_TemplateTestCaseRepository
    {
        public UC_TemplateTestCaseRepository(DbContext context) : base(context)
        {
        }
    }
}

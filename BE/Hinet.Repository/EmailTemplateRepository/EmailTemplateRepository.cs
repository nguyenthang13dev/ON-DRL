using Hinet.Model;
using Hinet.Model.Entities;

namespace Hinet.Repository.EmailTemplateRepository
{
    public class EmailTemplateRepository : Repository<EmailTemplate>, IEmailTemplateRepository
    {
        public EmailTemplateRepository(HinetContext dbContext) : base(dbContext)
        {
        }
    }
}


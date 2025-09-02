using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.EmailThongBaoRepository
{
    public class EmailThongBaoRepository : Repository<EmailThongBao>, IEmailThongBaoRepository
    {
        public EmailThongBaoRepository(DbContext context) : base(context)
        {
        }
    }
}

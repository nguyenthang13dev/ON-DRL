using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hinet.Model;
using Hinet.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Repository.KeyEmailTemplateRepository
{
    public class KeyEmailTemplateRepository : Repository<KeyEmailTemplate>, IKeyEmailTemplateRepository
    {
        public KeyEmailTemplateRepository(HinetContext context) : base(context)
        {
        }
    }
}
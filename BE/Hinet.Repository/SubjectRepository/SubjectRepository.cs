using Hinet.Model;
using Hinet.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Repository.SubjectRepository
{
    public class SubjectRepository : Repository<Subject>, ISubjectRepository
    {
        public SubjectRepository(HinetMongoContext context) : base(context)
        {

        }
    }
}

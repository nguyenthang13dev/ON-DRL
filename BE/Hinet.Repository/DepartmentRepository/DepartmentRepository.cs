using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.DepartmentRepository
{
    public class DepartmentRepository : Repository<Department>, IDepartmentRepository
    {
        public DepartmentRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

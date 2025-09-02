using Hinet.Model;
using Hinet.Model.Entities.DA_Test_Case;
using Hinet.Repository.Common;

namespace Hinet.Repository.UC_UseCaseDemoRepository
{
    public class UC_UseCaseDemoRepository : Repository<UC_UseCaseDemo>, IUC_UseCaseDemoRepository
    {
        public UC_UseCaseDemoRepository(HinetContext dbContext) : base(dbContext)
        {
        }
    }
}
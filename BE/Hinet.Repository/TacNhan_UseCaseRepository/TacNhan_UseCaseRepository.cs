using Hinet.Model;
using Hinet.Model.Entities.DA_Test_Case;
using Hinet.Repository.Common;

namespace Hinet.Repository.TacNhan_UseCaseRepository
{
    public class TacNhan_UseCaseRepository : Repository<TacNhan_UseCase>, ITacNhan_UseCaseRepository
    {
        public TacNhan_UseCaseRepository(HinetContext dbContext) : base(dbContext)
        {
        }
    }
}
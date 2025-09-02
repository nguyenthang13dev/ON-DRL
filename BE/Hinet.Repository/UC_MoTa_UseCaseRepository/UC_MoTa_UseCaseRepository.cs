using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.UC_MoTa_UseCaseRepository
{
    public class UC_MoTa_UseCaseRepository : Repository<UC_MoTa_UseCase>, IUC_MoTa_UseCaseRepository
    {
        public UC_MoTa_UseCaseRepository(DbContext context) : base(context)
        {
        }
    }
}

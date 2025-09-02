using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.UC_UseCaseRepository
{
    public class UC_UseCaseRepository : Repository<UC_UseCase>, IUC_UseCaseRepository
    {
        public UC_UseCaseRepository(DbContext context) : base(context)
        {
        }
    }
}

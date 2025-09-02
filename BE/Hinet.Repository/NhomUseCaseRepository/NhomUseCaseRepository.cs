using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.NhomUseCaseRepository
{
    public class NhomUseCaseRepository : Repository<NhomUseCase>, INhomUseCaseRepository
    {
        public NhomUseCaseRepository(DbContext context) : base(context)
        {
        }
    }
}

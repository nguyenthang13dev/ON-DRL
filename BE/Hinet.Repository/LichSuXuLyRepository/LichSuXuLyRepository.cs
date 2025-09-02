using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;

namespace Hinet.Repository.LichSuXuLyRepository
{
    public class LichSuXuLyRepository : Repository<LichSuXuLy>, ILichSuXuLyRepository
    {
        public LichSuXuLyRepository(DbContext context) : base(context)
        {
        }
    }
}
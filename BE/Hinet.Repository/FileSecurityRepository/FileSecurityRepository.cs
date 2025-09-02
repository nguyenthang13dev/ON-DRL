using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;


namespace Hinet.Repository.FileSecurityRepository
{
    public class FileSecurityRepository : Repository<FileSecurity>, IFileSecurityRepository
    {
        public FileSecurityRepository(DbContext context) : base(context)
        {
        }
    }
}

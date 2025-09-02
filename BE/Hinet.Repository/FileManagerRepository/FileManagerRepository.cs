using Hinet.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Repository.FileManagerRepository
{
    public class FileManagerRepository : Repository<FileManager>, IFileManagerRepository
    {
        public FileManagerRepository(DbContext context) : base(context)
        {
        }
    }
}
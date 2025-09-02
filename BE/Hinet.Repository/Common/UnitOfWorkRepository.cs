using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace Hinet.Repository.Common
{
    public class UnitOfWorkRepository : IUnitOfWorkRepository
    {
        private DbContext dbContext;
        private IDbContextTransaction _transaction;

        public UnitOfWorkRepository(DbContext context)
        {
            dbContext = context;
        }

        public IDbContextTransaction CreateTransaction()
        {
            _transaction = dbContext.Database.BeginTransaction();
            return _transaction;
        }

        public async Task<int> Save() // <--- Bổ sung
        {
            return await dbContext.SaveChangesAsync();
        }

        public async Task Commit()
        {
            await dbContext.SaveChangesAsync(); // <--- Ghi lại thay đổi
            if (_transaction != null)
            {
                await _transaction.CommitAsync(); // <--- Commit transaction đúng cách
            }
        }

        //public void Dispose()
        //{
        //    Dispose(true);
        //    GC.SuppressFinalize(this);
        //}

        private void Dispose(bool disposing)
        {
            if (disposing)
            {
                _transaction?.Dispose(); // <--- Đảm bảo dispose transaction
                dbContext?.Dispose();
                dbContext = null;
            }
        }

        public DbContext Context()
        {
            return dbContext;
        }

          public    async Task Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        public async Task RollBack()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
            }
        }
    }
}

using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Hinet.Repository
{
    public class Repository<T> : IRepository<T> where T : class, IEntity
    {
        protected DbContext _entities;
        protected readonly DbSet<T> _dbset;

        public Repository(DbContext context)
        {
            _entities = context;
            _dbset = context.Set<T>();
        }

        public virtual DbSet<T> DBSet()
        {
            return _dbset;
        }
        public async Task SaveChangesAsync()
        {
            await _entities.SaveChangesAsync();
        }
        public async Task<T?> GetByIdAsync(Guid? id)
        {
            return await _dbset.FindAsync(id);
        }
        public virtual IEnumerable<T> GetAll()
        {
            return _dbset.AsEnumerable<T>();
        }
        public void AddRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                TrimStringProperties(entity);
            }

            _dbset.AddRange(entities);
        }
        public virtual IQueryable<T> GetQueryable()
        {
            return _dbset.AsNoTracking().AsQueryable();
        }
        public virtual IQueryable<T> GetQueryableWithTracking()
        {
            return _dbset.AsQueryable();
        }
        public IQueryable<T> Where(Expression<Func<T, bool>> predicate)
        {
            return GetQueryable().Where(predicate);
        }

        public virtual T Add(T entity)
        {
            return _dbset.Add(entity).Entity;
        }

        public virtual T Delete(T entity)
        {
            return _dbset.Remove(entity).Entity;
        }

        public virtual void Update(T entity)
        {
            var entry = _entities.Entry(entity);
            entry.State = EntityState.Modified;
            if (entry.Properties.Any(p => p.Metadata.Name == "CreatedDate"))
            {
                entry.Property("CreatedDate").IsModified = false;
            }
        }

        public virtual void UpdateRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                var entry = _entities.Entry(entity);
                entry.State = EntityState.Modified;
                if (entry.Properties.Any(p => p.Metadata.Name == "CreatedDate"))
                {
                    entry.Property("CreatedDate").IsModified = false;
                }
            }
        }

        public virtual async Task SaveAsync()
        {
            await _entities.SaveChangesAsync();
        }



        public void CreateRange(IEnumerable<T> entities)
        {
            _entities.Set<T>().AddRange(entities);
        }

        public Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
        {
            return _dbset.AnyAsync(predicate);
        }

        public void Delete(Expression<Func<T, bool>> filter)
        {
            var entities = _dbset.Where(filter);
            _dbset.RemoveRange(entities);
        }

        public void DeleteRange(IEnumerable<T> entities)
        {
            _dbset.RemoveRange(entities);
        }


        public IEnumerable<T> FindBy(Expression<Func<T, bool>> predicate)
        {
            IEnumerable<T> query = _dbset.Where(predicate).AsEnumerable();
            return query;
        }

        public async Task InsertRange(List<T> entities)
        {
            if (entities != null && entities.Any())
            {
                await _entities.Set<T>().AddRangeAsync(entities);
                await SaveAsync();
            }
        }


        #region Private method
        private void TrimStringProperties(T entity)
        {
            var properties = typeof(T).GetProperties()
                .Where(p => p.PropertyType == typeof(string) &&
                            p is { CanRead: true, CanWrite: true });

            foreach (var prop in properties)
            {
                if (prop.GetValue(entity) is string value)
                {
                    if (string.IsNullOrWhiteSpace(value))
                    {
                        continue;
                    }

                    prop.SetValue(entity, value.Trim());
                }
            }
        }
        #endregion

    }
}

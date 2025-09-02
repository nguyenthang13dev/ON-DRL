using Hinet.Model.Entities;
using System.Linq.Expressions;

namespace Hinet.Repository
{
    public interface IRepository<T> where T : class, IEntity
    {
        Task<T?> GetByIdAsync(Guid? id);

        IEnumerable<T> GetAll();
        IQueryable<T> GetQueryable();
        IQueryable<T> GetQueryableWithTracking();
        IEnumerable<T> FindBy(Expression<Func<T, bool>> predicate);
        IQueryable<T> Where(Expression<Func<T, bool>> predicate);
        T Add(T entity);
        void AddRange(IEnumerable<T> entities);
        T Delete(T entity);

        void Update(T entity);
        void  UpdateRange(IEnumerable<T> entity);

        Task SaveAsync();

        Task<bool> AnyAsync(Expression<Func<T, bool>> predicate);
        Task SaveChangesAsync();
        void Delete(Expression<Func<T, bool>> filter);
        void DeleteRange(IEnumerable<T> entities);
        Task InsertRange(List<T> entities);


    }
}

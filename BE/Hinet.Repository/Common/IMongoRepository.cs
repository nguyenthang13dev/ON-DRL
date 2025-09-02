using MongoDB.Driver.Linq;
using Hinet.Model.Entities;
using System.Linq.Expressions;

namespace Hinet.Repository
{
    public interface IMongoRepository<T> where T : IEntity
    {
        IQueryable<T> GetQueryable();
        Task<IEnumerable<T>> FindBy(Expression<Func<T, bool>> predicate);
        Task<T> CreateAsync(T entity);
        Task<IEnumerable<T>> CreateAsync(IEnumerable<T> entities);
        Task<T> UpdateAsync(T entity);
        Task<IEnumerable<T>> UpdateAsync(IEnumerable<T> entities);
        Task<T> DeleteAsync(T entity);
        Task<T?> GetByIdAsync(Guid? id);
        Task DeleteAsync(IEnumerable<T> entities);
    }
}

using Hinet.Model.Entities;
using Hinet.Service.Common.Dtos;
using Hinet.Service.Dto;
using MongoDB.Driver.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Hinet.Service.Common.Service
{
    public interface IService<T> where T : IEntity
    {
        Task<T?> GetByIdAsync(Guid? guid);
        Task<T> GetByIdOrThrowAsync(Guid? guid);
        Task CreateAsync(T entity);
        Task CreateAsync(IEnumerable<T> entities);
        Task UpdateAsync(T entity);
        Task UpdateAsync(IEnumerable<T> entities);
        Task DeleteAsync(T entity);
        Task DeleteAsync(IEnumerable<T> entities);
        IMongoQueryable<T> GetQueryable();
        IQueryable<T> GetInMemoryQueryable();
        IMongoQueryable<T> Where(Expression<Func<T, bool>> predicate);
        IEnumerable<T> FindBy(Expression<Func<T, bool>> predicate);
        Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate);
        Task<int> Count(Expression<Func<T, bool>> predicate);

        Task<List<DropdownOption>> GetDropDown(string labelField, string valueField);
    }
}

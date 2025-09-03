using MongoDB.Driver.Linq;
using Hinet.Model.Entities;
using Hinet.Repository;
using System.Linq.Expressions;
using System.ComponentModel;
using System.Reflection;
using System;
using Hinet.Service.Common.Dtos;
using Hinet.Service.Dto;
using MongoDB.Driver.Linq;
using MongoDB.Driver;

namespace Hinet.Service.Common.Service
{
    public class Service<T> : IService<T> where T : IEntity
    {
        private readonly IRepository<T> _repository;
        public Service(IRepository<T> repository)
        {
            _repository = repository;
        }

        public virtual async Task<T?> GetByIdAsync(Guid? guid)
        {
            try
            {
                if (guid == null)
                {
                    return default;
                }
                return await _repository.GetByIdAsync(guid.Value);

            }
            catch (Exception)
            {
                return default;
            }

        }
        public async Task<T> GetByIdOrThrowAsync(Guid? guid)
        {
            var entity = await GetByIdAsync(guid);
            if (entity == null)
            {
                string entityName = typeof(T).Name;
                var displayNameAttribute = typeof(T).GetCustomAttribute<DisplayNameAttribute>();
                if (displayNameAttribute != null)
                {
                    entityName = displayNameAttribute.DisplayName;
                }
                throw new Exception($"Không tìm thấy {entityName} với Id {guid}");
            }
            return entity;
        }
        public virtual async Task CreateAsync(T entity)
        {
            await _repository.CreateAsync(entity);
        }

        public virtual async Task CreateAsync(IEnumerable<T> entities)
        {
            await _repository.CreateAsync(entities);
        }

        public virtual async Task UpdateAsync(T entity)
        {
            await _repository.UpdateAsync(entity);
        }

        public virtual async Task UpdateAsync(IEnumerable<T> entities)
        {
            await _repository.UpdateAsync(entities);
        }
        public virtual async Task DeleteAsync(T entity)
        {
            await _repository.DeleteAsync(entity);
        }
        public virtual async Task DeleteAsync(IEnumerable<T> entities)
        {
            await _repository.DeleteAsync(entities);
        }
        public IMongoQueryable<T> GetQueryable()
        {
            return _repository.GetQueryable();
        }

        public IMongoQueryable<T> Where(Expression<Func<T, bool>> predicate)
        {
            return _repository.GetQueryable().Where(predicate);
        }
        public IEnumerable<T> FindBy(Expression<Func<T, bool>> predicate)
        {
            return Where(predicate).AsEnumerable();
        }
        public async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            return await _repository.GetQueryable().FirstOrDefaultAsync(predicate);
        }
        public async Task<int> Count(Expression<Func<T, bool>> predicate)
        {
            return await _repository.GetQueryable().CountAsync(predicate);
        }

        public async Task<List<DropdownOption>> GetDropDown(string labelField, string valueField)
        {
            var query = _repository.GetQueryable();
            var param = Expression.Parameter(typeof(T), "t");

            // Lấy thuộc tính cho Label
            var labelProperty = Expression.PropertyOrField(param, labelField);
            var labelToString = Expression.Condition(
                Expression.Equal(labelProperty, Expression.Constant(null)), // Nếu null
                Expression.Constant(""), // Gán chuỗi rỗng
                Expression.Call(labelProperty, typeof(object).GetMethod("ToString") ?? throw new InvalidOperationException())
            );

            // Lấy thuộc tính cho Value (giữ nguyên kiểu dữ liệu gốc)
            var valueProperty = Expression.PropertyOrField(param, valueField);
            var valueConvert = Expression.Convert(valueProperty, typeof(object));

            // Biểu thức Lambda cho Select
            var selectExpression = Expression.Lambda<Func<T, DropdownOption>>(
                Expression.MemberInit(
                    Expression.New(typeof(DropdownOption)),
                    Expression.Bind(typeof(DropdownOption).GetProperty("Label"), labelToString),
                    Expression.Bind(typeof(DropdownOption).GetProperty("Value"), valueConvert) // Không dùng ToString()
                ),
                param
            );

            return await query.Select(selectExpression).ToListAsync();
        }


    }
}

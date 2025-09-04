using Hinet.Service.Dto;
using MongoDB.Driver.Linq;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Service.Common
{
    public class PagedList<T>
    {
        public PagedList(List<T> items, int pageIndex, int pageSize, int totalCount)
        {
            Items = items;
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalCount = totalCount;
        }

        public List<T> Items { get; set; }
        public int PageIndex { get; }
        public int PageSize { get; }
        public int TotalCount { get; }
        public int TotalPage => (int)Math.Ceiling(TotalCount / (double)PageSize);

        // MongoDB
        public static async Task<PagedList<T>> CreateEfAsync(IQueryable<T> query, SearchBase search)
        {
            // Dành cho EF Core DbSet
            var totalCount = await EntityFrameworkQueryableExtensions.CountAsync(query);
            var items = await EntityFrameworkQueryableExtensions.ToListAsync(
                query.Skip((search.PageIndex - 1) * search.PageSize)
                     .Take(search.PageSize)
            );
            return new PagedList<T>(items, search.PageIndex, search.PageSize, totalCount);
        }

        public static async Task<PagedList<T>> CreateAsync(IMongoQueryable<T> query, SearchBase search)
        {
            var totalCount =  query.Count();
            var items = query
                .Skip((search.PageIndex - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToList(); // MongoDB ToListAsync
            return new PagedList<T>(items, search.PageIndex, search.PageSize, totalCount);
        }

        public static Task<PagedList<T>> CreateMemoryAsync(IQueryable<T> query, SearchBase search)
        {
            var totalCount = query.Count();
            var items = query.Skip((search.PageIndex - 1) * search.PageSize)
                             .Take(search.PageSize)
                             .ToList(); // sync
            return Task.FromResult(new PagedList<T>(items, search.PageIndex, search.PageSize, totalCount));
        }

    }
}

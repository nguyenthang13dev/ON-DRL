using Hinet.Model.Entities;
using Hinet.Repository.TinhRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.TinhService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using MongoDB.Driver.Linq;
using MongoDB.Driver;
using Hinet.Repository;
using Hinet.Service.TypeDanhMucService.Dto;

namespace Hinet.Service.TypeDanhMucService
{
    public class TypeDanhMucService : Service<TypeDanhMuc>, ITypeDanhMucService
    {
        public TypeDanhMucService(IRepository<TypeDanhMuc> repository) : base(repository)
        {

        }
        public async Task<PagedList<TypeDanhMucDto>> GetData(TypeDanhMucSearch search)
        {
            try
            {
                var query = from q in GetQueryable()
                            select new TypeDanhMucDto()
                            {
                                Id = q.Id,
                                Name = q.Name,
                                Type = q.Type,
                                CodeDm = q.CodeDm,
                                Min = q.Min,
                                Max = q.Max, 
                                UpdatedDate = q.UpdatedDate,
                                CreatedDate = q.CreatedDate
                            };

                if (search != null)
                {
                    
                }

                query = query.OrderByDescending(x => x.CreatedDate);
                return await PagedList<TypeDanhMucDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message, ex);
            }
        }

        public async Task<TypeDanhMucDto> GetDto(Guid id)
        {
            try
            {
                var item = await (from q in GetQueryable().Where(x => x.Id == id)
                                  select new TypeDanhMucDto()
                                  {
                                      Id = q.Id,
                                      CreatedDate = q.CreatedDate,
                                  }).FirstOrDefaultAsync()
                                  ?? throw new Exception($"No Tinh found with ID {id}");

                return item;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve Tinh with ID {id}: " + ex.Message, ex);
            }
        }

        public async Task<List<DropdownOption>> GetDropdown()
        {
            try
            {
                var datas = await (from q in GetQueryable()
                                   select new DropdownOption()
                                   {
                                       Value = q.Type,
                                       Label = q.Name,
                                   }).ToListAsync();

                return datas;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve dropdown options: " + ex.Message, ex);
            }
        }
    }
}
using Hinet.Model.Entities;
using Hinet.Repository.TinhRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.TinhService.Dto;
using Hinet.Service.Common;
using Microsoft.EntityFrameworkCore;
using Hinet.Service.Dto;

namespace Hinet.Service.TinhService
{
    public class TinhService : Service<Tinh>, ITinhService
    {
        public TinhService(
            ITinhRepository tinhRepository
            ) : base(tinhRepository)
        {
        }

        public async Task<PagedList<TinhDto>> GetData(TinhSearch search)
        {
            try
            {
                var query = from q in GetQueryable()
                            select new TinhDto()
                            {
                                Id = q.Id,
                                TenTinh = q.TenTinh,
                                MaTinh = q.MaTinh,
                                Loai = q.Loai,
                                UpdatedDate = q.UpdatedDate,
                                CreatedDate = q.CreatedDate
                            };

                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.TenTinh))
                    {
                        query = query.Where(x => !string.IsNullOrEmpty(x.TenTinh) && x.TenTinh.Contains(search.TenTinh));
                    }
                    if (!string.IsNullOrEmpty(search.MaTinh))
                    {
                        query = query.Where(x => !string.IsNullOrEmpty(x.MaTinh) && x.MaTinh.Contains(search.MaTinh));
                    }
                    if (!string.IsNullOrEmpty(search.Loai))
                    {
                        query = query.Where(x => x.Loai == search.Loai);
                    }
                }

                query = query.OrderByDescending(x => x.CreatedDate);
                return await PagedList<TinhDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message, ex);
            }
        }

        public async Task<TinhDto> GetDto(Guid id)
        {
            try
            {
                var item = await (from q in GetQueryable().Where(x => x.Id == id)
                                  select new TinhDto()
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
                                       Value = q.MaTinh,
                                       Label = q.TenTinh,
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
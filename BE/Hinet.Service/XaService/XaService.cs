using Hinet.Model.Entities;
using Hinet.Repository.XaRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.XaService.Dto;
using Hinet.Service.Common;
using Hinet.Model.Entities;
using Hinet.Service.Dto;
using MongoDB.Driver.Linq;

namespace Hinet.Service.XaService
{
    public class XaService : Service<Xa>, IXaService
    {
        public XaService(IXaRepository xaRepository) : base(xaRepository)
        {
        }

        public async Task<PagedList<XaDto>> GetData(XaSearch search)
        {
            try
            {
                var query = from q in GetQueryable()
                            select new XaDto
                            {
                                CreatedId = q.CreatedId,
                                UpdatedId = q.UpdatedId,
                                TenXa = q.TenXa,
                                MaXa = q.MaXa,
                                MaHuyen = q.MaHuyen,
                                Loai = q.Loai,
                                CreatedBy = q.CreatedBy,
                                UpdatedBy = q.UpdatedBy,
                                DeleteId = q.DeleteId,
                                CreatedDate = q.CreatedDate,
                                UpdatedDate = q.UpdatedDate,
                                DeleteTime = q.DeleteTime,
                                IsDelete = q.IsDelete,
                                Id = q.Id,
                            };

                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.MaHuyen))
                    {
                        query = query.Where(x => x.MaHuyen == search.MaHuyen);
                    }
                    if (!string.IsNullOrEmpty(search.MaXa))
                    {
                        query = query.Where(x => x.MaXa.Contains(search.MaXa));
                    }
                    if (!string.IsNullOrEmpty(search.TenXa))
                    {
                        query = query.Where(x => x.TenXa.Contains(search.TenXa));
                    }
                }

                query = query.OrderByDescending(x => x.CreatedDate);
                return await PagedList<XaDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve Xa data: " + ex.Message);
            }
        }

        public async Task<XaDto> GetDto(Guid id)
        {
            try
            {
                var item = await (from q in GetQueryable().Where(x => x.Id == id)
                                  select new XaDto
                                  {
                                      CreatedId = q.CreatedId,
                                      UpdatedId = q.UpdatedId,
                                      TenXa = q.TenXa,
                                      MaXa = q.MaXa,
                                      MaHuyen = q.MaHuyen,
                                      Loai = q.Loai,
                                      CreatedBy = q.CreatedBy,
                                      UpdatedBy = q.UpdatedBy,
                                      DeleteId = q.DeleteId,
                                      CreatedDate = q.CreatedDate,
                                      UpdatedDate = q.UpdatedDate,
                                      DeleteTime = q.DeleteTime,
                                      IsDelete = q.IsDelete,
                                      Id = q.Id,
                                  }).FirstOrDefaultAsync() ?? throw new Exception("Xa not found");

                return item;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve Xa DTO: " + ex.Message);
            }
        }

        public async Task<List<DropdownOption>> GetDropdownByMaHuyen(string MaHuyen)
        {
            try
            {
                var data = GetQueryable()
                    .Where(x => x.MaHuyen == MaHuyen)
                    .Select(x => new DropdownOption
                    {
                        Label = x.TenXa,
                        Value = x.MaXa,
                    }).ToList();

                return data;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve dropdown data by MaHuyen: " + ex.Message);
            }
        }
    }
}
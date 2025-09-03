using Hinet.Model.Entities;
using Hinet.Repository.HuyenRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.HuyenService.Dto;
using Hinet.Service.Common;
using Hinet.Model.Entities;
using System.Net.WebSockets;
using Microsoft.IdentityModel.Tokens;
using Hinet.Service.Dto;
using MongoDB.Driver.Linq;

namespace Hinet.Service.HuyenService
{
    public class HuyenService : Service<Huyen>, IHuyenService
    {
        public HuyenService(
            IHuyenRepository huyenRepository) : base(huyenRepository)
        {
        }

        public async Task<PagedList<HuyenDto>> GetData(HuyenSearch search)
        {
            try
            {
                var query = from q in GetQueryable()
                            select new HuyenDto
                            {
                                CreatedId = q.CreatedId,
                                UpdatedId = q.UpdatedId,
                                TenHuyen = q.TenHuyen,
                                MaHuyen = q.MaHuyen,
                                MaTinh = q.MaTinh,
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
                    if (!string.IsNullOrEmpty(search.MaTinh))
                        query = query.Where(x => x.MaTinh.Contains(search.MaTinh));

                    if (!string.IsNullOrEmpty(search.MaHuyen))
                        query = query.Where(x => x.MaHuyen.Contains(search.MaHuyen));

                    if (!string.IsNullOrEmpty(search.TenHuyen))
                        query = query.Where(x => x.TenHuyen.Contains(search.TenHuyen));
                }

                query = query.OrderByDescending(x => x.CreatedDate);
                return await PagedList<HuyenDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve huyen data: " + ex.Message);
            }
        }

        public async Task<HuyenDto> GetDto(Guid id)
        {
            try
            {
                var item = await (from q in GetQueryable().Where(x => x.Id == id)
                                  select new HuyenDto
                                  {
                                      CreatedId = q.CreatedId,
                                      UpdatedId = q.UpdatedId,
                                      TenHuyen = q.TenHuyen,
                                      MaHuyen = q.MaHuyen,
                                      MaTinh = q.MaTinh,
                                      Loai = q.Loai,
                                      CreatedBy = q.CreatedBy,
                                      UpdatedBy = q.UpdatedBy,
                                      DeleteId = q.DeleteId,
                                      CreatedDate = q.CreatedDate,
                                      UpdatedDate = q.UpdatedDate,
                                      DeleteTime = q.DeleteTime,
                                      IsDelete = q.IsDelete,
                                      Id = q.Id,
                                  }).FirstOrDefaultAsync();

                return item ?? throw new Exception("Huyen not found for ID: " + id);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve huyen DTO: " + ex.Message);
            }
        }

        public async Task<List<DropdownOption>> GetDropdownByMaTinh(string MaTinh)
        {
            try
            {
                return await Task.Run(() => GetQueryable()
                    .Where(x => x.MaTinh == MaTinh)
                    .Select(x => new DropdownOption
                    {
                        Label = x.TenHuyen,
                        Value = x.MaHuyen,
                    }).ToList());
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve dropdown options by MaTinh: " + ex.Message);
            }
        }
    }
}
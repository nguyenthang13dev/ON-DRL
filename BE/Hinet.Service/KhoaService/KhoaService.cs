// Hinet.Service/KhoaService/KhoaService.cs
using System;
using System.Linq.Expressions;
using Hinet.Model.MongoEntities;
using Hinet.Repository.KhoaRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Core.Mapper;
using Hinet.Service.KhoaService.Dto;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Hinet.Service.KhoaService
{
    public class KhoaService : Service<Khoa>, IKhoaService
    {
        private readonly IKhoaRepository _khoaRepository;
        private readonly IMapper _mapper;

        public KhoaService(
            IKhoaRepository khoaRepository,
            IMapper mapper) : base(khoaRepository)
        {
            _khoaRepository = khoaRepository;
            _mapper = mapper;
        }

        public async Task<PagedList<KhoaDto>> GetData(KhoaSearch search)
        {
            try
            {
                // Direct projection in the LINQ query like in FormTemplateService
                var query = from q in GetQueryable()
                            select new KhoaDto
                            {
                                Id = q.Id,
                                TenKhoa = q.TenKhoa,
                                MaKhoa = q.MaKhoa,
                                CreatedId = q.CreatedId,
                                UpdatedId = q.UpdatedId,
                                CreatedBy = q.CreatedBy,
                                UpdatedBy = q.UpdatedBy,
                                DeleteId = q.DeleteId,
                                CreatedDate = q.CreatedDate,
                                UpdatedDate = q.UpdatedDate,
                                DeleteTime = q.DeleteTime,
                                IsDelete = q.IsDelete,
                                // Add any other properties you want to include
                            };

                if (search != null)
                {
                    // Apply filters if provided
                    if (!string.IsNullOrEmpty(search.TenKhoa))
                    {
                        var searchStr = search.TenKhoa.Trim().ToLower();
                        query = query.Where(x => x.TenKhoa.ToLower().Contains(searchStr));
                    }

                    if (!string.IsNullOrEmpty(search.MaKhoa))
                    {
                        var searchStr = search.MaKhoa.Trim().ToLower();
                        query = query.Where(x => x.MaKhoa.ToLower().Contains(searchStr));
                    }
                }

                // Default sorting
                query = query.OrderByDescending(x => x.CreatedDate);

                // Use the PagedList.CreateAsync method to handle pagination
                return await PagedList<KhoaDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message);
            }
        }

        public async Task<KhoaDto> GetDto(Guid id)
        {
            try
            {
                var khoa = await GetByIdAsync(id);
                if (khoa == null)
                    return null;

                // Use direct mapping to KhoaDto similar to how FormTemplateService maps its entities
                var khoaDto = new KhoaDto
                {
                    Id = khoa.Id,
                    TenKhoa = khoa.TenKhoa,
                    MaKhoa = khoa.MaKhoa,
                    CreatedId = khoa.CreatedId,
                    UpdatedId = khoa.UpdatedId,
                    CreatedBy = khoa.CreatedBy,
                    UpdatedBy = khoa.UpdatedBy,
                    DeleteId = khoa.DeleteId,
                    CreatedDate = khoa.CreatedDate,
                    UpdatedDate = khoa.UpdatedDate,
                    DeleteTime = khoa.DeleteTime,
                    IsDelete = khoa.IsDelete,
                    // Add any other properties you want to include
                };

                return khoaDto;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve data for ID {id}: {ex.Message}");
            }
        }
    }
}
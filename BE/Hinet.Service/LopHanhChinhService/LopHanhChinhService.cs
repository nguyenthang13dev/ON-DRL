// Hinet.Service/LopHanhChinhService/LopHanhChinhService.cs
using System;
using Hinet.Model.MongoEntities;
using Hinet.Repository.LopHanhChinhRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Core.Mapper;
using Hinet.Service.LopHanhChinhService.Dto;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Hinet.Service.LopHanhChinhService
{
    public class LopHanhChinhService : Service<LopHanhChinh>, ILopHanhChinhService
    {
        private readonly ILopHanhChinhRepository _lopHanhChinhRepository;
        private readonly IMapper _mapper;

        public LopHanhChinhService(
            ILopHanhChinhRepository lopHanhChinhRepository,
            IMapper mapper) : base(lopHanhChinhRepository)
        {
            _lopHanhChinhRepository = lopHanhChinhRepository;
            _mapper = mapper;
        }

        public async Task<PagedList<LopHanhChinhDto>> GetData(LopHanhChinhSearch search)
        {
            try
            {
                var query = from q in GetQueryable()
                            select new LopHanhChinhDto
                            {
                                Id = q.Id,
                                TenLop = q.TenLop,
                                KhoaId = q.KhoaId,
                                GiaoVienCoVanId = q.GiaoVienCoVanId,
                                CreatedId = q.CreatedId,
                                UpdatedId = q.UpdatedId,
                                CreatedBy = q.CreatedBy,
                                UpdatedBy = q.UpdatedBy,
                                DeleteId = q.DeleteId,
                                CreatedDate = q.CreatedDate,
                                UpdatedDate = q.UpdatedDate,
                                DeleteTime = q.DeleteTime,
                                IsDelete = q.IsDelete,
                            };

                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.TenLop))
                    {
                        var searchStr = search.TenLop.Trim().ToLower();
                        query = query.Where(x => x.TenLop.ToLower().Contains(searchStr));
                    }

                    if (search.KhoaId.HasValue)
                    {
                        query = query.Where(x => x.KhoaId == search.KhoaId.Value);
                    }
                }

                query = query.OrderByDescending(x => x.CreatedDate);
                return await PagedList<LopHanhChinhDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message);
            }
        }

        public async Task<LopHanhChinhDto> GetDto(Guid id)
        {
            try
            {
                var lopHanhChinh = await GetByIdAsync(id);
                if (lopHanhChinh == null)
                    return null;

                var lopHanhChinhDto = new LopHanhChinhDto
                {
                    Id = lopHanhChinh.Id,
                    TenLop = lopHanhChinh.TenLop,
                    KhoaId = lopHanhChinh.KhoaId,
                    GiaoVienCoVanId = lopHanhChinh.GiaoVienCoVanId,
                    CreatedId = lopHanhChinh.CreatedId,
                    UpdatedId = lopHanhChinh.UpdatedId,
                    CreatedBy = lopHanhChinh.CreatedBy,
                    UpdatedBy = lopHanhChinh.UpdatedBy,
                    DeleteId = lopHanhChinh.DeleteId,
                    CreatedDate = lopHanhChinh.CreatedDate,
                    UpdatedDate = lopHanhChinh.UpdatedDate,
                    DeleteTime = lopHanhChinh.DeleteTime,
                    IsDelete = lopHanhChinh.IsDelete,
                };

                return lopHanhChinhDto;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve data for ID {id}: {ex.Message}");
            }
        }
    }
}


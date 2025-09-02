using Hinet.Model.Entities;
using Hinet.Repository.LichSuXuLyRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.LichSuXuLyService.Dto;
using Hinet.Service.LichSuXuLyService.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hinet.Service.LichSuXuLyService
{
    public class LichSuXuLyService : Service<LichSuXuLy>, ILichSuXuLyService
    {
        private readonly ILichSuXuLyRepository _lichSuXuLyRepository;

        public LichSuXuLyService(ILichSuXuLyRepository lichSuXuLyRepository) : base(lichSuXuLyRepository)
        {
            _lichSuXuLyRepository = lichSuXuLyRepository;
        }

        public async Task<PagedList<LichSuXuLyDto>> GetData(LichSuXuLySearch search)
        {
            var query = _lichSuXuLyRepository.GetQueryable();

            if (search.ItemId.HasValue)
                query = query.Where(x => x.ItemId == search.ItemId.Value);

            if (!string.IsNullOrEmpty(search.ItemType))
                query = query.Where(x => x.ItemType.Contains(search.ItemType));

            if (!string.IsNullOrEmpty(search.Note))
                query = query.Where(x => x.note != null && x.note.Contains(search.Note));

            var total = query.Count();
            var items = query.OrderByDescending(x => x.CreatedDate)
                .Skip((search.PageIndex - 1) * search.PageSize)
                .Take(search.PageSize)
                .Select(x => new LichSuXuLyDto
                {
                    Id = x.Id,
                    ItemId = x.ItemId,
                    ItemType = x.ItemType,
                    note = x.note,
                    oldData = x.oldData,
                    newDaTa = x.newDaTa,
                    CreatedDate = x.CreatedDate,
                    UpdatedDate = x.UpdatedDate
                }).ToList();

            return new PagedList<LichSuXuLyDto>(items, total, search.PageIndex, search.PageSize);
        }

        public async Task<LichSuXuLyDto?> GetDto(Guid id)
        {
            var entity = await _lichSuXuLyRepository.GetByIdAsync(id);
            if (entity == null) return null;

            return new LichSuXuLyDto
            {
                Id = entity.Id,
                ItemId = entity.ItemId,
                ItemType = entity.ItemType,
                note = entity.note,
                oldData = entity.oldData,
                newDaTa = entity.newDaTa,
                CreatedDate = entity.CreatedDate,
                UpdatedDate = entity.UpdatedDate
            };
        }

        public async Task<List<LichSuXuLyDto>> GetByItemId(Guid itemId, string itemType)
        {
            var entities = _lichSuXuLyRepository.GetQueryable()
                .Where(x => x.ItemId == itemId && x.ItemType == itemType)
                .OrderByDescending(x => x.CreatedDate)
                .ToList();

            return entities.Select(x => new LichSuXuLyDto
            {
                Id = x.Id,
                ItemId = x.ItemId,
                ItemType = x.ItemType,
                note = x.note,
                oldData = x.oldData,
                newDaTa = x.newDaTa,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate
            }).ToList();
        }
    }
}
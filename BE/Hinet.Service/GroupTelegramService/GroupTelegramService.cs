using Hinet.Model.Entities;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using Hinet.Repository.DM_NhomDanhMucRepository;
using Hinet.Repository.GroupTelegramRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Core.Mapper;
using Hinet.Service.GroupTelegramService.Dto;
using Hinet.Service.GroupTelegramService.ViewModels;
using Hinet.Service.TD_UngVienService.Dto;
using Hinet.Service.UserTelegramService.Dto;
using Hinet.Service.XaService;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Service.GroupTelegramService
{
    public class GroupTelegramService : Service<GroupTelegram>, IGroupTelegramService
    {
        private readonly IDM_NhomDanhMucRepository _dM_NhomDanhMucRepository;
        private readonly IDM_DuLieuDanhMucRepository _dM_DuLieuDanhMucRepository;
        private readonly IMapper _mapper;
        public GroupTelegramService(IGroupTelegramRepository repo, IDM_NhomDanhMucRepository dM_NhomDanhMucRepository, IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository, IMapper mapper) : base(repo)
        {
            _dM_NhomDanhMucRepository = dM_NhomDanhMucRepository;
            _dM_DuLieuDanhMucRepository = dM_DuLieuDanhMucRepository;
            _mapper = mapper;
        }

        public async Task<PagedList<GroupTelegramDto>> GetData(GroupTelegramSearch search)
        {
            var query = GetQueryable();

            if (!string.IsNullOrEmpty(search.GroupName))
                query = query.Where(x => x.GroupName.ToLower().Trim().Contains(search.GroupName));

            if (!string.IsNullOrEmpty(search.ChatId))
                query = query.Where(x => x.ChatId.ToLower().Trim().Contains(search.ChatId.ToLower().Trim()));

            if (!string.IsNullOrEmpty(search.EventTypeCode))
                query = query.Where(x => x.EventTypeCode.ToLower().Trim().Contains(search.EventTypeCode.ToLower().Trim()));

            if (search.IsActive.HasValue)
                query = query.Where(x => x.IsActive == search.IsActive);

            var total = await query.CountAsync();
            var entities = await query.OrderByDescending(x => x.CreatedDate)
                .Skip((search.PageIndex - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToListAsync();
            var items = new List<GroupTelegramDto>();
            foreach (var x in entities)
            {
                var tenEventTypeCode = await _dM_DuLieuDanhMucRepository.GetQueryable().Where(dm => dm.Code == x.EventTypeCode).FirstOrDefaultAsync();
                items.Add(new GroupTelegramDto()
                {
                    Id = x.Id,
                    GroupName = x.GroupName,
                    ChatId = x.ChatId,
                    EventTypeCode = x.EventTypeCode,
                    IsActive = x.IsActive,
                    CreatedDate = x.CreatedDate,
                    UpdatedDate = x.UpdatedDate,
                    CreatedBy = x.CreatedBy,
                    UpdatedBy = x.UpdatedBy,
                    tenEventTypeCode = tenEventTypeCode?.Name ?? string.Empty
                });
            }
            var result = new PagedList<GroupTelegramDto>(items, search.PageIndex, search.PageSize, total);
            return result;
        }
        public async Task CreateGroupTelegram(GroupTelegramCreateVM model)
        {
            if (model == null) throw new ArgumentNullException(nameof(model), "Model không được null");


            if (!string.IsNullOrEmpty(model.EventTypeCode))
            {
                var eventType = await _dM_DuLieuDanhMucRepository.GetQueryable().Where(x => x.Code == model.EventTypeCode).FirstOrDefaultAsync();
                if (eventType == null)
                    throw new Exception("Loại sự kiện không tồn tại");
            }
            var entity = _mapper.Map<GroupTelegramCreateVM, GroupTelegram>(model);
            if (entity == null) throw new Exception("Không thể ánh xạ dữ liệu từ model sang entity");
            await CreateAsync(entity);
        }
        public async Task<GroupTelegramDto?> GetDto(Guid id)
        {
            var groupTele = await GetByIdAsync(id);
            if (groupTele == null)
            {
                return null;
            }
            return new GroupTelegramDto
            {
                Id = groupTele.Id,
                GroupName = groupTele.GroupName,
                ChatId = groupTele.ChatId,
                EventTypeCode = groupTele.EventTypeCode,
                IsActive = groupTele.IsActive,
                CreatedDate = groupTele.CreatedDate,
                UpdatedDate = groupTele.UpdatedDate,
                CreatedBy = groupTele.CreatedBy,
                UpdatedBy = groupTele.UpdatedBy
            };
        }

        public async Task<bool> SaveOrUpdateGroupTelegram(GroupTelegramCreateVM model)
        {
            var existing = await GetQueryable().FirstOrDefaultAsync(x => x.ChatId == model.ChatId);
            if (existing != null)
            {
                existing.GroupName = model.GroupName;
                if (!string.IsNullOrEmpty(model.EventTypeCode))
                    existing.EventTypeCode = model.EventTypeCode;
                existing.IsActive = true;
                await UpdateAsync(existing);
                return true;
            }
            var entity = new GroupTelegram
            {
                ChatId = model.ChatId,
                GroupName = model.GroupName,
                EventTypeCode = model.EventTypeCode,
                Description = model.Description,
                IsActive = true
            };
            await CreateAsync(entity);
            return true;
        }
        public async Task<int> UnlinkGroups(List<string> chatIds)
        {
            if (chatIds == null || chatIds.Count == 0) return 0;
            var groups = await GetQueryable().Where(x => chatIds.Contains(x.ChatId) && x.IsActive).ToListAsync();
            foreach (var group in groups)
                await DeleteAsync(group);
            return groups.Count;
        }
        public async Task<int> UnlinkGroupsByEventTypeCodes(List<string> eventTypeCodes)
        {
            if (eventTypeCodes == null || eventTypeCodes.Count == 0) return 0;
            var groups = await GetQueryable().Where(x => eventTypeCodes.Contains(x.EventTypeCode) && x.IsActive).ToListAsync();
            foreach (var group in groups)
                await DeleteAsync(group);
            return groups.Count;
        }
    }
}
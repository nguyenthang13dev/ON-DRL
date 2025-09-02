using Hinet.Model.Entities;
using Hinet.Repository.UserTelegramRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Core.Mapper;
using Hinet.Service.TD_UngVienService.Dto;
using Hinet.Service.UserTelegramService.Dto;
using Hinet.Service.UserTelegramService.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Service.UserTelegramService
{
    public class UserTelegramService : Service<UserTelegram>, IUserTelegramService
    {
        private readonly IUserTelegramRepository _userTelegramRepository;
        private readonly IMapper _mapper;
        public UserTelegramService(IUserTelegramRepository repo, IUserTelegramRepository userTelegramRepository, IMapper mapper) : base(repo)
        {
            _userTelegramRepository = userTelegramRepository;
            _mapper = mapper;
        }

        public async Task<PagedList<UserTelegramDto>> GetData(UserTelegramSearch search)
        {
            var query = GetQueryable().Select(x => new UserTelegramDto
            {
                Id = x.Id,
                FullName = x.FullName,
                UserId = x.UserId,
                ChatId = x.ChatId,
                IsActive = x.IsActive,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
                CreatedBy = x.CreatedBy,
                UpdatedBy = x.UpdatedBy
            });

            if (search != null)
            {
                if (search.UserId != null && search.UserId != Guid.Empty)
                    query = query.Where(x => x.UserId == search.UserId);

                if (!string.IsNullOrEmpty(search.ChatId))
                    query = query.Where(x => x.ChatId.ToLower().Trim().Contains(search.ChatId.ToLower().Trim()));

                if (search.IsActive.HasValue)
                    query = query.Where(x => x.IsActive == search.IsActive);
            }
            query.OrderByDescending(query => query.CreatedDate);

            var result = await PagedList<UserTelegramDto>.CreateAsync(query, search);
            return result;
        }
        public async Task<UserTelegramDto?> GetDto(Guid id)
        {
            var userTele = await _userTelegramRepository.GetByIdAsync(id);
            if (userTele == null)
            {
                return null;
            }
            return new UserTelegramDto
            {
                Id = userTele.Id,
                UserId = userTele.UserId,
                FullName = userTele.FullName,
                ChatId = userTele.ChatId,
                IsActive = userTele.IsActive,
                CreatedDate = userTele.CreatedDate,
                UpdatedDate = userTele.UpdatedDate,
                CreatedBy = userTele.CreatedBy,
                UpdatedBy = userTele.UpdatedBy
            };
        }
        public async Task<bool> SaveOrUpdateUserTelegram(Guid userId, string chatId, string? FullName)
        {
            try
            {
                var entity = new UserTelegramCreateVM
                {
                    FullName = FullName,
                    UserId = userId,
                    ChatId = chatId,
                    IsActive = true
                };
                var existingUserTelegram = await _userTelegramRepository.GetQueryable()
                    .FirstOrDefaultAsync(x => x.ChatId == chatId);
                if (existingUserTelegram!=null&& existingUserTelegram.UserId != userId)
                {
                    throw new Exception("Đoạn chat này đã được liên kết với một tài khoản khác");
                }
                if (existingUserTelegram != null)
                {
                    existingUserTelegram.IsActive = true;
                    await UpdateAsync(existingUserTelegram);
                    return true;
                }
                var mappedEntity = _mapper.Map<UserTelegramCreateVM, UserTelegram>(entity);

                await CreateAsync(mappedEntity);
                return true;
            }
            catch (Exception e)
            {
                throw e;
            }

        }

        public async Task<bool> UnlinkAllTelegramAccount(List<Guid> userIds)
        {
            var entities = await _userTelegramRepository.GetQueryable().Where(x => userIds.Contains(x.UserId)).ToListAsync();
            if (entities == null || entities.Count == 0)
                return false;
            foreach (var entity in entities)
                await DeleteAsync(entity);
            return true;
        }

        public async Task<bool> UnlinkTelegramAccountId(List<Guid> userTelegramIds)
        {
            try
            {
                var entities = await _userTelegramRepository.GetQueryable().Where(x => userTelegramIds.Contains(x.Id)).ToListAsync();
                await DeleteAsync(entities);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> UnlinkByChatIds(List<string> chatIds)
        {
            try
            {
                var entities = await _userTelegramRepository.GetQueryable().Where(x => chatIds.Contains(x.ChatId)).ToListAsync();
                await DeleteAsync(entities);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
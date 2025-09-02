using Hinet.Service.GroupTelegramService;
using Hinet.Service.GroupTelegramService.ViewModels;
using Hinet.Service.UserTelegramService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Hinet.Service.Common.TelegramNotificationService
{
    public class TelegramNotificationService : ITelegramNotificationService
    {
        private readonly HttpClient _httpClient;
        private readonly IUserTelegramService _userTelegramService;
        private readonly IGroupTelegramService _groupTelegramService;
        private readonly IConfiguration _configuration;
        public TelegramNotificationService(
            IUserTelegramService userTelegramService,
            IGroupTelegramService groupTelegramService,
             IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _configuration = configuration;
            _userTelegramService = userTelegramService;
            _groupTelegramService = groupTelegramService;
        }

        public async Task<bool> SendMessageAsync(string message, string chatId = null)
        {
            try
            {
                var url = $"https://api.telegram.org/bot{_configuration["TelegramBot:Token"]}/sendMessage";
                if (string.IsNullOrEmpty(chatId))
                    return false;
                var safeMessage = message.Replace("<", "&lt;").Replace(">", "&gt;");
                var payload = new
                {
                    chat_id = chatId,
                    text = safeMessage,
                    parse_mode = "HTML"
                };
                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(url, content);
                var responseContent = await response.Content.ReadAsStringAsync();
                if (!response.IsSuccessStatusCode)
                    throw new Exception($"Telegram API call failed with status code: {response.StatusCode}, content: {responseContent}");
                return response.IsSuccessStatusCode;
            }
            catch (Exception e)
            {
                throw new Exception($"Error sending message to Telegram: {e.Message}", e);
            }

        }

        public async Task<bool> SendToUsers(IEnumerable<Guid> userIds, string message)
        {
            var chatIds = await _userTelegramService.GetQueryable()
                .Where(x => userIds.Contains(x.UserId) && x.IsActive)
                .Select(x => x.ChatId)
                .Distinct()
                .ToListAsync();
            bool allSuccess = true;
            if (chatIds == null || !chatIds.Any())
                return false;
            foreach (var chatId in chatIds)
            {
                var success = await SendMessageAsync(message, chatId);
                if (!success) allSuccess = false;
            }
            return allSuccess;
        }

        public async Task<bool> SendToGroups(IEnumerable<Guid> groupIds, string message)
        {
            var groupList = await _groupTelegramService.GetQueryable().Where(x => groupIds.Contains(x.Id) && x.IsActive).ToListAsync();
            bool allSuccess = true;
            if (groupList == null || !groupList.Any())
                return false;
            foreach (var group in groupList)
            {
                var success = await SendMessageAsync(message, group.ChatId);
                if (!success) allSuccess = false;
            }
            return allSuccess;
        }

        public async Task<bool> SendByEventType(List<string>? eventTypeCode, string message)
        {
            var groups = await _groupTelegramService.GetQueryable().Where(x => x.IsActive).ToListAsync();

            if (eventTypeCode != null && eventTypeCode.Any())
                groups = groups.Where(x => eventTypeCode.Contains(x.EventTypeCode)).ToList();

            if (groups == null || !groups.Any())
                return false;
            bool allSuccess = true;
            foreach (var group in groups)
            {
                var success = await SendMessageAsync(message, group.ChatId);
                if (!success) allSuccess = false;
            }
            return allSuccess;
        }
    }
}
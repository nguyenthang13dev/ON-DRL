using Hinet.Api.Dto;
using Hinet.Service.Common.TelegramNotificationService;
using Hinet.Service.GroupTelegramService;
using Hinet.Service.GroupTelegramService.ViewModels;
using Hinet.Service.TelegramWebhook.Dto;
using Hinet.Service.TelegramWebhookService;
using Hinet.Service.TelegramWebhookService.Dto;
using Hinet.Service.UserTelegramService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace Hinet.Api.Controllers
{
    [Route("api/telegram/webhook")]
    [ApiController]
    public class TelegramWebhookController : ControllerBase
    {
        private readonly ILogger<TelegramWebhookController> _logger;
        private readonly ITelegramWebhookService _telegramWebhookService;
        private readonly ITelegramNotificationService _telegramNotificationService;
        private readonly IUserTelegramService _userTelegramService;
        private readonly IGroupTelegramService _groupTelegramService;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public TelegramWebhookController(IUserTelegramService userTelegramService, IGroupTelegramService groupTelegramService, ILogger<TelegramWebhookController> logger, ITelegramNotificationService telegramNotificationService, ITelegramWebhookService telegramWebhookService, IConfiguration configuration)
        {
            _logger = logger;
            _telegramWebhookService = telegramWebhookService;
            _groupTelegramService = groupTelegramService;
            _userTelegramService = userTelegramService;
            _telegramNotificationService = telegramNotificationService;
            _configuration = configuration;
            _httpClient = new HttpClient();
        }

        [HttpPost("setup")]
        [Authorize]
        public async Task<DataResponse> SetupWebhook([FromBody] SetupWebhookRequest request)
        {
            try
            {
                var botToken = _configuration["TelegramBot:Token"];
                if (string.IsNullOrEmpty(botToken))
                {
                    return DataResponse.False("Bot token chưa được cấu hình");
                }

                var webhookUrl = request.WebhookUrl ?? $"{Request.Scheme}://{Request.Host}/api/telegram/webhook";

                var setWebhookUrl = $"https://api.telegram.org/bot{botToken}/setWebhook";
                var payload = new
                {
                    url = webhookUrl,
                    allowed_updates = new[] { "message" }
                };

                var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(setWebhookUrl, content);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation($"Webhook setup successful: {result}");
                    return DataResponse.Success($"Webhook đã được thiết lập thành công tại: {webhookUrl}");
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Webhook setup failed: {error}");
                    return DataResponse.False($"Thiết lập webhook thất bại: {error}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting up webhook");
                return DataResponse.False($"Lỗi khi thiết lập webhook: {ex.Message}");
            }
        }

        [HttpGet("info")]
        [Authorize]
        public async Task<DataResponse> GetWebhookInfo()
        {
            try
            {
                var botToken = _configuration["TelegramBot:Token"];
                if (string.IsNullOrEmpty(botToken))
                {
                    return DataResponse.False("Bot token chưa được cấu hình");
                }

                var getWebhookInfoUrl = $"https://api.telegram.org/bot{botToken}/getWebhookInfo";
                var response = await _httpClient.GetAsync(getWebhookInfoUrl);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    return DataResponse.Success(result);
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return DataResponse.False($"Lỗi khi lấy thông tin webhook: {error}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting webhook info");
                return DataResponse.False($"Lỗi khi lấy thông tin webhook: {ex.Message}");
            }
        }

        [HttpPost("delete")]
        [Authorize]
        public async Task<DataResponse> DeleteWebhook()
        {
            try
            {
                var botToken = _configuration["TelegramBot:Token"];
                if (string.IsNullOrEmpty(botToken))
                {
                    return DataResponse.False("Bot token chưa được cấu hình");
                }

                var deleteWebhookUrl = $"https://api.telegram.org/bot{botToken}/deleteWebhook";
                var response = await _httpClient.PostAsync(deleteWebhookUrl, null);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    return DataResponse.Success("Webhook đã được xóa thành công");
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    return DataResponse.False($"Lỗi khi xóa webhook: {error}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting webhook");
                return DataResponse.False($"Lỗi khi xóa webhook: {ex.Message}");
            }
        }

        [HttpPost("setup-production")]
        [Authorize]
        public async Task<DataResponse> SetupWebhookProduction([FromBody] string? domain = null)
        {
            try
            {
                var botToken = _configuration["TelegramBot:Token"];
                if (string.IsNullOrEmpty(botToken))
                {
                    return DataResponse.False("Bot token chưa được cấu hình");
                }
                var webhookDomain = domain;
                if (string.IsNullOrWhiteSpace(webhookDomain))
                {
                    webhookDomain = Request.Host.Value;
                }
                var webhookUrl = $"https://{webhookDomain}/api/telegram/webhook";
                var setWebhookUrl = $"https://api.telegram.org/bot{botToken}/setWebhook";
                var payload = new
                {
                    url = webhookUrl,
                    allowed_updates = new[] { "message" }
                };
                var content = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(setWebhookUrl, content);
                var result = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation($"[PRODUCTION] Webhook setup successful: {result}");
                    return DataResponse.Success($"Webhook production đã được thiết lập thành công tại: {webhookUrl}");
                }
                else
                {
                    _logger.LogError($"[PRODUCTION] Webhook setup failed: {result}");
                    return DataResponse.False($"Thiết lập webhook production thất bại: {result}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting up production webhook");
                return DataResponse.False($"Lỗi khi thiết lập webhook production: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<DataResponse> Receive([FromBody] TelegramWebhookPayload payload)
        {
            try
            {
                var chatId = payload?.message?.chat?.id;
                var text = payload?.message?.text;
                if (string.IsNullOrEmpty(text))
                {
                    await _telegramNotificationService.SendMessageAsync("Vui lòng gửi đúng mã xác thực để liên kết Telegram với hệ thống. Ví dụ: LINK:<mã xác thực>", chatId.ToString());
                    return DataResponse.Success("Vui lòng gửi đúng mã xác thực để liên kết Telegram với hệ thống. Ví dụ: LINK:<mã xác thực>");
                }

                if (text.StartsWith("LINK:", StringComparison.OrdinalIgnoreCase))
                {
                    var jwt = text.Substring(5).Trim();
                    var userId = _telegramWebhookService.ValidateTelegramLinkJwt(jwt);
                    if (userId != null)
                    {
                        string fullName = payload?.message?.from?.first_name + " " + payload?.message?.from?.last_name;
                        await _userTelegramService.SaveOrUpdateUserTelegram(userId.Value, chatId.ToString(), fullName);
                        await _telegramNotificationService.SendMessageAsync("Liên kết Telegram với hệ thống thành công!", chatId.ToString());
                        return DataResponse.Success("Liên kết Telegram với hệ thống thành công!");
                    }
                    else
                    {
                        await _telegramNotificationService.SendMessageAsync("Mã xác thực không hợp lệ hoặc đã hết hạn.", chatId.ToString());
                        return DataResponse.False("Mã xác thực không hợp lệ hoặc đã hết hạn.");
                    }
                }
                var chatType = payload?.message?.chat?.type;
                if ((chatType == "group" || chatType == "supergroup") && text.StartsWith("/linkgroup", StringComparison.OrdinalIgnoreCase))
                {
                    // Cú pháp: /linkgroup <Tên nhóm> | <EventTypeCode> | <JWT>
                    var parts = text.Substring(10).Trim().Split('|');
                    if (parts.Length < 3)
                    {
                        await _telegramNotificationService.SendMessageAsync("Cú pháp đúng: /linkgroup <Tên nhóm> | <EventTypeCode> | <JWT>", chatId.ToString());
                        return DataResponse.False("Cú pháp đúng: /linkgroup <Tên nhóm> | <EventTypeCode> | <JWT>");
                    }
                    var groupName = parts[0].Trim();
                    var eventTypeCode = parts[1].Trim();
                    var jwt = parts[2].Trim();

                    // Validate JWT and extract group name and event type from token
                    var validationResult = _telegramWebhookService.ValidateTelegramGroupLinkJwtAndExtractData(jwt);
                    if (!validationResult.IsValid)
                    {
                        await _telegramNotificationService.SendMessageAsync("Mã xác thực không hợp lệ hoặc đã hết hạn.", chatId.ToString());
                        return DataResponse.False("Mã xác thực không hợp lệ hoặc đã hết hạn.");
                    }

                    // Use the group name and event type from the JWT token for security
                    var model = new GroupTelegramCreateVM
                    {
                        ChatId = chatId.ToString(),
                        GroupName = validationResult.GroupName,
                        EventTypeCode = validationResult.EventTypeCode
                    };
                    await _groupTelegramService.SaveOrUpdateGroupTelegram(model);
                    await _telegramNotificationService.SendMessageAsync($"Liên kết nhóm Telegram '{validationResult.GroupName}' với hệ thống thành công! (EventType: {validationResult.EventTypeCode})", chatId.ToString());
                    return DataResponse.Success($"Liên kết nhóm Telegram '{validationResult.GroupName}' với hệ thống thành công! (EventType: {validationResult.EventTypeCode})");
                }
                await _telegramNotificationService.SendMessageAsync("Vui lòng gửi đúng mã xác thực để liên kết Telegram với hệ thống. Ví dụ: LINK:<mã xác thực>", chatId.ToString());
                return DataResponse.Success("Vui lòng gửi đúng mã xác thực để liên kết Telegram với hệ thống. Ví dụ: LINK:<mã xác thực>");
            }
            catch (Exception ex)
            {
                await _telegramNotificationService.SendMessageAsync($"{ex.Message}", payload?.message?.chat?.id.ToString());
                return DataResponse.False($"{ex.Message}");
            }
        }
    }
}
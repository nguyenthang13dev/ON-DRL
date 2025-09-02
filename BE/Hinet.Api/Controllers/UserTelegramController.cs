using Hinet.Service.UserTelegramService;
using Hinet.Service.UserTelegramService.Dto;
using Hinet.Service.UserTelegramService.ViewModels;
using Hinet.Api.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Hinet.Service.Common;
using Hinet.Controllers;
using Hinet.Service.Core.Mapper;
using Hinet.Model.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Hinet.Service.TelegramWebhookService;
using Microsoft.AspNetCore.Authorization;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    public class UserTelegramController : HinetController
    {
        private readonly IUserTelegramService _service;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly ITelegramWebhookService _telegramWebhookService;
        public UserTelegramController(IUserTelegramService service, IMapper mapper, IConfiguration configuration, ITelegramWebhookService telegramWebhookService)
        {
            _service = service;
            _mapper = mapper;
            _configuration = configuration;
            _telegramWebhookService = telegramWebhookService;
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<UserTelegramDto>>> GetData([FromBody] UserTelegramSearch search)
        {
            var data = await _service.GetData(search);
            return DataResponse<PagedList<UserTelegramDto>>.Success(data);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<UserTelegramDto?>> Get(Guid id)
        {
            var dto = await _service.GetDto(id);
            return DataResponse<UserTelegramDto?>.Success(dto);
        }

        [HttpGet("GetAllLinked")]
        public async Task<DataResponse<List<UserTelegramDto>>> GetAllLinked()
        {
            if (!UserId.HasValue)
                return DataResponse<List<UserTelegramDto>>.False("Không tìm thấy tài khoản người dùng ");
            var list = await _service.GetQueryable()
                .Where(x => x.IsActive && x.UserId == UserId.Value)
                .Select(x => new UserTelegramDto
                {
                    Id = x.Id,
                    UserId = x.UserId,
                    FullName = x.FullName,
                    ChatId = x.ChatId,
                    LinkedAt = x.LinkedAt,
                    IsActive = x.IsActive
                })
                .ToListAsync();
            return DataResponse<List<UserTelegramDto>>.Success(list);
        }

        //[HttpPost("Create")]
        //public async Task<DataResponse> Create([FromBody] UserTelegramCreateVM model)
        //{
        //    try
        //    {
        //        if (model == null) return DataResponse.False("Dữ liệu không hợp lệ");
        //        var entity = _mapper.Map<UserTelegramCreateVM, UserTelegram>(model);
        //        if (entity == null) return DataResponse.False("Không thể ánh xạ dữ liệu");
        //        await _service.CreateAsync(entity);
        //        return DataResponse.Success("Thêm mới thành công");
        //    }
        //    catch (Exception e)
        //    {
        //        return DataResponse.False("Có lỗi khi thêm mới");
        //    }

        //}

        //[HttpPut("Update/{id}")]
        //public async Task<DataResponse> Update([FromBody] UserTelegramEditVM model)
        //{
        //    try
        //    {
        //        var entity = await _service.GetByIdAsync(model.Id);
        //        if (entity == null) return DataResponse.False("Không tìm thấy bản ghi");
        //        var updatedEntity = _mapper.Map<UserTelegramEditVM, UserTelegram>(model);
        //        await _service.UpdateAsync(updatedEntity);
        //        return DataResponse.Success("Cập nhật thành công");
        //    }
        //    catch (Exception e)
        //    {
        //        return DataResponse.False("Có lỗi khi cập nhật dữ liệu");
        //    }

        //}

        //[HttpDelete("Delete/{id}")]
        //public async Task<DataResponse> Delete(Guid id)
        //{
        //    try
        //    {
        //        var entity = await _service.GetByIdAsync(id);
        //        if (entity == null) return DataResponse.False("Không tìm thấy bản ghi");
        //        await _service.DeleteAsync(entity);
        //        return DataResponse.Success("Xóa thành công");
        //    }
        //    catch (Exception e)
        //    {
        //        return DataResponse.Success("Có lỗi khi xóa");
        //    }

        //}

        [HttpDelete("UnlinkAllTelegramAccount")]
        public async Task<DataResponse> UnlinkAllTelegramAccount([FromBody] List<Guid> userIds)
        {
            var result = await _service.UnlinkAllTelegramAccount(userIds);
            if (result)
                return DataResponse.Success("Huỷ liên kết Telegram thành công");
            return DataResponse.False("User chưa liên kết Telegram hoặc có lỗi khi huỷ liên kết");
        }

        [HttpDelete("UnlinkTelegramAccountId")]
        public async Task<DataResponse> UnlinkTelegramAccountId([FromBody] List<Guid> userTelegramIds)
        {
            var result = await _service.UnlinkTelegramAccountId(userTelegramIds);
            if (result)
                return DataResponse.Success("Huỷ liên kết tài khoản Telegram thành công");
            return DataResponse.False("Không tìm thấy tài khoản Telegram này hoặc có lỗi khi huỷ liên kết");
        }

        [HttpDelete("UnlinkByChatIds")]
        public async Task<DataResponse> UnlinkByChatIds([FromBody] List<string> chatIds)
        {
            var result = await _service.UnlinkByChatIds(chatIds);
            if (result)
                return DataResponse.Success("Huỷ liên kết tài khoản Telegram theo ChatId thành công");
            return DataResponse.False("Không tìm thấy tài khoản Telegram này hoặc có lỗi khi huỷ liên kết");
        }

        [HttpGet("GenerateTelegramLinkToken")]
        public async Task <ActionResult<DataResponse>> GenerateTelegramLinkToken()
        {
            if (!UserId.HasValue)
                return DataResponse.False("UserId không hợp lệ");
            var token = _telegramWebhookService.GenerateTelegramLinkToken(UserId.Value);
            return DataResponse.Success(new { Token = token });
        }

        [HttpPost("CheckLinked")]
        public async Task<DataResponse> CheckLinked([FromBody] string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return DataResponse.False("Token không hợp lệ");

            // Nếu token có prefix LINK:, cắt bỏ
            var jwt = token.StartsWith("LINK:", StringComparison.OrdinalIgnoreCase) ? token.Substring(5).Trim() : token.Trim();
            var userId = _telegramWebhookService.ValidateTelegramLinkJwt(jwt);
            if (userId == null)
                return DataResponse.False("Token không hợp lệ hoặc đã hết hạn");

            var userTelegram = await _service.GetQueryable().FirstOrDefaultAsync(x => x.UserId == userId.Value);
            if (userTelegram != null)
            {
                return DataResponse.Success(new
                {
                    Linked = true,
                    userTelegram.UserId,
                    userTelegram.ChatId,
                    userTelegram.LinkedAt
                });
            }
            else
            {
                return DataResponse.Success(new { Linked = false });
            }
        }
    }
}
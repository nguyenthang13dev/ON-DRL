using Hinet.Model.Entities;
using Hinet.Service.Core.Mapper;
using Hinet.Service.GroupTelegramService;
using Hinet.Service.GroupTelegramService.ViewModels;
using Hinet.Service.TelegramWebhookService.Dto;
using Hinet.Service.UserTelegramService;
using Hinet.Service.UserTelegramService.ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Hinet.Service.TelegramWebhookService
{
    public class TelegramWebhookService : ITelegramWebhookService
    {
        private readonly IUserTelegramService _userTelegramService;
        private readonly IGroupTelegramService _groupTelegramService;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        public TelegramWebhookService(IUserTelegramService userTelegramService, IGroupTelegramService groupTelegramService, IMapper mapper, IConfiguration configuration)
        {
            _userTelegramService = userTelegramService;
            _groupTelegramService = groupTelegramService;
            _configuration = configuration;
            _mapper = mapper;
        }

        public Guid? ValidateTelegramLinkJwt(string jwt)
        {
            var secret = _configuration["AuthSetting:Key"];
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.ASCII.GetBytes(secret);
            try
            {
                tokenHandler.ValidateToken(jwt, new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuerSigningKey = true
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userIdStr = jwtToken.Claims.First(x => x.Type == "userId").Value;
                if (Guid.TryParse(userIdStr, out Guid userId))
                    return userId;
                return null;
            }
            catch
            {
                return null;
            }
        }

        public bool ValidateTelegramGroupLinkJwt(string jwt, string eventTypeCode)
        {
            var secret = _configuration["AuthSetting:Key"];
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.ASCII.GetBytes(secret);
            try
            {
                tokenHandler.ValidateToken(jwt, new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuerSigningKey = true
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                // Nếu muốn kiểm tra eventTypeCode trong claim, có thể bổ sung ở đây
                // var eventTypeClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == "eventTypeCode")?.Value;
                // if (eventTypeClaim != eventTypeCode) return false;
                return true;
            }
            catch
            {
                return false;
            }
        }

        public string GenerateTelegramLinkToken(Guid userId)
        {
            var secret = _configuration["AuthSetting:Key"];
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.ASCII.GetBytes(secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("userId", userId.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);
            return $"LINK:{jwt}";
        }

        public string GenerateGroupTelegramLinkToken(string groupName, string eventTypeCode)
        {
            var secret = _configuration["AuthSetting:Key"];
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.ASCII.GetBytes(secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("groupName", groupName),
                    new Claim("eventTypeCode", eventTypeCode)
                }),
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwt = tokenHandler.WriteToken(token);
            // Trả về cú pháp mẫu để gửi vào nhóm
            return $"/linkgroup {groupName} | {eventTypeCode} | {jwt}";
        }

        public TelegramGroupLinkValidationResult ValidateTelegramGroupLinkJwtAndExtractData(string jwt)
        {
            var result = new TelegramGroupLinkValidationResult { IsValid = false };
            var secret = _configuration["AuthSetting:Key"];
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.ASCII.GetBytes(secret);

            try
            {
                tokenHandler.ValidateToken(jwt, new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuerSigningKey = true
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var groupNameClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == "groupName")?.Value;
                var eventTypeCodeClaim = jwtToken.Claims.FirstOrDefault(x => x.Type == "eventTypeCode")?.Value;

                if (!string.IsNullOrEmpty(groupNameClaim) && !string.IsNullOrEmpty(eventTypeCodeClaim))
                {
                    result.IsValid = true;
                    result.GroupName = groupNameClaim;
                    result.EventTypeCode = eventTypeCodeClaim;
                }
            }
            catch
            {
                result.IsValid = false;
            }

            return result;
        }
    }
}
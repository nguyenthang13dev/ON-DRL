using Hinet.Service.GioiHanDiaChiMangService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Hinet.Api.Core.Attributes
{
    public class IpAddressAuthorizedAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var remoteIp = context.HttpContext.Connection.RemoteIpAddress;

            if (remoteIp == null)
            {
                context.Result = new ForbidResult();
                return;
            }

            var gioiHanService = context.HttpContext.RequestServices.GetService<IGioiHanDiaChiMangService>();

            var ip = remoteIp.ToString();
            var _allowedIps = gioiHanService
                .FindBy(x => x.IPAddress == ip && x.Allowed == true)
                .FirstOrDefault();

            if (_allowedIps == null)
            {
                context.Result = new ContentResult
                {
                    StatusCode = StatusCodes.Status403Forbidden,
                    Content = $"Access denied from IP {ip}"
                };
            }
        }
    }
}

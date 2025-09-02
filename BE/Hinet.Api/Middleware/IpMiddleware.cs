using Hinet.Service.GioiHanDiaChiMangService;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Api.Middleware
{
    public class IpMiddleware
    {
        private readonly RequestDelegate _next;
        public IpMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IGioiHanDiaChiMangService gioiHanDiaChiMangService)
        {
            var ipAddress = GetIpAddress(context);
            var allowed = await gioiHanDiaChiMangService.GetQueryable()
                .AnyAsync(x => x.IPAddress == ipAddress && x.Allowed == true);

            if (!allowed)
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("Không có quyền truy cập");
                return;
            }

            await _next(context);
        }

        private string GetIpAddress(HttpContext context)
        {
            var ipTuProxy = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            return ipTuProxy?.Split(',')[0].Trim() ?? context.Connection.RemoteIpAddress?.ToString() ?? "";
        }

    }
}

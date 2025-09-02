namespace Hinet.Api.Middleware
{
    public class LoggingMiddleware
    {
        private readonly RequestDelegate _next;
        public LoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var request = context.Request;
            var userName = context.User?.Identity?.IsAuthenticated == true
            ? context.User.Identity.Name
            : "Ẩn danh";
            var ipAddress = context.Connection.RemoteIpAddress?.ToString();
            await _next(context);
        }
    }
}

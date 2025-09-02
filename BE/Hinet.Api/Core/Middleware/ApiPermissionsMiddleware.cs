using CommonHelper.String;
using Hinet.Extensions;
using Hinet.Model.Entities;
using Hinet.Service.ApiPermissionsService;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;

namespace Hinet.Api.Core.Middleware
{
    public class ApiPermissionsMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMemoryCache _cache;
        private readonly IServiceProvider _serviceProvider;

        public ApiPermissionsMiddleware(RequestDelegate next,
                                        IServiceProvider serviceProvider,
                                        IMemoryCache cache)
        {
            _next = next;
            _cache = cache;
            this._serviceProvider = serviceProvider;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (!string.IsNullOrEmpty(context.Request.Path.Value))
            {
                var path = context.Request.Path.Value.ToLower();
                if (path.StartsWith("/api") && path is not "/api/account/login")
                {
                    if (context.User.Identity?.IsAuthenticated == true)
                    {
                        var id = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value.ToGuid();
                        var requestPath = context.Request.Path.Value?.ToLower() ?? "";

                        if (!id.HasValue)
                        {
                            context.Response.StatusCode = 403;
                            return;
                        }

                        var cacheKey = $"api_permissions_{id}";
                        List<string?>? allowedActions;

                        if (!_cache.TryGetValue(cacheKey, out allowedActions))
                        {
                            using (var scope = _serviceProvider.CreateScope())
                            {
                                var apiPermissionsService = scope.ServiceProvider.GetRequiredService<IApiPermissionsService>();
                                allowedActions = await apiPermissionsService.GetApiPermistionOfUser(id);
                            }

                            _cache.Set(cacheKey, allowedActions, TimeSpan.FromSeconds(AppSettings.AuthSetting.SecondsExpires));
                        }
                        var paths = path.Split('/');
                        var allow = allowedActions.Any(x => x == "/api") 
                            || allowedActions.Any(x => x == string.Join("/", paths.Take(3)))
                            || allowedActions.Any(x => x == string.Join("/", paths.Take(4)));
                        if (!allow)
                        {
                            context.Response.StatusCode = 403;
                            return;
                        }
                    }
                }
            }

            await _next(context);
        }
    }
}

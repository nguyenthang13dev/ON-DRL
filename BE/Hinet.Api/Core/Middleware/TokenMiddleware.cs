using Hinet.Service.Common.TokenService;
using System.Net;

namespace Hinet.Api.Core.Middleware
{
    public class TokenMiddleware : IMiddleware
    {
        private readonly ITokenService _tokenService;

        public TokenMiddleware(ITokenService tokenService )
        {
            this._tokenService = tokenService;
        }
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {

            if (await _tokenService.IsCurrentActiveToken())
            {
                await next(context);
                return;
            }
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            return;
        }

    }

}

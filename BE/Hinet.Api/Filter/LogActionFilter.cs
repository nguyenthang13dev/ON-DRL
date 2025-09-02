using Azure.Core;
using Hinet.Model;
using Hinet.Model.Entities;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Diagnostics;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Hinet.Api.Filter
{
    public class LogActionFilter : ActionFilterAttribute
    {
        Audit audit;
        private readonly ILogger<LogActionFilter> _logger;
        private readonly HinetContext _dbContext;
        // Inject ILogger vào constructor
        public LogActionFilter(ILogger<LogActionFilter> logger, HinetContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;

        }


        // Ghi log trước khi action thực thi
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var controllerName = context.Controller.GetType().Name;
            //var actionName = context.ActionDescriptor.ActionName;
            var requestUrl = context.HttpContext.Request.Path;
            var timestamp = DateTime.Now;
            var request = context.HttpContext.Request;
            var audit1 = new Audit();
            if (request != null)
            {
                audit1.IPAddress = context.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "";
                audit1.UserName = context?.HttpContext?.User?.Identity?.Name ?? "Ẩn danh";
                audit1.URLAccessed = request?.Path.Value ?? "";
                audit1.AuditID = Guid.NewGuid();
                audit1.TimeAccessed = DateTime.UtcNow;
                audit1.Data = SerializeRequest(request);
                var userIdClaim = context?.HttpContext?.User?.Claims?.FirstOrDefault()?.Value;
                if (!string.IsNullOrEmpty(userIdClaim))
                {
                    audit1.UserId = Guid.Parse(userIdClaim);
                }
                audit1.Note = "";
                audit1.SessionID = "";
            }
            audit = audit1;
            base.OnActionExecuting(context);
        }

        // Ghi log sau khi action thực thi
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            var controllerName = context.Controller.GetType().Name;
            //var actionName = context.ActionDescriptor.ActionName;
            var timestamp = DateTime.Now;
            var statusCode = context.HttpContext.Response.StatusCode;


            //if (audit != null)
            //{
            //    audit.Note = context?.ActionDescriptor?.AttributeRouteInfo?.Name ?? "";
            //    _dbContext.Audit.Add(audit);
            //    _dbContext.SaveChanges();
            //}

            base.OnActionExecuted(context);
        }

        private string SerializeRequest(HttpRequest request)
        {
            // Tạo đối tượng chứa thông tin của request
            var requestInfo = new
            {
                Method = request.Method,
                Url = $"{request.Scheme}://{request.Host}{request.Path}{request.QueryString}",
                Headers = request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString()),
                QueryString = request.QueryString.HasValue ? request.QueryString.Value : null,
                Body = ReadRequestBody(request)
            };

            // Tuần tự hóa đối tượng thành JSON
            return JsonSerializer.Serialize(requestInfo, new JsonSerializerOptions { WriteIndented = true });
        }

        // Hàm đọc body của request
        private string ReadRequestBody(HttpRequest request)
        {
            if (request.Body.CanSeek)
            {
                request.Body.Seek(0, SeekOrigin.Begin); // Đặt con trỏ về đầu stream
                using (var reader = new StreamReader(request.Body, leaveOpen: true))
                {
                    var body = reader.ReadToEnd();
                    request.Body.Seek(0, SeekOrigin.Begin); // Đặt lại vị trí stream sau khi đọc
                    return body;
                }
            }
            return null; // Nếu không đọc được body
        }
    }
}

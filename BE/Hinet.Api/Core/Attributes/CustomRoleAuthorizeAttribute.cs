using Hinet.Service.OperationService;
using Hinet.Service.RoleOperationService;
using Hinet.Service.UserRoleService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace Hinet.Api.Core.Attributes
{
    public class CustomRoleAuthorizeAttribute : AuthorizeAttribute, IAuthorizationFilter
    {
        private readonly string _operation;
        private IUserRoleService _userRoleService;
        private IRoleOperationService _roleOperationService;
        private IOperationService _operationService;
        public CustomRoleAuthorizeAttribute(string operation)
        {
            _operation = operation;
        }
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            // Kiểm tra xem user đã xác thực hay chưa
            if (!user.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult(); // Trả về 401
                return;
            }
            var userId = context.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Lấy danh sách RoleId của người dùng
            var _userRoleService = (IUserRoleService)context.HttpContext.RequestServices.GetService(typeof(IUserRoleService));
            var userRoles = _userRoleService.FindBy(x => x.UserId.ToString() == userId).ToList();
            var listRole = userRoles.Select(x => x.RoleId).ToList();

            //// Lấy OperationId từ service
            var _operationService = (IOperationService)context.HttpContext.RequestServices.GetService(typeof(IOperationService));
            var OperationId = _operationService.FindBy(x => x.Code == _operation).FirstOrDefault()?.Id;

            //// Kiểm tra nếu OperationId không null và kiểm tra quyền của user cho operation đó
            if (OperationId != null)
            {
                var _roleOperationService = (IRoleOperationService)context.HttpContext.RequestServices.GetService(typeof(IRoleOperationService));

                // Kiểm tra xem có bất kỳ role nào trong listRole có quyền thực thi operation này
                var listRolOperation = _roleOperationService
                    .FindBy(x => x.OperationId == OperationId && listRole.Contains(x.RoleId))
                    .Any();

                if (!listRolOperation)
                {
                    context.Result = new ForbidResult(); // Trả về 403 
                    return;
                }
            }
        }
    }
}

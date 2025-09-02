using Hinet.Service.Dto;

namespace Hinet.Service.User_GroupUserService.Dto
{
    public class User_GroupUserSearch : SearchBase
    {
        public Guid? UserId {get; set; }
		public Guid? GroupUserId {get; set; }
    }
}

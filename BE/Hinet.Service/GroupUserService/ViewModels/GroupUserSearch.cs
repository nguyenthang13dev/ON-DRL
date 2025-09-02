using Hinet.Service.Dto;

namespace Hinet.Service.GroupUserService.Dto
{
    public class GroupUserSearch : SearchBase
    {
        public string? Name {get; set; }
		public string? Code {get; set; }
        public Guid? DepartmentId { get; set; }
    }
}

using Hinet.Service.Common;
using Hinet.Service.Dto;

namespace Hinet.Service.AspNetUsersService.Dto
{
    public class AspNetUsersSearch : SearchBase
    {
        public string? LockoutEnd {get; set; }
		public int AccessFailedCount {get; set; }
		public bool EmailConfirmed {get; set; }
		public bool PhoneNumberConfirmed {get; set; }
		public bool TwoFactorEnabled {get; set; }
		public bool LockoutEnabled {get; set; }
		public string? Name {get; set; }
		public string? Gender {get; set; }
		public string? Picture {get; set; }
		public string? Type {get; set; }
		public string? Permissions {get; set; }
		public string? UserName {get; set; }
		public string? PhoneNumber {get; set; }
		public string? NormalizedUserName {get; set; }
		public string? Email {get; set; }
		public string? NormalizedEmail {get; set; }
		public string? PasswordHash {get; set; }
		public string? SecurityStamp {get; set; }
		public string? ConcurrencyStamp {get; set; }
		public string? DiaChi {get; set; }
		public Guid? DonViId { get; set; }
		public Guid? ParentDonViId { get; set; }
		public Guid? DepartmentId { get; set; }
        public List<string>? VaiTro { get; set; }
    }
}

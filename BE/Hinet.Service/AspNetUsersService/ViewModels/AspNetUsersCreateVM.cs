
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.AspNetUsersService.ViewModels
{
    public class AspNetUsersCreateVM
    {
        public string? LockoutEnd {get; set; }
		[Required]
		public int AccessFailedCount {get; set; }
		[Required]
		public bool EmailConfirmed {get; set; }
		[Required]
		public bool PhoneNumberConfirmed {get; set; }
		[Required]
		public bool TwoFactorEnabled {get; set; }
		[Required]
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
        public Guid? DonViId { get; set; }
        public DateTime? NgaySinh { get; set; }
        public string? DiaChi { get; set; }
        public string? HoiDong { get; set; }
        public string? MatKhau { get; set; }
        public string? LoaiTaiKhoan { get; set; }
        public List<string>? VaiTro { get; set; }
        public string? DepartmentId { get; set; }
    }
}
using AspNetCore.Identity.MongoDbCore.Models;
using Hinet.Model.MongoEntities;
using Microsoft.AspNetCore.Identity;
using MongoDbGenericRepository.Attributes;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities
{
    [CollectionName("AppUser")]
    public class AppUser : MongoIdentityUser<Guid>, IEntity
    {
        [DisplayName("Tên đăng nhập")]
        public string? Name { get; set; }

        [DisplayName("Giới tính")]
        public int Gender { get; set; }

        [DisplayName("Ảnh đại diện")]
        public string? Picture { get; set; }

        [DisplayName("Loại")]
        public string? Type { get; set; }

        [DisplayName("Quyền")]
        public string? Permissions { get; set; }
        [DisplayName("Mã đơn vị")]
        public Guid? DonViId { get; set; }
        [DisplayName("Ngày sinh")]
        public DateTime? NgaySinh { get; set; }
        [DisplayName("Địa chỉ")]
        public string? DiaChi { get; set; }
        [DisplayName("Cập nhật mật khẩu")]
        public bool? IsUpdateNewPass { get; set; }
        [DisplayName("SSO")]
        public bool? IsSSO { get; set; }
        [DisplayName("Cán bộ ID")]
        public Guid? CanBoId { get; set; }
        [DisplayName("ID Nhân Sự")]
        public Guid? IdNhanSu { get; set; }
        // 
        public Khoa? Khoa { get; set; }

        public LopHanhChinh? Lop { get; set; }   

        public int MyProperty { get; set; }
        // ko dùng
        [DisplayName("GroupRole")]
        public string? GroupRole { get; set; }

        public string? OTP { get; set; }

        public string? Password { get; set ; }
        public bool? IsFirstLogin { get; set; } = true;
        public bool? IsChangePass { get; set; } = true;

        // Thông tin khác
        public string MaSv { get; set; }

        [DisplayName("Ảnh QRCCCD")]
        public string? QRCCCD { get; set; }

    }
}
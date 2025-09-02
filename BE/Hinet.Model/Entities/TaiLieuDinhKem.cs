using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Hinet.Model.Entities
{
    [Table("TaiLieuDinhKem")]
    public class TaiLieuDinhKem : AuditableEntity
    {
        public long? KichThuoc { get; set; }
        public DateTime? NgayPhatHanh { get; set; }
        [Required]
        [StringLength(500)]
        public string TenTaiLieu { get; set; } = " ";
        [StringLength(250)]

        public string? LoaiTaiLieu { get; set; } = " ";
        public Guid? Item_ID { get; set; }

        //public long? IdBuocThucHienDVC { get; set; }

        public string? MoTa { get; set; } = " ";
        public string DuongDanFile { get; set; }

        public string DuongDanFilePDF { get; set; } = " ";

        [StringLength(250)]
        public string DinhDangFile { get; set; } = " ";
        [JsonIgnore]
        public int SoLuongDownload { get; set; }
        public Guid? UserId { get; set; }

        [JsonIgnore]
        public bool? IsTempDelete { get; set; }
        [JsonIgnore]
        public int? LanKeKhai { get; set; }
        [JsonIgnore]
        public string Guid { get; set; } = " ";

        public string KeyTieuChiKeKhai { get; set; } = " ";//mã tiêu chí kê khai số liệu
        [JsonIgnore]
        public Guid? IdDonViUpload { get; set; } //đơn vị upload file
        [JsonIgnore]
        public Guid? IdDotKeKhaiSoLieu { get; set; } //đợt kê khai số liệu


        //kế thừa khảo sát
        [JsonIgnore]
        public Guid? IdDonViKhaoSat { get; set; }
        [JsonIgnore]
        public Guid? IdDotKhaoSat { get; set; }
        [JsonIgnore]
        public Guid? IdRootItem { get; set; }

        [JsonIgnore]
        public int? ThangKhaoSat { get; set; }
        [JsonIgnore]
        public int? QuyKhaoSat { get; set; }
        [JsonIgnore]
        public int? NamKhaoSat { get; set; }

        public bool? IsKySo { get; set; }
        public string NguoiKy { get; set; } = " ";
        public string DonViPhatHanh { get; set; } = " ";
        public string NgayKy { get; set; } = " ";
        public Guid? IdBieuMau { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("DA_DuAn")]
    public class DA_DuAn : AuditableEntity
    {
        [MaxLength(255)]
        public string TenDuAn { get; set; }
        public string? MoTaDuAn { get; set; }
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public DateTime? NgayTiepNhan { get; set; }
        public string? YeuCauDuAn { get; set; }
        public Int16? TrangThaiThucHien { get; set; } // 0: Nháp, 1: Đang thực hiện, 2: Tạm dừng, 3: Hoàn thành
        public string? LinkDemo { get; set; }
        public string? LinkThucTe { get; set; }
        public DateTime? TimeCaiDatMayChu { get; set; }
        public bool IsBackupMayChu { get; set; } // true: đã backup, false: chưa backup

        public bool HasFileKhaoSat { get; set; }
        public bool HasFileNoiDungKhaoSat { get; set; }
        public bool HasFileKeHoachTrienKhaiKhachHang { get; set; }
        public bool HasFileKeHoachTrienKhaiNoiBo { get; set; }
        public bool HasFileTestCase { get; set; }
        public bool HasCheckListNghiemThuKyThuat { get; set; }
        public bool HasFileNghiemThuKyThuat { get; set; }
        public bool HasFileTaiLieuDuAn { get; set; } // true: đã có file tài liệu dự án, false: chưa có file tài liệu dự án 

        public string? TenGoiThau { get; set; }
        public string? DiaDiemTrienKhai { get; set; }
        public string? ChuDauTu { get; set; }

    }
}

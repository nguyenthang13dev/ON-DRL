using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("DA_KeHoachThucHien")]
    public class DA_KeHoachThucHien : AuditableEntity
    {
        public Guid DuAnId { get; set; }
        //true: Kế hoạch nội bộ, false: Kế hoạch khách hàng
        public bool IsKeHoachNoiBo { get; set; }
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public bool? IsCanhBao { get; set; }
        //Cảnh báo trước bao nhiêu ngày
        public Int32 CanhBaoTruocNgay { get; set; }
        public Guid? GroupNoiDungId { get; set; }
        [MaxLength(550)]
        public string? NoiDungCongViec { get; set; }
        [MaxLength(750)]
        public string? PhanCong { get; set; }

        public string? Stt { get; set; }

        public string? PhanCongKH { get; set; }
        public int? Progress { get; set; }


    }
}

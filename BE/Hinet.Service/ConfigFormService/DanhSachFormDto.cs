using Hinet.Service.KeKhaiSumaryService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.ConfigFormService
{
    public class DanhSachFormDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Subject { get; set; }
        public Guid FormId { get; set; }
        public Guid UserId { get; set; }
        public bool IsDanhGia { get; set; }
        public decimal? Processs { get; set; }
        public int Status { get; set; }
        public int? SoHocSinh { get; set; }
        public int? TongSoHocSinh { get; set; }
        public DateTime? CreateDate { get; set; }
        public bool? IsShowDuyet { get; set; }
    }
}

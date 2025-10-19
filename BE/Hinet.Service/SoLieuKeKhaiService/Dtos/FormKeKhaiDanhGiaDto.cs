using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.SoLieuKeKhaiService.Dtos
{
    public class FormKeKhaiDanhGiaDto
    {
        public Guid IdDanhGia { get; set; }
        public string NameDanhGia { get; set; }
        public string DescriptionDanhGia { get; set; }
        public bool IsDanhGia { get; set; }
        public decimal? Processs { get; set; }
        public DateTime? NgayNopDanhGia { get; set; }
    }
}

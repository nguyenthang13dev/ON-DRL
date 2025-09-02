using Hinet.Service.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.NS_NgayLeService.ViewModels
{
   public class NS_NgayLeSearch:SearchBase
    {
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public string? TenNgayLe { get; set; }
        public string? LoaiNLCode { get; set; }
        public string? MoTa { get; set; }
        public string? TrangThai { get; set; }
        public string? Nam { get; set; }
    }
}

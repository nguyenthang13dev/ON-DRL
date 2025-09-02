using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TacNhan_UseCaseService.ViewModel
{
    public class TacNhan_UseCaseCreateVM
    {
        public string? maTacNhan { get; set; }
        [Required(ErrorMessage = "Tên tác nhận không được để trống")]
        public string tenTacNhan { get; set; }
        public Guid idDuAn { get; set; }
    }
}

using Hinet.Model.Entities;
using Hinet.Service.DA_DuAnService.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.DA_KeHoachThucHienService.ViewModels
{
    public class DA_KeHoachThucHienFormVM
    {
        public Guid DuAnId { get; set; }
        public bool IsKeHoachNoiBo { get; set; }
        public List<DA_KeHoachThucHien> KeHoachThucHienList { get; set; }
    }
}

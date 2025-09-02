using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.DA_Test_Case
{
    public class UC_UseCaseDemo : AuditableEntity
    {
        public Guid IdDuAn { get; set; }
        public string? TenUseCase { get; set; }
        public string? TacNhanChinh { get; set; }
        public string? TacNhanPhu { get; set; }
        public string? DoPhucTap { get; set; }
        public string? loaiUseCaseCode { get; set; }
        public string? lstHanhDong { get; set; }
        public string? lstHanhDongNangCao { get; set; }
    }
}

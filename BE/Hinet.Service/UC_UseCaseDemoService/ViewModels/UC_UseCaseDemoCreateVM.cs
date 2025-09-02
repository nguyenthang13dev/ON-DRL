using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.UC_UseCaseDemoService.ViewModels
{
    public class UC_UseCaseDemoCreateVM
    {
        [Required]
        public Guid IdDuAn { get; set; }

        public string? TenUseCase { get; set; }

        public string? TacNhanChinh { get; set; }
        public string? loaiUseCaseCode { get; set; }

        public string? TacNhanPhu { get; set; }

        public string DoPhucTap { get; set; }

        public string? lstHanhDong { get; set; }
        public string? lstHanhDongNangCao { get; set; }
    }
}
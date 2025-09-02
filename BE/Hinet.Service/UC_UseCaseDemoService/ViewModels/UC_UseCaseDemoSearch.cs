using Hinet.Service.Dto;

namespace Hinet.Service.UC_UseCaseDemoService.ViewModels
{
    public class UC_UseCaseDemoSearch : SearchBase
    {
        public string? TenUseCase { get; set; }
        public string? TacNhanChinh { get; set; }
        public string? TacNhanPhu { get; set; }
        public string? DoPhucTap { get; set; }
        public Guid? IdDuAn { get; set; }
    }
}
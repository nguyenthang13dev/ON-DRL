namespace Hinet.Service.UC_TemplateTestCaseService.Dto
{
    public class UseCaseInputDto
    {
        public Guid? id { get; set; }
        public Guid IdDuAn { get; set; }
        public string TenUseCase { get; set; }
        public List<string>? MaTacNhanChinhs { get; set; }
        public string? TacNhanPhu { get; set; }
        public string DoPhucTapCode { get; set; }
        public string? loaiUseCaseCode { get; set; }
    }

}
namespace Hinet.Service.UC_TemplateTestCaseService.Dto
{
    public class UseCaseGenerateResultDto
    {
        public string TenUseCase { get; set; }
        public string TacNhanChinh { get; set; }
        public string DoPhucTapCode { get; set; }
        public string DoPhucTapName { get; set; }
        public string loaiUseCase { get; set; }
        public List<string> moTaTruongHop { get; set; }
        public List<string> lstHanhDongNangCao { get; set; }
    }
}
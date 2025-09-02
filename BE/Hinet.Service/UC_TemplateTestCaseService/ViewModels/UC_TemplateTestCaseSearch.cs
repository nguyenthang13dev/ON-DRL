using Hinet.Service.Dto;

namespace Hinet.Service.UC_TemplateTestCaseService.Dto
{
    public class UC_TemplateTestCaseSearch : SearchBase
    {
        public string? TemplateName {get; set; }
		public string? KeyWord {get; set; }
		public string? TemplateContent {get; set; }
    }
}

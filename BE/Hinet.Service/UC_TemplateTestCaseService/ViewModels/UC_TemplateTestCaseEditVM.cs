using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.UC_TemplateTestCaseService.ViewModels
{
    public class UC_TemplateTestCaseEditVM : UC_TemplateTestCaseCreateVM
    {
        public Guid? Id { get; set; }
    }
}
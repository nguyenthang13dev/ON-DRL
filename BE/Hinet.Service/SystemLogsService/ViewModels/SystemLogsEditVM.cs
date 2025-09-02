using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.SystemLogsService.ViewModels
{
    public class SystemLogsEditVM : SystemLogsCreateVM
    {
        public Guid? Id { get; set; }
    }
}
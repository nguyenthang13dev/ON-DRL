using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.SystemLogsService.ViewModels
{
    public class SystemLogsCreateVM
    {
        public Guid? UserId {get; set; }
		public string? UserName {get; set; }
		public DateTime? Timestamp {get; set; }
		public string? IPAddress {get; set; }
		public string? Level {get; set; }
		public string? Message {get; set; }
    }
}
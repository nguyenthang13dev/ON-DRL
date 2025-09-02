using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.FileSecurityService.ViewModels
{
    public class FileSecurityCreateVM
    {
        [Required]
		public Guid SharedByID {get; set; }
		[Required]
		public Guid fileID {get; set; }
		[Required]
		public string SharedToType {get; set; }
		[Required]
		public Guid SharedToID {get; set; }
		[Required]
		public bool canRead {get; set; }
		[Required]
		public bool canWrite {get; set; }
		[Required]
		public bool canDelete {get; set; }
		[Required]
		public bool canShare {get; set; }
    }
}
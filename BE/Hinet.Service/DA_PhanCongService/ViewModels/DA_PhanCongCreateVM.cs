using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.DA_PhanCongService.ViewModels
{
    public class DA_PhanCongCreateVM
    {
		[Required]
		public string VaiTroId { get; set; }
		[Required]
		public Guid UserId { get; set; }

        //public Guid? DuAnId { get; set; }
        //public Int16? OrderBy { get; set; }
    }
}
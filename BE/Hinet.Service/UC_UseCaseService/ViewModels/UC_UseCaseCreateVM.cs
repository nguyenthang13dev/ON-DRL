using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.UC_UseCaseService.ViewModels
{
    public class UC_UseCaseCreateVM
    { 
		public Guid IdDuAn {get; set; } 
		public string TenUseCase {get; set; } 
		public string TacNhanChinh {get; set; } 
		public string? TacNhanPhu {get; set; } 
		public string? DoCanThiet {get; set; } 
		public string DoPhucTap {get; set; } 
		public string? ParentId {get; set; }
        public List<string> lstMoTa { get; set; }
    }
}
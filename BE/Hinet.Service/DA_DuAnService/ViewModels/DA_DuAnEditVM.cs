using Hinet.Model.Entities;
using Hinet.Service.DA_PhanCongService.ViewModels;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.DA_DuAnService.ViewModels
{
    public class DA_DuAnEditVM : DA_DuAnCreateVM
    {
        public Guid? Id { get; set; }
        public List<DA_PhanCongEditVM> PhanCongList { get; set; } = new List<DA_PhanCongEditVM>();
    }
}
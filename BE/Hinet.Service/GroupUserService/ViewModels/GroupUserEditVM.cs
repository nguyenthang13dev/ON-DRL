using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.GroupUserService.ViewModels
{
    public class GroupUserEditVM : GroupUserCreateVM
    {
        public Guid? Id { get; set; }
    }
}
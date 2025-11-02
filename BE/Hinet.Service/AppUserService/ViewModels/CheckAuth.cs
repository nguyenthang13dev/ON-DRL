using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.AppUserService.ViewModels
{
    public class CheckAuth
    {
        public Guid? AppUserId { get; set; }
        public string OtpCode { get; set; }
    }
}

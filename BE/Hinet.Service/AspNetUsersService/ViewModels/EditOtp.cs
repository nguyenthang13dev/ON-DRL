using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.AspNetUsersService.ViewModels
{
    public class EditOtp
    {
        public Guid? AppUserId { get; set; }
        public string OtpCodeOld { get; set; }
        public string OtpCodeConfirm { get; set; }
        public string OtpCode { get; set; }

    }
}

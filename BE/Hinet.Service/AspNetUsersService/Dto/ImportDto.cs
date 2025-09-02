using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.AspNetUsersService.Dto
{
    public class ImportDto
    {
        public List<UserDto> ListTrue { get; set; }

        public List<UserDto> ListFalse { get; set; }
    }
}

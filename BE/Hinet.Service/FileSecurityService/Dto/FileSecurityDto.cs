using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Constant;

namespace Hinet.Service.FileSecurityService.Dto
{
    public class FileSecurityDto : FileSecurity
    {
        public string SharedToName { get; set; }
    }
}

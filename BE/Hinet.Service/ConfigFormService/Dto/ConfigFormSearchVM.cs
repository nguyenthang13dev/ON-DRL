using Hinet.Service.Common;
using Hinet.Service.Dto;

namespace Hinet.Service.ConfigFormService.Dto
{
    public class ConfigFormSearchVM : SearchBase
    {
        public  Guid? FormId { get; set; }
        public Guid? UserId { get; set; }
    }
}

using Hinet.Model.Entities;
using Hinet.Model.Entities.LuuTruBQP;
using Hinet.Service.Common;
using Hinet.Service.Constant;

namespace Hinet.Service.ArcFileService.Dto
{
    public class ArcFileDto : ArcFile
    {
        public string? MaintenceName { get; set; }
        public string? LangName { get; set; }
        public string? OrganName { get; set; }

    }
}

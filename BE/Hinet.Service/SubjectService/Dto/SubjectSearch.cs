using Hinet.Service.Common;
using Hinet.Service.Dto;

namespace Hinet.Service.SubjectService.Dto
{
    public class SubjectSearch : SearchBase
    {
        public string? SubjectCode { get; set; }
        public string? Name { get; set; }
        public Guid? Department { get; set; }
    }
}

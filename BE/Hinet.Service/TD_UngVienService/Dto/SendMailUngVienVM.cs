using System;
using System.Collections.Generic;

namespace Hinet.Service.TD_UngVienService.Dto
{
    public class SendMailUngVienVM
    {
        public List<Guid> UngVienIds { get; set; }
        public Guid EmailTemplateId { get; set; }
    }
}

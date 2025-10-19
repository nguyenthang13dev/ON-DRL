using Hinet.Model.Entities.ConfigAssign;
using Hinet.Model.Entities;
using Hinet.Model.MongoEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.SoLieuKeKhaiService.Dtos
{
    public class SoLieuKeKhaiDto : SoLieuKeKhai
    {
        public Guid Id { get; set; }
        public Guid KTT_KEY { get; set; }
        public object KTT_VALUE { get; set; }
    }
}

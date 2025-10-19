using Hinet.Model.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.MongoEntities
{
    public class KeKhaiSummary : AuditableEntity
    {
        public Guid FormId { get; set; }
        public Guid UserId { get; set; }
        public bool IsDanhGia { get; set; }
        public int Status { get; set; }
        public decimal? Processs { get; set; }
    }
}

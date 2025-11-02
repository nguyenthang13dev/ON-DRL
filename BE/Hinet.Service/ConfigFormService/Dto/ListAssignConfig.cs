using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.ConfigFormService.Dto
{
    public class ListAssignConfig
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string SubjectName { get; set; }
        public Guid FormId { get; set; }
        public decimal? Processs { get; set; }
        public int? SoHocSinh { get; set; }
        public int? TongSoHocSinh { get; set; }
        public DateTime? CreateDate { get; set; }
    }
}

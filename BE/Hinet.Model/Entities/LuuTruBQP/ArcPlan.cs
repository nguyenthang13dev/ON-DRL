using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.LuuTruBQP
{
    [Table("ArcPlan")]
    public class ArcPlan : AuditableEntity
    {
      


            public string PlanID { get; set; } // NVARCHAR2

          
            public string Name { get; set; } // NVARCHAR2

            public string Description { get; set; } // NVARCHAR2

            /// <summary>
            /// Ngày bắt đầu
            /// </summary>
            public DateTime? StartDate { get; set; } // TIMESTAMP(7)

            /// <summary>
            /// Ngày kết thúc
            /// </summary>
            public DateTime? EndDate { get; set; } // TIMESTAMP(7)

            /// <summary>
            /// Trạng thái kế hoạch
            /// </summary>
            public string Status { get; set; } // NVARCHAR2

            /// <summary>
            /// Ghi chú
            /// </summary>
            public string GhiChu { get; set; } // NVARCHAR2

            /// <summary>
            /// Phương án thu thập
            /// </summary>
            public string Method { get; set; } // NVARCHAR2

            /// <summary>
            /// Kết quả dự kiến
            /// </summary>
            public string Outcome { get; set; } // NVARCHAR2
       

    }
}

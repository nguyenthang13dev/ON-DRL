using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TD_UngVienService.ViewModel
{
    public class TD_UngVienTongQuanVM
    {
        public int totalCandidates { get; set; }
        public int daNhanViec { get; set; }
        public int dangChoPhongVan { get; set; }
        public int daXetDuyet { get; set; }
        public int daTuChoi { get; set; }
        public int chuaXetDuyet { get; set; }
        public int datPhongVan { get; set; }
        public int interviewToday { get; set; }
        public int interviewThisWeek { get; set; }
        public int interviewThisMonth { get; set; }
        public double avgInterviewPerDay { get; set; }
        public double conversionRate { get; set; }
        public double interviewRate { get; set; }
    }
}

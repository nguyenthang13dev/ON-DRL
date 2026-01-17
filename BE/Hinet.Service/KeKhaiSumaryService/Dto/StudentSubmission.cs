using Hinet.Service.Constant;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.KeKhaiSumaryService.Dto
{
    public class StudentSubmission
    {
        public string StudentId { get; set; }
        public Guid UserId { get; set; }
        public Guid FormId { get; set; }
        public string ClassName { get; set; }
        public int Status { get; set; }
        public DateTime SubmitDate { get; set; }
        public decimal? Progress { get; set; }
        public string StudentName { get; set; }
        public string StatusStr => this.Status == StatusConstant.GUIGIAOVIEN ? "Gửi giáo viên" : "Gửi lớp trưởng";

    }
}

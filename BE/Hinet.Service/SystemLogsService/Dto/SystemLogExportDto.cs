using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.SystemLogsService.Dto
{
    public class SystemLogExportDto
    {
        [DisplayName("Tên tài khoản")]
        public string? UserName { get; set; }
        [DisplayName("Thời gian")]
        public DateTime? Timestamp { get; set; }
        [DisplayName("Địa chỉ IP")]
        public string? IPAddress { get; set; }
        [DisplayName("Loại")]
        public string? Level { get; set; }
        [DisplayName("Nội dung")]
        public string? Message { get; set; }
    }
}

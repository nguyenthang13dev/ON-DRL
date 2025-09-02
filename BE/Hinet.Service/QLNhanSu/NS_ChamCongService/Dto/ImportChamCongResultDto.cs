using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_ChamCongService.Dto
{
    public class ImportChamCongResultDto
    {
        public int TotalRecords { get; set; }          // Tổng số bản ghi quét qua
        public int TotalRecordsSuccess { get; set; }   // Số bản ghi thành công
        public int TotalRecordsError { get; set; }     // Số bản ghi lỗi
        public List<string> Errors { get; set; } = new();
    }
}

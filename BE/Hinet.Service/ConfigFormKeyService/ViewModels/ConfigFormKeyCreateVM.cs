using Hinet.Model.Entities.ConfigAssign;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.ConfigFormKeyService.ViewModels
{
    public class ConfigFormKeyCreateVM
    {
        // Có bắt buộc
        public bool IsRquired { get; set; }
        // Lưu key nội dung
        public string KTT_KEY { get; set; }
        // Lưu type
        public string KTT_TYPE { get; set; }
        //// Lưu kiểu nhập
        public ConfigForm? FormId { get; set; }
    }
}

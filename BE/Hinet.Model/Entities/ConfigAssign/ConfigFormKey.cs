using MongoDbGenericRepository.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.ConfigAssign
{
    [CollectionName("ConfigFormKey")]
    public class ConfigFormKey : AuditableEntity
    {

        public bool IsSystem { get; set; }
        public string DefaultKey { get; set; }
        public int? Min { get; set; }
        public int? Max { get; set; }

        // Có bắt buộc
        public bool IsRequired { get; set; }
        // Lưu key nội dung
        public string KTT_KEY { get; set; }
        // Lưu type
        public string KTT_TYPE { get; set; }
        // Lưu kiểu nhập
        public ConfigForm FormId { get; set; }
    }
}

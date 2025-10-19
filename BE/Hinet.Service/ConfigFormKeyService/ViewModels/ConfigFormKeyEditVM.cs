using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.ConfigFormKeyService.ViewModels
{
    public class ConfigFormKeyEditVM
    {
        public string? KTT_KEY { get; set; }
        public string? KTT_TYPE { get; set; }
        public int? Min { get; set; }
        public int? Max { get; set; }
        public bool IsSystem { get; set; }
        public bool IsRequired { get; set; }
        public string? DefaultKey { get; set; }
        public Guid ConfigId { get; set; }

    }
}

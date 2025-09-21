using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.ConfigFormKeyService.ViewModels
{
    public class ConfigFormKeyEditVM
    {
        public string KTT_KEY { get; set; }
        public string Type { get; set; }
        public int? Min { get; set; }
        public int? Max { get; set; }

        public Guid ConfigId { get; set; }

    }
}

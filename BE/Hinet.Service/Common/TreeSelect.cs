using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Common
{
    public class TreeSelect
    {
        public string Value { get; set; }
        public string Title { get; set; }
        public List<TreeSelect>? Children { get; set; }
    }
}

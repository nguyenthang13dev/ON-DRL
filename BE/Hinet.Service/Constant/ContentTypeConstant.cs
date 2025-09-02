using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant
{
    public class ContentTypeConstant
    {
        [DisplayName("application/json")]
        public static string applicationjson { get; set; } = "application/json";
        [DisplayName("text/json")]
        public static string textjson { get; set; } = "text/json";
        [DisplayName("application/xml")]
        public static string applicationxml { get; set; } = "application/xml";
        [DisplayName("text/xml")]
        public static string textxml { get; set; } = "text/xml";
    }
}

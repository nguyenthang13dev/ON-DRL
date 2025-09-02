using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Encrypt.Models
{
    public class DecryptedResult
    {
        public string PlainTextJson { get; set; }
        public byte[] AesKey { get; set; }
        public byte[] AesIV { get; set; }
    }

    public class DecryptedResultByte
    {
        public byte[] PlainByte { get; set; }
        public byte[] AesKey { get; set; }
        public byte[] AesIV { get; set; }
    }

}

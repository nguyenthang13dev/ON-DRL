using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Encrypt.Models
{
    public class EncryptedResult
    {

        public byte[] EncryptedPayload { get; set; }
        public byte[] EncryptedAesKey { get; set; }
        public byte[] Signature { get; set; }
    }

    public class EncryptedResultRaw
    {

        public string EncryptedPayload { get; set; }
        public string EncryptedAesKey { get; set; }
        public string Signature { get; set; }
    }
}

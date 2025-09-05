using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Constant;

namespace Hinet.Service.KySoInfoService.Dto
{
    public class CertificateInfo
    {
        public bool InvalidSignature
        {
            get
            {
                return SignersIdentity && !DocumentModified;
            }
        }

        public string? CN { get; set; }
        public string? SignedAt { get; set; }
        public bool SignersIdentity { get; set; }
        public bool DocumentModified { get; set; }
    }
}

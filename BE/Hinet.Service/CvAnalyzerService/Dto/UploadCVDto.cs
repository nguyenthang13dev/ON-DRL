using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.CvAnalyzerService.Dto
{
    public class UploadCVDto
    {
            public Guid TuyenDungId { get; set; }
            public List<IFormFile> Files { get; set; }
    }
}

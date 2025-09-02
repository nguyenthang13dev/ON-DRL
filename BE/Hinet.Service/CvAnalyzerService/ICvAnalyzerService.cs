using Hinet.Service.CvAnalyzerService.Dto;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.CvAnalyzerService
{
    public interface ICvAnalyzerService
    {
        Task<CvAnalyzeDto> AnalyzeCvAsync(IFormFile file);
    }
}

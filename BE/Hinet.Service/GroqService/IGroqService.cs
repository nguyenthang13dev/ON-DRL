using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.GroqService
{
    public interface IGroqService
    {
        Task<string> AnalyzeCvTextAsync(string cvText);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Common.Service
{
    public interface IHasId<TKey>
    {
        TKey Id { get; set; }
    }
}

using Hinet.Model.MongoEntities;
using Hinet.Service.Common.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.SoLieuKeKhaiService
{
    public interface ISoLieuKeKhaiService : IService<SoLieuKeKhai>
    {
        Task<List<SoLieuKeKhai>> GetConfsByFormId(Guid Id);
        Task<List<SoLieuKeKhai>> GetConfsByFormIdAndUser(Guid Id, Guid UserId);
    }
}

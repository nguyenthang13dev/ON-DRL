using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.LienHeService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.LienHeService
{
    public interface ILienHeService : IService<LienHe>
    {
        Task<PagedList<LienHeDto>> GetDataAll(LienHeSearchDto search);
        Task<LienHe> GetById(Guid id);
        Task<LienHeDto> GetDtoByID(Guid id);
    }
}

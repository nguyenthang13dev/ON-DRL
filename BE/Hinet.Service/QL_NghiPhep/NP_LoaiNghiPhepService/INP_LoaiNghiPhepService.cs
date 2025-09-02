using Hinet.Model.Entities;
using Hinet.Model.Entities.NghiPhep;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;
using Hinet.Service.QL_NghiPhep.NP_LoaiNghiPhepService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QL_NghiPhep.NP_LoaiNghiPhepService
{
    public interface INP_LoaiNghiPhepService : IService<NP_LoaiNghiPhep>
    {
        Task<PagedList<NP_LoaiNghiPhepDto>> GetData(NP_LoaiNghiPhepSearchDto search);
        Task<NP_LoaiNghiPhep> GetById(Guid id);
        Task<List<DropdownOption>> GetDropdown();
        Task<NP_LoaiNghiPhep> GetByMa(string MaLoaiPhep);
    }
}

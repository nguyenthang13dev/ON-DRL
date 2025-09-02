using Hinet.Model.Entities.TuyenDung;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.TD_UngVienService.Dto;
using Hinet.Service.TD_UngVienService.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TD_UngVienService
{
    public interface ITD_UngVienService : IService<TD_UngVien>
    {
        Task<PagedList<TD_UngVienDto>> GetData(TD_UngVienSearch search);
        Task<TD_UngVienDto> GetDto(Guid id);

        Task UpdateAsyncFixTracked(TD_UngVien ungVien);
        Task SendMailToUngViens(List<Guid> ungVienIds, Guid? emailTemplateId,string? emailTemplateCode);
    }
}

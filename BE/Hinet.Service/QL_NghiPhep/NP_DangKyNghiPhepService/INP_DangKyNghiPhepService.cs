using Hinet.Model.Entities;
using Hinet.Model.Entities.NghiPhep;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.QL_NghiPhep.NP_DangKyNghiPhepService.Dto;
using Hinet.Service.QL_NghiPhep.NP_DangKyNghiPhepService.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QL_NghiPhep.NP_DangKyNghiPhepService
{
    public interface INP_DangKyNghiPhepService : IService<NP_DangKyNghiPhep>
    {
        Task<PagedList<NP_DangKyNghiPhepDto>> GetData(NP_DangKyNghiPhepSearchDto search, Guid UserId);
        Task<NP_DangKyNghiPhep> GetById(Guid id);
        Task<NP_DangKyNghiPhep> GetDonNghiPhepTaoMoi(string MaNhanSu);
        Task<string> ConfigUploadDataUseLibreOffice(ConfigUploadForm configUploadForm);
        Task<TaiLieuDinhKem> GetTaiLieuDinhKem();
        Task<NP_DangKyNghiPhep> PheDuyetNghiPhep(Guid Id, Guid UserId);
        Task<NP_DangKyNghiPhep> TrinhNghiPhep(Guid Id, Guid UserId);
        Task<NP_DangKyNghiPhep> TuChoiNghiPhep(Guid Id, TuChoiVM model, Guid UserId);
        Task<NgayPhepDto> GetSoNgayPhep(Guid UserId);
        Task<PreviewDto> PreviewNghiPhep(Guid UserId, Guid Id);
        Task<ThongKeNghiPhepDto> ThongKeNghiPhep(Guid UserId);
        Task<NP_DangKyNghiPhep> Create(NP_DangKyNghiPhep nP_DangKyNghiPhep, Guid? UserId);
        Task<bool> DeleteNghiPhep(Guid Id, Guid UserId);
    }
}

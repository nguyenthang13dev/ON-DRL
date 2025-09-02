using Hinet.Model.Entities;
using Hinet.Service.DA_KeHoachThucHienService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.DA_KeHoachThucHienService.ViewModels;

namespace Hinet.Service.DA_KeHoachThucHienService
{
    public interface IDA_KeHoachThucHienService : IService<DA_KeHoachThucHien>
    {
        Task<PagedList<DA_KeHoachThucHienDto>> GetData(DA_KeHoachThucHienSearch search);
        Task<DA_KeHoachThucHienDto?> GetDto(Guid id);

        Task<string> ExportKeHoachThucHien(Guid duAnId, bool isKeHoachNoiBo);

        Task<List<DA_KeHoachThucHienTree>> getDropDownKeHoachThuchien(Guid id, bool isKeHoachNoiBo);
        Task<List<DA_KeHoachThucHienTree>> getDropDownKeHoachThuchienTemplate(Guid id, bool isKeHoachNoiBo);

        Task<List<DA_KeHoachThucHien>> SaveImportDataIntoExcel(List<DA_KeHoachThucHienCreateVM> dA_KeHoachThucHienCreateVMs, Guid duAnId, bool isKeHoachNoiBo);
    }
}

using Hinet.Model.Entities;
using Hinet.Service.UC_UseCaseService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;
using Hinet.Service.UC_MoTa_UseCaseService.ViewModels;
using Microsoft.AspNetCore.Http;

namespace Hinet.Service.UC_UseCaseService
{
    public interface IUC_UseCaseService : IService<UC_UseCase>
    {
        Task<PagedList<UC_UseCaseDto>> GetData(UC_UseCaseSearch search);
        Task<UC_UseCaseDto> GetDto(Guid id);

        Task<List<UseCaseData2Level>> GetDataIntoMotaUsecase(Guid DuAnId);


        Task<ReadExcelResult> ReadImportExcel(IFormFile fileTestCase, Guid idDuAn);

        Task<List<UseCaseData2Level>> SaveRange(List<UseCaseData2Level> listdatatree,Guid DuAnId);

        Task<UseCaseData2Level> createUseCaseAndTestcase(UseCaseData2Level useCaseData, Guid DuAnId);

        Task<string> ExportExcel(Guid duAnId);


    }
}

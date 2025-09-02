using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Model.Entities.DuAn;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.DA_NhatKyTrienKhaiService.Dto;
using Hinet.Service.DA_NhatKyTrienKhaiService.ViewModels;
using Microsoft.AspNetCore.Http;

namespace Hinet.Service.DA_NhatKyTrienKhaiService
{
    public interface IDA_NhatKyTrienKhaiService : IService<DA_NhatKyTrienKhai>
    {

        Task<DA_NhatKyTrienKhaiReponseImportExcel> ReadNhatKyTrienKhai(IFormFile fileNhatKyTrienKhai, Guid idDuAn);

        Task<List<DA_NhatKyTrienKhai>> CreateRangeTrienKhai(List<DA_NhatKyTrienKhai> listdA_NhatKyTrienKhais);

        Task<PagedList<DA_NhatKyTrienKhaiDto>> GetData(DA_NhatKyTrienKhaiSearchVM search);

        Task<UrlFilePath> ExportWordNhatKyTrienKhai(Guid duAnId,string title="phanCong");

        Task<UrlFilePath> ExportWordNhatKyTrienKhaiTuKeHoachThucHien(Guid duAnId, bool isDay);

    }
}

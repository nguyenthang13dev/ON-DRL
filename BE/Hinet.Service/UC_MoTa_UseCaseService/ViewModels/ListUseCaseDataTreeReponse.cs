using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Model.Entities;
using Hinet.Service.UC_UseCaseService.ViewModels;

namespace Hinet.Service.UC_MoTa_UseCaseService.ViewModels
{
    public class ListUseCaseDataTreeReponse :UseCaseReadExcel
    {

        public List<ListUseCaseDataTreeReponse> listUseCaseDataTrees { get; set; }

        public int SoLuongThanhCong { get; set; }
        public int SoLuongThatBai { get; set; }
    }

    public class UseCaseData2Level: UC_UseCase
    {

        public List<UC_MoTa_UseCase> listUC_mota { get; set; } = new List<UC_MoTa_UseCase>();


    }
    public class CreateUseCaseData2Level : UC_UseCaseCreateVM
    {
        public List<UC_MoTa_UseCase>? listUC_mota { get; set; } = new List<UC_MoTa_UseCase>();
    }

    public class ReadExcelResult
    {
        public int SoLuongThanhCong { get; set; }
        public int SoLuongThatBai { get; set; }
        public List<UseCaseReadExcel> Data { get; set; } = new();
    }
}

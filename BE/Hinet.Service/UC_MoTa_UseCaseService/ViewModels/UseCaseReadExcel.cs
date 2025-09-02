using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Model.Entities;
using Newtonsoft.Json;

namespace Hinet.Service.UC_MoTa_UseCaseService.ViewModels
{
    public class UseCaseReadExcel : UC_UseCase
    {

        [JsonProperty("listUC_mota")]
        public List<UC_MoTa_UseCase> listUC_mota { get; set; } = new List<UC_MoTa_UseCase>();
        public int RowIndex { get; set; }
        public List<string> Errors { get; set; } = new();
        public bool IsValid => Errors == null || Errors.Count == 0;

    }
}

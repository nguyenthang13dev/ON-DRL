using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Model.Entities.DuAn;

namespace Hinet.Service.DA_NhatKyTrienKhaiService.ViewModels
{
    public class DA_NhatKyTrienKhaiReponseImportExcel
    {
        public List<DA_NhatKyTrienKhaiImportItemDto> listDA_NhatKyTrienKhai { get; set; } = new List<DA_NhatKyTrienKhaiImportItemDto>();

        public int SoLuongThanhCong { get; set; }
        public int SoLuongThatBai { get; set; }

    }


    public class DA_NhatKyTrienKhaiImportItemDto
    {
        public DA_NhatKyTrienKhai Data { get; set; }
        public int RowIndex { get; set; }
        public List<string> Errors { get; set; } = new();
        public bool IsValid => Errors == null || Errors.Count == 0;
    }

}

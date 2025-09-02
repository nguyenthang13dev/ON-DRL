using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.FileManagerService.ViewModels
{
    public class FileManagerUploadFileVM
    {
        public Guid? ParentId { get; set; }
        public IFormFile File { get; set; }
        public string LoaiVanBan { get; set; }
        public string SoKyHieu { get; set; }
        public DateTime? NgayBanHanh { get; set; }
        public string? TrichYeu { get; set; }


    }
}

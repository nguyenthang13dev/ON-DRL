using Hinet.Model.Entities;
using Hinet.Service.DA_KeHoachThucHienService.ViewModels;
using Hinet.Service.DA_PhanCongService.ViewModels;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.DA_DuAnService.ViewModels
{
    public class DA_DuAnCreateVM
    {

        public Guid? Id { get; set; }
		public string? TenDuAn {get; set; }
		public DateTime? NgayBatDau {get; set; }
		public DateTime? NgayKetThuc {get; set; }
		public string? MoTaDuAn {get; set; }
		public DateTime? NgayTiepNhan {get; set; }
		public string? YeuCauDuAn {get; set; }
		public Int16? TrangThaiThucHien {get; set; }
		public DateTime? TimeCaiDatMayChu {get; set; }
		public bool? IsBackupMayChu {get; set; }
		public string? LinkDemo {get; set; }
		public string? LinkThucTe {get; set; }
        public string? TenGoiThau { get; set; }
        public string? DiaDiemTrienKhai { get; set; }
        public string? ChuDauTu { get; set; }

        public List<DA_PhanCongCreateVM> PhanCongList { get; set; } = new List<DA_PhanCongCreateVM>();
		public List<DA_KeHoachThucHienCreateVM> KeHoachList { get; set; } = new List<DA_KeHoachThucHienCreateVM>();

    }
}
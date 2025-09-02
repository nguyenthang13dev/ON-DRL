using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.DA_KeHoachThucHienService.ViewModels
{
    public class DA_KeHoachThucHienCreateVM
    {
        public string? Stt { get; set; }
        public string? Group { get; set; }
        public bool? IsGroup { get; set; }
        public Guid DuAnId { get; set; }
        public Guid? GroupNoiDungId { get; set; }
        public DateTime? NgayBatDau { get; set; }
        public DateTime? NgayKetThuc { get; set; }
        public Int32? CanhBaoTruocNgay { get; set; }
        public bool IsKeHoachNoiBo { get; set; }
        public bool IsCanhBao { get; set; }
        public string? NoiDungCongViec { get; set; }
        public string? PhanCong {get;set;}

        public string? PhanCongKH { get; set; }
        public string ? NoiDungCongViecCon { get; set; }
        public int ? Progress { get; set; }



    }
}
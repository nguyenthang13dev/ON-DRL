using Hinet.Model.Entities;

namespace Hinet.Service.DA_NoiDungCuocHopService.Dto
{
    public class DA_NoiDungCuocHopDto : DA_NoiDungCuocHop
    {
        public string LoaiCuocHopText
        {
            get
            {
                return IsNoiBo ? "Review nội bộ" : "Họp với khách hàng";
            }
        }
        public int SoTaiLieu { get; set; } = 0;
        public string? ThanhPhanThamGiaText { get; set; }
        public List<TaiLieuUpload> ListTaiLieu { get; set; } = new List<TaiLieuUpload>();
    }
}

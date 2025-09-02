using Hinet.Model.Entities.TuyenDung;

namespace Hinet.Service.TD_UngVienService.ViewModel
{
    public class TD_UngVienUpdateStatusVM
    {
        public List<Guid> Ids { get; set; }
        public TrangThai_UngVien TrangThai { get; set; }
        public string? GhiChu { get; set; }
    }
}
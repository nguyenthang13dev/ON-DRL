using Hinet.Model.Entities;

namespace Hinet.Model.MongoEntities
{
    public class LichSuXuLyHoSo : AuditableEntity
    {
        public Guid NguoiXuLyId { get; set; }
        public Guid NguoiTiepNhanId { get; set; }
        public Guid? NguoiThamGiaIds { get; set; }
        public Guid BuocXuLyId { get; set; }
        public DateTime NgayXuLy { get; set; }
        public bool IsTraVe { get; set; } = false;
    }
}

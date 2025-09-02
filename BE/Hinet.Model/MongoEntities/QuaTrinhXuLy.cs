using Hinet.Model.Entities;

namespace Hinet.Model.MongoEntities
{
    public class QuaTrinhXuLyHoSo : AuditableEntity
    {
        public long? IdNguoiXuLy { get; set; }
        public long? DepartmentId { get; set; }
        public bool IsDaXuLy { get; set; } = false;
        public long? TrangThaiId { get; set; }
        public string GhiChu { get; set; }
        public Guid? QuaTrinhChaId { get; set; }
    }
}

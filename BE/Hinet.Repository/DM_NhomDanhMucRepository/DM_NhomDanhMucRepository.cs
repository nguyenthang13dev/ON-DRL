using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.DM_NhomDanhMucRepository
{
    public class DM_NhomDanhMucRepository : Repository<DM_NhomDanhMuc>, IDM_NhomDanhMucRepository
    {
        public DM_NhomDanhMucRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

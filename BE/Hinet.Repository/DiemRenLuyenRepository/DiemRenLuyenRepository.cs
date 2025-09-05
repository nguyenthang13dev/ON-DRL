// Hinet.Repository/DiemRenLuyenRepository/DiemRenLuyenRepository.cs
using Hinet.Model;
using Hinet.Model.MongoEntities;

namespace Hinet.Repository.DiemRenLuyenRepository
{
    public class DiemRenLuyenRepository : Repository<DiemRenLuyen>, IDiemRenLuyenRepository
    {
        public DiemRenLuyenRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

// Hinet.Service/DiemRenLuyenService/DiemRenLuyenService.cs
using Hinet.Model.MongoEntities;
using Hinet.Repository.DiemRenLuyenRepository;
using Hinet.Service.Common.Service;


namespace Hinet.Service.DiemRenLuyenService
{
    public class DiemRenLuyenService : Service<DiemRenLuyen>, IDiemRenLuyenService
    {
        private readonly IDiemRenLuyenRepository _diemRenLuyenRepository;

        public DiemRenLuyenService(IDiemRenLuyenRepository diemRenLuyenRepository) : base(diemRenLuyenRepository)
        {
            _diemRenLuyenRepository = diemRenLuyenRepository;
        }

        // Implement specialized methods here
    }
}

// Hinet.Service/DangKyHocPhanService/DangKyHocPhanService.cs
using Hinet.Model.MongoEntities;
using Hinet.Repository.DangKyHocPhanRepository;
using Hinet.Service.Common.Service;

namespace Hinet.Service.DangKyHocPhanService
{
    public class DangKyHocPhanService : Service<DangKyHocPhan>, IDangKyHocPhanService
    {
        private readonly IDangKyHocPhanRepository _dangKyHocPhanRepository;

        public DangKyHocPhanService(IDangKyHocPhanRepository dangKyHocPhanRepository) : base(dangKyHocPhanRepository)
        {
            _dangKyHocPhanRepository = dangKyHocPhanRepository;
        }

        // Implement specialized methods here
    }
}

using Hinet.Model.MongoEntities;
using Hinet.Repository.SinhVienRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.SinhVienService
{
    public class SinhVienService : Service<SinhVien>, ISinhVienService
    {
        private readonly ISinhVienRepository _sinhVienRepository;

        public SinhVienService(ISinhVienRepository sinhVienRepository) : base(sinhVienRepository)
        {
            _sinhVienRepository = sinhVienRepository;
        }

        // Implement specialized methods here
    }
}

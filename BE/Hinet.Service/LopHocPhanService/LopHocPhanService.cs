// Hinet.Service/LopHocPhanService/LopHocPhanService.cs
using Hinet.Model.MongoEntities;
using Hinet.Repository.LopHocPhanRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.LopHocPhanService
{
    public class LopHocPhanService : Service<LopHocPhan>, ILopHocPhanService
    {
        private readonly ILopHocPhanRepository _lopHocPhanRepository;

        public LopHocPhanService(ILopHocPhanRepository lopHocPhanRepository) : base(lopHocPhanRepository)
        {
            _lopHocPhanRepository = lopHocPhanRepository;
        }

        // Implement specialized methods here
    }
}

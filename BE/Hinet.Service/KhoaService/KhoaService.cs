// Hinet.Service/KhoaService/KhoaService.cs
using Hinet.Model.MongoEntities;
using Hinet.Repository.KhoaRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;

namespace Hinet.Service.KhoaService
{
    public class KhoaService : Service<Khoa>, IKhoaService
    {
        private readonly IKhoaRepository _khoaRepository;

        public KhoaService(IKhoaRepository khoaRepository) : base(khoaRepository)
        {
            _khoaRepository = khoaRepository;
        }

        // Implement specialized methods here
    }
}

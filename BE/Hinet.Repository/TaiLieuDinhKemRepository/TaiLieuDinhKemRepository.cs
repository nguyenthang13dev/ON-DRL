using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.TaiLieuDinhKemRepository
{
    public class TaiLieuDinhKemRepository : Repository<TaiLieuDinhKem>, ITaiLieuDinhKemRepository
    {
        public TaiLieuDinhKemRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

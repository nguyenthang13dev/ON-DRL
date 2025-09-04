using Hinet.Model;
using Hinet.Model.Entities;

namespace Hinet.Repository.TypeDanhMucRepository
{
    public class TypeDanhMucRepository : Repository<TypeDanhMuc>, ITypeDanhMucRepository
    {
        public TypeDanhMucRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

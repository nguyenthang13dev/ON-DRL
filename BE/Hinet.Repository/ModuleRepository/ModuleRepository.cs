using Hinet.Model;
using Hinet.Model.Entities;


namespace Hinet.Repository.ModuleRepository
{
    public class ModuleRepository : Repository<Module>, IModuleRepository
    {
        public ModuleRepository(HinetMongoContext context) : base(context)
        {
        }
    }
}

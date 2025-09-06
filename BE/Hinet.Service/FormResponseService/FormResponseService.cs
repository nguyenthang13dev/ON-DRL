using Hinet.Model.MongoEntities;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.FormResponseRepository;
using Hinet.Repository.FormTemplateRepository;
using Hinet.Repository.RoleRepository;
using Hinet.Repository.UserRoleRepository;
using Hinet.Service.Common.Service;
using Microsoft.Extensions.Caching.Memory;

namespace Hinet.Service.FormResponseService
{
    public class FormResponseService : Service<FormResponse>, IFormResponseService
    {
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IAppUserRepository _appUserRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IMemoryCache _cache;
        private readonly IFormResponseRepository _formResponseRepository;

        public FormResponseService(
            IUserRoleRepository userRoleRepository, 
            IAppUserRepository appUserRepository, 
            IRoleRepository roleRepository, 
            IMemoryCache cache, 
            IFormResponseRepository formResponseRepository) 
            : base(formResponseRepository)
        {
            _userRoleRepository = userRoleRepository;
            _appUserRepository = appUserRepository;
            _roleRepository = roleRepository;
            _cache = cache;
        }


    }
}
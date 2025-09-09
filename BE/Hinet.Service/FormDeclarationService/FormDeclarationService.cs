using DocumentFormat.OpenXml.Packaging;
using Hinet.Model.MongoEntities;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.FormDeclarationRepository;
using Hinet.Repository.RoleRepository;
using Hinet.Repository.UserRoleRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.FormDeclarationService.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using OpenXmlPowerTools;
using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace Hinet.Service.FormDeclarationService
{
    public class FormDeclarationService : Service<FormDeclaration>, IFormDeclarationService
    {
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IAppUserRepository _appUserRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IMemoryCache _cache;
        private readonly IFormDeclarationRepository _formDeclarationRepository;

        public FormDeclarationService(
            IFormDeclarationRepository formDeclarationRepository,
            IUserRoleRepository userRoleRepository,
            IAppUserRepository appUserRepository,
            IRoleRepository roleRepository,
            IMemoryCache cache) : base(formDeclarationRepository)
        {
            _userRoleRepository = userRoleRepository;
            _appUserRepository = appUserRepository;
            _roleRepository = roleRepository;
            _cache = cache;
            _formDeclarationRepository = formDeclarationRepository;
        }

    }
}
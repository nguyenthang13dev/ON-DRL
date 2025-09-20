using Hinet.Model.MongoEntities;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.FormDeclarationRepository;
using Hinet.Repository.RoleRepository;
using Hinet.Repository.UserRoleRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.FormDeclarationService.Dto;
using Microsoft.Extensions.Caching.Memory;
using MongoDB.Driver.Linq;

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

        public async Task<PagedList<FormDeclarationDto>> GetData(FormDeclarationSearchDto search)
        {
            var userQuery = _appUserRepository.GetQueryable();
            var declarationQuery = GetQueryable();
            var query = from q in declarationQuery
                        join u in userQuery
                        on q.UserId equals u.Id into userGroup
                        from u in userGroup
                        select new FormDeclarationDto
                        {
                            Id = q.Id,
                            FormTemplateId = q.FormTemplateId,
                            UserId = q.UserId,
                            DeclaringUser = u.Name ?? "",
                            Status = q.Status,
                            Declaration = q.Declaration,
                            CreatedId = q.CreatedId,
                            UpdatedId = q.UpdatedId,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            IsDelete = q.IsDelete,
                        };

            if (search != null)
            {
                if (search.FormTemplateId.HasValue)
                {
                    query = query.Where(x => x.FormTemplateId == search.FormTemplateId.Value);
                }

                if (!string.IsNullOrEmpty(search.Status))
                {
                    var searchStr = search.Status.Trim().ToLower();
                    query = query.Where(x => x.Status.ToLower().Equals(searchStr));
                }

                if (!string.IsNullOrEmpty(search.DeclaringUser))
                {
                    var searchStr = search.DeclaringUser.Trim().ToLower();
                    query = query.Where(x => x.DeclaringUser.ToLower().Equals(searchStr));
                }

                if (search.FromDate.HasValue)
                {
                    var searchDate = search.FromDate.Value.Date;
                    query = query.Where(x => x.CreatedDate >= searchDate);
                }

                if (search.EndDate.HasValue)
                {
                    var searchDate = search.EndDate.Value.AddDays(1).Date;
                    query = query.Where(x => x.CreatedDate < searchDate);
                }
            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<FormDeclarationDto>.CreateAsync(query, search);
            return result;
        }
    }
}
using Hinet.Model.MongoEntities;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.FormDeclarationRepository;
using Hinet.Repository.RoleRepository;
using Hinet.Repository.UserRoleRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.FormDeclarationService.Dto;
using Microsoft.Extensions.Caching.Memory;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver.Linq;
using System.Text.Json;

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
                            Name = q.Name,
                            UserId = q.UserId,
                            Declarant = u.Name ?? "",
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
                    query = query.Where(x => x.Declarant.ToLower().Equals(searchStr));
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

        public async Task<FormDeclaration> CreateAsync(FormDeclarationCreateDto dto)
        {
            var cleaned = new Dictionary<string, object>();
            foreach (var kvp in dto.Declaration)
            {
                if (kvp.Value is JsonElement element)
                {
                    cleaned[kvp.Key] = ConvertJsonElement(element);
                }
                else
                {
                    cleaned[kvp.Key] = kvp.Value;
                }
            }
            var newDeclaration = new FormDeclaration
            {
                FormTemplateId = dto.FormTemplateId,
                Name = dto.Name,
                UserId = dto.UserId,
                Declaration = cleaned
            };
            await base.CreateAsync(newDeclaration);
            return newDeclaration;
        }

        private object ConvertJsonElement(JsonElement element)
        {
            switch (element.ValueKind)
            {
                case JsonValueKind.String:
                    return element.GetString();
                case JsonValueKind.Number:
                    if (element.TryGetInt64(out long l))
                        return l;
                    if (element.TryGetDouble(out double d))
                        return d;
                    return element.GetRawText();
                case JsonValueKind.True:
                case JsonValueKind.False:
                    return element.GetBoolean();
                case JsonValueKind.Object:
                    var dict = new Dictionary<string, object>();
                    foreach (var prop in element.EnumerateObject())
                        dict[prop.Name] = ConvertJsonElement(prop.Value);
                    return dict;
                case JsonValueKind.Array:
                    var list = new List<object>();
                    foreach (var item in element.EnumerateArray())
                        list.Add(ConvertJsonElement(item));
                    return list;
                case JsonValueKind.Null:
                    return null;
                default:
                    return element.GetRawText();
            }
        }
    }
}
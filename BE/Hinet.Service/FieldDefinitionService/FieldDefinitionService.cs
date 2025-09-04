using Hinet.Model.MongoEntities;
using Hinet.Repository.FieldDefinitionRepository;
using Hinet.Repository.FormTemplateRepository;
using Hinet.Service.Common.Service;
using Microsoft.Extensions.Caching.Memory;

namespace Hinet.Service.FieldDefinitionService
{
    public class FieldDefinitionService : Service<FieldDefinition>, IFieldDefinitionService
    {
        private readonly IMemoryCache _cache;
        private readonly TimeSpan _defaultCacheDuration = TimeSpan.FromHours(1);
        private readonly IFieldDefinitionRepository _fieldDefinitionRepository;
        private readonly IFormTemplateRepository _formTemplateRepository;

        public FieldDefinitionService(
            IMemoryCache cache,
            TimeSpan defaultCacheDuration,
            IFieldDefinitionRepository fieldDefinitionRepository,
            IFormTemplateRepository formTemplateRepository) : base(fieldDefinitionRepository)
        {
            _cache = cache;
            _defaultCacheDuration = defaultCacheDuration;
            _fieldDefinitionRepository = fieldDefinitionRepository;
            _formTemplateRepository = formTemplateRepository;
        }

    }
}
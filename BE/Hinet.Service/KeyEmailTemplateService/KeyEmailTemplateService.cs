using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hinet.Model.Entities;
using Hinet.Repository.KeyEmailTemplateRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Core.Mapper;
using Hinet.Service.EmailTemplateService.Dto;
using Hinet.Service.EmailTemplateService.ViewModel;
using Hinet.Service.KeyEmailTemplateService.Dto;
using Hinet.Service.KeyEmailTemplateService.ViewModel;

namespace Hinet.Service.KeyEmailTemplateService
{
    public class KeyEmailTemplateService : Service<KeyEmailTemplate>, IKeyEmailTemplateService
    {
        private readonly IKeyEmailTemplateRepository _repository;
        private readonly IMapper _mapper;

        public KeyEmailTemplateService(IKeyEmailTemplateRepository repository, IMapper mapper) : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<PagedList<KeyEmailTemplateDto>> GetData(KeyEmailTemplateSearchVM keyEmailTemplateSearchVM)
        {
            var query = _repository.GetQueryable();
            if (keyEmailTemplateSearchVM.EmailTemplateId != null && keyEmailTemplateSearchVM.EmailTemplateId != Guid.Empty)
            {
                query = query.Where(x => x.EmailTemplateId == keyEmailTemplateSearchVM.EmailTemplateId);
            }
            var total = query.Count();
            var items = query.OrderByDescending(x => x.CreatedDate)
              .Skip((keyEmailTemplateSearchVM.PageIndex - 1) * keyEmailTemplateSearchVM.PageSize)
              .Take(keyEmailTemplateSearchVM.PageSize)
              .ToList();
            var result = items.Select(x => new KeyEmailTemplateDto
            {
                Id = x.Id,
                EmailTemplateId = x.EmailTemplateId,
                Key = x.Key,
                Value = x.Value
            }).ToList();
            return new PagedList<KeyEmailTemplateDto>(result, total, keyEmailTemplateSearchVM.PageIndex, keyEmailTemplateSearchVM.PageSize);
        }

        public async Task<KeyEmailTemplateDto> GetDto(Guid id)
        {
            var entity = _repository.GetQueryable().Where(x => x.Id == id).FirstOrDefault();
            if (entity == null) return null;
            return new KeyEmailTemplateDto
            {
                Id = entity.Id,
                EmailTemplateId = entity.EmailTemplateId,
                Key = entity.Key,
                Value = entity.Value
            };
        }

        public async Task<KeyEmailTemplateDto> GetExistKey(string key, Guid EmailTemplateId)
        {
            try
            {
                var entity = _repository.GetQueryable().Where(x => x.EmailTemplateId == EmailTemplateId && x.Key == key).FirstOrDefault();
                if (entity == null) return null;
                return new KeyEmailTemplateDto
                {
                    Id = entity.Id,
                    EmailTemplateId = entity.EmailTemplateId,
                    Key = entity.Key,
                    Value = entity.Value
                };
            }
            catch (Exception e)
            {
                Console.WriteLine();
                throw;
            }

        }
    }
}
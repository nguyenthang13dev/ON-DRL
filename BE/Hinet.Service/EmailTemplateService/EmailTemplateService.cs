using Hinet.Model.Entities;
using Hinet.Repository.EmailTemplateRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.EmailTemplateService.Dto;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Hinet.Service.EmailTemplateService.ViewModel;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Common;
using Hinet.Service.KeyEmailTemplateService;
using Hinet.Service.KeyEmailTemplateService.ViewModel;
using Hinet.Service.KeyEmailTemplateService.Dto;
using Hinet.Repository.KeyEmailTemplateRepository;
using Hinet.Repository.DM_DuLieuDanhMucRepository;

namespace Hinet.Service.EmailTemplateService
{
    public class EmailTemplateService : Service<EmailTemplate>, IEmailTemplateService
    {
        private readonly IEmailTemplateRepository _repository;
        private readonly IKeyEmailTemplateRepository _keyEmailService;
        private readonly IDM_DuLieuDanhMucRepository _dM_DuLieuDanhMucRepository;
        private readonly IMapper _mapper;
        public EmailTemplateService(IEmailTemplateRepository repository, IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository, IMapper mapper, IKeyEmailTemplateRepository keyEmailService) : base(repository)
        {
            _repository = repository;
            _mapper = mapper;
            _dM_DuLieuDanhMucRepository = dM_DuLieuDanhMucRepository;
            _keyEmailService = keyEmailService;
        }
        public async Task<PagedList<EmailTemplateDto>> GetData(EmailTemplateSearch emailTemplateSearch)
        {
            var query = _repository.GetQueryable();
            if (!string.IsNullOrEmpty(emailTemplateSearch.Code))
                query = query.Where(x => x.Code.ToLower().Contains(emailTemplateSearch.Code.ToLower()));
            if (emailTemplateSearch.IsActive.HasValue)
                query = query.Where(x => x.IsActive == emailTemplateSearch.IsActive);
            if (!string.IsNullOrEmpty(emailTemplateSearch.Name))
                query = query.Where(x => x.Name.ToLower().Contains(emailTemplateSearch.Name.ToLower()));
            if (!string.IsNullOrEmpty(emailTemplateSearch.LoaiTemPlate))
                query = query.Where(x => x.LoaiTemPlate == emailTemplateSearch.LoaiTemPlate);

            var total = query.Count();
            var items = query.OrderByDescending(x => x.CreatedDate)
              .Skip((emailTemplateSearch.PageIndex - 1) * emailTemplateSearch.PageSize)
              .Take(emailTemplateSearch.PageSize)
              .ToList();

            var result = new List<EmailTemplateDto>();
            foreach (var x in items)
            {
                var keyList = await _keyEmailService.GetQueryable().Where(k => k.EmailTemplateId == x.Id).ToListAsync();
                var tenLoaiEmailtemplate = await _dM_DuLieuDanhMucRepository.GetQueryable().Where(k => k.Code == x.LoaiTemPlate).FirstOrDefaultAsync();
                result.Add(new EmailTemplateDto
                {
                    Id = x.Id,
                    Code = x.Code,
                    Name = x.Name,
                    Content = x.Content,
                    Description = x.Description,
                    LoaiTemPlate = x.LoaiTemPlate,
                    tenLoaiEmailTemPlate = tenLoaiEmailtemplate?.Name??"Không xác định",
                    IsActive = x.IsActive,
                    lstKeyEmailTemplate = keyList.Select(y => new KeyEmailTemplateDto
                    {
                        Id= y.Id,
                        EmailTemplateId = y.Id,
                        Key = y.Key,
                        Value = y.Value
                    }).ToList()
                });
            }
            return new PagedList<EmailTemplateDto>(result, total, emailTemplateSearch.PageIndex, emailTemplateSearch.PageSize);
        }

        public async Task<EmailTemplateDto> GetByCodeAsync(string code)
        {
            var entity = _repository.GetQueryable().Where(x => x.Code == code).FirstOrDefault();
            if (entity == null) return null;
            var keyList = await _keyEmailService.GetQueryable().Where(k => k.EmailTemplateId == entity.Id).ToListAsync();
            var tenLoaiEmailtemplate = await _dM_DuLieuDanhMucRepository.GetQueryable().Where(k => k.Code == entity.LoaiTemPlate).FirstOrDefaultAsync();

            return new EmailTemplateDto
            {
                Id = entity.Id,
                Code = entity.Code,
                Name = entity.Name,
                Content = entity.Content,
                Description = entity.Description,
                IsActive = entity.IsActive,
                LoaiTemPlate = entity.LoaiTemPlate,
                tenLoaiEmailTemPlate = tenLoaiEmailtemplate.Name ?? "Không xác định",
                lstKeyEmailTemplate = keyList.Select(y => new KeyEmailTemplateDto
                {
                    Id = y.Id,
                    EmailTemplateId = y.Id,
                    Key = y.Key,
                    Value = y.Value
                }).ToList()
            };
        }

        public async Task<EmailTemplateDto> getDto(Guid id)
        {
            var entity = _repository.GetQueryable().Where(x => x.Id == id).FirstOrDefault();
            if (entity == null) return null;
            var keyList = await _keyEmailService.GetQueryable().Where(k => k.EmailTemplateId == entity.Id).ToListAsync(); 
            var tenLoaiEmailtemplate = await _dM_DuLieuDanhMucRepository.GetQueryable().Where(k => k.Code == entity.LoaiTemPlate).FirstOrDefaultAsync();

            return new EmailTemplateDto
            {
                Id = entity.Id,
                Code = entity.Code,
                Name = entity.Name,
                Content = entity.Content,
                Description = entity.Description,
                IsActive = entity.IsActive,
                LoaiTemPlate = entity.LoaiTemPlate,
                tenLoaiEmailTemPlate = tenLoaiEmailtemplate?.Name ?? "Không xác định",
                lstKeyEmailTemplate = keyList.Select(y => new KeyEmailTemplateDto
                {
                    Id = y.Id,
                    EmailTemplateId = y.Id,
                    Key = y.Key,
                    Value = y.Value
                }).ToList()
            };
        }
    }
}


    using Hinet.Model.Entities;
    using Hinet.Service.Common.Service;
    using Hinet.Service.EmailTemplateService.Dto;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using Hinet.Service.EmailTemplateService.ViewModel;
    using Hinet.Service.Common;

    namespace Hinet.Service.EmailTemplateService
    {
        public interface IEmailTemplateService : IService<EmailTemplate>
        {
            Task<PagedList<EmailTemplateDto>> GetData(EmailTemplateSearch emailTemplateSearch);
            Task<EmailTemplateDto> GetByCodeAsync(string code);
            Task<EmailTemplateDto> getDto(Guid id);
        }
    }


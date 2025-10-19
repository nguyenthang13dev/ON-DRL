using Hinet.Model.Entities;
using Hinet.Service.SubjectService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;

namespace Hinet.Service.SubjectService
{
    public interface ISubjectService : IService<Subject>
    {
        Task<PagedList<SubjectDto>> GetData(SubjectSearch search);

        Task<SubjectDto> GetDto(Guid id);

        Task<List<DropdownOption>> GetDropDownSubject();
    }
}
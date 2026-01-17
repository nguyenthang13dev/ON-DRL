using Hinet.Model.MongoEntities;
using Hinet.Repository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;
using Hinet.Service.KeKhaiSumaryService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.KeKhaiSumaryService
{
    public interface IKeKhaiSumaryService : IService<KeKhaiSummary>
    {
        Task<PagedList<StudentSubmission>> GetListStudentSubmission(SearchBase search, Guid IdForm, Guid? IdLop);
    }
}

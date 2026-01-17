using Hinet.Model.MongoEntities;
using Hinet.Repository;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.ConfigFormRepository;
using Hinet.Repository.KeKhaiSumaryRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Constant;
using Hinet.Service.Dto;
using Hinet.Service.KeKhaiSumaryService.Dto;
using Hinet.Service.KeKhaiSumaryService.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Driver.Linq;

namespace Hinet.Service.KeKhaiSumaryService
{
    public class KeKhaiSumaryService : Service<KeKhaiSummary>, IKeKhaiSumaryService
    {
        private readonly IKeKhaiSumaryRepository _keKhaiSumaryRepository;

        private readonly IConfigFormRepository _configFormRepository;

        private readonly IAppUserRepository _appUserRepository;

        public KeKhaiSumaryService(IKeKhaiSumaryRepository keKhaiSumaryRepository, IConfigFormRepository configFormRepository, IAppUserRepository appUserRepository) : base(keKhaiSumaryRepository)
        {
            _keKhaiSumaryRepository = keKhaiSumaryRepository;
            _configFormRepository = configFormRepository;
            _appUserRepository = appUserRepository;
        
        }

        public async Task<PagedList<StudentSubmission>> GetListStudentSubmission(SearchBase search, Guid IdForm, Guid? IdLop)
        {
            var query = from q in _keKhaiSumaryRepository.GetQueryable()
                        .Where(t => t.AppUser != null && t.AppUser.Lop != null && t.FormId == IdForm 
                        && (t.Status == StatusConstant.GUILOPTRUONG || t.Status == StatusConstant.GUIGIAOVIEN) 
                        && t.AppUser.Lop.Id == IdLop)

                        select new StudentSubmission
                        {
                            Progress = q.Processs,
                            Status = q.Status,
                            SubmitDate = q.CreatedDate,
                            UserId = q.UserId,
                            StudentName = q.AppUser.Name,
                            StudentId = q.AppUser.MaSv,
                            ClassName = q.AppUser.Lop.TenLop,
                            FormId = q.FormId
                        }
                        ;

            return await PagedList<StudentSubmission>.CreateAsync(query, search);
        }



    }
}

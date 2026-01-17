using Hinet.Model.MongoEntities;
using Hinet.Repository;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.ConfigFormRepository;
using Hinet.Repository.KeKhaiSumaryRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.KeKhaiSumaryService.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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


        pub



    }
}

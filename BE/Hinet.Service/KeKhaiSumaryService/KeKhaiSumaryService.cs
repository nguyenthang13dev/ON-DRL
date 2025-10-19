using Hinet.Model.MongoEntities;
using Hinet.Repository;
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
        public KeKhaiSumaryService(IKeKhaiSumaryRepository keKhaiSumaryRepository) : base(keKhaiSumaryRepository)
        {
            _keKhaiSumaryRepository = keKhaiSumaryRepository;
        }



    }
}

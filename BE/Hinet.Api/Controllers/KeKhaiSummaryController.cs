using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Model.MongoEntities;
using Hinet.Service.Constant;
using Hinet.Service.Core.Mapper;
using Hinet.Service.KeKhaiSumaryService;
using Hinet.Service.KeKhaiSumaryService.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.X509;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KeKhaiSummaryController : HinetController
    {
        private readonly IKeKhaiSumaryService _keKhaiSumaryService;
        private readonly IMapper _mapper;

        public KeKhaiSummaryController(IKeKhaiSumaryService keKhaiSumaryService, IMapper mapper)
        {
            _keKhaiSumaryService = keKhaiSumaryService;
            _mapper = mapper;
        }

        [HttpPost("UpdateStatus")]
        public async Task<DataResponse<KeKhaiSummary>> UpdateStatus([FromBody] SubmitData model)
        {
            var response = _keKhaiSumaryService.GetQueryable().Where(t => t.UserId == UserId.Value && t.FormId == model.FormId).FirstOrDefault();
            if (response == null)
                return DataResponse<KeKhaiSummary>.False("Error extisting");
            response.Status = model.Redirect;
            await _keKhaiSumaryService.UpdateAsync(response);
            return DataResponse<KeKhaiSummary>.Success(response);
        }



        // Lấy danh sách sinh viên kê khai theo form biểu mẫu nhé


    }
}

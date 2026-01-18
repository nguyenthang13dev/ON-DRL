using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Model.MongoEntities;
using Hinet.Service.AspNetUsersService;
using Hinet.Service.Common;
using Hinet.Service.Constant;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.KeKhaiSumaryService;
using Hinet.Service.KeKhaiSumaryService.Dto;
using Hinet.Service.KeKhaiSumaryService.ViewModels;
using Hinet.Service.KySoInfoService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.X509;
using System.Collections.Generic;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KeKhaiSummaryController : HinetController
    {
        private readonly IKeKhaiSumaryService _keKhaiSumaryService;
        private readonly IMapper _mapper;
        private readonly IAspNetUsersService _aspNetUsersService;
        private readonly IKySoInfoService _kySoInfoService;

        public KeKhaiSummaryController(IKeKhaiSumaryService keKhaiSumaryService, IMapper mapper, IAspNetUsersService aspNetUsersService, IKySoInfoService kySoInfoService)
        {
            _keKhaiSumaryService = keKhaiSumaryService;
            _mapper = mapper;
            _aspNetUsersService = aspNetUsersService;
            _kySoInfoService = kySoInfoService;
        }

        [HttpPost("UpdateStatus")]
        public async Task<DataResponse<List<KeKhaiSummary>>> UpdateStatus([FromBody] SubmitData model)
        {
            var lop = await _aspNetUsersService.GetByIdAsync(UserId.Value);
            var response = _keKhaiSumaryService.GetQueryable().Where(t => t.FormId == model.FormId).ToList();
            if (model.Redirect == StatusConstant.GUIGIAOVIEN && IsLopTruong)
            {
                response = response.Where(t => t.AppUser.Lop != null && t.AppUser.Lop.Id == lop.Lop.Id).ToList();
            }
            else
            {
                response = response.Where(t => t.UserId == UserId.Value).ToList();
            }
            if (response == null)
                return DataResponse<List<KeKhaiSummary>>.False("Error extisting");
            if (response.Any())
            {
                response.ForEach((item) =>
                {
                    item.Status = model.Redirect;
                });
            }
            await _keKhaiSumaryService.UpdateAsync(response);
            return DataResponse<List<KeKhaiSummary>>.Success(response);
        }
        // Lấy danh sách sinh viên kê khai theo form biểu mẫu nhé
        [HttpPost("GetStudentSubmission")]
        public async Task<DataResponse<PagedList<StudentSubmission>>> GetStudentSubmission(Guid IdForm, [FromBody] SearchBase model)
        {
            var Lop = await _aspNetUsersService.GetByIdAsync(UserId.Value);
            var response = await _keKhaiSumaryService.GetListStudentSubmission(model, IdForm, Lop?.Lop?.Id ?? null);
            return DataResponse<PagedList<StudentSubmission>>.Success(response);
        }



      


    }
}

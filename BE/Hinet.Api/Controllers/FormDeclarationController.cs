using Hinet.Api.Dto;
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.FormDeclarationService;
using Hinet.Service.FormDeclarationService.Dto;
using Hinet.Service.FormTemplateService.Dto;
using Microsoft.AspNetCore.Mvc;


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class FormDeclarationController : HinetController
    {
        private readonly IFormDeclarationService _formDeclarationService;
        private readonly IMapper _mapper;
        private readonly ILogger<DM_NhomDanhMucController> _logger;

        public FormDeclarationController(
            IFormDeclarationService formDeclarationService,
            IMapper mapper,
            ILogger<DM_NhomDanhMucController> logger)
        {
            _formDeclarationService = formDeclarationService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<FormDeclarationDto>>> GetData([FromBody] FormDeclarationSearchDto search)
        {
            var result = await _formDeclarationService.GetData(search);
            return new DataResponse<PagedList<FormDeclarationDto>>
            {
                Data = result,
                Message = "Lấy dữ liệu thành công",
                Status = true
            };
        }

    }
}
using Hinet.Controllers;
using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    public class DashboardController : HinetController
    {
        private readonly IMapper _mapper;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(
            IMapper mapper,
            ILogger<DashboardController> logger)
        {
            _mapper = mapper;
            _logger = logger;
        }

       
    }
}

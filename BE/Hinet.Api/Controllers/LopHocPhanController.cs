// Hinet.Api/Controllers/LopHocPhanController.cs
using Hinet.Api.Dto;
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.LopHocPhanService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class LopHocPhanController : HinetController
    {
        private readonly ILopHocPhanService _lopHocPhanService;
        private readonly IMapper _mapper;
        private readonly ILogger<LopHocPhanController> _logger;

        public LopHocPhanController(
            ILopHocPhanService lopHocPhanService,
            IMapper mapper,
            ILogger<LopHocPhanController> logger)
        {
            _lopHocPhanService = lopHocPhanService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entities = await Task.FromResult(_lopHocPhanService.GetQueryable().ToList());
            return Ok(entities);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var entity = await _lopHocPhanService.GetByIdAsync(id);
            if (entity == null)
                return NotFound();
            
            return Ok(entity);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] LopHocPhan lopHocPhan)
        {
            await _lopHocPhanService.CreateAsync(lopHocPhan);
            return CreatedAtAction(nameof(GetById), new { id = lopHocPhan.Id }, lopHocPhan);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] LopHocPhan lopHocPhan)
        {
            if (id != lopHocPhan.Id)
                return BadRequest();

            await _lopHocPhanService.UpdateAsync(lopHocPhan);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _lopHocPhanService.GetByIdAsync(id);
            if (entity == null)
                return NotFound();
            
            await _lopHocPhanService.DeleteAsync(entity);
            return NoContent();
        }
    }
}

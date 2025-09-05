// Hinet.Api/Controllers/DangKyHocPhanController.cs
using Hinet.Api.Dto;
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DangKyHocPhanService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class DangKyHocPhanController : HinetController
    {
        private readonly IDangKyHocPhanService _dangKyHocPhanService;
        private readonly IMapper _mapper;
        private readonly ILogger<DangKyHocPhanController> _logger;

        public DangKyHocPhanController(
            IDangKyHocPhanService dangKyHocPhanService,
            IMapper mapper,
            ILogger<DangKyHocPhanController> logger)
        {
            _dangKyHocPhanService = dangKyHocPhanService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entities = await Task.FromResult(_dangKyHocPhanService.GetQueryable().ToList());
            return Ok(entities);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var entity = await _dangKyHocPhanService.GetByIdAsync(id);
            if (entity == null)
                return NotFound();
            
            return Ok(entity);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DangKyHocPhan dangKyHocPhan)
        {
            await _dangKyHocPhanService.CreateAsync(dangKyHocPhan);
            return CreatedAtAction(nameof(GetById), new { id = dangKyHocPhan.Id }, dangKyHocPhan);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] DangKyHocPhan dangKyHocPhan)
        {
            if (id != dangKyHocPhan.Id)
                return BadRequest();

            await _dangKyHocPhanService.UpdateAsync(dangKyHocPhan);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _dangKyHocPhanService.GetByIdAsync(id);
            if (entity == null)
                return NotFound();
            
            await _dangKyHocPhanService.DeleteAsync(entity);
            return NoContent();
        }
    }
}

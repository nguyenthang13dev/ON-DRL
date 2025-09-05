// Hinet.Api/Controllers/KhoaController.cs
using Hinet.Api.Dto;
using Hinet.Model.MongoEntities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.KhoaService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class KhoaController : HinetController
    {
        private readonly IKhoaService _khoaService;
        private readonly IMapper _mapper;
        private readonly ILogger<KhoaController> _logger;

        public KhoaController(
            IKhoaService khoaService,
            IMapper mapper,
            ILogger<KhoaController> logger)
        {
            _khoaService = khoaService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entities = await Task.FromResult(_khoaService.GetQueryable().ToList());
            return Ok(entities);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var entity = await _khoaService.GetByIdAsync(id);
            if (entity == null)
                return NotFound();
            
            return Ok(entity);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Khoa khoa)
        {
            await _khoaService.CreateAsync(khoa);
            return CreatedAtAction(nameof(GetById), new { id = khoa.Id }, khoa);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] Khoa khoa)
        {
            if (id != khoa.Id)
                return BadRequest();

            await _khoaService.UpdateAsync(khoa);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _khoaService.GetByIdAsync(id);
            if (entity == null)
                return NotFound();
            
            await _khoaService.DeleteAsync(entity);
            return NoContent();
        }
    }
}

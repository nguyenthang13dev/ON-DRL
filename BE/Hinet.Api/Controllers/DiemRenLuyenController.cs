// Hinet.Api/Controllers/DiemRenLuyenController.cs
using Hinet.Api.Dto;
using Hinet.Model.MongoEntities;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DiemRenLuyenService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class DiemRenLuyenController : HinetController
    {
        private readonly IDiemRenLuyenService _diemRenLuyenService;
        private readonly IMapper _mapper;
        private readonly ILogger<DiemRenLuyenController> _logger;

        public DiemRenLuyenController(
            IDiemRenLuyenService diemRenLuyenService,
            IMapper mapper,
            ILogger<DiemRenLuyenController> logger)
        {
            _diemRenLuyenService = diemRenLuyenService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var entities = await Task.FromResult(_diemRenLuyenService.GetQueryable().ToList());
            return Ok(entities);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var entity = await _diemRenLuyenService.GetByIdAsync(id);
            if (entity == null)
                return NotFound();
            
            return Ok(entity);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] DiemRenLuyen diemRenLuyen)
        {
            await _diemRenLuyenService.CreateAsync(diemRenLuyen);
            return CreatedAtAction(nameof(GetById), new { id = diemRenLuyen.Id }, diemRenLuyen);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] DiemRenLuyen diemRenLuyen)
        {
            if (id != diemRenLuyen.Id)
                return BadRequest();

            await _diemRenLuyenService.UpdateAsync(diemRenLuyen);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var entity = await _diemRenLuyenService.GetByIdAsync(id);
            if (entity == null)
                return NotFound();
            
            await _diemRenLuyenService.DeleteAsync(entity);
            return NoContent();
        }
    }
}

using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.HuyenService.Dto;
using Hinet.Service.LienHeService;
using Hinet.Service.LienHeService.Dto;
using Hinet.Service.LienHeService.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LienHeController : HinetController
    {
        private readonly IMapper _mapper;
        private readonly ILogger<HuyenController> _logger;
        private readonly ILienHeService _lienHeService;

        public LienHeController(IMapper mapper, ILogger<HuyenController> logger, ILienHeService lienHeService)
        {
            _mapper = mapper;
            _logger = logger;
            _lienHeService = lienHeService;
        }
        [HttpPost("Create")]
        public async Task<DataResponse<LienHe>> Create([FromBody] LienHeCreateVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = _mapper.Map<LienHeCreateVM,LienHe>(model);
                    await _lienHeService.CreateAsync(entity);
                    return DataResponse<LienHe>.Success(entity); 
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error creating Lien He");
                    return DataResponse<LienHe>.False("An error occurred while creating the data.");
                }
            }
            return DataResponse<LienHe>.False("Some properties are not valid", ModelStateError);
        }
        [HttpPost("Update")]
        public async Task<DataResponse<LienHe>> Update([FromBody] LienHeEditVM model)
        {
           if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _lienHeService.GetByIdAsync(model.Id);
                    if (entity == null)
                        return DataResponse<LienHe>.False("Lien He not found");

                    _mapper.Map(model, entity);
                    await _lienHeService.UpdateAsync(entity);
                    return DataResponse<LienHe>.Success(entity);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error updating Lien He");
                    return DataResponse<LienHe>.False("An error occurred while updating the data.");
                }
            }
            return DataResponse<LienHe>.False("Some properties are not valid", ModelStateError);
        }
        [HttpGet("Get/{id}")]
        public async Task<DataResponse<LienHeDto>> GetById(Guid id)
        {
            var result = await _lienHeService.GetDtoByID(id);

            return new DataResponse<LienHeDto>
            {
                Data = result,
                Message = "Get LienHeDto thành công",
                Status = true
            };
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<LienHeDto>>> GetData([FromBody] LienHeSearchDto search)
        {
            var result = await _lienHeService.GetDataAll(search);
            return new DataResponse<PagedList<LienHeDto>>
            {
                Data = result,
                Message = "GetData PagedList<LienHeDto> thành công",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _lienHeService.GetByIdAsync(id);
                await _lienHeService.DeleteAsync(entity);
                return DataResponse.Success(entity);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }


    }
}

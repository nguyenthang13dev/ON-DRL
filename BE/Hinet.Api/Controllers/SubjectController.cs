using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Api.Core.Permission;
using Hinet.Api.Dto;
using Hinet.Service.SubjectService;
using Hinet.Service.SubjectService.ViewModels;
using Hinet.Service.SubjectService.Dto;
using Google.Protobuf;
using Grpc.Core;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class SubjectController : HinetController
    {
        private readonly ISubjectService _subjectService;
        private readonly IMapper _mapper;
        private readonly ILogger<SubjectController> _logger;

        public SubjectController(
            ISubjectService SubjectService,
            IMapper mapper,
            ILogger<SubjectController> logger
            )
        {
            this._subjectService = SubjectService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<Subject>> Create([FromBody] SubjectCreateVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = _mapper.Map<SubjectCreateVM, Subject>(model);
                    await _subjectService.CreateAsync(entity);
                    return new DataResponse<Subject>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    return DataResponse<Subject>.False("Error", new string[] { ex.Message });
                }
            }
            return DataResponse<Subject>.False("Some properties are not valid", ModelStateError);
        }

        [HttpPost("Update")]
        public async Task<DataResponse<Subject>> Update([FromBody] SubjectEditVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _subjectService.GetByIdAsync(model.Id);
                    if (entity == null)
                        return DataResponse<Subject>.False("TypeDanhMuc not found");

                    entity = _mapper.Map(model, entity);
                    await _subjectService.UpdateAsync(entity);
                    return new DataResponse<Subject>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    DataResponse<Subject>.False(ex.Message);
                }
            }
            return DataResponse<Subject>.False("Some properties are not valid", ModelStateError);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<SubjectDto>> Get(Guid id)
        {
            var result = await _subjectService.GetDto(id);
            return new DataResponse<SubjectDto>
            {
                Data = result,
                Message = "Get TypeDanhMucDto thành công",
                Status = true
            };
        }


        [HttpGet("GetDropDownSubject")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropDownSubject()
        {
            try
            {
                var result = await _subjectService.GetDropDownSubject();
                return  DataResponse<List<DropdownOption>>.Success(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost("GetData")]
        
        public async Task<DataResponse<PagedList<SubjectDto>>> GetData([FromBody] SubjectSearch search)
        {
            var result = await _subjectService.GetData(search);
            return new DataResponse<PagedList<SubjectDto>>
            {
                Data = result,
                Message = "GetData PagedList<TypeDanhMucDto> thành công",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _subjectService.GetByIdAsync(id);
                await _subjectService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpGet("GetDropdown")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropdown()
        {
            var result = await _subjectService.GetDropdown();
            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "GetDropdown List<DropdownOption> thành công",
                Status = true
            };
        }
    }
}
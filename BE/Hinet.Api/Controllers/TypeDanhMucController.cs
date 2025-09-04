using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Api.Core.Permission;
using Hinet.Service.TaiLieuDinhKemService.Dto;
using Hinet.Api.Dto;
using Hinet.Service.TypeDanhMucService;
using Hinet.Service.TypeDanhMucService.ViewModels;
using Hinet.Service.TypeDanhMucService.Dto;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class TypeDanhMucController : HinetController
    {
        private readonly ITypeDanhMucService _typeDanhMucService;
        private readonly IMapper _mapper;
        private readonly ILogger<TypeDanhMucController> _logger;

        public TypeDanhMucController(
            ITypeDanhMucService TypeDanhMucService,
            IMapper mapper,
            ILogger<TypeDanhMucController> logger
            )
        {
            this._typeDanhMucService = TypeDanhMucService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<TypeDanhMuc>> Create([FromBody] TypeDanhMucCreateVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = _mapper.Map<TypeDanhMucCreateVM, TypeDanhMuc>(model);
                    await _typeDanhMucService.CreateAsync(entity);
                    return new DataResponse<TypeDanhMuc>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    return DataResponse<TypeDanhMuc>.False("Error", new string[] { ex.Message });
                }
            }
            return DataResponse<TypeDanhMuc>.False("Some properties are not valid", ModelStateError);
        }

        [HttpPost("Update")]
        public async Task<DataResponse<TypeDanhMuc>> Update([FromBody] TypeDanhMucEditVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _typeDanhMucService.GetByIdAsync(model.Id);
                    if (entity == null)
                        return DataResponse<TypeDanhMuc>.False("TypeDanhMuc not found");

                    entity = _mapper.Map(model, entity);
                    await _typeDanhMucService.UpdateAsync(entity);
                    return new DataResponse<TypeDanhMuc>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    DataResponse<TypeDanhMuc>.False(ex.Message);
                }
            }
            return DataResponse<TypeDanhMuc>.False("Some properties are not valid", ModelStateError);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<TypeDanhMucDto>> Get(Guid id)
        {
            var result = await _typeDanhMucService.GetDto(id);
            return new DataResponse<TypeDanhMucDto>
            {
                Data = result,
                Message = "Get TypeDanhMucDto thành công",
                Status = true
            };
        }

        [HttpPost("GetData", Name = "Xem danh sách kiểu dữ liệu")]
        
        public async Task<DataResponse<PagedList<TypeDanhMucDto>>> GetData([FromBody] TypeDanhMucSearch search)
        {
            var result = await _typeDanhMucService.GetData(search);
            return new DataResponse<PagedList<TypeDanhMucDto>>
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
                var entity = await _typeDanhMucService.GetByIdAsync(id);
                await _typeDanhMucService.DeleteAsync(entity);
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
            var result = await _typeDanhMucService.GetDropdown();
            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "GetDropdown List<DropdownOption> thành công",
                Status = true
            };
        }
    }
}
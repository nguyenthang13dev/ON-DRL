using Microsoft.AspNetCore.Mvc;
using Hinet.Service.KeyEmailTemplateService;
using Hinet.Service.KeyEmailTemplateService.ViewModel;
using Hinet.Service.Common;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Threading.Tasks;
using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Service.KeyEmailTemplateService.Dto;
using Hinet.Service.Core.Mapper;
using Hinet.Model.Entities;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    public class KeyEmailTemplateController : HinetController
    {
        private readonly IKeyEmailTemplateService _service;
        private readonly IMapper _mapper;

        public KeyEmailTemplateController(IKeyEmailTemplateService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpPost("GetByEmailTemplateId")]
        public async Task<DataResponse<PagedList<KeyEmailTemplateDto>>> GetByEmailTemplateId(KeyEmailTemplateSearchVM keyEmailTemplateSearchVM)
        {
                var result = await _service.GetData(keyEmailTemplateSearchVM);
                return new DataResponse<PagedList<KeyEmailTemplateDto>>
                {
                    Data = result,
                    Message = "Lấy danh sách key email template thành công",
                    Status = true
                };
        }
        [HttpPost("Create")]
        public async Task<DataResponse<KeyEmailTemplateDto>> Create([FromBody] KeyEmailTemplateCreateVM model)
        {
            if (!ModelState.IsValid)
                return DataResponse<KeyEmailTemplateDto>.False("Dữ liệu không hợp lệ", ModelStateError);

            try
            {
                // Kiểm tra xem key đã tồn tại cho template này chưa  
                var exists = await _service.GetExistKey(model.Key, model.EmailTemplateId);
                if (exists!=null)
                    return DataResponse<KeyEmailTemplateDto>.False($"Key '{model.Key}' đã tồn tại cho template này");
                var keyEM = _mapper.Map<KeyEmailTemplateCreateVM, KeyEmailTemplate >( model );
                await _service.CreateAsync(keyEM);
                return DataResponse<KeyEmailTemplateDto>.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse<KeyEmailTemplateDto>.False($"Lỗi khi tạo mới: {ex.Message}");
            }
        }

        [HttpPost("Update")]
        public async Task<DataResponse<KeyEmailTemplateDto>> Update([FromBody] KeyEmailTemplateEditVM model)
        {
            if (!ModelState.IsValid)
                return DataResponse<KeyEmailTemplateDto>.False("Dữ liệu không hợp lệ", ModelStateError);

            try
            {
                var entity = await _service.GetByIdAsync(model.Id); 
                if (entity == null) 
                    return DataResponse<KeyEmailTemplateDto>.False("Không tìm thấy key Email template");

                entity = _mapper.Map(model, entity);
                await _service.UpdateAsync(entity);
                return DataResponse<KeyEmailTemplateDto>.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse<KeyEmailTemplateDto>.False($"Lỗi khi cập nhật: {ex.Message}");
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _service.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse.False("Không tìm thấy key Email template");
                  await _service.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False($"Lỗi khi xóa: {ex.Message}");
            }
        }
    }
}
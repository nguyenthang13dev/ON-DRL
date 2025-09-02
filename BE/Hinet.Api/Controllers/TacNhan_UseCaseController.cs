using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Model.Entities.DA_Test_Case;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.TacNhan_UseCaseService;
using Hinet.Service.TacNhan_UseCaseService.Dto;
using Hinet.Service.TacNhan_UseCaseService.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    public class TacNhan_UseCaseController : HinetController
    {
        private readonly ITacNhan_UseCaseService _service;
        private readonly IMapper _mapper;

        public TacNhan_UseCaseController(IMapper mapper, ITacNhan_UseCaseService service)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<TacNhan_UseCaseDto>>> GetData([FromBody] TacNhan_UseCaseSearch search)
        {
            var result = await _service.GetData(search);
            return DataResponse<PagedList<TacNhan_UseCaseDto>>.Success(result, "Lấy dữ liệu thành công");
        }

        [HttpGet("GetDto/{id}")]
        public async Task<DataResponse<TacNhan_UseCaseDto>> GetDto(Guid id)
        {
            var result = await _service.GetDto(id);
            if (result == null) return DataResponse<TacNhan_UseCaseDto>.False("Không tìm thấy tác nhân với ID đã cho");
            return DataResponse<TacNhan_UseCaseDto>.Success(result, "Lấy dữ liệu thành công");
        }

        [HttpPost("Create")]
        public async Task<DataResponse<TacNhan_UseCaseDto>> Create([FromBody] TacNhan_UseCaseCreateVM model)
        {
            if (!ModelState.IsValid)
                return DataResponse<TacNhan_UseCaseDto>.False("Vui lòng nhập đầy đủ tên tác nhân");
            var entity = _mapper.Map<TacNhan_UseCaseCreateVM, TacNhan_UseCase>(model);

            // Tự động tạo mã tác nhân nếu không được nhập
            if (string.IsNullOrEmpty(entity.maTacNhan))
            {
                entity.maTacNhan = await _service.GenerateMaTacNhan();
            }

            var existingEntity = await _service.GetQueryable().FirstOrDefaultAsync(x => x.maTacNhan == entity.maTacNhan && x.idDuAn == entity.idDuAn);
            if (existingEntity != null)
                return DataResponse<TacNhan_UseCaseDto>.False("Mã tác nhân đã tồn tại");

            await _service.CreateAsync(entity);
            return  DataResponse<TacNhan_UseCaseDto>.Success( null, "Tạo tác nhân thành công");
        }

        [HttpPut("Update")]
        public async Task<DataResponse<TacNhan_UseCaseDto>> Update([FromBody] TacNhan_UseCaseEditVM model)
        {
            if (!ModelState.IsValid)
                return DataResponse<TacNhan_UseCaseDto>.False("Vui lòng nhập đầy đủ tên tác nhân");
            var entity = await _service.GetByIdAsync(model.Id);
            if (entity == null)
                return DataResponse<TacNhan_UseCaseDto>.False("Không tìm thấy tác nhân với ID đã cho");
            if(string.IsNullOrEmpty(model.maTacNhan))
                return DataResponse<TacNhan_UseCaseDto>.False("Vui lòng nhập mã tác nhân");
            var existingEntity = await _service.GetQueryable().FirstOrDefaultAsync(x => x.maTacNhan == model.maTacNhan && x.Id != model.Id);
            if (existingEntity != null)
                return DataResponse<TacNhan_UseCaseDto>.False("Mã tác nhân đã tồn tại");

            entity = _mapper.Map(model, entity);
            await _service.UpdateAsync(entity);
            return DataResponse<TacNhan_UseCaseDto>.Success(null, "Cập nhật tác nhân thành công");
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse<TacNhan_UseCaseDto>> Delete(Guid id)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null) return DataResponse<TacNhan_UseCaseDto>.False("Không tìm thấy tác nhân với ID đã cho");
            await _service.DeleteAsync(entity);
            return DataResponse<TacNhan_UseCaseDto>.Success(null, "Xóa tác nhân thành công");
        }
    }
}
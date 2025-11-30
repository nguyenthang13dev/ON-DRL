// Hinet.Api/Controllers/GiaoVienController.cs
using Hinet.Api.Dto;
using Hinet.Model.Entities;
using Hinet.Model.MongoEntities;
using Hinet.Service.AppUserService;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.GiaoVienService;
using Hinet.Service.GiaoVienService.Dto;
using Hinet.Service.GiaoVienService.ViewModels;
using Hinet.Service.KhoaService;
using Hinet.Service.LopHanhChinhService;
using Hinet.Service.SinhVienService.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class GiaoVienController : HinetController
    {

        private readonly IKhoaService _khoaService;
        private readonly ILopHanhChinhService _lopHanhChinhService;
        private readonly IGiaoVienService _giaoVienService;
        private readonly IAppUserService _appUserService;
        private readonly IMapper _mapper;
        private readonly ILogger<GiaoVienController> _logger;

        public GiaoVienController(
            IGiaoVienService giaoVienService,
            IMapper mapper,
            ILogger<GiaoVienController> logger,
            IAppUserService appUserService,
            IKhoaService khoaService,
            ILopHanhChinhService lopHanhChinhService)
        {
            _giaoVienService = giaoVienService;
            _mapper = mapper;
            _logger = logger;
            _appUserService = appUserService;
            _khoaService = khoaService;
            _lopHanhChinhService = lopHanhChinhService;
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<GiaoVienDto>>> GetData([FromBody] GiaoVienSearch search)
        {
            try
            {
                var result = await _giaoVienService.GetData(search);
                return DataResponse<PagedList<GiaoVienDto>>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting GiaoVien data");
                return DataResponse<PagedList<GiaoVienDto>>.False("Có lỗi xảy ra khi lấy dữ liệu");
            }
        }

        [HttpGet("{id}")]
        public async Task<DataResponse<GiaoVienDto>> GetById(Guid id)
        {
            var dto = await _giaoVienService.GetDto(id);
            if (dto == null)
                return DataResponse<GiaoVienDto>.False("Không tìm thấy giáo viên");
            return DataResponse<GiaoVienDto>.Success(dto);
        }

        [HttpPost("Create")]
        public async Task<DataResponse<GiaoVien>> Create([FromBody] GiaoVienCreateVM model)
        {
            try
            {
                var Khoa = await _khoaService.GetByIdAsync(model.KhoaId);
                var giaoVien = _mapper.Map<GiaoVienCreateVM, GiaoVien>(model);
                //Tạo tk
                var entity = new AppUser
                {
                    UserName = model.MaGiaoVien,
                    MaSv = model.MaGiaoVien,
                    Gender = model.GioiTinh ? 1 : 0,
                    Email = model.Email,
                    NgaySinh = model.NgaySinh,
                    Khoa = Khoa,
                };
                //
                var user = await _appUserService.CreateUserByRole("GIAOVIEN", entity);
                //
                giaoVien.User = user;
                
                await _giaoVienService.CreateAsync(giaoVien);
                return DataResponse<GiaoVien>.Success(giaoVien);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating GiaoVien");
                return DataResponse<GiaoVien>.False("Có lỗi xảy ra khi tạo giáo viên");
            }
        }

        [HttpPut("Update/{id}")]
        public async Task<DataResponse<GiaoVien>> Update(Guid id, [FromBody] GiaoVien model)
        {
            try
            {
                var entity = await _giaoVienService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse<GiaoVien>.False("Không tìm thấy giáo viên");
                model.Id = id;
                await _giaoVienService.UpdateAsync(model);
                return DataResponse<GiaoVien>.Success(model);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating GiaoVien");
                return DataResponse<GiaoVien>.False("Có lỗi xảy ra khi cập nhật giáo viên");
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _giaoVienService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse.False("Không tìm thấy giáo viên");
                if (entity.User is not null)
                {
                    await _appUserService.DeleteAsync(entity.User);
                }
                await _giaoVienService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting GiaoVien");
                return DataResponse.False("Có lỗi xảy ra khi xóa giáo viên");
            }
        }

        [HttpGet("DropdownByKhoa")]
        public async Task<DataResponse<List<DropdownOption>>> DropdownByKhoa(Guid khoaId)
        {
            try
            {
                var result = await _giaoVienService.GetDropdownByKhoa(khoaId);
                return DataResponse<List<DropdownOption>>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting GiaoVien dropdown");
                return DataResponse<List<DropdownOption>>.False("Có lỗi xảy ra khi lấy danh sách dropdown");
            }
        }
    }
}

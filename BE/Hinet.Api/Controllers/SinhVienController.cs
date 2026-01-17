using CommonHelper.String;
using Hinet.Api.Dto;
using Hinet.Model.Entities;
using Hinet.Model.MongoEntities;
using Hinet.Repository.RoleRepository;
using Hinet.Service.AppUserService;
using Hinet.Service.AspNetUsersService;
using Hinet.Service.AspNetUsersService.ViewModels;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.KhoaService;
using Hinet.Service.LopHanhChinhService;
using Hinet.Service.RoleService;
using Hinet.Service.SinhVienService;
using Hinet.Service.SinhVienService.Dto;
using Hinet.Service.SinhVienService.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;



namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class SinhVienController : HinetController
    {
        private readonly IRoleService _roleService; 
        private readonly ISinhVienService _sinhVienService;
        private readonly ILopHanhChinhService _lopHanhChinhService;
        private readonly IAppUserService _appUserService;
        private readonly IKhoaService _khoaService;
        private readonly IMapper _mapper;
        private readonly ILogger<SinhVienController> _logger;
        private readonly UserManager<AppUser> _userManager;

        public SinhVienController(
            ISinhVienService sinhVienService,
            IMapper mapper,
            ILogger<SinhVienController> logger,
            UserManager<AppUser> userManager,
            IRoleService roleService,
            IAppUserService appUserService,
            IKhoaService khoaService,
            ILopHanhChinhService lopHanhChinhService)
        {
            _sinhVienService = sinhVienService;
            _mapper = mapper;
            _logger = logger;
            _userManager = userManager;
            _roleService = roleService;
            _appUserService = appUserService;
            _khoaService = khoaService;
            _lopHanhChinhService = lopHanhChinhService;
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<SinhVienDto>>> GetData([FromBody] SinhVienSearch search)
        {
            try
            {
                var result = await _sinhVienService.GetData(search);
                return DataResponse<PagedList<SinhVienDto>>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting SinhVien data");
                return DataResponse<PagedList<SinhVienDto>>.False("Có lỗi xảy ra khi lấy dữ liệu");
            }
        }

        [HttpGet("{id}")]
        public async Task<DataResponse<SinhVienDto>> GetById(Guid id)
        {
            var dto = await _sinhVienService.GetDto(id);
            if (dto == null)
                return DataResponse<SinhVienDto>.False("Không tìm thấy sinh viên");
            return DataResponse<SinhVienDto>.Success(dto);
        }

        [HttpPost("Create")]
        public async Task<DataResponse<SinhVien>> Create([FromBody] SinhVienCreateVM model)
        {
            try
            {
                var Khoa = await _khoaService.GetByIdAsync(model.KhoaId);
                var LopHanhChinh = await _lopHanhChinhService.GetByIdAsync(model.LopHanhChinhId);
                var sinhVien = _mapper.Map<SinhVienCreateVM, SinhVien>(model);
                //Tạo tk
                var entity = new AppUser {
                    UserName =  model.MaSV,
                    MaSv = model.MaSV,
                    Gender = model.GioiTinh ? 1 : 0,
                    Email = model.Email,
                    NgaySinh = model.NgaySinh,
                    Khoa = Khoa,
                    Lop = LopHanhChinh
                };
                //
                var user = await _appUserService.CreateUserByRole("SINHVIEN", entity);
                if (user != null)
                {
                    sinhVien.User = user;
                }
                await _sinhVienService.CreateAsync(sinhVien);
                return DataResponse<SinhVien>.Success(sinhVien);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating SinhVien");
                return DataResponse<SinhVien>.False("Có lỗi xảy ra khi tạo sinh viên");
            }
        }

        [HttpPut("Update/{id}")]
        public async Task<DataResponse<SinhVien>> Update(Guid id, [FromBody] SinhVienUpdate model)
        {
            try
            {
                var entity = await _sinhVienService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse<SinhVien>.False("Không tìm thấy sinh viên");

                entity = _mapper.Map<SinhVienUpdate, SinhVien>(model);
                entity.Id = id;

                await _sinhVienService.UpdateAsync(entity);
                return DataResponse<SinhVien>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating SinhVien");
                return DataResponse<SinhVien>.False("Có lỗi xảy ra khi cập nhật sinh viên");
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _sinhVienService.GetByIdAsync(id);

                // delete user
                if (entity == null)
                    return DataResponse.False("Không tìm thấy sinh viên");

                var user = entity.User;
                await _appUserService.DeleteAsync(user);

                await _sinhVienService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting SinhVien");
                return DataResponse.False("Có lỗi xảy ra khi xóa sinh viên");
            }
        }
    }
}


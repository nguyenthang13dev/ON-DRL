using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Service.Common;
using Hinet.Api.Filter;
using CommonHelper.Excel;
using Hinet.Web.Common;
using Hinet.Api.ViewModels.Import;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Api.Dto;
using Hinet.Service.Dto;
using Hinet.Model.Entities.QLNhanSu;

using Hinet.Service.AspNetUsersService;
using Hinet.Service.QLNhanSu.NS_NhanSuService;
using Hinet.Service.QLNhanSu.NS_NhanSuService.Dto;
using Hinet.Service.QLNhanSu.NS_NhanSuService.ViewModels;
using Hinet.Controllers;
using Hinet.Service.DepartmentService;
using Hinet.Service.DM_DuLieuDanhMucService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Hinet.Service.Constant;
using Hinet.Api.Core.Attributes;

namespace Hinet.Api.Controllers.QLNhanSuController
{
    [Route("api/[controller]")]
    public class NS_NhanSuController : HinetController
    {
        private readonly INS_NhanSuService _nS_NhanSuService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<NS_NhanSuController> _logger;
        private readonly IDepartmentService _departmentService;
        private readonly IDM_DuLieuDanhMucService _dmDuLieuDanhMucService;

        public NS_NhanSuController(
            INS_NhanSuService nS_NhanSuService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<NS_NhanSuController> logger,
            IAspNetUsersService aspNetUsersService
,
            IDepartmentService departmentService,
            IDM_DuLieuDanhMucService dmDuLieuDanhMucService)
        {
            _nS_NhanSuService = nS_NhanSuService;
            _taiLieuDinhKemService = taiLieuDinhKemService;
            _mapper = mapper;
            _logger = logger;
            _departmentService = departmentService;
            _dmDuLieuDanhMucService = dmDuLieuDanhMucService;
        }

        [CustomRoleAuthorize("QLNS")]
        [HttpPost("Create")]
        public async Task<DataResponse<NS_NhanSu>> Create([FromBody] NS_NhanSuCreateVM model)
        {
            try
            {
                var entity = await _nS_NhanSuService.CreateStaffAsync(model);
                return DataResponse<NS_NhanSu>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo nhân viên");
                return DataResponse<NS_NhanSu>.False($"Đã xảy ra lỗi khi tạo nhân viên: {ex.Message}");
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<NS_NhanSuDto>> Get(Guid id)
        {
            var dto = await _nS_NhanSuService.GetDto(id);
            return DataResponse<NS_NhanSuDto>.Success(dto);
        }

        [CustomRoleAuthorize("QLNS")]
        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<NS_NhanSuDto>>> GetData([FromBody] NS_NhanSuSearch search)
        {
            var data = await _nS_NhanSuService.GetData(search);
            return DataResponse<PagedList<NS_NhanSuDto>>.Success(data);
        }

        [CustomRoleAuthorize("QLNS")]
        [HttpPut("Update")]
        public async Task<DataResponse<NS_NhanSu>> Update([FromBody] NS_NhanSuEditVM model)
        {
            try
            {
                var entity = await _nS_NhanSuService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<NS_NhanSu>.False("Nhân viên không tồn tại!");
                var checkCodeStaffUsed = _nS_NhanSuService.FindBy(x => x.MaNV == model.MaNV).FirstOrDefault();
                if (checkCodeStaffUsed != null && checkCodeStaffUsed.Id != model.Id)
                {
                    return DataResponse<NS_NhanSu>.False("Mã nhân viên đã tồn tại!.");
                }
                if (model.ChucVuId.HasValue)
                {
                    var chucVuCode = await _dmDuLieuDanhMucService.GetQueryable().FirstOrDefaultAsync(x => x.Id == model.ChucVuId);
                    if (!string.IsNullOrEmpty(chucVuCode.Code))
                    {
                        model.ChucVuCode = chucVuCode.Code;
                    }
                }
                if (model.PhongBanId.HasValue)
                {
                    var phongBanCode = await _departmentService.GetQueryable().FirstOrDefaultAsync(x => x.Id == model.PhongBanId);
                    if (!string.IsNullOrEmpty(phongBanCode.Code))
                    {
                        model.PhongBanCode = phongBanCode.Code;
                    }
                }
                entity = _mapper.Map(model, entity);
                await _nS_NhanSuService.UpdateAsync(entity);
                return DataResponse<NS_NhanSu>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật nhân viên {hoTen}", model.HoTen);
                return new DataResponse<NS_NhanSu>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật nhân viên."
                };
            }
        }

        [CustomRoleAuthorize("QLNS")]
        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                await _nS_NhanSuService.DeleteStaffAsync(id);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lá»—i khi xÃ³a nhÃ¢n sá»± vá»›i Id: {Id}", id);
                return DataResponse.False("ÄÃ£ xáº£y ra lá»—i khi xÃ³a dá»¯ liá»‡u.");
            }
        }

        [HttpGet("GetDropdowns")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropdowns()
        {
            var result = await _nS_NhanSuService.GetDropdownOptions(x => x.HoTen, x => x.MaNV);

            return DataResponse<List<DropdownOption>>.Success(result);
        }

        [HttpPost("UploadAvatar/{id}")]
        public async Task<DataResponse> UploadAvatar(IFormFile file, Guid id)
        {
            if (file == null || file.Length == 0)
            {
                return DataResponse.False("File khÃ´ng há»£p lá»‡");
            }
            const string BASE_PATH = "wwwroot/uploads";
            var info = await _nS_NhanSuService.GetDto(id);
            if (!string.IsNullOrEmpty(info.HinhAnh))
            {
                var oldFilePath = Path.Combine(BASE_PATH, info.HinhAnh.TrimStart('/'));
                if (System.IO.File.Exists(oldFilePath))
                {
                    System.IO.File.Delete(oldFilePath);
                }
            }

            var filePath = UploadFileHelper.UploadFile(file, "Avatars");
            info.HinhAnh = filePath;
            await _nS_NhanSuService.UpdateAsync(info);
            return DataResponse.Success(filePath);
        }

        [HttpGet("ThongKeNs")]
        public async Task<DataResponse<List<BaoCaoThongKeNsDto<NS_NhanSu>>>> ThongKeNs([FromQuery] string? search)
        {
            try
            {
                var result = await _nS_NhanSuService.ThongKeNs(search);
                return DataResponse<List<BaoCaoThongKeNsDto<NS_NhanSu>>>.Success(result);
            }
            catch (Exception ex)
            {
                return DataResponse<List<BaoCaoThongKeNsDto<NS_NhanSu>>>.False("Đã xảy ra lỗi khi lấy dữ liệu báo cáo thống kê nhân sự: " + ex.Message);
            }
        }
        [HttpPost("ThongKeHDLD")]
        public async Task<DataResponse<ThongKeHopDongLaoDongDto>> ThongKeHDLD()
        {
            try
            {
                var result = await _nS_NhanSuService.ThongKeHDLD();
                return DataResponse<ThongKeHopDongLaoDongDto>.Success(result);
            }
            catch (Exception ex)
            {
                return DataResponse<ThongKeHopDongLaoDongDto>.False("Đã xảy ra lỗi khi lấy dữ liệu thống kê hợp đồng lao động: " + ex.Message);
            }
        }

    }
}
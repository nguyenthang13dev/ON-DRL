using Hinet.Api.Dto;
using Hinet.Model.Entities;
using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DM_DuLieuDanhMucService;
using Hinet.Service.DM_NhomDanhMucService;
using Hinet.Service.NS_NgayLeService;
using Hinet.Service.NS_NgayLeService.Dto;
using Hinet.Service.NS_NgayLeService.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class NS_NgayLeController : HinetController
    {
        private readonly INS_NgayLeService _ngayLeService;
        private readonly IDM_DuLieuDanhMucService _dM_DuLieuDanhMucService;
        private readonly IDM_NhomDanhMucService _dM_NhomDanhMucService;
        private readonly ILogger<NS_NgayLeController> _logger;
        private readonly IMapper _maper;
        public NS_NgayLeController(INS_NgayLeService ngayLeService, IDM_NhomDanhMucService dM_NhomDanhMucService, IDM_DuLieuDanhMucService dM_DuLieuDanhMucService, ILogger<NS_NgayLeController> logger, IMapper maper)
        {
            _ngayLeService = ngayLeService;
            _logger = logger;
            _maper = maper;
            _dM_NhomDanhMucService = dM_NhomDanhMucService;
            _dM_DuLieuDanhMucService = dM_DuLieuDanhMucService;
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<NS_NgayLeDto>> Get(Guid id)
        {
            var dto = await _ngayLeService.GetDto(id);
            return DataResponse<NS_NgayLeDto>.Success(dto);
        }
        [HttpPost("GetLoaiNgayLe")]
        public async Task<DataResponse<List<DM_DuLieuDanhMuc>>> GetLoaiNgayLe()
        {
            var nhomDanhMuc = await _dM_NhomDanhMucService.GetQueryable()
                .Where(x => x.GroupCode == "LNL")
                .OrderBy(x => x.CreatedDate)
                .FirstOrDefaultAsync();

            if (nhomDanhMuc == null)
            {
                await _dM_NhomDanhMucService.CreateAsync(new DM_NhomDanhMuc
                {
                    GroupCode = "LNL",
                    GroupName = "Loại Ngày Lễ",
                });
                nhomDanhMuc = await _dM_NhomDanhMucService.GetQueryable()
                    .Where(x => x.GroupCode == "LNL")
                    .FirstOrDefaultAsync();
            }    
                var loaiNgayLe = await _dM_DuLieuDanhMucService.GetQueryable()
                .Where(x => x.GroupId == nhomDanhMuc.Id)
                .OrderBy(x => x.CreatedDate)
                .ToListAsync();
            return DataResponse<List<DM_DuLieuDanhMuc>>.Success(loaiNgayLe);
        }
        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<NS_NgayLeDto>>> GetData([FromBody] NS_NgayLeSearch search)
        {
            var data = await _ngayLeService.GetData(search);
            return DataResponse<PagedList<NS_NgayLeDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _ngayLeService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse.False("Ngày lễ không tồn tại.");
                await _ngayLeService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa ngày lễ");
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }

        [HttpPost("CreateManyNgayLe")]
        public async Task<DataResponse<List<NS_NgayLeDto>>> CreateMany([FromBody] List<NS_NgayLeCreateUpdateVM> models)
        {
            try
            {
                var result = await _ngayLeService.CreateManyAsync(models);
                return DataResponse<List<NS_NgayLeDto>>.Success(result);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo nhiều ngày lễ (validation)");
                return DataResponse<List<NS_NgayLeDto>>.False(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo nhiều ngày lễ");
                return DataResponse<List<NS_NgayLeDto>>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }
        [HttpPost("KeThuaDuLieuNamCu")]
        public async Task<DataResponse<List<NS_NgayLeDto>>> KeThuaDuLieuNamCu([FromBody] KeThuaDuLieuNamCuDto models)
        {
            try
            {
                var result = await _ngayLeService.KeThuaDuLieuNamCu(models);
                return DataResponse<List<NS_NgayLeDto>>.Success(result);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo nhiều ngày lễ (validation)");
                return DataResponse<List<NS_NgayLeDto>>.False(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo nhiều ngày lễ");
                return DataResponse<List<NS_NgayLeDto>>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }

        [HttpPost("ImportAllSundays")]
        public async Task<DataResponse<List<NS_NgayLeDto>>> ImportAllSundays([FromQuery] int year, [FromQuery] string loaiNLCode)
        {
            try
            {
                var sundays = new List<NS_NgayLeCreateUpdateVM>();
                var start = new DateTime(year, 1, 1);
                var end = new DateTime(year, 12, 31);
                for (var date = start; date <= end; date = date.AddDays(1))
                {
                    if (date.DayOfWeek == DayOfWeek.Sunday)
                    {
                        sundays.Add(new NS_NgayLeCreateUpdateVM
                        {
                            NgayBatDau = date,
                            NgayKetThuc = date,
                            TenNgayLe = "Chủ nhật",
                            LoaiNLCode = loaiNLCode,
                            MoTa =  "Ngày chủ nhật",
                            TrangThai = "HoatDong",
                            Nam = year
                        });
                    }
                }
                var result = await _ngayLeService.CreateManyAsync(sundays); 
                return DataResponse<List<NS_NgayLeDto>>.Success(result);
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo nhiều ngày lễ (validation)");
                return DataResponse<List<NS_NgayLeDto>>.False(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi import tất cả ngày chủ nhật");
                return DataResponse<List<NS_NgayLeDto>>.False("Đã xảy ra lỗi khi import ngày chủ nhật.");
            }
        }

    }
}
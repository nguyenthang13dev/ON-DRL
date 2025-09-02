using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.NS_NgayLeService.Dto;
using Hinet.Service.NS_NgayLeService.ViewModels;
using Hinet.Repository.NS_NgayLeRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DM_DuLieuDanhMucService;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Service.NS_NgayLeService
{
    public class NS_NgayLeService : Service<NS_NgayLe>, INS_NgayLeService
    {
        private readonly INS_NgayLeRepository _ngayLeRepository;
        private readonly IMapper _mapper;
        private readonly IDM_DuLieuDanhMucService _dM_DuLieuDanhMucService;

        public NS_NgayLeService(INS_NgayLeRepository ngayLeRepository, IDM_DuLieuDanhMucService dM_DuLieuDanhMucService) : base(ngayLeRepository)
        {
            _ngayLeRepository = ngayLeRepository;
            _dM_DuLieuDanhMucService = dM_DuLieuDanhMucService;
        }

        public async Task<NS_NgayLeDto> CreateNgayLeAsync(NS_NgayLeCreateUpdateVM model)
        {
            // Validate required fields
            if (string.IsNullOrWhiteSpace(model.TenNgayLe))
                throw new ArgumentException("Tên ngày lễ là bắt buộc.");
            if (model.NgayBatDau == default)
                throw new ArgumentException("Ngày bắt đầu là bắt buộc.");
            if (model.NgayKetThuc == default)
                throw new ArgumentException("Ngày kết thúc là bắt buộc.");
            if (model.NgayBatDau > model.NgayKetThuc)
                throw new ArgumentException("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
            if (model.Nam < 1900 || model.Nam > 2200)
                throw new ArgumentException("Năm không hợp lệ.");
            if (model.Id.HasValue)
            {
                // Nếu có Id thì là cập nhật, kiểm tra xem Id có tồn tại không
                var existingEntity = await _ngayLeRepository.GetByIdAsync(model.Id.Value);
                if (existingEntity == null)
                    throw new ArgumentException($"Ngày lễ với Id {model.Id} không tồn tại.");
                // Kiểm tra trùng tên ngày lễ cùng năm
                var isExist = _ngayLeRepository.GetQueryable()
                    .Any(x => x.TenNgayLe == model.TenNgayLe && x.Nam == model.Nam && x.Id != model.Id);
                if (isExist)
                    throw new ArgumentException($"Đã tồn tại ngày lễ '{model.TenNgayLe}' trong năm {model.Nam} với Id khác.");

                var loaiNL = await _dM_DuLieuDanhMucService.GetQueryable().Where(nl=>nl.Code  == model.LoaiNLCode).ToListAsync();
                if( loaiNL == null || !loaiNL.Any())
                    throw new ArgumentException($"Loại ngày lễ '{model.LoaiNLCode}' không tồn tại trong danh mục.");

                existingEntity.TenNgayLe = model.TenNgayLe;
                existingEntity.NgayBatDau = model.NgayBatDau;
                existingEntity.NgayKetThuc = model.NgayKetThuc;
                existingEntity.LoaiNLCode = model.LoaiNLCode;
                existingEntity.MoTa = model.MoTa;
                existingEntity.TrangThai = model.TrangThai ?? "HoatDong";
                existingEntity.Nam = model.Nam;
                existingEntity.UpdatedDate = DateTime.UtcNow;
                _ngayLeRepository.Update(existingEntity);
                await _ngayLeRepository.SaveAsync();
                return new NS_NgayLeDto
                {
                    Id = existingEntity.Id,
                    TenNgayLe = existingEntity.TenNgayLe,
                    NgayBatDau = existingEntity.NgayBatDau,
                    NgayKetThuc = existingEntity.NgayKetThuc,
                    LoaiNLCode = existingEntity.LoaiNLCode,
                    MoTa = existingEntity.MoTa,
                    TrangThai = existingEntity.TrangThai,
                    Nam = existingEntity.Nam
                };
            }
            // Kiểm tra trùng tên ngày lễ cùng năm
            var isExist2 = _ngayLeRepository.GetQueryable().Any(x => x.TenNgayLe == model.TenNgayLe && x.Nam == model.Nam && x.LoaiNLCode == model.LoaiNLCode);
            if (isExist2)
                throw new ArgumentException($"Đã tồn tại ngày lễ '{model.TenNgayLe}' cùng loại '{model.LoaiNLCode}' trong năm {model.Nam}.");
            try
            {
                var entity = new NS_NgayLe
                {
                    Id = Guid.NewGuid(),
                    TenNgayLe = model.TenNgayLe,
                    NgayBatDau = model.NgayBatDau,
                    NgayKetThuc = model.NgayKetThuc,
                    LoaiNLCode = model.LoaiNLCode,
                    MoTa = model.MoTa,
                    TrangThai = model.TrangThai ?? "HoatDong",
                    Nam = model.Nam,
                    CreatedDate = DateTime.UtcNow,
                    UpdatedDate = DateTime.UtcNow
                };

                _ngayLeRepository.Add(entity);
                await _ngayLeRepository.SaveAsync();
                return new NS_NgayLeDto
                {
                    Id = entity.Id,
                    TenNgayLe = entity.TenNgayLe,
                    NgayBatDau = entity.NgayBatDau,
                    NgayKetThuc = entity.NgayKetThuc,
                    LoaiNLCode = entity.LoaiNLCode,
                    MoTa = entity.MoTa,
                    TrangThai = entity.TrangThai,
                    Nam = entity.Nam
                };
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }

        }

        public async Task<PagedList<NS_NgayLeDto>> GetData(NS_NgayLeSearch search)
        {
            var query = _ngayLeRepository.GetQueryable();
            if (!string.IsNullOrEmpty(search.TenNgayLe))
                query = query.Where(x => x.TenNgayLe.Contains(search.TenNgayLe));
            if (!string.IsNullOrEmpty(search.Nam))
                query = query.Where(x => x.Nam == int.Parse(search.Nam));
            if (!string.IsNullOrEmpty(search.LoaiNLCode))
                query = query.Where(x => x.LoaiNLCode == search.LoaiNLCode);
            if (!string.IsNullOrEmpty(search.TrangThai))
                query = query.Where(x => x.TrangThai.Contains(search.TrangThai));
            if (search.NgayBatDau.HasValue)
                query = query.Where(x => x.NgayBatDau >= search.NgayBatDau);
            if (search.NgayKetThuc.HasValue)
                query = query.Where(x => x.NgayKetThuc <= search.NgayKetThuc);
            var total = query.Count();
            var items = query.OrderByDescending(x => x.CreatedDate)
                .Skip((search.PageIndex - 1) * search.PageSize)
                .Take(search.PageSize)
                .Select(x => new NS_NgayLeDto
                {
                    Id = x.Id,
                    TenNgayLe = x.TenNgayLe,
                    NgayBatDau = x.NgayBatDau,
                    NgayKetThuc = x.NgayKetThuc,
                    LoaiNLCode = x.LoaiNLCode,
                    MoTa = x.MoTa,
                    TrangThai = x.TrangThai,
                    Nam = x.Nam,
                    TenLoaiNL = _dM_DuLieuDanhMucService.GetQueryable().Where(a=>a.Code==x.LoaiNLCode).FirstOrDefault().Name
                }).ToList();
            return new PagedList<NS_NgayLeDto>(items,  search.PageSize, search.PageIndex, total);
        }

        public async Task<NS_NgayLeDto?> GetDto(Guid id)
        {
            var entity = await _ngayLeRepository.GetByIdAsync(id);
            if (entity == null) return null;
            return new NS_NgayLeDto
            {
                Id = entity.Id,
                TenNgayLe = entity.TenNgayLe,
                NgayBatDau = entity.NgayBatDau,
                NgayKetThuc = entity.NgayKetThuc,
                LoaiNLCode = entity.LoaiNLCode,
                MoTa = entity.MoTa,
                TrangThai = entity.TrangThai,
                Nam = entity.Nam
            };
        }

        public async Task<List<NS_NgayLeDto>> CreateManyAsync(List<NS_NgayLeCreateUpdateVM> models)
        {
            try
            {
                var results = new List<NS_NgayLeDto>();
                foreach (var model in models)
                {
                    var dto = await CreateNgayLeAsync(model);
                    results.Add(dto);
                }
                return results;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
            
        }

        public async Task<List<NS_NgayLeDto>> KeThuaDuLieuNamCu(KeThuaDuLieuNamCuDto models)
        {
            if (models == null || string.IsNullOrEmpty(models.namDuocKeThua) || string.IsNullOrEmpty(models.namKeThua))
                throw new ArgumentException($"Vui lòng nhập đủ dữ liệu yêu cầu!");
            var namKeThua = _ngayLeRepository.GetQueryable().Any(x => x.Nam == int.Parse(models.namKeThua));
            if (!namKeThua)
                throw new ArgumentException($"Năm {models.namKeThua} không có dữ liệu để kế thừa!");
            var namDuocKeThuaExist = _ngayLeRepository.GetQueryable()
                .Where(x => x.Nam == int.Parse(models.namDuocKeThua)).ToList();
            if (namDuocKeThuaExist != null && namDuocKeThuaExist.Count > 0)
            {
                _ngayLeRepository.DeleteRange(namDuocKeThuaExist);
            }
            var namKeThuaData = _ngayLeRepository.GetQueryable()
                .Where(x => x.Nam == int.Parse(models.namKeThua)).ToList();
            var newEntities = new List<NS_NgayLeDto>();
            foreach (var item in namKeThuaData)
            {
                var newEntity = new NS_NgayLe
                {
                    Id = Guid.NewGuid(),
                    TenNgayLe = item.TenNgayLe,
                    NgayBatDau = item.NgayBatDau,
                    NgayKetThuc = item.NgayKetThuc,
                    LoaiNLCode = item.LoaiNLCode,
                    MoTa = item.MoTa,
                    TrangThai = item.TrangThai,
                    Nam = int.Parse(models.namDuocKeThua),
                    CreatedDate = DateTime.UtcNow,
                    UpdatedDate = DateTime.UtcNow
                };
                _ngayLeRepository.Add(newEntity);
                newEntities.Add(new NS_NgayLeDto
                {
                    Id = newEntity.Id,
                    TenNgayLe = newEntity.TenNgayLe,
                    NgayBatDau = newEntity.NgayBatDau,
                    NgayKetThuc = newEntity.NgayKetThuc,
                    LoaiNLCode = newEntity.LoaiNLCode,
                    MoTa = newEntity.MoTa,
                    TrangThai = newEntity.TrangThai,
                    Nam = newEntity.Nam
                });
            }
            await _ngayLeRepository.SaveAsync();
            return newEntities;
        }
    }
}

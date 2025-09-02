using Hinet.Model.Entities.TuyenDung;
using Hinet.Repository.DepartmentRepository;
using Hinet.Repository.TD_TuyenDungRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.TD_ViTriTuyenDungService.Dto;
using Hinet.Service.TD_ViTriTuyenDungService.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TD_ViTriTuyenDungService
{
    public class TD_TuyenDungService : Service<TD_TuyenDung>, ITD_TuyenDungService
    {
        private readonly ITD_TuyenDungRepository _tD_ViTriTuyenDungRepository;
        private readonly IDepartmentRepository _departmentRepository;
        public TD_TuyenDungService(ITD_TuyenDungRepository tD_ViTriTuyenDungRepository, IDepartmentRepository departmentRepository) : base(tD_ViTriTuyenDungRepository)
        {
            _tD_ViTriTuyenDungRepository = tD_ViTriTuyenDungRepository;
            _departmentRepository = departmentRepository;
        }

        public async Task<PagedList<TD_TuyenDungDto>> GetData(TD_TuyenDungSearchVM search)
        {
            var query = _tD_ViTriTuyenDungRepository.GetQueryable();
            if (!string.IsNullOrEmpty(search.TenViTri))
                query = query.Where(x => x.TenViTri.ToLower().Trim().Contains(search.TenViTri.ToLower().Trim()));

            if (search.SoLuongCanTuyen>0)
                query = query.Where(x => x.SoLuongCanTuyen == search.SoLuongCanTuyen);

            if (search.TinhTrang != null)
                query = query.Where(x => x.TinhTrang == search.TinhTrang);
            if (search.Loai != null)
                query = query.Where(x => x.Loai == search.Loai);
            if (search.HinhThuc != null)
                query = query.Where(x => x.HinhThuc == search.HinhThuc);

            if (search.PhongBanId !=null && search.PhongBanId != Guid.Empty)
                query = query.Where(x => x.PhongBanId == search.PhongBanId);

            if (search.NgayBatDau.HasValue)
                query = query.Where(x => x.NgayBatDau >= search.NgayBatDau);
            if (search.NgayKetThuc.HasValue)
                query = query.Where(x => x.NgayKetThuc <= search.NgayKetThuc);
            var total = query.Count();

            var items = query.OrderByDescending(x => x.CreatedDate)
                .Skip((search.PageIndex - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToList();

            var result = new List<TD_TuyenDungDto>();
            foreach (var x in items)
            {
                var department = x.PhongBanId.HasValue ? await _departmentRepository.GetByIdAsync(x.PhongBanId.Value) : null;
                result.Add(new TD_TuyenDungDto
                {
                    Id = x.Id,
                    tenPhongBan = department?.Name ?? "Không xác định",
                    PhongBanId = x.PhongBanId,
                    TenViTri = x.TenViTri,
                    SoLuongCanTuyen = x.SoLuongCanTuyen,
                    NgayBatDau = x.NgayBatDau,
                    NgayKetThuc = x.NgayKetThuc,
                    MoTa = x.MoTa,
                    TinhTrang = x.TinhTrang,
                    Loai = x.Loai,
                    HinhThuc = x.HinhThuc
                });
            }

            return new PagedList<TD_TuyenDungDto>(result, search.PageIndex, search.PageSize, total);
        }

        public async Task<TD_TuyenDungDto?> GetDto(Guid id)
        {
            var entity = await _tD_ViTriTuyenDungRepository.GetByIdAsync(id);
            if (entity == null) return null;

            var department = entity.PhongBanId.HasValue ? await _departmentRepository.GetByIdAsync(entity.PhongBanId.Value) : null;
            return new TD_TuyenDungDto
            {
                Id = entity.Id,
                tenPhongBan = department?.Name ?? "Không xác định",
                PhongBanId = entity.PhongBanId,
                TenViTri = entity.TenViTri,
                SoLuongCanTuyen = entity.SoLuongCanTuyen,
                NgayBatDau = entity.NgayBatDau,
                NgayKetThuc = entity.NgayKetThuc,
                MoTa = entity.MoTa,
                TinhTrang = entity.TinhTrang,
            };
        }
    }
}

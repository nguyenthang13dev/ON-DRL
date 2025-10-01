using System;
using Hinet.Model.MongoEntities;
using Hinet.Repository.KhoaRepository;
using Hinet.Repository.LopHanhChinhRepository;
using Hinet.Repository.SinhVienRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.SinhVienService.Dto;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver.Linq;

namespace Hinet.Service.SinhVienService
{
    public class SinhVienService : Service<SinhVien>, ISinhVienService
    {
        private readonly ISinhVienRepository _sinhVienRepository;
        private readonly IMapper _mapper;
        private readonly IKhoaRepository _khoaRepository;
        private readonly ILopHanhChinhRepository _lopHanhChinhRepository;

        public SinhVienService(
            ISinhVienRepository sinhVienRepository,
            IMapper mapper,
            ILopHanhChinhRepository lopHanhChinhRepository,
            IKhoaRepository khoaRepository) : base(sinhVienRepository)
        {
            _sinhVienRepository = sinhVienRepository;
            _mapper = mapper;
            _lopHanhChinhRepository = lopHanhChinhRepository;
            _khoaRepository = khoaRepository;
        }
        
        public async Task<PagedList<SinhVienDto>> GetData(SinhVienSearch search)
        {
            var query = from q in GetQueryable()

                        join khoa in _khoaRepository.GetQueryable() on q.KhoaId equals khoa.Id into khoaJoin
                        join lop in _lopHanhChinhRepository.GetQueryable() on q.LopHanhChinhId equals lop.Id into lopJoin


                        select new SinhVienDto
                        {
                            Id = q.Id,
                            MaSV = q.MaSV,
                            HoTen = q.HoTen,
                            NgaySinh = q.NgaySinh,
                            GioiTinh = q.GioiTinh,
                            Email = q.Email,
                            TrangThai = q.TrangThai,
                            KhoaId = q.KhoaId,
                            LopHanhChinhId = q.LopHanhChinhId,
                            CreatedId = q.CreatedId,
                            UpdatedId = q.UpdatedId,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            IsDelete = q.IsDelete,
                            TenKhoa = khoaJoin.Any() ? khoaJoin.First().TenKhoa : "",
                            TenLopHanhChinh = lopJoin.Any() ? lopJoin.First().TenLop : ""
                        };

            if (search != null)
            {
                if (!string.IsNullOrEmpty(search.HoTen))
                {
                    var searchStr = search.HoTen.Trim().ToLower();
                    query = query.Where(x => x.HoTen.ToLower().Contains(searchStr));
                }
                if (!string.IsNullOrEmpty(search.MaSV))
                {
                    var searchStr = search.MaSV.Trim().ToLower();
                    query = query.Where(x => x.MaSV.ToLower().Contains(searchStr));
                }
                if (search.KhoaId.HasValue)
                {
                    query = query.Where(x => x.KhoaId == search.KhoaId.Value);
                }
                if (search.LopHanhChinhId.HasValue)
                {
                    query = query.Where(x => x.LopHanhChinhId == search.LopHanhChinhId.Value);
                }
                if (!string.IsNullOrEmpty(search.TrangThai))
                {
                    query = query.Where(x => x.TrangThai == search.TrangThai);
                }
            }

            query = query.OrderByDescending(x => x.CreatedDate);
            return await PagedList<SinhVienDto>.CreateAsync(query, search);
        }

        public async Task<SinhVienDto> GetDto(Guid id)
        {
            var sv = await GetByIdAsync(id);
            if (sv == null)
                return null;

            return new SinhVienDto
            {
                Id = sv.Id,
                MaSV = sv.MaSV,
                HoTen = sv.HoTen,
                NgaySinh = sv.NgaySinh,
                GioiTinh = sv.GioiTinh,
                Email = sv.Email,
                TrangThai = sv.TrangThai,
                KhoaId = sv.KhoaId,
                LopHanhChinhId = sv.LopHanhChinhId,
                CreatedId = sv.CreatedId,
                UpdatedId = sv.UpdatedId,
                CreatedBy = sv.CreatedBy,
                UpdatedBy = sv.UpdatedBy,
                DeleteId = sv.DeleteId,
                CreatedDate = sv.CreatedDate,
                UpdatedDate = sv.UpdatedDate,
                DeleteTime = sv.DeleteTime,
                IsDelete = sv.IsDelete,
            };
        }

        public async Task<List<DropdownOption>> GetDropdownByLopHanhChinh(Guid lopHanhChinhId)
        {
            var query = GetQueryable().Where(x => x.LopHanhChinhId == lopHanhChinhId);
            var items = await query.ToListAsync();
            return items.Select(x => new DropdownOption
            {
                Value = x.Id.ToString(),
                Label = x.HoTen
            }).ToList();
        }

        public async Task<List<DropdownOption>> GetDropdownByKhoa(Guid khoaId)
        {
            var query = GetQueryable().Where(x => x.KhoaId == khoaId);
            var items = await query.ToListAsync();
            return items.Select(x => new DropdownOption
            {
                Value = x.Id.ToString(),
                Label = x.HoTen
            }).ToList();
        }
    }
}

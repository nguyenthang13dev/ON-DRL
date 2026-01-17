// Hinet.Service/GiaoVienService/GiaoVienService.cs
using System;
using Hinet.Model.MongoEntities;
using Hinet.Repository.GiaoVienRepository;
using Hinet.Repository.KhoaRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Core.Mapper;
using Hinet.Service.Dto;
using Hinet.Service.GiaoVienService.Dto;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver.Linq;

namespace Hinet.Service.GiaoVienService
{
    public class GiaoVienService : Service<GiaoVien>, IGiaoVienService
    {
        private readonly IGiaoVienRepository _giaoVienRepository;
        private readonly IMapper _mapper;
        private readonly IKhoaRepository _khoaRepository;

        public GiaoVienService(
            IGiaoVienRepository giaoVienRepository,
            IMapper mapper,
            IKhoaRepository khoaRepository) : base(giaoVienRepository)
        {
            _giaoVienRepository = giaoVienRepository;
            _mapper = mapper;
            _khoaRepository = khoaRepository;
        }

        public async Task<PagedList<GiaoVienDto>> GetData(GiaoVienSearch search)
        {
            var query = from q in GetQueryable()

                        select new GiaoVienDto
                        {
                            Id = q.Id,
                            MaGiaoVien = q.MaGiaoVien,
                            HoTen = q.HoTen,
                            Email = q.Email,
                            SoDienThoai = q.SoDienThoai,
                            GioiTinh = q.GioiTinh,
                            KhoaId = q.KhoaId,
                            TrangThai = q.TrangThai,
                            CreatedId = q.CreatedId,
                            UpdatedId = q.UpdatedId,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            IsDelete = q.IsDelete,
                            TenKhoa = q.Khoa != null ? q.Khoa.TenKhoa : ""
                        };

            if (search != null)
            {
                if (!string.IsNullOrEmpty(search.HoTen))
                {
                    var searchStr = search.HoTen.Trim().ToLower();
                    query = query.Where(x => x.HoTen.ToLower().Contains(searchStr));
                }
                if (!string.IsNullOrEmpty(search.MaGiaoVien))
                {
                    var searchStr = search.MaGiaoVien.Trim().ToLower();
                    query = query.Where(x => x.MaGiaoVien.ToLower().Contains(searchStr));
                }
                if (search.KhoaId.HasValue)
                {
                    query = query.Where(x => x.KhoaId == search.KhoaId.Value);
                }
            }

            query = query.OrderByDescending(x => x.CreatedDate);
            return await PagedList<GiaoVienDto>.CreateAsync(query, search);
        }

        public async Task<GiaoVienDto> GetDto(Guid id)
        {
            var giaoVien = await GetByIdAsync(id);
            if (giaoVien == null)
                return null;

            return new GiaoVienDto
            {
                Id = giaoVien.Id,
                MaGiaoVien = giaoVien.MaGiaoVien,
                HoTen = giaoVien.HoTen,
                Email = giaoVien.Email,
                SoDienThoai = giaoVien.SoDienThoai,
                KhoaId = giaoVien.KhoaId,
                TrangThai = giaoVien.TrangThai,
                CreatedId = giaoVien.CreatedId,
                UpdatedId = giaoVien.UpdatedId,
                CreatedBy = giaoVien.CreatedBy,
                UpdatedBy = giaoVien.UpdatedBy,
                DeleteId = giaoVien.DeleteId,
                CreatedDate = giaoVien.CreatedDate,
                UpdatedDate = giaoVien.UpdatedDate,
                DeleteTime = giaoVien.DeleteTime,
                IsDelete = giaoVien.IsDelete,
            };
        }

        public async Task<List<DropdownOption>> GetDropdownByKhoa(Guid khoaId)
        {
            var query = _giaoVienRepository.GetQueryable().Where(x => x.KhoaId == khoaId);
            var items = query.ToList();
            return items.Select(x => new DropdownOption
            {
                Value = x.Id.ToString(),
                Label = x.HoTen
            }).ToList();
        }
    }
}

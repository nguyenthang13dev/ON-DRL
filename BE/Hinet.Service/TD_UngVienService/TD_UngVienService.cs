using Hinet.Extensions;
using Hinet.Model;
using Hinet.Model.Entities.TuyenDung;
using Hinet.Repository;
using Hinet.Repository.TD_UngVienRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Core.Mapper;
using Hinet.Service.EmailService;
using Hinet.Service.EmailTemplateService;
using Hinet.Service.KeyEmailTemplateService;
using Hinet.Service.TD_UngVienService.Dto;
using Hinet.Service.TD_UngVienService.ViewModel;
using Hinet.Service.TD_ViTriTuyenDungService;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace Hinet.Service.TD_UngVienService
{
    public class TD_UngVienService : Service<TD_UngVien>, ITD_UngVienService
    {
        private readonly IMapper _mapper;
        ITD_UngVienRepository _tD_UngVienRepository;
        IEmailTemplateService _emailTemplateService;
        IKeyEmailTemplateService _keyEmailTemplateService;
        ITD_TuyenDungService _tD_TuyenDungService;
        private readonly DbContext _dbContext;
        private readonly IEmailService _emailService;

        public TD_UngVienService(
            ITD_UngVienRepository tD_UngVienRepository,
             ITD_TuyenDungService tD_TuyenDungService,
             IEmailTemplateService emailTemplateService,
              IKeyEmailTemplateService keyEmailTemplateService,
              DbContext dbContext, // ✅ thêm vào đây
            IMapper mapper,
            IEmailService emailService
            ) : base(tD_UngVienRepository)
        {
            _mapper = mapper;
            _emailTemplateService = emailTemplateService;
            _tD_TuyenDungService = tD_TuyenDungService;
            _keyEmailTemplateService = keyEmailTemplateService;
            _tD_UngVienRepository = tD_UngVienRepository;
            _dbContext = dbContext; // ✅ lưu lại để dùng
            _emailService = emailService;
        }

        public async Task<PagedList<TD_UngVienDto>> GetData(TD_UngVienSearch search)
        {
            var query = _tD_UngVienRepository.GetQueryable();

            if (!string.IsNullOrEmpty(search.HoTen))
            {
                if (!search.HoTen.Contains("@"))
                    query = query.Where(x => x.HoTen.ToLower().Trim().Contains(search.HoTen.ToLower().Trim()));
                else
                    query = query.Where(x => x.Email.ToLower().Trim().Contains(search.HoTen.ToLower().Trim()));
            }

            if (!string.IsNullOrEmpty(search.sdt))
                query = query.Where(x => x.SoDienThoai.Trim().Contains(search.sdt.Trim()));

            if (!string.IsNullOrEmpty(search.Email))
                query = query.Where(x => x.Email.ToLower().Trim().Contains(search.Email.ToLower().Trim()));

            if (!string.IsNullOrEmpty(search.KinhNghiem))
                query = query.Where(x => x.KinhNghiem.ToLower().Trim().Contains(search.KinhNghiem.ToLower().Trim()));

            if (search.GioiTinh.HasValue)
                query = query.Where(x => x.GioiTinh == search.GioiTinh);

            if (search.TrangThai.HasValue)
                query = query.Where(x => x.TrangThai == search.TrangThai.Value);

            if (search.TuyenDungId.HasValue)
                query = query.Where(x => x.TuyenDungId == search.TuyenDungId);

            if (search.NgayUngTuyen.HasValue)
                query = query.Where(x => x.NgayUngTuyen.HasValue && DateOnly.FromDateTime(x.NgayUngTuyen.Value) == search.NgayUngTuyen);

            if (search.ThoiGianPhongVan_Start.HasValue)
            {
                var start = search.ThoiGianPhongVan_Start.Value.ToDateTime(TimeOnly.MinValue);
                query = query.Where(x => x.ThoiGianPhongVan.HasValue && x.ThoiGianPhongVan.Value >= start);
            }
            if (search.ThoiGianPhongVan_End.HasValue)
            {
                var end = search.ThoiGianPhongVan_End.Value.ToDateTime(TimeOnly.MaxValue);
                query = query.Where(x => x.ThoiGianPhongVan.HasValue && x.ThoiGianPhongVan.Value <= end);
            }

            var total = await query.CountAsync();
            var entities = await query.OrderByDescending(x => x.CreatedDate)
                .Skip((search.PageIndex - 1) * search.PageSize)
                .Take(search.PageSize)
                .ToListAsync();

            var items = new List<TD_UngVienDto>();
            foreach (var q in entities)
            {
                var tuyenDung = await _tD_TuyenDungService.GetByIdAsync(q.TuyenDungId);
                items.Add(new TD_UngVienDto()
                {
                    Id = q.Id,
                    HoTen = q.HoTen,
                    NgaySinh = q.NgaySinh,
                    GioiTinh = q.GioiTinh,
                    Email = q.Email,
                    SoDienThoai = q.SoDienThoai,
                    DiaChi = q.DiaChi,
                    TrinhDoHocVan = q.TrinhDoHocVan,
                    KinhNghiem = q.KinhNghiem,
                    CVFile = q.CVFile,
                    NgayUngTuyen = q.NgayUngTuyen,
                    ThoiGianPhongVan = q.ThoiGianPhongVan,
                    TrangThai = q.TrangThai,
                    GhiChuUngVien = q.GhiChuUngVien,
                    TuyenDungId = q.TuyenDungId,
                    TrangThaiText = q.TrangThai.ToString(),
                    ViTriTuyenDungText = tuyenDung?.TenViTri ?? "Không xác định",
                    GioiTinhText = q.GioiTinh.ToString()
                });
            }
            var result = new PagedList<TD_UngVienDto>(items, search.PageIndex, search.PageSize, total);
            return result;
        }

        public async Task<TD_UngVienDto> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)
                              select new TD_UngVienDto()
                              {
                                  Id = q.Id,
                                  HoTen = q.HoTen,
                                  NgaySinh = q.NgaySinh,
                                  GioiTinh = q.GioiTinh,
                                  Email = q.Email,
                                  SoDienThoai = q.SoDienThoai,
                                  DiaChi = q.DiaChi,
                                  TrinhDoHocVan = q.TrinhDoHocVan,
                                  KinhNghiem = q.KinhNghiem,
                                  CVFile = q.CVFile,
                                  NgayUngTuyen = q.NgayUngTuyen,
                                  ThoiGianPhongVan = q.ThoiGianPhongVan,
                                  TrangThai = q.TrangThai,
                                  GhiChuUngVien = q.GhiChuUngVien,
                                  TuyenDungId = q.TuyenDungId,
                                  TrangThaiText = q.TrangThai.ToString(),
                                  GioiTinhText = q.GioiTinh.ToString(),
                                  ViTriTuyenDungText = null
                              }).FirstOrDefaultAsync();

            if (item != null)
            {
                var tuyenDung = await _tD_TuyenDungService.GetByIdAsync(item.TuyenDungId);
                item.ViTriTuyenDungText = tuyenDung?.TenViTri ?? "Không xác định";
            }

            return item;
        }

        /// <summary>
        /// Cập nhật TD_UngVien với xử lý xung đột tracking trong EF Core
        /// </summary>
        public async Task UpdateAsyncFixTracked(TD_UngVien entity)
        {
            var trackedEntity = _dbContext.ChangeTracker.Entries<TD_UngVien>()
                .FirstOrDefault(e => e.Entity.Id == entity.Id);

            if (trackedEntity != null)
            {
                trackedEntity.State = EntityState.Detached;
            }

            _dbContext.Update(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task SendMailToUngViens(List<Guid> ungVienIds, Guid? emailTemplateId, string? emailtemplateCode)
        {
            var template = string.IsNullOrEmpty(emailtemplateCode) ? await _emailTemplateService.GetQueryable().Where(x => x.Id == emailTemplateId).FirstOrDefaultAsync() : await _emailTemplateService.GetQueryable().Where(x => x.Code == emailtemplateCode).FirstOrDefaultAsync();
            if (template == null) throw new Exception("Không tìm thấy template");

            var keyList = await _keyEmailTemplateService.GetQueryable().Where(x => x.EmailTemplateId == emailTemplateId).ToListAsync();
            var ungViens = await _tD_UngVienRepository.GetQueryable().Where(x => ungVienIds.Contains(x.Id)).ToListAsync();

            // Lấy tất cả TuyenDungId cần thiết
            var tuyenDungIds = ungViens.Select(x => x.TuyenDungId).Distinct().ToList();
            var tuyenDungDict = (await _tD_TuyenDungService.GetQueryable().Where(x => tuyenDungIds.Contains(x.Id)).ToListAsync())
                                .ToDictionary(x => x.Id, x => x);

            // Chuẩn bị key mặc định
            var defaultKeys = keyList.ToDictionary(k => k.Key, k => k.Value ?? "");

            var tasks = new List<Task>();
            var semaphore = new System.Threading.SemaphoreSlim(30); // Giới hạn tối đa 30 email gửi đồng thời
            foreach (var ungVien in ungViens)
            {
                await semaphore.WaitAsync();
                tasks.Add(Task.Run(async () =>
                {
                    try
                    {
                        tuyenDungDict.TryGetValue(ungVien.TuyenDungId, out var tuyenDung);
                        var data = new Dictionary<string, string>(defaultKeys)
                        {
                            ["TenUngVien"] = ungVien.HoTen,
                            ["ViTri"] = tuyenDung?.TenViTri ?? "Không xác định",
                            ["ThoiGianPhongVan"] = ungVien.ThoiGianPhongVan?.ToString("dd/MM/yyyy HH:mm") ?? "Chưa xác định",
                            ["NamHienTai"] = DateTime.Now.Year.ToString()
                        };
                        string body = Regex.Replace(
                            template.Content,
                            @"\{\{(\w+)\}\}",
                            m => data.TryGetValue(m.Groups[1].Value, out var val) ? val : m.Value
                        );
                        await _emailService.SendEmailAsync(ungVien.Email, template.Name, body);
                    }
                    finally
                    {
                        semaphore.Release();
                    }
                }));
            }
            await Task.WhenAll(tasks);
        }

    }
}

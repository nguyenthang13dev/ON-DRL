using Hinet.Model.Entities;
using Hinet.Service.Common.Service;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Constant.QLNhanSu;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using Hinet.Repository.QLNhanSu.NS_HopDongLaoDongRepository;
using Hinet.Repository.QLNhanSu.NS_NhanSuRepository;
using Hinet.Service.QLNhanSu.NS_HopDongLaoDongService.Dto;
using Hinet.Service.QLNhanSu.NS_HopDongLaoDongService.ViewModels;



namespace Hinet.Service.QLNhanSu.NS_HopDongLaoDongService
{
    public class NS_HopDongLaoDongService : Service<NS_HopDongLaoDong>, INS_HopDongLaoDongService
    {
        private readonly INS_NhanSuRepository nS_NhanSuRepository;
        private readonly IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository;
        public NS_HopDongLaoDongService(
            INS_HopDongLaoDongRepository nS_HopDongLaoDongRepository,
            INS_NhanSuRepository nS_NhanSuRepository,
            IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository
            ) : base(nS_HopDongLaoDongRepository)
        {
            this.nS_NhanSuRepository = nS_NhanSuRepository;
            this.dM_DuLieuDanhMucRepository = dM_DuLieuDanhMucRepository;
        }

        public async Task<PagedList<NS_HopDongLaoDongDto>> GetData(NS_HopDongLaoDongSearch search)
        {
            var query = from q in GetQueryable()

                        select new NS_HopDongLaoDongDto()
                        {
                            NhanSuId = q.NhanSuId,
                            NgayKy = q.NgayKy,
                            NgayHetHan = q.NgayHetHan,
                            LoaiHopDong = q.LoaiHopDong,
                            SoHopDong = q.SoHopDong,
                            GhiChu = q.GhiChu,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                        };
            if (search != null)
            {
                if (search.NhanSuId.HasValue)
                {
                    query = query.Where(x => x.NhanSuId == search.NhanSuId);
                }
                if (search.NgayKyFrom.HasValue)
                {
                    query = query.Where(x => x.NgayKy >= search.NgayKyFrom);
                }
                if (search.NgayKyTo.HasValue)
                {
                    query = query.Where(x => x.NgayKy <= search.NgayKyTo);
                }
                if (search.NgayHetHanFrom.HasValue)
                {
                    query = query.Where(x => x.NgayHetHan >= search.NgayHetHanFrom);
                }
                if (search.NgayHetHanTo.HasValue)
                {
                    query = query.Where(x => x.NgayHetHan <= search.NgayHetHanTo);
                }
                if (search.LoaiHopDong.HasValue)
                {
                    query = query.Where(x => x.LoaiHopDong == search.LoaiHopDong);
                }
                if (!string.IsNullOrEmpty(search.SoHopDong))
                {
                    query = query.Where(x => EF.Functions.Like(x.SoHopDong, $"%{search.SoHopDong}%"));
                }
                if (!string.IsNullOrEmpty(search.GhiChu))
                {
                    query = query.Where(x => EF.Functions.Like(x.GhiChu, $"%{search.GhiChu}%"));
                }
            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<NS_HopDongLaoDongDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<NS_HopDongLaoDongDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)

                              select new NS_HopDongLaoDongDto()
                              {
                                  NhanSuId = q.NhanSuId,
                                  NgayKy = q.NgayKy,
                                  NgayHetHan = q.NgayHetHan,
                                  LoaiHopDong = q.LoaiHopDong,
                                  SoHopDong = q.SoHopDong,
                                  GhiChu = q.GhiChu,
                                  CreatedBy = q.CreatedBy,
                                  UpdatedBy = q.UpdatedBy,
                                  IsDelete = q.IsDelete,
                                  DeleteId = q.DeleteId,
                                  CreatedDate = q.CreatedDate,
                                  UpdatedDate = q.UpdatedDate,
                                  DeleteTime = q.DeleteTime,
                                  Id = q.Id,
                              }).FirstOrDefaultAsync();

            return item;
        }

        public async Task<NS_HopDongLaoDongExportDto?> GetExportDto(Guid idHopDongLaoDong)
        {
            var nhanSu = nS_NhanSuRepository.GetQueryable().AsNoTracking();
            var dmDulieuDanhMuc = dM_DuLieuDanhMucRepository.GetQueryable().AsNoTracking();
            var query = await (from HopDongLaoDongtbl in GetQueryable().Where(x => x.Id == idHopDongLaoDong)
                               join NhanSutbl in nhanSu on HopDongLaoDongtbl.NhanSuId equals NhanSutbl.Id
                               join ChucVutble in dmDulieuDanhMuc on NhanSutbl.ChucVuId equals ChucVutble.Id
                               select new NS_HopDongLaoDongExportDto
                               {
                                   Id = idHopDongLaoDong,
                                   SoHopDong = HopDongLaoDongtbl.SoHopDong,
                                   NgayKy = HopDongLaoDongtbl.NgayKy.HasValue ? HopDongLaoDongtbl.NgayKy.Value.ToString("dd/MM/yyyy") : "",
                                   HoTenNhanSu = NhanSutbl.HoTen,
                                   NgaySinh = NhanSutbl.NgaySinh.HasValue ? NhanSutbl.NgaySinh.Value.ToString("dd/MM/yyyy") : "",
                                   DiaChiThuongTru = NhanSutbl.DiaChiThuongTru,
                                   CMND = NhanSutbl.CMND,
                                   NgayCapCMND = NhanSutbl.NgayCapCMND.HasValue ? NhanSutbl.NgayCapCMND.Value.ToString("dd/MM/yyyy") : "",
                                   NoiCapCMND = NhanSutbl.NoiCapCMND,
                                   LoaiHopDong = LoaiHopDongLaoDongConstant.GetDisplayName(HopDongLaoDongtbl.LoaiHopDong ?? 0).ToUpper(),
                                   NgayHetHan = HopDongLaoDongtbl.NgayHetHan.HasValue ? HopDongLaoDongtbl.NgayHetHan.Value.ToString("dd/MM/yyyy") : "",
                                   ChucVu = ChucVutble.Name
                               }).FirstOrDefaultAsync();
            if (query == null)
            {
                return null;
            }
            return query;
        }
    }
}

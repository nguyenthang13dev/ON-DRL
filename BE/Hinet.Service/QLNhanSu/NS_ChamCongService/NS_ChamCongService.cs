using CommonHelper.CrawlProvider;
using CommonHelper.Extenions;
using CommonHelper.String;
using DocumentFormat.OpenXml.Wordprocessing;
using Hinet.Model.Entities.QLNhanSu;
using Hinet.Repository.AspNetUsersRepository;
using Hinet.Repository.DepartmentRepository;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using Hinet.Repository.NghiPhep.NP_DonXinNghiPhepRepository;
using Hinet.Repository.NS_NgayLeRepository;
using Hinet.Repository.QLNhanSu.NS_ChamCongRepository;
using Hinet.Repository.QLNhanSu.NS_NhanSuRepository;
using Hinet.Service.AppUserService;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Constant;
using Hinet.Service.Constant.NghiPhep;
using Hinet.Service.Constant.QLNhanSu;
using Hinet.Service.OperationService;
using Hinet.Service.QLNhanSu.NS_ChamCongService.Dto;
using Hinet.Service.QLNhanSu.NS_ChamCongService.ViewModels;
using Hinet.Service.QLNhanSu.NS_NhanSuService;
using Hinet.Service.QLNhanSu.NS_NhanSuService.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Hinet.Service.QLNhanSu.NS_ChamCongService
{
    public class NS_ChamCongService : Service<NS_ChamCong>, INS_ChamCongService
    {
        private readonly INS_ChamCongRepository _iNS_ChamCongRepository;
        private readonly INS_NhanSuRepository _nS_NhanSuRepository;
        private readonly IDM_DuLieuDanhMucRepository _dM_DuLieuDanhMucRepository;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IAspNetUsersRepository _aspNetUsersRepository;
        private readonly INS_NhanSuService _nS_NhanSuService;
        private readonly INP_DangKyNghiPhepRepository _nP_DangKyNghiPhepRepository;
        private readonly INS_NgayLeRepository _nS_NgayLeRepository;
        private readonly IOperationService _operationService;

        public NS_ChamCongService(
            INS_ChamCongRepository iNS_ChamCongRepository,
            INS_NhanSuRepository nS_NhanSuRepository,
            IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository,
            IDepartmentRepository departmentRepository,
            INS_NhanSuService nS_NhanSuService,
            INP_DangKyNghiPhepRepository nP_DangKyNghiPhepRepository,
            IAspNetUsersRepository aspNetUsersRepository,
            INS_NgayLeRepository nS_NgayLeRepository,
            IOperationService operationService
            ) : base(iNS_ChamCongRepository)
        {
            _iNS_ChamCongRepository = iNS_ChamCongRepository;
            _nS_NhanSuRepository = nS_NhanSuRepository;
            _dM_DuLieuDanhMucRepository = dM_DuLieuDanhMucRepository;
            _departmentRepository = departmentRepository;
            _aspNetUsersRepository = aspNetUsersRepository;
            _nS_NhanSuService = nS_NhanSuService;
            _nP_DangKyNghiPhepRepository = nP_DangKyNghiPhepRepository;
            _nS_NgayLeRepository = nS_NgayLeRepository;
            _operationService = operationService;
        }

        public async Task<PagedList<NS_ChamCongDto>> GetData(NS_ChamCongSearch search)
        {
            var query = from data in GetQueryable().Distinct()
                        select new NS_ChamCongDto
                        {
                            NhanSuId = data.NhanSuId,
                            NgayLamViec = data.NgayLamViec,
                            GioVao = data.GioVao,
                            GioRa = data.GioRa,
                            SoGioLam = data.SoGioLam,
                            TrangThai = data.TrangThai,
                            DiMuon = data.DiMuon,
                            VeSom = data.VeSom,
                            MaNV = data.MaNV,
                            CreateDate = data.CreatedDate
                        };
            if (search != null)
            {
                if (search.NgayLamViec.HasValue)
                {
                    query = query.Where(x => x.NgayLamViec.Date == search.NgayLamViec.Value.Date && x.NgayLamViec.Month == search.NgayLamViec.Value.Month && x.NgayLamViec.Month == search.NgayLamViec.Value.Year);
                }
                if (search.GioVao.HasValue)
                {
                    query = query.Where(x => x.GioVao == search.GioVao);
                }
                if (search.GioRa.HasValue)
                {
                    query = query.Where(x => x.GioRa == search.GioRa);
                }
                if (search.TrangThai.HasValue)
                {
                    query = query.Where(x => x.TrangThai == search.TrangThai);
                }
                if (!string.IsNullOrEmpty(search.MaNV))
                {
                    query = query.Where(x => x.MaNV.ToLower() == search.MaNV.ToLower());
                }
            }
            query = query.OrderByDescending(x => x.CreateDate);
            var result = await PagedList<NS_ChamCongDto>.CreateAsync(query, search);
            return result;

        }

        public async Task<ImportChamCongResultDto> ImportChamCongAsync(IFormFile fileExcel)
        {
            var result = new ImportChamCongResultDto();

            try
            {
                using var stream = new MemoryStream();
                await fileExcel.CopyToAsync(stream);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using var package = new ExcelPackage(stream);
                var sheet = package.Workbook.Worksheets[0];
                var ngayRow = 7; // dữ liệu ngày (1 ddesn 31)
                var dataStartRow = 9; // dữ liệu chấm công 

                // Lấy tháng/năm từ tiêu đề
                var tieuDe = sheet.Cells[4, 1].Text?.Trim();
                var thang = DateTime.Now.Month;
                var nam = DateTime.Now.Year;
                if (!string.IsNullOrEmpty(tieuDe))
                {
                    var match = Regex.Match(tieuDe, @"\d{2}/(?<thang>\d{2})/(?<nam>\d{4})");
                    if (match.Success)
                    {
                        thang = int.Parse(match.Groups["thang"].Value);
                        nam = int.Parse(match.Groups["nam"].Value);
                    }
                }
                var chamCongList = _iNS_ChamCongRepository.FindBy(x => x.NgayLamViec.Year == nam && x.NgayLamViec.Month == thang).ToList();
                // Lấy giờ vào làm và hệ số đi muộn
                var heSoDiMuon = _dM_DuLieuDanhMucRepository.FindBy(x => x.Code == MaDanhMucConstant.HeSoDiMuon).FirstOrDefault();
                var gioVaoLamViec = _dM_DuLieuDanhMucRepository.FindBy(x => x.Code == MaDanhMucConstant.GioVaoLamViec).FirstOrDefault();
                int gioVaoInt = int.TryParse(gioVaoLamViec?.Note ?? "0", out var gvl) ? gvl : 0;
                int phutDiMuonInt = int.TryParse(heSoDiMuon?.Note ?? "0", out var hsdm) ? hsdm : 0;
                TimeSpan gioChamCongMuonChoPhep = new TimeSpan(gioVaoInt, 0, 0).Add(TimeSpan.FromMinutes(phutDiMuonInt));
                for (int row = dataStartRow; row <= sheet.Dimension.End.Row; row += 2)
                {
                    var maNV = sheet.Cells[row, 2].Text?.Trim();
                    if (string.IsNullOrWhiteSpace(maNV))
                    {
                        result.Errors.Add($"[Row {row}] Không có mã nhân viên.");
                        result.TotalRecordsError++;
                        continue;
                    }

                    var nhanSu = _nS_NhanSuRepository.FindBy(x => x.MaNV == maNV).FirstOrDefault();
                    if (nhanSu == null)
                    {
                        result.Errors.Add($"[Row {row}] Không tìm thấy nhân viên mã {maNV}.");
                        result.TotalRecordsError++;
                        continue;
                    }

                    int check = 0;
                    // lấy dữ liệu từng cột ngày
                    for (int col = 5; col <= 66; col += 2)
                    {
                        try
                        {
                            var ngayText = sheet.Cells[ngayRow, col].Text;
                            if (!int.TryParse(ngayText, out int ngaySo))
                                throw new Exception($"Ngày không hợp lệ: {ngayText}");

                            if (ngaySo == 1) check++;
                            if (check > 1) continue;

                            var gioVaoCell = sheet.Cells[row, col].Text?.Trim();
                            var gioRaCell = sheet.Cells[row, col + 1].Text?.Trim();

                            TimeSpan gioVao = TimeSpan.Zero;
                            TimeSpan gioRa = TimeSpan.Zero;

                            if (!string.IsNullOrWhiteSpace(gioVaoCell) && !TimeSpan.TryParse(gioVaoCell, out gioVao))
                                throw new Exception($"Giờ vào không hợp lệ: {gioVaoCell}");

                            if (!string.IsNullOrWhiteSpace(gioRaCell) && !TimeSpan.TryParse(gioRaCell, out gioRa))
                                throw new Exception($"Giờ ra không hợp lệ: {gioRaCell}");

                            int trangThai = TrangThaiChamCongConstant.ChuaChamCong;
                            bool diMuon = false;

                            if (gioVao != TimeSpan.Zero)
                            {
                                diMuon = gioVao > gioChamCongMuonChoPhep;
                                trangThai = diMuon ? TrangThaiChamCongConstant.DiMuon : TrangThaiChamCongConstant.BinhThuong;
                            }

                            var ngayLam = new DateTime(nam, thang, ngaySo);
                            var start = ngayLam.Date;
                            var end = start.AddDays(1);

                            //var chamCong = _iNS_ChamCongRepository
                            //    .FindBy(x => x.NhanSuId == nhanSu.Id && x.NgayLamViec >= start && x.NgayLamViec < end)
                            //    .FirstOrDefault();

                            var soGioLam = (decimal)Math.Round((gioRa - gioVao).TotalHours, 2);
                            var chamCong = chamCongList.FirstOrDefault(x => x.NhanSuId == nhanSu.Id && x.NgayLamViec.ToLocalTime() == ngayLam.Date);
                            if (chamCong == null)
                            {
                                chamCong = new NS_ChamCong
                                {
                                    Id = Guid.NewGuid(),
                                    NhanSuId = nhanSu.Id,
                                    NgayLamViec = ngayLam,
                                    GioVao = gioVao,
                                    GioRa = gioRa,
                                    SoGioLam = soGioLam,
                                    TrangThai = (byte)trangThai,
                                    DiMuon = diMuon,
                                    CreatedDate = DateTime.UtcNow,
                                    MaNV = nhanSu.MaNV
                                };
                                _iNS_ChamCongRepository.Add(chamCong);
                            }
                            else
                            {
                                chamCong.GioVao = gioVao;
                                chamCong.GioRa = gioRa;
                                chamCong.SoGioLam = soGioLam;
                                chamCong.TrangThai = (byte)trangThai;
                                chamCong.DiMuon = diMuon;
                                chamCong.UpdatedDate = DateTime.UtcNow;
                                _iNS_ChamCongRepository.Update(chamCong);
                            }

                            result.TotalRecordsSuccess++;
                        }
                        catch (Exception ex)
                        {
                            result.TotalRecordsError++;
                            result.Errors.Add($"[Row {row}, Col {col}] {ex.Message}");
                        }
                    }
                }

                await _iNS_ChamCongRepository.SaveAsync();

                result.TotalRecords = result.TotalRecordsSuccess + result.TotalRecordsError;
                return result;
            }
            catch (Exception ex)
            {
                var message = ex.Message;
                throw new Exception("Lỗi khi import dữ liệu chấm công: " + message, ex);
            }
        }
        public async Task<List<DataTableChamCong>> DataTableChamCong(DataTableSearch search, Guid? UserId, List<string>? Roles)
        {
            var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month - 1, 1);
            var endDate = startDate.AddMonths(1);
            if (search.Year > 0 && search.Month > 0)
            {
                startDate = new DateTime(search.Year, search.Month, 1);
                endDate = startDate.AddMonths(1);
            }
            var chamCongs = await (from q in _iNS_ChamCongRepository.GetQueryable().Where(x => x.NgayLamViec.ToLocalTime() >= startDate.Date && x.NgayLamViec.ToLocalTime() < endDate.Date)
                                   join ns in _nS_NhanSuRepository.GetQueryable() on q.NhanSuId equals ns.Id
                                   join d in _dM_DuLieuDanhMucRepository.GetQueryable() on ns.ChucVuCode equals d.Code
                                   select new
                                   {
                                       q.NgayLamViec,
                                       q.GioVao,
                                       q.TrangThai,
                                       ns.MaNV,
                                       ns.HoTen,
                                       ChucVu = d.Name,
                                       q.CreatedDate
                                   }).OrderByDescending(x => x.CreatedDate).ToListAsync();
            var nghiPheps = await _nP_DangKyNghiPhepRepository.GetQueryable()
                            .Where(x =>
                                (
                                    (x.SoNgayNghi <= 1 && x.TrangThai == TrangThaiNghiPhepConstant.TruongBanDuyet) ||
                                    x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocPheDuyet
                                ) &&
                                x.TuNgay <= endDate &&
                                x.DenNgay >= startDate)
                            .Select(x => new
                            {
                                TuNgay = x.TuNgay.ToLocalTime(),
                                DenNgay = x.DenNgay.ToLocalTime(),
                                MaNV = x.MaNhanSu
                            }).ToListAsync();
            var nghiLes = await _nS_NgayLeRepository.GetQueryable().Where(x=> x.NgayBatDau <= endDate && x.NgayKetThuc >= startDate)
                            .Select(x => new
                            {
                                NgayBatDau = x.NgayBatDau.ToLocalTime(),
                                NgayKetThuc = x.NgayKetThuc.ToLocalTime(),
                                TenNgayLe = x.TenNgayLe,
                            }).ToListAsync();
            var grouped = chamCongs
                             .GroupBy(x => new { x.MaNV, x.HoTen, x.ChucVu })
                             .Select(g =>
                             {
                                 var dict = new Dictionary<string, ChamCongTheoNgayDto>();
                                 for (int i = 1; i <= 31; i++)
                                 {
                                     dict[$"day_{i}"] = new ChamCongTheoNgayDto();
                                 }

                                 foreach (var cc in g)
                                 {
                                     bool isNghiPhep = false;
                                     bool isNghiLe = false;
                                     var day = cc.NgayLamViec.ToLocalTime().Day;
                                     if(cc.TrangThai == TrangThaiChamCongConstant.ChuaChamCong)
                                     {
                                          isNghiPhep = nghiPheps.Any(np => cc.NgayLamViec.ToLocalTime().Date >= np.TuNgay.Date && cc.NgayLamViec.ToLocalTime().Date <= np.DenNgay.Date && cc.MaNV == np.MaNV);
                                         if (!isNghiPhep)
                                         {
                                              isNghiLe = nghiLes.Any(nl => cc.NgayLamViec.ToLocalTime().Date >= nl.NgayBatDau.Date && cc.NgayLamViec.ToLocalTime().Date <= nl.NgayKetThuc.Date);
                                         }
                                     }

                                     dict[$"day_{day}"] = new ChamCongTheoNgayDto
                                     {
                                         GioVao = cc.GioVao.HasValue ? cc.GioVao.Value.ToString(@"hh\:mm") : "00:00",
                                         TrangThai = cc.TrangThai,
                                         IsNgayLe = isNghiLe,
                                         IsNghiPhep = isNghiPhep
                                     };
                                 }

                                 return new DataTableChamCong
                                 {
                                     MaNV = g.Key.MaNV,
                                     HoTen = g.Key.HoTen,
                                     ChucVu = g.Key.ChucVu,
                                     DataOfDate = dict
                                 };
                             }).ToList();
            if (Roles != null && !Roles.Contains(VaiTroConstant.HR) && !Roles.Contains(VaiTroConstant.Admin))
            {
                if (UserId.HasValue)
                {
                    var user = await _aspNetUsersRepository.GetByIdAsync(UserId.Value);
                    var nhanSu = await _nS_NhanSuRepository.Where(x => x.Id == user.IdNhanSu).FirstOrDefaultAsync();
                    if (nhanSu != null)
                    {
                        grouped = grouped.Where(x => x.MaNV == nhanSu.MaNV).ToList();
                    }
                }
            }
            return grouped;
        }

        public async Task<List<DataChamCongDto>> DanhSachChamCongThang(DataTableSearch search, Guid UserId)
        {
            var userInfo = await _aspNetUsersRepository.GetByIdAsync(UserId);
            if (userInfo is null)
            {
                throw new Exception("Không tìm thấy thông tin người dùng");
            }

            var ListOperations = await _operationService.GetListOperationUser(UserId);
            if (!ListOperations.Any(x => x.Equals(VaiTroNhanSuConstant.ViewAllNS)))
            {
                var currentNS = await _nS_NhanSuRepository.GetByIdAsync(userInfo.IdNhanSu);
                if (currentNS is null)
                {
                    throw new Exception("Không tìm thấy thông tin nhân sự");
                }

                if (currentNS.MaNV != search.MaNV)
                {
                    throw new Exception("Không tìm thấy thông tin nhân sự");
                }
            }

            var infoNS = await _nS_NhanSuService.GetByMa(search.MaNV);
            if (infoNS is null)
            {
                throw new Exception("Không tìm thấy thông tin nhân sự");
            }

            var startDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month - 1, 1);
            var endDate = startDate.AddMonths(1);
            if (search.Year > 0 && search.Month > 0)
            {
                startDate = new DateTime(search.Year, search.Month, 1);
                endDate = startDate.AddMonths(1);
            }
            var vnTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");

            var startDateVN = TimeZoneInfo.ConvertTimeFromUtc(startDate.ToUniversalTime(), vnTimeZone).Date;
            var endDateVN = TimeZoneInfo.ConvertTimeFromUtc(endDate.ToUniversalTime(), vnTimeZone).Date;
            var allDates = Enumerable.Range(0, (endDateVN - startDateVN).Days + 1)
                            .Select(offset => startDateVN.AddDays(offset))
                            .ToList();

            var chamCongData = await _iNS_ChamCongRepository.GetQueryable()
                                .Where(x => x.NgayLamViec >= startDate && x.NgayLamViec < endDate.AddDays(1) && x.MaNV == search.MaNV)
                                .ToListAsync();

            var chamCongDataVN = chamCongData.Select(x => new {
                                    NgayLamViec = x.NgayLamViec.ToLocalTime(),
                                    x.GioVao,
                                    x.TrangThai
                                }).OrderBy(x =>x .NgayLamViec).ToList();

            var nghiPhep = await _nP_DangKyNghiPhepRepository.GetQueryable()
                            .Where(x =>
                                x.MaNhanSu == search.MaNV &&
                                (
                                    (x.SoNgayNghi <= 1 && x.TrangThai == TrangThaiNghiPhepConstant.TruongBanDuyet) ||
                                    x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocPheDuyet
                                ) &&
                                x.TuNgay <= endDate &&
                                x.DenNgay >= startDate)
                            .Select(x => new
                            {
                                TuNgay = TimeZoneInfo.ConvertTimeFromUtc(x.TuNgay, vnTimeZone),
                                DenNgay = TimeZoneInfo.ConvertTimeFromUtc(x.DenNgay, vnTimeZone)
                            }).ToListAsync();

            var nghiLe = await _nS_NgayLeRepository.GetQueryable()
                        .Where(x => x.NgayBatDau <= endDate && x.NgayKetThuc >= startDate)
                        .Select(x => new
                        {
                            NgayBatDau = TimeZoneInfo.ConvertTimeFromUtc(x.NgayBatDau, vnTimeZone),
                            NgayKetThuc = TimeZoneInfo.ConvertTimeFromUtc(x.NgayKetThuc, vnTimeZone),
                            x.TenNgayLe,
                            x.LoaiNLCode
                        }).ToListAsync();

            var chamCongs = allDates.Select(date =>
            {
                var record = chamCongDataVN.FirstOrDefault(x => x.NgayLamViec.Date == date.Date);
                var isNghiPhep = nghiPhep.Any(np =>
                    date.Date >= np.TuNgay.Date && date.Date <= np.DenNgay.Date);
                var le = nghiLe.FirstOrDefault(nl =>
                    date.Date >= nl.NgayBatDau.Date && date.Date <= nl.NgayKetThuc.Date);

                return new DataChamCongDto
                {
                    NgayDiemDanh = date,
                    GioVao = record?.GioVao.HasValue == true ? record.GioVao.Value.ToString(@"hh\:mm") : "00:00",
                    TrangThai = record?.TrangThai ?? 3,
                    IsNghiPhep = isNghiPhep,
                    IsNgayLe = le != null,
                    Note = le != null && !le.LoaiNLCode.Equals(LoaiNghiLeConstant.CHUNHAT) ? le?.TenNgayLe : ""
                };
            }).OrderBy(x => x.NgayDiemDanh).ToList();

            return chamCongs;
        }

        public async Task<NS_NhanSu> UpdateListDataByMaNVAsync(UpdateDataListByMaNV model)
        {
            try
            {
                var heSoDiMuon = _dM_DuLieuDanhMucRepository.FindBy(x => x.Code == MaDanhMucConstant.HeSoDiMuon).FirstOrDefault();
                var gioVaoLamViec = _dM_DuLieuDanhMucRepository.FindBy(x => x.Code == MaDanhMucConstant.GioVaoLamViec).FirstOrDefault();
                int gioVaoInt = int.TryParse(gioVaoLamViec?.Note ?? "0", out var gvl) ? gvl : 0;
                int phutDiMuonInt = int.TryParse(heSoDiMuon?.Note ?? "0", out var hsdm) ? hsdm : 0;
                TimeSpan gioChamCongMuonChoPhep = new TimeSpan(gioVaoInt, 0, 0).Add(TimeSpan.FromMinutes(phutDiMuonInt));
                var allDates = model.ChamCongList.Select(x => DateTime.ParseExact(x.NgayLam, "dd/MM/yyyy", CultureInfo.InvariantCulture)).ToList();
                var chamCongListFind = (await _iNS_ChamCongRepository
                                        .Where(x => x.MaNV == model.MaNV)
                                        .ToListAsync())
                                        .Where(x => allDates.Contains(x.NgayLamViec.ToLocalTime())) // Không có LocalTime lấy dữ liêu DB DateTime lỗi + 1 ngày. 
                                        .ToList();
                foreach (var item in model.ChamCongList)
                {
                    if (!DateTime.TryParseExact(item.NgayLam, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var ngayLamViec))
                        continue;
                    TimeSpan? gioVaoLam = null;
                    if (TimeSpan.TryParseExact(item.GioVao, "hh\\:mm", CultureInfo.InvariantCulture, out var parsedGioVao))
                        gioVaoLam = parsedGioVao;
                    var chamCong = chamCongListFind.FirstOrDefault(x => x.NgayLamViec.ToLocalTime() == ngayLamViec.Date);
                    if (chamCong != null)
                    {
                        if (chamCong.GioVao.HasValue && gioVaoLam.HasValue && chamCong.GioVao != gioVaoLam)
                        {
                            chamCong.SoGioLam = (decimal)Math.Round((chamCong.GioRa.Value - gioVaoLam.Value).TotalHours, 2);
                            chamCong.TrangThai = (byte)(gioVaoLam > gioChamCongMuonChoPhep ? TrangThaiChamCongConstant.DiMuon : TrangThaiChamCongConstant.BinhThuong);
                            chamCong.GioVao = gioVaoLam.Value;
                            _iNS_ChamCongRepository.Update(chamCong);
                        }
                    }
                }
                await _iNS_ChamCongRepository.SaveAsync();
                return await _nS_NhanSuRepository.Where(x => x.MaNV == model.MaNV).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi khi cập nhật dữ liệu chấm công: " + ex.Message, ex);
            }

        }



    }
}

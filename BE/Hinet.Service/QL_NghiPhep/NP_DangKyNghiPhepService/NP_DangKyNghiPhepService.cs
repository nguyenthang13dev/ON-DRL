using CommonHelper.String;
using CommonHelper.Word;
using DocumentFormat.OpenXml.EMMA;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Hinet.Model.Entities;
using Hinet.Model.Entities.NghiPhep;
using Hinet.Repository;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.NghiPhep.NP_DonXinNghiPhepRepository;
using Hinet.Repository.NghiPhep.NP_LoaiNghiPhepRepository;
using Hinet.Repository.QLNhanSu.NS_NhanSuRepository;
using Hinet.Repository.TaiLieuDinhKemRepository;
using Hinet.Service.AppUserService;
using Hinet.Service.AppUserService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Constant;
using Hinet.Service.Constant.NghiPhep;
using Hinet.Service.Constant.QLNhanSu;
using Hinet.Service.NotificationService;
using Hinet.Service.OperationService;
using Hinet.Service.QL_NghiPhep.NP_DangKyNghiPhepService.Dto;
using Hinet.Service.QL_NghiPhep.NP_DangKyNghiPhepService.ViewModels;
using Hinet.Service.QL_NghiPhep.NP_LoaiNghiPhepService.Dto;
using Hinet.Service.QLNhanSu.NS_NhanSuService;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Service.XaService.Dto;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using OfficeOpenXml.Export.HtmlExport.StyleCollectors.StyleContracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Xceed.Words.NET;

namespace Hinet.Service.QL_NghiPhep.NP_DangKyNghiPhepService
{
    public class NP_DangKyNghiPhepService : Service<NP_DangKyNghiPhep>, INP_DangKyNghiPhepService
    {
        private readonly INP_LoaiNghiPhepRepository _nP_LoaiNghiPhepRepository;
        private readonly INS_NhanSuRepository _nS_NhanSuRepository;
        private readonly IAppUserRepository _appUserRepository;
        private readonly IAppUserService _appUserService;
        private readonly ITaiLieuDinhKemRepository _taiLieuDinhKemRepository;
        private readonly IOperationService _operationService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly INS_NhanSuService _nS_NhanSuService;
        private readonly INotificationService _notificationService;


        private const string BASE_PATH = "wwwroot";

        public NP_DangKyNghiPhepService(
            INP_LoaiNghiPhepRepository nP_LoaiNghiPhepRepository,
            INS_NhanSuRepository nS_NhanSuRepository,
            IAppUserRepository appUserRepository,
            IAppUserService appUserService,
            ITaiLieuDinhKemRepository taiLieuDinhKemRepository,
            IOperationService operationService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            INS_NhanSuService nS_NhanSuService,
            INotificationService notificationService,
            INP_DangKyNghiPhepRepository repository)
            : base(repository)
        {
            _nP_LoaiNghiPhepRepository = nP_LoaiNghiPhepRepository;
            _nS_NhanSuRepository = nS_NhanSuRepository;
            _appUserRepository = appUserRepository;
            _appUserService = appUserService;
            _taiLieuDinhKemRepository = taiLieuDinhKemRepository;
            _operationService = operationService;
            _taiLieuDinhKemService = taiLieuDinhKemService;
            _nS_NhanSuService = nS_NhanSuService;
            _notificationService = notificationService;
        }

        public async Task<PagedList<NP_DangKyNghiPhepDto>> GetData(NP_DangKyNghiPhepSearchDto search, Guid UserId)
        {
            try
            {
                var userInfo = await _appUserService.GetInfo(UserId);
                if (userInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin người dùng");
                }
                var ListOperations = await _operationService.GetListOperationUser(UserId);

                var query = GetQueryable().AsNoTracking();
                if (!ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.QUANLYNGHIPHEP_ALL)) &&
                    !ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.QUANLYNGHIPHEP_PHONG)) &&
                    !userInfo.ListRole.Any(x => x.Equals(VaiTroConstant.Admin)))
                {
                    query = query.Where(x => x.CreatedId == UserId);
                }
                else if (!ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.QUANLYNGHIPHEP_ALL)) &&
                   ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.QUANLYNGHIPHEP_PHONG)))
                {
                    var lstUserInDep = await _appUserRepository.GetQueryable().Where(x => x.DonViId == userInfo.DonViId).Select(x => x.Id).ToListAsync();
                    if (ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.QUANLYNGHIPHEP_PHONG)))
                    {
                        query = query.Where(x => (lstUserInDep.Contains(x.CreatedId.Value) || x.CreatedId == UserId) && x.TrangThai != TrangThaiNghiPhepConstant.HuyDangKy);
                    }
                    else
                    {
                        query = query.Where(x => lstUserInDep.Contains(x.CreatedId.Value) && x.TrangThai != TrangThaiNghiPhepConstant.HuyDangKy);
                    }
                }
                else if (ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.QUANLYNGHIPHEP_ALL)) &&
                    userInfo.ListRole.Any(x => x.Equals(VaiTroConstant.TongGiamDoc)))
                {
                    query = query.Where(x => x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocPheDuyet ||
                    x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocTuChoi ||
                    x.TrangThai == TrangThaiNghiPhepConstant.GuiTongGiamDoc);
                }

                var q = from lh in query
                        join lp in _nP_LoaiNghiPhepRepository.GetQueryable()
                            on lh.MaLoaiPhep equals lp.MaLoaiPhep into grLp
                        from lp in grLp.DefaultIfEmpty()

                        join ns in _nS_NhanSuRepository.GetQueryable()
                            on lh.MaNhanSu equals ns.MaNV

                        select new NP_DangKyNghiPhepDto
                        {
                            MaNhanSu = lh.MaNhanSu,
                            HoVaTen = ns != null ? ns.HoTen : string.Empty,
                            MaLoaiPhep = lh.MaLoaiPhep,
                            TenLoaiPhep = lp != null ? lp.TenLoaiPhep : string.Empty,
                            LyDo = lh.LyDo,
                            TuNgay = lh.TuNgay,
                            DenNgay = lh.DenNgay,
                            SoNgayNghi = lh.SoNgayNghi,
                            TrangThai = lh.TrangThai,
                            MaTruongBanDuyet = lh.MaTruongBanDuyet,
                            MaGiamDocDuyet = lh.MaGiamDocDuyet,
                            NgayDangKy = lh.NgayDangKy,
                            NgayDuyet = lh.NgayDuyet,
                            LyDoTuChoi = lh.LyDoTuChoi,
                            MaNhanSuBanGiao = lh.MaNhanSuBanGiao,
                            CongViecBanGiao = lh.CongViecBanGiao,
                            IdNhanSu = ns.Id,

                            CreatedBy = lh.CreatedBy,
                            CreatedDate = lh.CreatedDate,
                            Id = lh.Id,
                            UpdatedBy = lh.UpdatedBy,
                            UpdatedDate = lh.UpdatedDate,
                            CreatedId = lh.CreatedId,
                            UpdatedId = lh.UpdatedId,
                            DeleteId = lh.DeleteId,
                            DeleteTime = lh.DeleteTime,
                            IsDelete = lh.IsDelete
                        };

                if (search != null)
                {
                    if (search.TrangThaiFilter.HasValue)
                    {
                        q = q.Where(x => x.TrangThai == search.TrangThaiFilter.Value);
                        if (search.TrangThaiFilter.Value == TrangThaiNghiPhepConstant.TaoMoi)
                        {
                            q = q.Where(x => x.CreatedId == UserId);
                        }
                    }

                    if (!string.IsNullOrEmpty(search.HoVaTenFilter))
                    {
                        q = q.Where(x => x.HoVaTen.Contains(search.HoVaTenFilter.Trim(), StringComparison.CurrentCultureIgnoreCase));
                    }

                    if (search.NgayXinNghiFrom.HasValue)
                    {
                        var fromDate = search.NgayXinNghiFrom.Value.Date;
                        q = q.Where(x => x.NgayDangKy >= fromDate);
                    }

                    if (search.NgayXinNghiTo.HasValue)
                    {
                        var toDate = search.NgayXinNghiTo.Value.Date.AddDays(1);
                        q = q.Where(x => x.NgayDangKy < toDate);
                    }
                }
                q = q.OrderByDescending(x => x.CreatedDate);
                return await PagedList<NP_DangKyNghiPhepDto>.CreateAsync(q, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi lấy dữ liệu: " + ex.Message);
            }
        }

        public async Task<NP_DangKyNghiPhep> GetById(Guid id)
        {
            return await GetById(id);
        }

        public async Task<NP_DangKyNghiPhep> GetDonNghiPhepTaoMoi(string MaNhanSu)
        {
            var query = await GetQueryable().FirstOrDefaultAsync(x => x.TrangThai == TrangThaiNghiPhepConstant.TaoMoi && x.MaNhanSu == MaNhanSu);
            return query;
        }

        public async Task<string> ConfigUploadDataUseLibreOffice(ConfigUploadForm configUploadForm)
        {
            try
            {
                Guid id = Guid.NewGuid();
                if (!string.IsNullOrEmpty(configUploadForm.fileId))
                {
                    Guid.TryParse(configUploadForm.fileId, out id);
                }

                Guid itemId = Guid.NewGuid();
                if (!string.IsNullOrEmpty(configUploadForm.itemId))
                {
                    Guid.TryParse(configUploadForm.itemId, out itemId);
                }

                // Xóa tài liệu cũ
                var entityTaiLieuDinhKem = _taiLieuDinhKemRepository.FindBy(x => x.Id != id && x.LoaiTaiLieu == LoaiTaiLieuConstant.CAUHINHDANGKYNGHIPHEP).FirstOrDefault();
                if (entityTaiLieuDinhKem != null)
                {
                    _taiLieuDinhKemRepository.Delete(entityTaiLieuDinhKem);
                }

                var entityTaiLieu = _taiLieuDinhKemRepository.FindBy(x => x.Id == id).FirstOrDefault();
                if (entityTaiLieu != null)
                {
                    var basePath = Path.Combine(Directory.GetCurrentDirectory(), BASE_PATH, "uploads");
                    var cleanedFilePath = entityTaiLieu.DuongDanFile.TrimStart('\\', '/');
                    var pathFileBieuMau = Path.Combine(basePath, cleanedFilePath);

                    if (!File.Exists(pathFileBieuMau))
                    {
                        throw new Exception("Tệp tin cấu hình không tồn tại.");
                    }

                    var htmlContent = WordHelper.ConvertWordToHtml(pathFileBieuMau);
                    entityTaiLieu.MoTa = htmlContent;
                    _taiLieuDinhKemRepository.Update(entityTaiLieu);
                    await _taiLieuDinhKemRepository.SaveAsync();

                    // Xóa thư mục tạm chứa html sau khi đọc xong docx
                    var outputDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "htmloutput");
                    Directory.Delete(outputDirectory, recursive: true);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return null;
        }

        public async Task<TaiLieuDinhKem> GetTaiLieuDinhKem()
        {
            var item = await _taiLieuDinhKemRepository.Where(x => x.LoaiTaiLieu == LoaiTaiLieuConstant.CAUHINHDANGKYNGHIPHEP).FirstOrDefaultAsync();
            return item;
        }

        public async Task<NP_DangKyNghiPhep> PheDuyetNghiPhep(Guid Id, Guid UserId)
        {
            try
            {
                var userInfo = await _appUserService.GetInfo(UserId);
                if (userInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin người dùng");
                }

                var ListOperations = await _operationService.GetListOperationUser(UserId);
                if (!ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.PHEDUYETNGHIPHEP_PHONG)) &&
                    !ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.PHEDUYETNGHIPHEP_ALL)))
                {
                    throw new Exception("Không có quyền truy cập");
                }

                var nghiPhepInfo = await GetByIdAsync(Id);
                if (nghiPhepInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin đăng ký nghỉ phép");
                }

                if (ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.PHEDUYETNGHIPHEP_PHONG)))
                {
                    if (nghiPhepInfo.TrangThai != TrangThaiNghiPhepConstant.DaGuiTruongBan)
                    {
                        throw new Exception("Đơn đăng ký nghỉ phép đã được phê duyệt hoặc bạn không có quyền phê duyệt");
                    }

                    var lstIdUserInDep = await _appUserRepository.Where(x => x.DonViId == userInfo.DonViId).Select(x => x.Id).ToListAsync();
                    if (!lstIdUserInDep.Contains(nghiPhepInfo.CreatedId.Value))
                    {
                        throw new Exception("Không thể phê duyệt đơn nghỉ phép của phòng ban khác");
                    }

                    //nếu <= 1 ngày nghỉ thì chỉ cần trưởng ban duyệt
                    if (nghiPhepInfo.SoNgayNghi <= 1)
                    {
                        var infoNSTB = await _nS_NhanSuRepository.GetByIdAsync(userInfo.IdNhanSu);
                        nghiPhepInfo.NgayDuyet = DateTime.Now;
                        nghiPhepInfo.MaTruongBanDuyet = infoNSTB?.MaNV;
                        nghiPhepInfo.TrangThai = TrangThaiNghiPhepConstant.TruongBanDuyet;
                    }
                    else
                    {
                        nghiPhepInfo.TrangThai = TrangThaiNghiPhepConstant.GuiTongGiamDoc;
                        //gửi thông báo cho tổng giám đốc
                        var infoNSTGD = _nS_NhanSuService.FindBy(x => x.ChucVuCode == ChucVuConstant.CEO).ToList();
                        if (infoNSTGD != null)
                        {
                            foreach (var item in infoNSTGD)
                            {
                                var info = _appUserRepository.FindBy(x => x.IdNhanSu == item.Id).FirstOrDefault();
                                var notificationTGD = new Notification(UserId, info.Id, "", userInfo.Name + " gửi cho bạn một yêu cầu phê duyệt nghỉ phép", "NGHIPHEP");
                                await _notificationService.CreateAsync(notificationTGD);
                            }
                        }
                    }

                    //gửi thông báo cho nhân sự
                    var notification = new Notification(UserId, nghiPhepInfo.CreatedId.Value, "", userInfo.Name + " đã phê duyệt đơn nghỉ phép của bạn", "NGHIPHEP");
                    await _notificationService.CreateAsync(notification);
                }
                else if (ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.PHEDUYETNGHIPHEP_ALL)))
                {
                    if (nghiPhepInfo.TrangThai != TrangThaiNghiPhepConstant.GuiTongGiamDoc)
                    {
                        throw new Exception("Đơn đăng ký nghỉ phép đã được phê duyệt hoặc bạn không có quyền phê duyệt");
                    }
                    var infoNSGD = await _nS_NhanSuRepository.GetByIdAsync(userInfo.IdNhanSu);
                    nghiPhepInfo.TrangThai = TrangThaiNghiPhepConstant.TongGiamDocPheDuyet;
                    nghiPhepInfo.NgayDuyet = DateTime.Now;
                    nghiPhepInfo.MaGiamDocDuyet = infoNSGD?.MaNV;

                    var notification = new Notification(UserId, nghiPhepInfo.CreatedId.Value, "", userInfo.Name + " đã phê duyệt đơn nghỉ phép của bạn", "NGHIPHEP");
                    await _notificationService.CreateAsync(notification);

                    var infoNS = await _nS_NhanSuService.GetByMa(nghiPhepInfo.MaNhanSu);
                    var infoTB = await _nS_NhanSuService.GetByMa(nghiPhepInfo.MaTruongBanDuyet);
                    if (infoTB != null)
                    {
                        var userInfoTB = _appUserRepository.FindBy(x => x.IdNhanSu == infoTB.Id).FirstOrDefault();
                        var notificationTB = new Notification(UserId, userInfoTB.Id, "", userInfo.Name + " đã phê duyệt đơn nghỉ phép của " + infoNS?.HoTen, "NGHIPHEP");
                        await _notificationService.CreateAsync(notificationTB);
                    }

                }
                await UpdateAsync(nghiPhepInfo);
                return nghiPhepInfo;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<NP_DangKyNghiPhep> TrinhNghiPhep(Guid Id, Guid UserId)
        {
            try
            {
                var userInfo = await _appUserService.GetInfo(UserId);
                if (userInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin người dùng");
                }

                var ListOperations = await _operationService.GetListOperationUser(UserId);

                if (!ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.PHEDUYETNGHIPHEP_PHONG)) &&
                    !ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.NP_DangKyNghiPhep_create)))
                {
                    throw new Exception("Không có quyền truy cập");
                }

                var nghiPhepInfo = await GetByIdAsync(Id);
                if (nghiPhepInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin đăng ký nghỉ phép");
                }

                if (ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.PHEDUYETNGHIPHEP_PHONG)))
                {
                    var lstIdUserInDep = await _appUserRepository.Where(x => x.DonViId == userInfo.DonViId).Select(x => x.Id).ToListAsync();
                    if (!lstIdUserInDep.Contains(nghiPhepInfo.CreatedId.Value))
                    {
                        throw new Exception("Không thể trình đơn nghỉ phép của phòng ban khác");
                    }

                    if (nghiPhepInfo.CreatedId != UserId)
                    {
                        if (nghiPhepInfo.TrangThai != TrangThaiNghiPhepConstant.TruongBanDuyet)
                        {
                            throw new Exception("Đơn đăng ký nghỉ phép đã được trình lên lãnh đạo hoặc bạn không có quyền");
                        }
                    }
                    nghiPhepInfo.TrangThai = TrangThaiNghiPhepConstant.GuiTongGiamDoc;

                    //gửi thông báo cho tổng giám đốc
                    var infoNSTGD = _nS_NhanSuService.FindBy(x => x.ChucVuCode == ChucVuConstant.CEO).ToList();
                    if (infoNSTGD != null)
                    {
                        foreach (var item in infoNSTGD)
                        {
                            var info = _appUserRepository.FindBy(x => x.IdNhanSu == item.Id).FirstOrDefault();
                            var notification = new Notification(UserId, info.Id, "", userInfo.Name + " gửi cho bạn một yêu cầu phê duyệt nghỉ phép", "NGHIPHEP");
                            await _notificationService.CreateAsync(notification);
                        }
                    }
                }
                else if (ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.NP_DangKyNghiPhep_create)))
                {
                    if (nghiPhepInfo.TrangThai != TrangThaiNghiPhepConstant.TaoMoi)
                    {
                        throw new Exception("Đơn đăng ký nghỉ phép đã được trình hoặc bạn không có quyền");
                    }

                    if (nghiPhepInfo.CreatedId != UserId)
                    {
                        throw new Exception("Đơn nghỉ phép cần trình không hợp lệ.");
                    }

                    var maNV = nghiPhepInfo.MaNhanSu;
                    var tuNgay = nghiPhepInfo.TuNgay.Date;
                    var denNgay = nghiPhepInfo.DenNgay.Date;

                    var isTrungLich = await GetQueryable()
                        .Where(x => x.Id != Id
                                    && x.MaNhanSu == maNV
                                    && x.TrangThai != TrangThaiNghiPhepConstant.TongGiamDocTuChoi
                                    && x.TuNgay.Date <= denNgay
                                    && x.DenNgay.Date >= tuNgay)
                        .AnyAsync();

                    if (isTrungLich)
                    {
                        throw new Exception("Bạn đã có đơn nghỉ phép trùng thời gian với đơn khác.");
                    }

                    nghiPhepInfo.TrangThai = TrangThaiNghiPhepConstant.DaGuiTruongBan;

                    var infoNS = await _nS_NhanSuService.GetByMa(nghiPhepInfo.MaNhanSu);
                    //gửi thông báo cho trưởng ban
                    var listTB = await _nS_NhanSuRepository.GetQueryable().Where(x => x.ChucVuCode == ChucVuConstant.CTO && x.PhongBanCode == infoNS.PhongBanCode).ToListAsync();
                    if (listTB != null && listTB.Count > 0)
                    {
                        foreach (var infoTB in listTB)
                        {
                            var info = await _appUserRepository.GetQueryable().Where(x => x.IdNhanSu == infoTB.Id).FirstOrDefaultAsync();
                            var notification = new Notification(UserId, info.Id, "", userInfo.Name + " gửi cho bạn đơn xin nghỉ phép", "NGHIPHEP");
                            await _notificationService.CreateAsync(notification);
                        }
                    }
                }
                await UpdateAsync(nghiPhepInfo);
                return nghiPhepInfo;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<NP_DangKyNghiPhep> TuChoiNghiPhep(Guid Id, TuChoiVM model, Guid UserId)
        {
            try
            {
                var userInfo = await _appUserService.GetInfo(UserId);
                if (userInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin người dùng");
                }

                var ListOperations = await _operationService.GetListOperationUser(UserId);

                if (!ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.TUCHOINGHIPHEP_PHONG)) &&
                    !ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.TUCHOINGHIPHEP_ALL)))
                {
                    throw new Exception("Không có quyền truy cập");
                }

                var nghiPhepInfo = await GetByIdAsync(Id);
                if (nghiPhepInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin đăng ký nghỉ phép");
                }

                if (ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.TUCHOINGHIPHEP_PHONG)))
                {
                    if (nghiPhepInfo.TrangThai != TrangThaiNghiPhepConstant.DaGuiTruongBan)
                    {
                        throw new Exception("Đơn đăng ký nghỉ phép đã bị từ chối hoặc bạn không có quyền từ chối");
                    }

                    var lstIdUserInDep = await _appUserRepository.Where(x => x.DonViId == userInfo.DonViId).Select(x => x.Id).ToListAsync();
                    if (!lstIdUserInDep.Contains(nghiPhepInfo.CreatedId.Value))
                    {
                        throw new Exception("Không thể từ chối đơn nghỉ phép của phòng ban khác");
                    }

                    nghiPhepInfo.TrangThai = TrangThaiNghiPhepConstant.TruongBanTuChoi;
                    nghiPhepInfo.LyDoTuChoi = model.LyDoTuChoi;

                    //Gửi thông báo cho NS
                    var notification = new Notification(UserId, nghiPhepInfo.CreatedId.Value, "", userInfo.Name + " đã từ chối yêu cầu nghỉ phép của bạn", "NGHIPHEP");
                    await _notificationService.CreateAsync(notification);
                }
                else if (ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.TUCHOINGHIPHEP_ALL)))
                {
                    if (nghiPhepInfo.TrangThai != TrangThaiNghiPhepConstant.GuiTongGiamDoc)
                    {
                        throw new Exception("Đơn đăng ký nghỉ phép đã bị từ chối hoặc bạn không có quyền từ chối");
                    }
                    nghiPhepInfo.TrangThai = TrangThaiNghiPhepConstant.TongGiamDocTuChoi;
                    nghiPhepInfo.LyDoTuChoi = model.LyDoTuChoi;

                    //Gửi thông báo cho trường ban và NS
                    var infoNSTB = await _nS_NhanSuService.GetByMa(nghiPhepInfo.MaTruongBanDuyet);
                    if (infoNSTB != null)
                    {
                        var appUserTB = _appUserService.FindBy(x => x.IdNhanSu == infoNSTB.Id).FirstOrDefault();
                        var infoNS = await _nS_NhanSuService.GetByMa(nghiPhepInfo.MaNhanSu);
                        var notificationTB = new Notification(UserId, appUserTB != null ? appUserTB.Id : Guid.Empty, "", userInfo.Name + " đã từ chối yêu cầu nghỉ phép của " + infoNS.HoTen, "NGHIPHEP");
                        await _notificationService.CreateAsync(notificationTB);
                    }

                    var notification = new Notification(UserId, nghiPhepInfo.CreatedId.Value, "", userInfo.Name + " đã từ chối yêu cầu nghỉ phép của bạn", "NGHIPHEP");
                    await _notificationService.CreateAsync(notification);

                }
                await UpdateAsync(nghiPhepInfo);
                return nghiPhepInfo;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteNghiPhep(Guid Id, Guid UserId)
        {
            try
            {
                var userInfo = await _appUserService.GetInfo(UserId);
                if (userInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin người dùng");
                }

                var ListOperations = await _operationService.GetListOperationUser(UserId);
                if (!ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.NP_DangKyNghiPhep_delete)))
                {
                    throw new Exception("Không có quyền truy cập");
                }

                var nghiPhepInfo = await GetByIdAsync(Id);
                if (nghiPhepInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin đăng ký nghỉ phép");
                }

                if (nghiPhepInfo.TrangThai != TrangThaiNghiPhepConstant.TaoMoi)
                {
                    throw new Exception("Đơn đăng ký nghỉ phép đã bị xóa hoặc bạn không có quyền");
                }

                if (nghiPhepInfo.CreatedId != UserId)
                {
                    throw new Exception("Đơn nghỉ phép cần xóa không hợp lệ.");
                }
                await DeleteAsync(nghiPhepInfo);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<NgayPhepDto> GetSoNgayPhep(Guid UserId)
        {
            try
            {
                var userInfo = await _appUserService.GetInfo(UserId);
                if (userInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin người dùng");
                }

                var infoNS = await _nS_NhanSuRepository.GetByIdAsync(userInfo.IdNhanSu);
                if (infoNS is null)
                {
                    throw new Exception("Không tìm thấy thông tin nhân sự");
                }
                var tongSoNgayPhep = TinhSoNgayPhepNam(infoNS.NgayVaoLam ?? DateTime.Now);
                var lichSuNghiPhep = await GetQueryable().Where(x => x.CreatedId == UserId)
                    .Join(
                    _nP_LoaiNghiPhepRepository.GetQueryable(),
                    x => x.MaLoaiPhep,
                    y => y.MaLoaiPhep,
                    (x, y) => new
                    {
                        SoNgayMacDinh = y.SoNgayMacDinh,
                        SoNgayNghi = x.SoNgayNghi,
                        TrangThai = x.TrangThai,
                        LoaiPhep = x.MaLoaiPhep
                    })
                    .Where(x => (x.SoNgayNghi <= 1 && x.TrangThai == TrangThaiNghiPhepConstant.TruongBanDuyet) ||
                                x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocPheDuyet)
                    .ToListAsync();
                var soNgayPhepDaSuDung = lichSuNghiPhep.Sum(x => x.SoNgayNghi);
                var soNgayPhepConLai = tongSoNgayPhep - soNgayPhepDaSuDung;
                var vm = new NgayPhepDto
                {
                    TongSoNgayPhep = tongSoNgayPhep,
                    SoNgayPhepConLai = soNgayPhepConLai,
                    SoNgayPhepDaSuDung = soNgayPhepDaSuDung
                };
                return vm;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<ThongKeNghiPhepDto> ThongKeNghiPhep(Guid UserId)
        {
            try
            {
                var userInfo = await _appUserService.GetInfo(UserId);
                if (userInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin người dùng");
                }

                var ListOperations = await _operationService.GetListOperationUser(UserId);
                var vm = new ThongKeNghiPhepDto();

                var query = GetQueryable().AsNoTracking();
                //nếu là nhân viên
                if (!ListOperations.Contains(VaiTroNghiPhepConstant.QUANLYNGHIPHEP_ALL) &&
                    !ListOperations.Contains(VaiTroNghiPhepConstant.QUANLYNGHIPHEP_PHONG) &&
                    !userInfo.ListRole.Contains(VaiTroConstant.Admin))
                {
                    query = query.Where(x => x.CreatedId == UserId);

                    var counts = query
                        .GroupBy(x => x.TrangThai)
                        .Select(g => new { TrangThai = g.Key, Count = g.Count() })
                        .ToList();

                    vm.TaoMoi = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.TaoMoi)?.Count ?? 0;
                    vm.DaGuiTruongBan = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.DaGuiTruongBan)?.Count ?? 0;
                    vm.TruongBanTuChoi = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.TruongBanTuChoi)?.Count ?? 0;
                    vm.TruongBanPheDuyet = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.TruongBanDuyet)?.Count ?? 0;
                    vm.GuiTongGiamDoc = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.GuiTongGiamDoc)?.Count ?? 0;
                    vm.TongGiamDocPheDuyet = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocPheDuyet)?.Count ?? 0;
                    vm.TongGiamDocTuChoi = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocTuChoi)?.Count ?? 0;
                }
                else if (!ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.QUANLYNGHIPHEP_ALL)) &&
                   ListOperations.Any(x => x.Equals(VaiTroNghiPhepConstant.QUANLYNGHIPHEP_PHONG)))
                {
                    var lstUserInDep = await _appUserRepository.GetQueryable()
                        .Where(x => x.DonViId == userInfo.DonViId)
                        .Select(x => x.Id)
                        .ToListAsync();
                    // Lọc query theo quyền
                    if (ListOperations.Contains(VaiTroNghiPhepConstant.QUANLYNGHIPHEP_PHONG))
                    {
                        query = query.Where(x =>
                            (lstUserInDep.Contains(x.CreatedId.Value) || x.CreatedId == UserId));
                    }
                    else
                    {
                        query = query.Where(x =>
                            lstUserInDep.Contains(x.CreatedId.Value));
                    }

                    var counts = await query.Where(x => x.TrangThai != TrangThaiNghiPhepConstant.TaoMoi)
                        .GroupBy(x => x.TrangThai)
                        .Select(g => new { TrangThai = g.Key, Count = g.Count() })
                        .ToListAsync();
                    var countTaoMoi = await GetQueryable()
                            .Where(x => x.TrangThai == TrangThaiNghiPhepConstant.TaoMoi && x.CreatedId == UserId)
                            .CountAsync();
                    vm.TaoMoi = countTaoMoi;
                    vm.DaGuiTruongBan = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.DaGuiTruongBan)?.Count ?? 0;
                    vm.TruongBanTuChoi = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.TruongBanTuChoi)?.Count ?? 0;
                    vm.TruongBanPheDuyet = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.TruongBanDuyet)?.Count ?? 0;
                    vm.GuiTongGiamDoc = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.GuiTongGiamDoc)?.Count ?? 0;
                    vm.TongGiamDocPheDuyet = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocPheDuyet)?.Count ?? 0;
                    vm.TongGiamDocTuChoi = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocTuChoi)?.Count ?? 0;
                }
                else if (ListOperations.Contains(VaiTroNghiPhepConstant.QUANLYNGHIPHEP_ALL) &&
                        userInfo.ListRole.Contains(VaiTroConstant.TongGiamDoc))
                {
                    query = query.Where(x =>
                        x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocPheDuyet ||
                        x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocTuChoi ||
                        x.TrangThai == TrangThaiNghiPhepConstant.GuiTongGiamDoc);

                    var counts = await query
                        .GroupBy(x => x.TrangThai)
                        .Select(g => new { TrangThai = g.Key, Count = g.Count() })
                        .ToListAsync();

                    vm.GuiTongGiamDoc = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.GuiTongGiamDoc)?.Count ?? 0;
                    vm.TongGiamDocPheDuyet = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocPheDuyet)?.Count ?? 0;
                    vm.TongGiamDocTuChoi = counts.FirstOrDefault(x => x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocTuChoi)?.Count ?? 0;
                }
                return vm;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<PreviewDto> PreviewNghiPhep(Guid UserId, Guid Id)
        {
            try
            {
                var userInfo = await _appUserService.GetInfo(UserId);
                if (userInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin người dùng");
                }

                var nghiPhepInfo = await GetByIdAsync(Id);
                if (nghiPhepInfo is null)
                {
                    throw new Exception("Không tìm thấy thông tin đăng ký nghỉ phép");
                }

                var infoNS = await _nS_NhanSuService.GetByMa(nghiPhepInfo.MaNhanSu);
                if (infoNS is null)
                {
                    throw new Exception("Không tìm thấy thông tin nhân sự");
                }

                var infoTaiLieuBieuMau = await _taiLieuDinhKemService.GetTaiLieuByType(LoaiTaiLieuConstant.CAUHINHDANGKYNGHIPHEP);
                if (infoTaiLieuBieuMau == null)
                {
                    throw new Exception("Không tìm thấy thông tin biểu mẫu");
                }

                var infoNSBanGiao = await _nS_NhanSuService.GetByMa(nghiPhepInfo.MaNhanSuBanGiao);
                var infoTruongBan = await _nS_NhanSuService.GetByMa(nghiPhepInfo.MaTruongBanDuyet);
                var infoTGD = await _nS_NhanSuService.GetByMa(nghiPhepInfo.MaGiamDocDuyet);

                var templateName = infoNS.Id + "_" + nghiPhepInfo.Id;
                var filePath = "/ViewNghiPhep/" + templateName + ".docx";

                var pdfFilePath = "/ViewNghiPhep/" + templateName + ".pdf";
                var outputFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/ViewNghiPhep");

                if (System.IO.File.Exists(outputFolder))
                {
                    var PreviewVM = new PreviewDto()
                    {
                        Path = pdfFilePath
                    };
                    return PreviewVM;
                }

                var templateWordPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads") + filePath;
                var template_path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads") + infoTaiLieuBieuMau.DuongDanFile;
                var fileSource = new FileInfo(template_path);


                if (fileSource.Exists)
                {
                    var data = new ViewDangKyDto()
                    {
                        Thu = nghiPhepInfo.NgayDangKy.GetThuVN(),
                        Ngay = nghiPhepInfo.NgayDangKy.Day,
                        Thang = nghiPhepInfo.NgayDangKy.Month,
                        Nam = nghiPhepInfo.NgayDangKy.Year,
                        HoTen = infoNS.HoTen,
                        ChucVu = infoNS.ChucVu_txt,
                        BoPhan = infoNS.PhongBan_txt,
                        SoDienThoai = infoNS.DienThoai,
                        DiaChi = infoNS.DiaChiThuongTru,
                        SoNgayNghi = nghiPhepInfo.SoNgayNghi.ToString(),
                        TuNgay = nghiPhepInfo.TuNgay.ToVnDateTimeString(),
                        DenNgay = nghiPhepInfo.DenNgay.ToVnDateTimeString(),
                        LyDo = nghiPhepInfo.LyDo,
                        HoTenBanGiao = infoNSBanGiao?.HoTen,
                        BoPhanBanGiao = infoNSBanGiao?.PhongBan_txt,
                        CongViecBanGiao = nghiPhepInfo.CongViecBanGiao,
                        HoTenTruongBan = infoTruongBan?.HoTen,
                        HoTenTongGiamDoc = infoTGD?.HoTen
                    };

                    if (System.IO.File.Exists(templateWordPath) || true)
                    {
                        var dir = Path.GetDirectoryName(templateWordPath);
                        if (!Directory.Exists(dir))
                        {
                            Directory.CreateDirectory(dir);
                        }
                        if (System.IO.File.Exists(templateWordPath))
                        {
                            System.IO.File.Delete(templateWordPath);
                        }
                        fileSource.CopyTo(templateWordPath);

                        using (var docx = DocX.Load(templateWordPath))
                        {
                            var wordsToReplace = docx.FindUniqueByPattern(@"\[\[\w*\]\]", RegexOptions.IgnoreCase);
                            foreach (var word in wordsToReplace)
                            {
                                var configKey = word.Replace("[[", "").Replace("]]", "");
                                var replaceText = word;
                                var property = typeof(ViewDangKyDto).GetProperty(configKey, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                                var replaceValue = property?.GetValue(data)?.ToString();

                                docx.ReplaceText(word, replaceValue ?? "");
                            }
                            var fields = new Regex(@"\[\[.*?\]\]").Matches(docx.Text);
                            foreach (Match item in fields)
                            {
                                docx.ReplaceText(item.Value, string.Empty);
                            }
                            docx.Save();
                        }

                        var result = WordHelper.ToPDF(templateWordPath, outputFolder);
                        var PreviewVM = new PreviewDto();
                        if (result.Status)
                        {
                            PreviewVM.Path = pdfFilePath;
                        }
                        else
                        {
                            throw new Exception("Có lỗi khi hiển thị tập tin xem trước");
                        }
                        return PreviewVM;
                    }

                }
                return null;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public async Task<NP_DangKyNghiPhep> Create(NP_DangKyNghiPhep nP_DangKyNghiPhep, Guid? UserId)
        {
            nP_DangKyNghiPhep.NgayDangKy = DateTime.Now;
            var userInfo = await _appUserService.GetByIdAsync(UserId.HasValue ? UserId.Value : Guid.Empty);
            if (userInfo == null)
            {
                throw new Exception("Không tìm thấy thông tin người dùng");
            }

            var infoNS = await _nS_NhanSuService.GetByIdAsync(userInfo.IdNhanSu);
            if (infoNS == null)
            {
                throw new Exception("Không tìm thấy thông tin nhân sự");
            }

            nP_DangKyNghiPhep.MaNhanSu = infoNS.MaNV;
            var getDonNghiPhep = await GetDonNghiPhepTaoMoi(nP_DangKyNghiPhep.MaNhanSu);
            if (getDonNghiPhep != null)
            {
                throw new Exception("Bạn đã đăng ký nghỉ phép. Vui lòng thử lại sau.");
            }

            if (nP_DangKyNghiPhep.DenNgay < nP_DangKyNghiPhep.TuNgay)
            {
                throw new Exception("Số thời gian nghỉ phép không hợp lệ.");
            }

            decimal soNgayNghi = (decimal)(nP_DangKyNghiPhep.MaLoaiPhep == LoaiPhepConstant.NGHINUANGAY ? 0.5 : (nP_DangKyNghiPhep.DenNgay - nP_DangKyNghiPhep.TuNgay).Days);
            if (soNgayNghi != nP_DangKyNghiPhep.SoNgayNghi)
            {
                throw new Exception("Số ngày nghỉ hoặc thời gian nghỉ phép không hợp lệ.");
            }

            var isTrungLich = await GetQueryable()
                    .Where(x => x.MaNhanSu == infoNS.MaNV
                                && (x.TrangThai != TrangThaiNghiPhepConstant.TongGiamDocTuChoi || x.TrangThai != TrangThaiNghiPhepConstant.TruongBanTuChoi || x.TrangThai != TrangThaiNghiPhepConstant.HuyDangKy)
                                && x.TuNgay.Date <= nP_DangKyNghiPhep.DenNgay
                                && x.DenNgay.Date >= nP_DangKyNghiPhep.TuNgay)
                    .AnyAsync();

            if (isTrungLich)
            {
                throw new Exception("Bạn đã có lịch nghỉ phép trong khoảng thời gian này.");
            }

            var tongSoNgayPhep = TinhSoNgayPhepNam(infoNS.NgayVaoLam ?? DateTime.Now);
            var lichSuNghiPhep = await GetQueryable()
                .Where(x => x.CreatedId == UserId)
                    .Join(
                    _nP_LoaiNghiPhepRepository.GetQueryable(),
                    x => x.MaLoaiPhep,
                    y => y.MaLoaiPhep,
                    (x, y) => new LichSuNghiPhepDto
                    {
                        SoNgayMacDinh = y.SoNgayMacDinh,
                        SoNgayNghi = x.SoNgayNghi,
                        TrangThai = x.TrangThai,
                        LoaiPhep = x.MaLoaiPhep
                    })
                    .Where(x => ((x.SoNgayNghi <= 1 && x.TrangThai == TrangThaiNghiPhepConstant.TruongBanDuyet) ||
                                x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocPheDuyet))
                    .ToListAsync();

            var soNgayPhepDaSuDung = lichSuNghiPhep.Sum(x => x.SoNgayNghi);
            var soNgayPhepConLai = tongSoNgayPhep - soNgayPhepDaSuDung;
            if (soNgayPhepConLai == 0)
            {
                throw new Exception("Bạn đã hết ngày phép.");
            }

            if (soNgayPhepConLai > 0 && nP_DangKyNghiPhep.SoNgayNghi > soNgayPhepConLai)
            {
                throw new Exception("Bạn chỉ còn " + soNgayPhepConLai + " ngày phép. Vui lòng điều chỉnh lại");
            }

            await CreateAsync(nP_DangKyNghiPhep);
            return nP_DangKyNghiPhep;
        }

        private async Task<List<LichSuNghiPhepDto>> LichSuNghiPhep(Guid? UserId)
        {
            var lichSuNghiPhep = await GetQueryable()
                .Where(x => x.CreatedId == UserId)
                    .Join(
                    _nP_LoaiNghiPhepRepository.GetQueryable(),
                    x => x.MaLoaiPhep,
                    y => y.MaLoaiPhep,
                    (x, y) => new LichSuNghiPhepDto
                    {
                        SoNgayMacDinh = y.SoNgayMacDinh,
                        SoNgayNghi = x.SoNgayNghi,
                        TrangThai = x.TrangThai,
                        LoaiPhep = x.MaLoaiPhep
                    })
                    .Where(x => ((x.SoNgayNghi <= 1 && x.TrangThai == TrangThaiNghiPhepConstant.TruongBanDuyet) ||
                                x.TrangThai == TrangThaiNghiPhepConstant.TongGiamDocPheDuyet))
                    .ToListAsync();
            return lichSuNghiPhep;
        }
        private int TinhSoNgayPhepNam(DateTime ngayVaoLam)
        {
            DateTime now = DateTime.Now;

            int namHienTai = now.Year;
            int namVaoLam = ngayVaoLam.Year;

            int soNamLamViec = namHienTai - namVaoLam;

            int thangVaoLam = ngayVaoLam.Month; // 1 = Tháng 1

            // Nếu dưới 1 năm, tính số tháng còn lại trong năm
            if (soNamLamViec < 1 && namVaoLam == namHienTai)
            {
                int soThangConLai = 12 - thangVaoLam + 1; // +1 để tính cả tháng vào làm
                return soThangConLai; // mỗi tháng 1 ngày phép
            }

            // Mặc định 12 ngày phép/năm
            int soNgayPhep = 12;

            // Nếu trên 10 năm, mỗi 5 năm thêm 1 ngày phép
            if (soNamLamViec > 10)
            {
                int soLanCongThem = (soNamLamViec - 10) / 5;
                soNgayPhep += soLanCongThem;
            }

            return soNgayPhep;
        }
    }
}

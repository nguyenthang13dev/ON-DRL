using Hinet.Service.Common.Service;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities.QLNhanSu;
using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Identity;
using Hinet.Model.Entities;
using Hinet.Service.AspNetUsersService;
using Hinet.Repository.AspNetUsersRepository;
using Hinet.Repository.UserRoleRepository;
using Hinet.Repository.RoleRepository;
using Hinet.Service.UserRoleService;
using Hinet.Model;
using DnsClient.Internal;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Text;
using CommonHelper.CrawlProvider;
using Hinet.Repository.QLNhanSu.NS_NhanSuRepository;
using Hinet.Service.QLNhanSu.NS_NhanSuService.Dto;
using Hinet.Service.QLNhanSu.NS_NhanSuService.ViewModels;
using System.Drawing.Text;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using Hinet.Repository.DepartmentRepository;
using System.Runtime.Intrinsics.Arm;
using Hinet.Service.Constant.QLNhanSu;
using Hinet.Repository.QLNhanSu.NS_HopDongLaoDongRepository;



namespace Hinet.Service.QLNhanSu.NS_NhanSuService
{
    public class NS_NhanSuService : Service<NS_NhanSu>, INS_NhanSuService
    {
        private readonly IMapper _mapper;
        private readonly INS_NhanSuRepository _nS_NhanSuRepository;
        private readonly IAspNetUsersRepository _aspNetUsersRepository;
        private static readonly PasswordHasher<object> _hasher = new PasswordHasher<object>();
        private readonly IAspNetUsersService _usersService;
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IUserRoleService userRoleService;
        private readonly ILogger<NS_NhanSuService> _logger;
        private readonly HinetContext _hinetContext;
        private readonly UserManager<AppUser> _userManager;
        private readonly IAspNetUsersRepository _userRepository;
        private readonly IDM_DuLieuDanhMucRepository _dmDuLieuDanhMucRepository;
        private readonly IDepartmentRepository _departmentRepository;
        private readonly IDM_DuLieuDanhMucRepository _dM_DuLieuDanhMucRepository;
        private readonly INS_HopDongLaoDongRepository _nS_HopDongLaoDongRepository;


        public NS_NhanSuService(
            INS_NhanSuRepository nS_NhanSuRepository,
            IMapper mapper,
            IAspNetUsersService usersService,
            IAspNetUsersRepository aspNetUsersRepository,
            IUserRoleRepository userRoleRepository,
            IRoleRepository roleRepository,
            IUserRoleService userRoleService,
            ILogger<NS_NhanSuService> logger,
            HinetContext hinetContext,
            UserManager<AppUser> userManager,
            IAspNetUsersRepository userRepository,
            IDM_DuLieuDanhMucRepository dmDuLieuDanhMucRepository,
            IDepartmentRepository departmentRepository,
            IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository,
            INS_HopDongLaoDongRepository nS_HopDongLaoDongRepository) : base(nS_NhanSuRepository)
        {
            _mapper = mapper;
            _nS_NhanSuRepository = nS_NhanSuRepository;
            _usersService = usersService;
            _aspNetUsersRepository = aspNetUsersRepository;
            _userRoleRepository = userRoleRepository;
            _roleRepository = roleRepository;
            this.userRoleService = userRoleService;
            _logger = logger;
            _hinetContext = hinetContext;
            _userManager = userManager;
            _userRepository = userRepository;
            _dmDuLieuDanhMucRepository = dmDuLieuDanhMucRepository;
            _departmentRepository = departmentRepository;
            _dM_DuLieuDanhMucRepository = dM_DuLieuDanhMucRepository;
            _nS_HopDongLaoDongRepository = nS_HopDongLaoDongRepository;
        }


        #region Private Method

        //ToAscII
        private static string RemoveDiacritics(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return text;

            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    if (c == 'đ') stringBuilder.Append('d');
                    else if (c == 'Đ') stringBuilder.Append('D');
                    else stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }

        //Create New Staff
        private async Task<NS_NhanSu> CreateMainStaffAsync(NS_NhanSuCreateVM model)
        {

            var entity = _mapper.Map<NS_NhanSuCreateVM, NS_NhanSu>(model);
            // Kiểm tra mã nhân viên đã tồn tại chưa
            var existingStaff = await _nS_NhanSuRepository
                .Where(x => x.MaNV == entity.MaNV && (x.IsDelete == false || x.IsDelete == null))
                .FirstOrDefaultAsync();
            if (existingStaff != null)
                throw new InvalidOperationException($"Mã nhân viên '{entity.MaNV}' đã tồn tại.");
            if (model.ChucVuId.HasValue)
            {
                var chucVuCode = _dmDuLieuDanhMucRepository
                    .Where(x => x.Id == model.ChucVuId.Value)
                    .Select(x => x.Code)
                    .FirstOrDefault();
                if (!string.IsNullOrEmpty(chucVuCode))
                {
                    entity.ChucVuCode = chucVuCode;
                }
            }
            if (model.PhongBanId.HasValue)
            {
                var codePhongBan = _departmentRepository
                    .Where(x => x.Id == model.PhongBanId.Value)
                    .Select(x => x.Code)
                    .FirstOrDefault();
                if (!string.IsNullOrEmpty(codePhongBan))
                {
                    entity.PhongBanCode = codePhongBan;
                }
            }
            _nS_NhanSuRepository.Add(entity);
            _nS_NhanSuRepository.Add(entity);
            await _nS_NhanSuRepository.SaveAsync();

            return entity;
        }

        //Gen Code Staff
        private async Task<string> GenCodeStaff(string fullName)
        {
            if (string.IsNullOrWhiteSpace(fullName))
                return string.Empty;

            var words = fullName.Trim()
                                .Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                                .ToList();

            if (words.Count == 0)
                return string.Empty;

            var lastWord = RemoveDiacritics(words.Last()).ToLower();

            var otherInitials = words.Take(words.Count - 1)
                                     .Select(w => RemoveDiacritics(w.Substring(0, 1).ToLower()));

            return lastWord + string.Concat(otherInitials);
        }
        // Create Deffautl Account Staff
        private async Task<AppUser> CreateUserAccountAsync(NS_NhanSu staff)
        {
            var userName = await GenCodeStaff(staff.HoTen);
            var count = _userRepository.Where(x=>x.UserName.ToLower() == userName.ToLower()).Count();
            if (count > 0)
            {
                userName = $"{userName}{count}";
            }
            if (staff.Email.IsNullOrEmpty())
            {
                staff.Email = $"{userName}@hinet.com";
            }
            var userAccount = new AppUser
            {
                UserName = userName,
                Email = staff.Email,
                Name = staff.HoTen,
                Gender = (int)staff.GioiTinh,
                DonViId = staff.PhongBanId,
                NgaySinh = staff.NgaySinh,
                PhoneNumber = staff.DienThoai,
                DiaChi = staff.DiaChiThuongTru,
                IdNhanSu = staff.Id,
                PasswordHash = HashPassword("12345678"),
            };

            var createResult = await _userManager.CreateAsync(userAccount);
            if (!createResult.Succeeded)
                throw new Exception("Đăng ký thất bại: " + string.Join(", ", createResult.Errors.Select(e => e.Description)));
            await _userManager.SetLockoutEnabledAsync(userAccount, false);
            return userAccount;
        }
        // Set Default Role For Staff
        private async Task AssignDefaultRoleAsync(AppUser userAccount)
        {
            // Tìm role mặc định
            var defaultRole = await _roleRepository
                .Where(x => x.Code.ToLower() == "nhanvien")
                .FirstOrDefaultAsync();

            if (defaultRole == null)
                throw new InvalidOperationException("Không tìm thấy role mặc định 'NHANVIEN'");

            // Gán role cho người dùng là: User
            var userRole = new UserRole
            {
                UserId = userAccount.Id,
                RoleId = defaultRole.Id
            };

            await userRoleService.CreateAsync(userRole);
        }
        private string HashPassword(string plainPassword)
        {
            return _hasher.HashPassword(null, plainPassword);
        }
        #endregion

        public async Task<NS_NhanSu> CreateStaffAsync(NS_NhanSuCreateVM model)
        {
            // Validate đầu vào
            if (model == null)
                throw new ArgumentNullException(nameof(model), "Model không được null");

            await using var transaction = await _hinetContext.Database.BeginTransactionAsync();

            try
            {
                var entity = await CreateMainStaffAsync(model);

                var userAccount = await CreateUserAccountAsync(entity);

                await AssignDefaultRoleAsync(userAccount);

                await transaction.CommitAsync();

                return entity;
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<PagedList<NS_NhanSuDto>> GetData(NS_NhanSuSearch search)
        {
            var danhMuc = _dM_DuLieuDanhMucRepository.GetQueryable().AsNoTracking();
            var department = _departmentRepository.GetQueryable().AsNoTracking();
            var query = from q in GetQueryable()
                        join dm in danhMuc
                        on q.ChucVuCode equals dm.Code
                        join dep in department
                        on q.PhongBanCode equals dep.Code
                        select new NS_NhanSuDto()
                        {
                            ChucVuId = q.ChucVuId,
                            PhongBanId = q.PhongBanId,
                            NgaySinh = q.NgaySinh,
                            NgayCapCMND = q.NgayCapCMND,
                            NgayVaoLam = q.NgayVaoLam,
                            GioiTinh = q.GioiTinh,
                            TrangThai = q.TrangThai,
                            HinhAnh = q.HinhAnh,
                            MaNV = q.MaNV,
                            HoTen = q.HoTen,
                            CMND = q.CMND,
                            NoiCapCMND = q.NoiCapCMND,
                            DiaChiThuongTru = q.DiaChiThuongTru,
                            DiaChiTamTru = q.DiaChiTamTru,
                            DienThoai = q.DienThoai,
                            Email = q.Email,
                            MaSoThueCaNhan = q.MaSoThueCaNhan,
                            SoTaiKhoanNganHang = q.SoTaiKhoanNganHang,
                            NganHang = q.NganHang,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                            ChucVu_txt = dm.Name,
                            PhongBan_txt = dep.Name,
                        };
            if (search != null)
            {
                if (search.ChucVuId.HasValue)
                {
                    query = query.Where(x => x.ChucVuId == search.ChucVuId);
                }
                if (search.PhongBanId.HasValue)
                {
                    query = query.Where(x => x.PhongBanId == search.PhongBanId);
                }
                if (!string.IsNullOrEmpty(search.MaNV))
                {
                    query = query.Where(x => EF.Functions.Like(x.MaNV, $"%{search.MaNV}%"));
                }
                if (!string.IsNullOrEmpty(search.HoTen))
                {
                    query = query.Where(x => EF.Functions.Like(x.HoTen, $"%{search.HoTen}%"));
                }
                if (!string.IsNullOrEmpty(search.CMND))
                {
                    query = query.Where(x => EF.Functions.Like(x.CMND, $"%{search.CMND}%"));
                }
            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<NS_NhanSuDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<NS_NhanSuDto?> GetDto(Guid id)
        {
            var danhMuc = _dM_DuLieuDanhMucRepository.GetQueryable().AsNoTracking();
            var item = await (from q in GetQueryable().Where(x => x.Id == id)

                              join dm in danhMuc
                              on q.ChucVuCode equals dm.Code into dmChucVu
                              from dm in dmChucVu.DefaultIfEmpty()

                              join dep in _departmentRepository.GetQueryable().AsNoTracking()
                              on q.PhongBanCode equals dep.Code into dmDep
                              from dep in dmDep.DefaultIfEmpty()

                              select new NS_NhanSuDto
                              {
                                  ChucVuId = q.ChucVuId,
                                  PhongBanId = q.PhongBanId,
                                  NgaySinh = q.NgaySinh,
                                  NgayCapCMND = q.NgayCapCMND,
                                  NgayVaoLam = q.NgayVaoLam,
                                  GioiTinh = q.GioiTinh,
                                  TrangThai = q.TrangThai,
                                  HinhAnh = q.HinhAnh,
                                  MaNV = q.MaNV,
                                  HoTen = q.HoTen,
                                  CMND = q.CMND,
                                  NoiCapCMND = q.NoiCapCMND,
                                  DiaChiThuongTru = q.DiaChiThuongTru,
                                  DiaChiTamTru = q.DiaChiTamTru,
                                  DienThoai = q.DienThoai,
                                  Email = q.Email,
                                  MaSoThueCaNhan = q.MaSoThueCaNhan,
                                  SoTaiKhoanNganHang = q.SoTaiKhoanNganHang,
                                  NganHang = q.NganHang,
                                  CreatedBy = q.CreatedBy,
                                  UpdatedBy = q.UpdatedBy,
                                  IsDelete = q.IsDelete,
                                  DeleteId = q.DeleteId,
                                  CreatedDate = q.CreatedDate,
                                  UpdatedDate = q.UpdatedDate,
                                  DeleteTime = q.DeleteTime,
                                  Id = q.Id,
                                  ChucVuCode = q.ChucVuCode,
                                  PhongBanCode = q.PhongBanCode,
                                  ChucVu_txt = dm.Name,
                                  PhongBan_txt = dep.Name,
                              }).FirstOrDefaultAsync();

            return item;
        }

        public async Task<NS_NhanSuDto?> GetByMa(string MaNhanSu)
        {
            var danhMuc = _dM_DuLieuDanhMucRepository.GetQueryable().AsNoTracking();
            var item = await (from q in GetQueryable().Where(x => x.MaNV.Equals(MaNhanSu))

                              join dm in danhMuc
                              on q.ChucVuCode equals dm.Code into dmChucVu
                              from dm in dmChucVu.DefaultIfEmpty()

                              join dep in _departmentRepository.GetQueryable().AsNoTracking()
                              on q.PhongBanCode equals dep.Code into dmDep
                              from dep in dmDep.DefaultIfEmpty()


                              select new NS_NhanSuDto
                              {
                                  ChucVuCode = q.ChucVuCode,
                                  PhongBanCode = q.PhongBanCode,
                                  ChucVuId = q.ChucVuId,
                                  PhongBanId = q.PhongBanId,
                                  NgaySinh = q.NgaySinh,
                                  NgayCapCMND = q.NgayCapCMND,
                                  NgayVaoLam = q.NgayVaoLam,
                                  GioiTinh = q.GioiTinh,
                                  TrangThai = q.TrangThai,
                                  HinhAnh = q.HinhAnh,
                                  MaNV = q.MaNV,
                                  HoTen = q.HoTen,
                                  CMND = q.CMND,
                                  NoiCapCMND = q.NoiCapCMND,
                                  DiaChiThuongTru = q.DiaChiThuongTru,
                                  DiaChiTamTru = q.DiaChiTamTru,
                                  DienThoai = q.DienThoai,
                                  Email = q.Email,
                                  MaSoThueCaNhan = q.MaSoThueCaNhan,
                                  SoTaiKhoanNganHang = q.SoTaiKhoanNganHang,
                                  NganHang = q.NganHang,
                                  CreatedBy = q.CreatedBy,
                                  UpdatedBy = q.UpdatedBy,
                                  IsDelete = q.IsDelete,
                                  DeleteId = q.DeleteId,
                                  CreatedDate = q.CreatedDate,
                                  UpdatedDate = q.UpdatedDate,
                                  DeleteTime = q.DeleteTime,
                                  Id = q.Id,
                                  ChucVu_txt = dm.Name,
                                  PhongBan_txt = dep.Name
                              }).FirstOrDefaultAsync();

            return item;
        }

        public async Task DeleteStaffAsync(Guid id)
        {
            var staff = await _nS_NhanSuRepository.GetByIdAsync(id);
            if (staff == null)
                throw new KeyNotFoundException($"Nhân sự {id} không tồn tại");

            await using var transaction = await _hinetContext.Database.BeginTransactionAsync();

            try
            {

                var accountUser = await _aspNetUsersRepository
                    .Where(x => x.IdNhanSu == staff.Id)
                    .FirstOrDefaultAsync();

                if (accountUser != null)
                {

                    await _userRoleRepository
                        .Where(x => x.UserId == accountUser.Id)
                        .ExecuteDeleteAsync();


                    await _aspNetUsersRepository
                        .Where(x => x.Id == accountUser.Id)
                        .ExecuteDeleteAsync();
                }


                await _nS_NhanSuRepository
                    .Where(x => x.Id == id)
                    .ExecuteDeleteAsync();

                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Transaction rollback for staff {Id}", id);
                throw;
            }
        }

        public async Task<List<BaoCaoThongKeNsDto<NS_NhanSu>>> ThongKeNs(string? search)
        {
            try
            {
                var query = _nS_NhanSuRepository.GetQueryable();
                if (string.IsNullOrEmpty(search))
                {
                    var results = new List<BaoCaoThongKeNsDto<NS_NhanSu>>
                {
                    new BaoCaoThongKeNsDto<NS_NhanSu>
                    {
                        ListItem = await query.ToListAsync()
                    }
                };
                    return results;
                }
                if (search.Trim().ToLower() == FilterKeys.Gender.Trim().ToLower())
                {
                    var results = new List<BaoCaoThongKeNsDto<NS_NhanSu>>();
                    var groupedByGender = await query.GroupBy(x => x.GioiTinh).ToListAsync();
                    foreach (var group in groupedByGender)
                    {
                        string genderName = group.Key == 1 ? "Nam" : "Nữ";
                        var nhanSuList = group.ToList();
                        results.Add(new BaoCaoThongKeNsDto<NS_NhanSu>
                        {
                            NameSearch = $"{genderName}",
                            Total = nhanSuList.Count,
                            ListItem = nhanSuList
                        });
                    }

                    return results.OrderByDescending(x => x.ListItem.Count).ToList();
                }
                else if (search.Trim().ToLower() == FilterKeys.Department.Trim().ToLower())
                {
                    var results = new List<BaoCaoThongKeNsDto<NS_NhanSu>>();
                    var groupedByDepartment = await query.GroupBy(x => x.PhongBanCode).ToListAsync();
                    foreach (var group in groupedByDepartment)
                    {
                        var department = _departmentRepository.FindBy(x => x.Code == group.Key).FirstOrDefault();
                        if (department != null)
                        {
                            var nhanSuList = group.ToList();
                            results.Add(new BaoCaoThongKeNsDto<NS_NhanSu>
                            {
                                NameSearch = $"{department.Name}",
                                Total = nhanSuList.Count,
                                ListItem = nhanSuList
                            });
                        }
                    }
                    return results.OrderByDescending(x => x.ListItem.Count).ToList();
                }
                else if (search.Trim().ToLower() == FilterKeys.StatusWork.Trim().ToLower())
                {
                    var results = new List<BaoCaoThongKeNsDto<NS_NhanSu>>();
                    var groupedByStatusWork = await query.GroupBy(x => x.TrangThai).ToListAsync();
                    foreach (var group in groupedByStatusWork)
                    {
                        string statusName;
                        if (Enum.IsDefined(typeof(TrangThaiLamViecEnum),(int)group.Key))
                        {
                            var enumValue = (TrangThaiLamViecEnum)(int)group.Key;
                            statusName = enumValue.GetDescription();
                        }
                        else
                        {
                            statusName = $"Trạng thái không xác định ({group.Key})";
                        }

                        var nhanSuList = group.ToList();

                        results.Add(new BaoCaoThongKeNsDto<NS_NhanSu>
                        {
                            NameSearch = $"{statusName}",
                            Total = nhanSuList.Count,
                            ListItem = nhanSuList
                        });
                    }

                    return results.OrderByDescending(x => x.ListItem.Count).ToList();
                }
                return new List<BaoCaoThongKeNsDto<NS_NhanSu>>();
            }
            catch (Exception ex)
            {
                throw new Exception("Đã xảy ra lỗi khi lấy dữ liệu báo cáo thống kê nhân sự: " + ex.Message, ex);
            }
        }
        public async Task<ThongKeHopDongLaoDongDto> ThongKeHDLD()
        {
            try
            {
                var query = _nS_HopDongLaoDongRepository.GetQueryable();
                var totalContracts = await query.CountAsync();
                var expiredContracts = await query.CountAsync(x => x.NgayHetHan.Value.ToLocalTime() < DateTime.Now && x.LoaiHopDong != LoaiHopDongLaoDongConstant.VoThoiHan);
                var soonExpiredContracts = await query.CountAsync(x => x.NgayHetHan.Value.ToLocalTime() >= DateTime.Now && x.NgayHetHan.Value.ToLocalTime() <= DateTime.Now.AddDays(30) && x.LoaiHopDong != LoaiHopDongLaoDongConstant.VoThoiHan);
                var contractTypes = await query
                    .GroupBy(x => x.LoaiHopDong)
                    .Select(g => new ContractTypeDto
                    {
                        Type = LoaiHopDongLaoDongConstant.GetDisplayName(g.Key.Value),
                        Count = g.Count()
                    })
                    .ToListAsync();
                return new ThongKeHopDongLaoDongDto
                {
                    Total = totalContracts,
                    Expired = expiredContracts,
                    ExpiredSoon = soonExpiredContracts,
                    ContractTypes = contractTypes
                };

            }catch(Exception ex)
            {
                return new ThongKeHopDongLaoDongDto
                {
                    Total = 0,
                    Expired = 0,
                    ExpiredSoon = 0,
                    ContractTypes = new List<ContractTypeDto>()
                };
            }
        }
    }
}

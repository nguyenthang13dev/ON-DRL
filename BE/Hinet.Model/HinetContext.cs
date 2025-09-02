using CommonHelper.String;
using Hinet.Model.Entities;
using Hinet.Model.Entities.DA_Test_Case;
using Hinet.Model.Entities.DuAn;
using Hinet.Model.Entities.LuuTruBQP;
using Hinet.Model.Entities.NghiPhep;
using Hinet.Model.Entities.QLNhanSu;
using Hinet.Model.Entities.TuyenDung;
using Hinet.Model.Ultilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using System.Security.Claims;

namespace Hinet.Model
{
    public class HinetContext : IdentityDbContext<AppUser, AppRole, Guid>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HinetContext(DbContextOptions<HinetContext> options, IHttpContextAccessor httpContextAccessor) : base(options)
        {
            this._httpContextAccessor = httpContextAccessor;
        }
        public DbSet<TD_UngVien> TD_UngVien { get; set; }
        public DbSet<UC_UseCaseDemo> UC_UseCaseDemo { get; set; }

        public DbSet<Tinh> Tinh { get; set; }
        public DbSet<TacNhan_UseCase> TacNhan_UseCase { get; set; }
        public DbSet<KeyEmailTemplate> KeyEmailTemplate { get; set; }
        public DbSet<Huyen> Huyen { get; set; }
        public DbSet<UserTelegram> UserTelegram { get; set; }
        public DbSet<GroupTelegram> GroupTelegram { get; set; }
        public DbSet<EmailTemplate> EmailTemplate { get; set; }
        public DbSet<DM_NhomDanhMuc> DM_NhomDanhMuc { get; set; }
        public DbSet<DM_DuLieuDanhMuc> DM_DuLieuDanhMuc { get; set; }
        public DbSet<Role> Role { get; set; }
        public DbSet<LichSuXuLy> LichSuXuLys { get; set; }
        public DbSet<TD_TuyenDung> TD_TuyenDungs { get; set; }
        public DbSet<UserRole> UserRole { get; set; }
        public DbSet<ApiPermissions> ApiPermissions { get; set; }
        public DbSet<Module> Module { get; set; }
        public DbSet<Operation> Operation { get; set; }
        public DbSet<RoleOperation> RoleOperation { get; set; }
        public DbSet<Notification> Notification { get; set; }
        public DbSet<TaiLieuDinhKem> TaiLieuDinhKem { get; set; }
        public DbSet<Xa> Xa { get; set; }
        public DbSet<UserDonVi> UserDonVi { get; set; }
        public DbSet<Audit> Audit { get; set; }
        public DbSet<Department> Department { get; set; }
        public DbSet<FileManager> FileManager { get; set; }
        public DbSet<FileSecurity> FileSecurity { get; set; }
        public DbSet<EmailThongBao> EmailThongBao { get; set; }
        public DbSet<QLThongBao> QLThongBao { get; set; }

        //QL Nhân sự
        public DbSet<NS_NhanSu> NS_NhanSu { get; set; }
        public DbSet<NS_NgayLe> NS_NgayLe { get; set; }
        public DbSet<NS_KinhNghiemLamViec> NS_KinhNghiemLamViec { get; set; }
        public DbSet<NS_HopDongLaoDong> NS_HopDongLaoDong { get; set; }
        public DbSet<NS_DieuChinhChamCong> NS_DieuChinhChamCong { get; set; }
        public DbSet<NS_ChamCong> NS_ChamCong { get; set; }
        public DbSet<NS_BangCap> NS_BangCap { get; set; }


        // tạm ko dùng GroupRole
        //public DbSet<GroupRole> GroupRole { get; set; }

        // nhóm người
        public DbSet<GroupUser> GroupUser { get; set; }

        public DbSet<User_GroupUser> User_GroupUser { get; set; }
        // nhóm người - nhóm quyền
        public DbSet<GroupUserRole> GroupUserRole { get; set; }
        public DbSet<SystemLogs> SystemLogs { get; set; }

        public DbSet<GioiHanDiaChiMang> GioiHanDiaChiMang { get; set; }

        //Đơn thư

        //Lưu trữ bộ quốc phòng

        public DbSet<ArcFont> ArcFont { get; set; }
        public DbSet<ArcFile> ArcFile { get; set; }
        public DbSet<ArcTransfer> ArcTransfers { get; set; }
        public DbSet<ArcPlan> ArcPlan { get; set; }
        public DbSet<ArcFilePlan> ArcFilePlan { get; set; }
        //Module nghỉ phép
        public DbSet<NP_LoaiNghiPhep> NP_LoaiNghiPhep { get; set; }
        public DbSet<NP_DangKyNghiPhep> NP_DangKyNghiPhep { get; set; }

        //Quản lý dự án
        public DbSet<DA_DuAn> DA_DuAn { get; set; }
        public DbSet<DA_KeHoachThucHien> DA_KeHoachThucHien { get; set; }
        public DbSet<DA_PhanCong> DA_PhanCong { get; set; }
        public DbSet<DA_NoiDungCuocHop> DA_NoiDungCuocHop { get; set; }
        public DbSet<DA_NhatKyTrienKhai> DA_NhatKyTrienKhai { get; set; }

        // Test Case
        public DbSet<UC_TemplateTestCase> UC_TemplateTestCase { get; set; }
        public DbSet<UC_UseCase> UC_UseCase { get; set; }
        public DbSet<UC_MoTa_UseCase> UC_MoTa_UseCase { get; set; }
        public DbSet<NhomUseCase> NhomUseCase { get; set; }
        //Lưu trữ dvc

        public DbSet<LienHe> LienHe { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<AppUser>().HasData(
                new AppUser
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    UserName = "admin",
                    Type = "Admin",
                    NormalizedUserName = "ADMIN",
                    Email = "admin",
                    NormalizedEmail = "ADMIN",
                    EmailConfirmed = true,
                    PasswordHash = new PasswordHasher<AppUser>().HashPassword(null, "12345678"),
                    SecurityStamp = Guid.NewGuid().ToString()
                }
            );
            builder.ApplyUtcDateTimeConverter();
            base.OnModelCreating(builder);
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries<AuditableEntity>();

            Guid.TryParse(_httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier), out var userId);
            var userName = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Name);
            foreach (var entry in entries)
            {
                foreach (var prop in entry.Properties)
                {
                    if (prop.CurrentValue != null)
                    {
                        if (prop.Metadata.ClrType == typeof(DateTime))
                            prop.CurrentValue = ((DateTime)prop.CurrentValue).ToUtc();

                        if (prop.Metadata.ClrType == typeof(DateTime?))
                            prop.CurrentValue = ((DateTime?)prop.CurrentValue).ToUtc();
                    }
                }



                if (entry.State == EntityState.Added)
                {
                    entry.Entity.CreatedDate = DateTime.UtcNow;
                    entry.Entity.CreatedId = userId;
                    entry.Entity.CreatedBy = userName;
                }
                else if (entry.State == EntityState.Modified)
                {
                    entry.Entity.UpdatedDate = DateTime.UtcNow;
                    entry.Entity.UpdatedId = userId;
                    entry.Entity.UpdatedBy = userName;
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
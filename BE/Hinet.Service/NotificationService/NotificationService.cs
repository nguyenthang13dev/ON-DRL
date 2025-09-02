using Hinet.Model.Entities;
using Hinet.Repository.NotificationRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.NotificationService.Dto;
using Hinet.Service.Common;
using Microsoft.EntityFrameworkCore;
using Hinet.Service.UserRoleService;
using Hinet.Service.RoleService;
using Hinet.Service.Constant;
using Hinet.Repository.TaiLieuDinhKemRepository;
using Hinet.Repository.AppUserRepository;
using Hinet.Service.Dto;
using Hinet.Service.DA_PhanCongService.ViewModels;
using Hinet.Repository.DA_PhanCongRepository;
using Hinet.Service.DA_PhanCongService;
using Hinet.Repository.AspNetUsersRepository;
using Hinet.Repository.DA_DuAnRepository;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using System.Linq;

namespace Hinet.Service.NotificationService
{
    public class NotificationService : Service<Notification>, INotificationService
    {
        private readonly IUserRoleService _userRoleService;
        private readonly IDA_PhanCongRepository _phanCongRepository;
        private readonly IDA_PhanCongService _phanCongService;
        private readonly IDA_DuAnRepository _duAnRepository;
        private readonly IAppUserRepository _appUserRepository;
        private readonly IDM_DuLieuDanhMucRepository _dmDuLieuDanhMucRepository;
        private readonly IAspNetUsersRepository _aspNetUsersRepository;
        private readonly IRoleService _roleService;
        private readonly ITaiLieuDinhKemRepository _TaiLieuDinhKemRepository;

        public NotificationService(
            INotificationRepository notificationRepository,
            IUserRoleService userRoleService,
            IDA_PhanCongRepository phanCongRepository,
            IDA_PhanCongService phanCongService,
            IDA_DuAnRepository duAnRepository,
            IAppUserRepository appUserRepository,
            IDM_DuLieuDanhMucRepository dmDuLieuDanhMucRepository,
            IAspNetUsersRepository aspNetUsersRepository,
            ITaiLieuDinhKemRepository taiLieuDinhKemRepository,
            IRoleService roleService) : base(notificationRepository)
        {
            _userRoleService = userRoleService;
            _phanCongRepository = phanCongRepository;
            _phanCongService = phanCongService;
            _duAnRepository = duAnRepository;
            _appUserRepository = appUserRepository;
            _dmDuLieuDanhMucRepository = dmDuLieuDanhMucRepository;
            _aspNetUsersRepository = aspNetUsersRepository;
            _roleService = roleService;
            _TaiLieuDinhKemRepository = taiLieuDinhKemRepository;
        }

        public async Task<PagedList<NotificationDto>> GetData(NotificationSearch search)
        {
            var query = from q in GetQueryable()
                        join users in _appUserRepository.GetQueryable()
                        on q.FromUser equals users.Id into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        join tailieu in _TaiLieuDinhKemRepository.GetQueryable() on q.Id equals tailieu.Item_ID
                        into tailieuGroup
                        from tailieu in tailieuGroup.DefaultIfEmpty()
                        select new NotificationDto
                        {
                            Id = q.Id,
                            FromUser = q.FromUser,
                            FromUserName = user.Name ?? "",
                            ToUser = q.ToUser,
                            Message = q.Message,
                            Link = q.Link,
                            Type = q.Type,
                            DonViId = q.DonViId,
                            ItemType = q.ItemType,
                            SendToFrontEndUser = q.SendToFrontEndUser,
                            IsRead = q.IsRead,
                            CreatedDate = q.CreatedDate,
                            ItemId = q.ItemId,
                            Email = q.Email,
                            LoaiThongBao = q.LoaiThongBao,
                            ProductId = q.ProductId,
                            ProductName = q.ProductName,
                            TieuDe = q.TieuDe,
                            NoiDung = q.NoiDung,
                            FileDinhKem = q.FileDinhKem,
                            IsXuatBan = q.IsXuatBan,
                            CreatedId = q.CreatedId,
                            UpdatedId = q.UpdatedId,
                            IsDisplay = q.IsDisplay,
                            ItemName = q.ItemName,
                            IsDelete = q.IsDelete,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            DeleteId = q.DeleteId,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            FileTaiLieu = tailieu != null ? new FileDinhKem
                            {
                                Id = tailieu.Id,
                                Url = tailieu.DuongDanFile,
                                Name = tailieu.TenTaiLieu
                            } : null,
                        };

            if (search != null)
            {
                if (search.ToUser != null)
                    query = query.Where(x => x.ToUser == search.ToUser);

                if (search.FromUser != null)
                    query = query.Where(x => x.FromUser == search.FromUser);

                if (!string.IsNullOrEmpty(search.FromUserName))
                    query = query.Where(x => x.FromUserName.ToLower().Contains(search.FromUserName.Trim().ToLower()));

                if (!string.IsNullOrEmpty(search.Message))
                    query = query.Where(x => x.Message.ToLower().Contains(search.Message.Trim().ToLower()));

                if (search.FromDate != null)
                    query = query.Where(x => x.CreatedDate >= search.FromDate);

                if (search.ToDate != null)
                    query = query.Where(x => x.CreatedDate <= search.ToDate);
            }


            query = query.OrderBy(x => x.IsRead).ThenByDescending(x => x.CreatedDate);
            return await PagedList<NotificationDto>.CreateAsync(query, search);
        }

        public async Task<NotificationDto> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)
                              select new NotificationDto
                              {
                                  ItemId = q.ItemId,
                                  CreatedId = q.CreatedId,
                                  UpdatedId = q.UpdatedId,
                                  FromUser = q.FromUser,
                                  ToUser = q.ToUser,
                                  Message = q.Message,
                                  Link = q.Link,
                                  Type = q.Type,
                                  DonViId = q.DonViId,
                                  ItemType = q.ItemType,
                                  IsDisplay = q.IsDisplay,
                                  SendToFrontEndUser = q.SendToFrontEndUser,
                                  ItemName = q.ItemName,
                                  Email = q.Email,
                                  LoaiThongBao = q.LoaiThongBao,
                                  ProductId = q.ProductId,
                                  ProductName = q.ProductName,
                                  TieuDe = q.TieuDe,
                                  NoiDung = q.NoiDung,
                                  FileDinhKem = q.FileDinhKem,
                                  IsXuatBan = q.IsXuatBan,
                                  IsRead = q.IsRead,
                                  IsDelete = q.IsDelete,
                                  Id = q.Id,
                                  CreatedBy = q.CreatedBy,
                                  UpdatedBy = q.UpdatedBy,
                                  DeleteId = q.DeleteId,
                                  CreatedDate = q.CreatedDate,
                                  UpdatedDate = q.UpdatedDate,
                                  DeleteTime = q.DeleteTime,
                              }).FirstOrDefaultAsync();

            return item ?? throw new Exception("Notification not found for ID: " + id);
        }

        public async Task<bool> CreateNhacNho(Notification newNoTi)
        {
            if (newNoTi == null)
                throw new Exception("Notification object is null");

            var idHoSoDonViKeKhai = newNoTi.ItemId;
            if (idHoSoDonViKeKhai == null)
                throw new Exception("ItemId is required for notification");

            newNoTi.IsRead = false;
            newNoTi.ItemName = "";
            newNoTi.Type = "";

            try
            {
                await CreateAsync(newNoTi);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to create notification: " + ex.Message);
            }
        }

        public async Task<PagedList<NotificationDto>> GetNotification(Guid? id, int size = 20)
        {
            var query = from q in GetQueryable().Where(x => x.IsRead != true && x.ToUser == id)
                        join users in _appUserRepository.GetQueryable()
                        on q.FromUser equals users.Id into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        select new NotificationDto
                        {
                            Id = q.Id,
                            FromUser = q.FromUser,
                            FromUserName = user.Name ?? "",
                            ToUser = q.ToUser,
                            Message = q.Message,
                            Link = q.Link,
                            Type = q.Type,
                            DonViId = q.DonViId,
                            ItemType = q.ItemType,
                            SendToFrontEndUser = q.SendToFrontEndUser,
                            IsRead = q.IsRead,
                            Email = q.Email,
                            LoaiThongBao = q.LoaiThongBao,
                            ProductId = q.ProductId,
                            ProductName = q.ProductName,
                            TieuDe = q.TieuDe,
                            NoiDung = q.NoiDung,
                            FileDinhKem = q.FileDinhKem,
                            IsXuatBan = q.IsXuatBan,
                            CreatedDate = q.CreatedDate,
                            ItemId = q.ItemId,
                            CreatedId = q.CreatedId,
                            UpdatedId = q.UpdatedId,
                            IsDisplay = q.IsDisplay,
                            ItemName = q.ItemName,
                            IsDelete = q.IsDelete,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            DeleteId = q.DeleteId,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                        };

            query = query.OrderByDescending(x => x.CreatedDate);
            var search = new SearchBase
            {
                PageIndex = 1,
                PageSize = size,
            };
            return await PagedList<NotificationDto>.CreateAsync(query, search);
        }

        public async Task<PagedList<NotificationDto>> GetDataDoanhNghiep(NotificationSearch search)
        {
            var query = from q in GetQueryable().Where(x => x.LoaiThongBao == "Website")
                        join users in _appUserRepository.GetQueryable()
                        on q.FromUser equals users.Id into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        join tailieu in _TaiLieuDinhKemRepository.GetQueryable().Where(x => x.LoaiTaiLieu == "FileNotification")
                        on q.Id equals tailieu.Item_ID into tailieuGroup
                        from tailieu in tailieuGroup.DefaultIfEmpty()
                        select new NotificationDto
                        {
                            Id = q.Id,
                            FromUser = q.FromUser,
                            FromUserName = user.Name ?? "",
                            ToUser = q.ToUser,
                            Message = q.Message,
                            Link = q.Link,
                            Type = q.Type,
                            DonViId = q.DonViId,
                            ItemType = q.ItemType,
                            SendToFrontEndUser = q.SendToFrontEndUser,
                            IsRead = q.IsRead,
                            CreatedDate = q.CreatedDate,
                            ItemId = q.ItemId,
                            Email = q.Email,
                            LoaiThongBao = q.LoaiThongBao,
                            ProductId = q.ProductId,
                            ProductName = q.ProductName,
                            TieuDe = q.TieuDe,
                            NoiDung = q.NoiDung,
                            FileDinhKem = q.FileDinhKem,
                            IsXuatBan = q.IsXuatBan,
                            CreatedId = q.CreatedId,
                            UpdatedId = q.UpdatedId,
                            IsDisplay = q.IsDisplay,
                            ItemName = q.ItemName,
                            IsDelete = q.IsDelete,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            DeleteId = q.DeleteId,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            FileTaiLieu = tailieu != null ? new FileDinhKem
                            {
                                Id = tailieu.Id,
                                Url = tailieu.DuongDanFile,
                                Name = tailieu.TenTaiLieu
                            } : null,
                        };

            if (search != null)
            {
                if (search.ToUser != null)
                    query = query.Where(x => x.ToUser == search.ToUser);

                if (search.FromUser != null)
                    query = query.Where(x => x.FromUser == search.FromUser);

                if (!string.IsNullOrEmpty(search.FromUserName))
                    query = query.Where(x => x.FromUserName.ToLower().Contains(search.FromUserName.Trim().ToLower()));

                if (!string.IsNullOrEmpty(search.Message))
                    query = query.Where(x => x.Message.ToLower().Contains(search.Message.Trim().ToLower()));

                if (search.FromDate != null)
                    query = query.Where(x => x.CreatedDate >= search.FromDate);

                if (search.ToDate != null)
                    query = query.Where(x => x.CreatedDate <= search.ToDate);
            }

            query = query.OrderByDescending(x => x.CreatedDate);
            return await PagedList<NotificationDto>.CreateAsync(query, search);
        }

        public async Task<PagedList<NotificationDto>> GetDataSanPham(NotificationSearch search)
        {
            var query = from q in GetQueryable().Where(x => x.LoaiThongBao == "Sản phẩm")
                        join users in _appUserRepository.GetQueryable()
                        on q.FromUser equals users.Id into userGroup
                        from user in userGroup.DefaultIfEmpty()
                        join tailieu in _TaiLieuDinhKemRepository.GetQueryable() on q.Id equals tailieu.Item_ID
                        into tailieuGroup
                        from tailieu in tailieuGroup.DefaultIfEmpty()
                        select new NotificationDto
                        {
                            Id = q.Id,
                            FromUser = q.FromUser,
                            FromUserName = user.Name ?? "",
                            ToUser = q.ToUser,
                            Message = q.Message,
                            Link = q.Link,
                            Type = q.Type,
                            DonViId = q.DonViId,
                            ItemType = q.ItemType,
                            SendToFrontEndUser = q.SendToFrontEndUser,
                            IsRead = q.IsRead,
                            CreatedDate = q.CreatedDate,
                            ItemId = q.ItemId,
                            Email = q.Email,
                            LoaiThongBao = q.LoaiThongBao,
                            ProductId = q.ProductId,
                            ProductName = q.ProductName,
                            TieuDe = q.TieuDe,
                            NoiDung = q.NoiDung,
                            FileDinhKem = q.FileDinhKem,
                            IsXuatBan = q.IsXuatBan,
                            CreatedId = q.CreatedId,
                            UpdatedId = q.UpdatedId,
                            IsDisplay = q.IsDisplay,
                            ItemName = q.ItemName,
                            IsDelete = q.IsDelete,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            DeleteId = q.DeleteId,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            FileTaiLieu = tailieu != null ? new FileDinhKem
                            {
                                Id = tailieu.Id,
                                Url = tailieu.DuongDanFile,
                                Name = tailieu.TenTaiLieu
                            } : null,
                        };

            if (search != null)
            {
                if (search.ToUser != null)
                    query = query.Where(x => x.ToUser == search.ToUser);

                if (search.FromUser != null)
                    query = query.Where(x => x.FromUser == search.FromUser);

                if (!string.IsNullOrEmpty(search.FromUserName))
                    query = query.Where(x => x.FromUserName.ToLower().Contains(search.FromUserName.Trim().ToLower()));

                if (!string.IsNullOrEmpty(search.Message))
                    query = query.Where(x => x.Message.ToLower().Contains(search.Message.Trim().ToLower()));

                if (search.FromDate != null)
                    query = query.Where(x => x.CreatedDate >= search.FromDate);

                if (search.ToDate != null)
                    query = query.Where(x => x.CreatedDate <= search.ToDate);
            }

            query = query.OrderByDescending(x => x.CreatedDate);
            return await PagedList<NotificationDto>.CreateAsync(query, search);
        }


        public async Task<List<Notification>> CreateOrUpdateNotificationPhanCong(
      List<DA_PhanCongCreateVM> listPhanCong, Guid duAnId, Guid fromUser)
        {
            
                // Lấy tên người gửi và tên dự án
                var fromUserName = await _aspNetUsersRepository.GetQueryable()
                    .Where(x => x.Id == fromUser)
                    .Select(x => x.Name)
                    .SingleOrDefaultAsync();

                var duAnName = await _duAnRepository.GetQueryable()
                    .Where(x => x.Id == duAnId)
                    .Select(x => x.TenDuAn)
                    .SingleOrDefaultAsync();

                // Lấy danh sách notification đã tạo cho dự án này
                var existingNotifications = await GetQueryable()
                    .Where(x => x.ItemId == duAnId)
                    .ToListAsync();

                var listNotification = new List<Notification>();

                // Lấy danh sách UserId từ phân công
                var assignedUserIds = listPhanCong.Select(x => x.UserId).ToHashSet();

                // Lấy danh sách tất cả VaiTrò để tránh truy vấn nhiều lần
                var allVaiTroIds = listPhanCong
                    .SelectMany(p => (p.VaiTroId ?? "")
                    .Split(',', StringSplitOptions.RemoveEmptyEntries))
                    .Select(id => Guid.TryParse(id.Trim(), out var g) ? g : Guid.Empty)
                    .Where(g => g != Guid.Empty)
                    .Distinct()
                    .ToList();

                var vaiTroDict = await _dmDuLieuDanhMucRepository.GetQueryable()
                    .Where(x => allVaiTroIds.Contains(x.Id))
                    .ToDictionaryAsync(x => x.Id, x => x.Name);

                // Group các vai trò theo user để tiện sử dụng
                var userVaiTroMap = listPhanCong.ToDictionary(
                    pc => pc.UserId,
                    pc =>
                    {
                        var ids = (pc.VaiTroId ?? "")
                            .Split(',', StringSplitOptions.RemoveEmptyEntries)
                            .Select(s => Guid.TryParse(s.Trim(), out var g) ? g : Guid.Empty)
                            .Where(g => g != Guid.Empty)
                            .ToList();

                        var names = ids
                            .Where(id => vaiTroDict.ContainsKey(id))
                            .Select(id => vaiTroDict[id])
                            .ToList();

                        return names;
                    });

                var existingUserIds = existingNotifications.Select(x => x.ToUser).ToHashSet();

                // CASE 2: Người trong phân công nhưng chưa có thông báo → Gửi thông báo mới
                foreach (var userId in assignedUserIds)
                {
                    if (!existingUserIds.Contains(userId))
                    {
                        var vaiTroNames = userVaiTroMap[userId];
                        var noti = new Notification
                        {
                            FromUser = fromUser,
                            ToUser = userId,
                            Message = $"Bạn được phân công công việc vào dự án {duAnName} với vai trò: {string.Join(", ", vaiTroNames)}",
                            Link = $"/DuAn/detail/{duAnId}",
                            Type = "PHANCONG",
                            ItemName = "PHANCONG",
                            SendToFrontEndUser = true,
                            IsRead = false,
                            CreatedDate = DateTime.Now,
                            ItemId = duAnId,
                            LoaiThongBao = "Phân công",
                            TieuDe = $"Thông báo phân công từ {fromUserName} vào dự án {duAnName}",
                            NoiDung = $"Bạn đã được phân công với vai trò: {string.Join(", ", vaiTroNames)}",
                            IsXuatBan = false
                        };
                        await CreateAsync(noti);
                        listNotification.Add(noti);
                    }
                }

                // CASE 3: Người đã có thông báo nhưng **không còn trong danh sách phân công**
                foreach (var oldNoti in existingNotifications)
                {
                    if (!assignedUserIds.Contains(oldNoti.ToUser.Value))
                    {
                        oldNoti.Link = "";
                        await UpdateAsync(oldNoti); // Gọi update nếu có hàm riêng

                        var noti = new Notification
                        {
                            FromUser = fromUser,
                            ToUser = oldNoti.ToUser,
                            Message = $"Bạn không cần tham gia vào dự án {duAnName} nữa.",
                            Link = $"/DuAn/detail/{duAnId}",
                            Type = "PHANCONG",
                            ItemName = "PHANCONG",
                            SendToFrontEndUser = true,
                            IsRead = false,
                            CreatedDate = DateTime.Now,
                            ItemId = duAnId,
                            LoaiThongBao = "Phân công",
                            TieuDe = $"Thông báo từ {fromUserName} - Rút khỏi dự án {duAnName}",
                            NoiDung = $"Bạn không còn được phân công trong dự án này.",
                            IsXuatBan = false
                        };
                        await CreateAsync(noti);
                        listNotification.Add(noti);
                    }
                }

                return listNotification;
           
  
        }

     
    }


}

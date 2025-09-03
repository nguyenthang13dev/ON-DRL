using Hinet.Model.Entities;
using Hinet.Repository.NotificationRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.NotificationService.Dto;
using Hinet.Service.Common;
using Hinet.Service.UserRoleService;
using Hinet.Service.RoleService;
using Hinet.Repository.TaiLieuDinhKemRepository;
using Hinet.Repository.AppUserRepository;
using Hinet.Service.Dto;
using Hinet.Repository.AspNetUsersRepository;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using MongoDB.Driver.Linq;

namespace Hinet.Service.NotificationService
{
    public class NotificationService : Service<Notification>, INotificationService
    {
        private readonly IUserRoleService _userRoleService;
        private readonly IAppUserRepository _appUserRepository;
        private readonly IDM_DuLieuDanhMucRepository _dmDuLieuDanhMucRepository;
        private readonly IAspNetUsersRepository _aspNetUsersRepository;
        private readonly IRoleService _roleService;
        private readonly ITaiLieuDinhKemRepository _TaiLieuDinhKemRepository;

        public NotificationService(
            INotificationRepository notificationRepository,
            IUserRoleService userRoleService,
            IAppUserRepository appUserRepository,
            IDM_DuLieuDanhMucRepository dmDuLieuDanhMucRepository,
            IAspNetUsersRepository aspNetUsersRepository,
            ITaiLieuDinhKemRepository taiLieuDinhKemRepository,
            IRoleService roleService) : base(notificationRepository)
        {
            _userRoleService = userRoleService;
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


       

     
    }


}

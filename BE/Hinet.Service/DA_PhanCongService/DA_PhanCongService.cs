using Hinet.Model.Entities;
using Hinet.Repository.DA_PhanCongRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.DA_PhanCongService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;
using Hinet.Service.DA_PhanCongService.ViewModels;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.DM_DuLieuDanhMucRepository;



namespace Hinet.Service.DA_PhanCongService
{
    public class DA_PhanCongService : Service<DA_PhanCong>, IDA_PhanCongService
    {
        private readonly IAppUserRepository _appUserRepository;
        private readonly IDM_DuLieuDanhMucRepository _dmDuLieuDanhMucRepository;

        public DA_PhanCongService(
            IDA_PhanCongRepository dA_PhanCongRepository
, IAppUserRepository appUserRepository,
IDM_DuLieuDanhMucRepository dmDuLieuDanhMucRepository) : base(dA_PhanCongRepository)
        {
            _appUserRepository = appUserRepository;
            _dmDuLieuDanhMucRepository = dmDuLieuDanhMucRepository;
        }

        public async Task<PagedList<DA_PhanCongDto>> GetData(DA_PhanCongSearch search)
        {
            var query = from q in GetQueryable()

                        select new DA_PhanCongDto()
                        {
                            DuAnId = q.DuAnId,
                            VaiTroId = q.VaiTroId,
                            UserId = q.UserId,
                            OrderBy = q.OrderBy,
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
                if (search.DuAnId.HasValue)
                {
                    query = query.Where(x => x.DuAnId == search.DuAnId);
                }
                if (search.VaiTroId.HasValue)
                {
                    query = query.Where(x => x.VaiTroId.Contains(search.VaiTroId.ToString()));
                }
                if (search.UserId.HasValue)
                {
                    query = query.Where(x => x.UserId == search.UserId);
                }
                //if(!string.IsNullOrEmpty(search.OrderBy))
                //{
                //	query = query.Where(x => EF.Functions.Like(x.OrderBy, $"%{search.OrderBy}%"));
                //}
            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<DA_PhanCongDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<DA_PhanCongDto?> GetDto(Guid id)
        {
            var qData = await (from q in GetQueryable().Where(x => x.Id == id)
                               join user in _appUserRepository.GetQueryable()
                               on q.UserId equals user.Id
                               select new
                               {
                                   q,
                                   TenUser = user.Name
                               }).FirstOrDefaultAsync();

            if (qData == null) return null;

            // Tách các VaiTroId từ chuỗi
            var vaiTroIds = (qData.q.VaiTroId ?? "")
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => Guid.TryParse(s.Trim(), out var g) ? g : Guid.Empty)
                .Where(g => g != Guid.Empty)
                .ToList();

            // Truy vấn tên các VaiTrò theo danh sách ID
            var vaiTros = await _dmDuLieuDanhMucRepository.GetQueryable()
                .Where(x => vaiTroIds.Contains(x.Id))
                .Select(x => x.Name)
                .ToListAsync();

            return new DA_PhanCongDto()
            {
                DuAnId = qData.q.DuAnId,
                VaiTroId = qData.q.VaiTroId,
                UserId = qData.q.UserId,
                OrderBy = qData.q.OrderBy,
                CreatedBy = qData.q.CreatedBy,
                UpdatedBy = qData.q.UpdatedBy,
                IsDelete = qData.q.IsDelete,
                DeleteId = qData.q.DeleteId,
                CreatedDate = qData.q.CreatedDate,
                UpdatedDate = qData.q.UpdatedDate,
                DeleteTime = qData.q.DeleteTime,
                Id = qData.q.Id,
                TenUser = qData.TenUser,
                TenVaiTro = string.Join(", ", vaiTros)
            };
        }



        public async Task<List<DA_PhanCongDto>> ListPhanCong(Guid id)
        {
            // 1. Truy vấn danh sách phân công + user
            var qList = await (from q in GetQueryable().Where(x => x.DuAnId == id)
                               join user in _appUserRepository.GetQueryable()
                               on q.UserId equals user.Id
                               select new
                               {
                                   q,
                                   TenUser = user.Name
                               }).ToListAsync();

            // 2. Tách toàn bộ VaiTroId từ các bản ghi
            var allVaiTroIds = qList
                .SelectMany(x => (x.q.VaiTroId ?? "")
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => Guid.TryParse(s.Trim(), out var g) ? g : Guid.Empty)
                    .Where(g => g != Guid.Empty))
                .Distinct()
                .ToList();

            // 3. Truy vấn các VaiTro cần thiết
            var vaiTroDict = await _dmDuLieuDanhMucRepository.GetQueryable()
                .Where(x => allVaiTroIds.Contains(x.Id))
                .ToDictionaryAsync(x => x.Id, x => x.Name);

            // 4. Ánh xạ dữ liệu thành DTO
            var result = qList.Select(x =>
            {
                var vaiTroIds = (x.q.VaiTroId ?? "")
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(s => Guid.TryParse(s.Trim(), out var g) ? g : Guid.Empty)
                    .Where(g => g != Guid.Empty);

                var tenVaiTros = vaiTroIds
                    .Where(id => vaiTroDict.ContainsKey(id))
                    .Select(id => vaiTroDict[id]);

                return new DA_PhanCongDto
                {
                    DuAnId = x.q.DuAnId,
                    VaiTroId = x.q.VaiTroId,
                    UserId = x.q.UserId,
                    OrderBy = x.q.OrderBy,
                    CreatedBy = x.q.CreatedBy,
                    UpdatedBy = x.q.UpdatedBy,
                    IsDelete = x.q.IsDelete,
                    DeleteId = x.q.DeleteId,
                    CreatedDate = x.q.CreatedDate,
                    UpdatedDate = x.q.UpdatedDate,
                    DeleteTime = x.q.DeleteTime,
                    Id = x.q.Id,
                    TenUser = x.TenUser,
                    TenVaiTro = string.Join(", ", tenVaiTros)
                };
            }).ToList();

            return result;
        }



        public async Task<List<DA_PhanCongEditVM>> GetByDuAn(Guid idDuAn)
        {
            var data = await GetQueryable()
                .Where(x => x.DuAnId == idDuAn).Select(x => new DA_PhanCongEditVM
                {
                    Id = x.Id,
                    UserId = x.UserId,
                    VaiTroId = x.VaiTroId
                }).ToListAsync();
            return data;
        }
    }
}

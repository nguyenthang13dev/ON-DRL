using Hinet.Model.Entities;
using Hinet.Repository.DA_NoiDungCuocHopRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.DA_NoiDungCuocHopService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;
using Hinet.Repository.TaiLieuDinhKemRepository;
using Hinet.Service.Constant;
using Hinet.Service.AppUserService;
using CommonHelper.String;

namespace Hinet.Service.DA_NoiDungCuocHopService
{
    public class DA_NoiDungCuocHopService : Service<DA_NoiDungCuocHop>, IDA_NoiDungCuocHopService
    {
        private readonly ITaiLieuDinhKemRepository _taiLieuDinhKemRepository;
        private readonly IAppUserService _appUserService;
        public DA_NoiDungCuocHopService(
            IDA_NoiDungCuocHopRepository dA_NoiDungCuocHopRepository
, ITaiLieuDinhKemRepository taiLieuDinhKemRepository,
IAppUserService appUserService) : base(dA_NoiDungCuocHopRepository)
        {
            _taiLieuDinhKemRepository = taiLieuDinhKemRepository;
            _appUserService = appUserService;
        }

        public async Task<PagedList<DA_NoiDungCuocHopDto>> GetData(DA_NoiDungCuocHopSearch search)
        {
            var data = GetQueryable();
            if (search != null)
            {
                if (search.DuAnId != null)
                {
                    data = data.Where(x => x.DuAnId == search.DuAnId);
                }
            }
            var query = from q in data
                        select new DA_NoiDungCuocHopDto()
                        {
                            Id = q.Id,
                            CreatedDate = q.CreatedDate,
                            DuAnId = q.DuAnId,
                            ThoiGianHop = q.ThoiGianHop,
                            IsNoiBo = q.IsNoiBo,
                            TenDuAn = q.TenDuAn,
                            ThanhPhanThamGia = q.ThanhPhanThamGia,
                            NoiDungCuocHop = q.NoiDungCuocHop,
                            DiaDiemCuocHop = q.DiaDiemCuocHop,
                        };
            if (search != null)
            {
                if (!string.IsNullOrEmpty(search.DiaDiemCuocHop))
                {
                    query = query.Where(x => !string.IsNullOrEmpty(x.DiaDiemCuocHop) && x.DiaDiemCuocHop.ToLower().Contains(search.DiaDiemCuocHop.ToLower()));
                } 
                if (!string.IsNullOrEmpty(search.ThoiGianHop))
                {
                    var test = query.ToList();
                    if (DateTime.TryParse(search.ThoiGianHop, out DateTime date))
                    {
                        //Console.WriteLine(date.ToString("dd/MM/yyyy")); // Output: 12/06/2025
                        query = query.Where(x => x.ThoiGianHop.HasValue &&  x.ThoiGianHop.Value.Date == date.ToUniversalTime().Date);
                    }
                    test = query.ToList();
                    // Tìm theo ngày
                }

                if (search.IsNoiBo != null)
                {
                    query = query.Where(x=>x.IsNoiBo == search.IsNoiBo);
                }
                if (!string.IsNullOrEmpty(search.ThanhPhanThamGia))
                {

                    var listThanhPhan = search.ThanhPhanThamGia?.Split(',').Select(x => x.Trim().ToString()).ToList();
                    if (listThanhPhan.Any())
                    { 
                        foreach (var item in listThanhPhan)
                        {
                            query = query.Where(x => !string.IsNullOrEmpty(x.ThanhPhanThamGia) && x.ThanhPhanThamGia.Contains(item));
                        }
                    }
                }
                /*if (!string.IsNullOrEmpty(search.ThanhPhanThamGia))
                {
                    var listThanhPhan = search.ThanhPhanThamGia.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                          .Select(x => x.Trim())
                                          .Where(x => !string.IsNullOrWhiteSpace(x))
                                          .ToList();
                    var dataTest = query.ToList();
                    if (listThanhPhan.Count > 0)
                    {
                        query = query.Where(x => listThanhPhan.Any(item =>
                            !string.IsNullOrEmpty(x.ThanhPhanThamGia) &&
                            x.ThanhPhanThamGia.Contains(item)));
                        var queryTest = query.ToList();
                    }
                }*/
            }
            query = query.OrderByDescending(x => x.CreatedDate); 
            var result = await PagedList<DA_NoiDungCuocHopDto>.CreateAsync(query, search);
            foreach (var item in result.Items)
            {
                item.SoTaiLieu = _taiLieuDinhKemRepository.FindBy(x => x.Item_ID == item.Id && x.LoaiTaiLieu == LoaiTaiLieuConstant.NoiDungCuocHop).Count();
                var listThanhPhan = item.ThanhPhanThamGia?.Split(',').Select(x=>x.Trim().ToString()).ToList();
                if (listThanhPhan.Any())
                {
                    item.ThanhPhanThamGiaText =string.Join(", ", _appUserService.GetQueryable()
                    .Where(x => listThanhPhan.Contains(x.Id.ToString()))
                    .Select(x => x.Name).ToList());
                } 
            }
            return result;
        }

        public async Task<List<DA_NoiDungCuocHopDto>> ListCuocHopByDuAn(Guid? id, DA_NoiDungCuocHopSearch search)
        {
            var query = from q in GetQueryable().Where(x => x.DuAnId == id)
                        select new DA_NoiDungCuocHopDto()
                        {
                            Id = q.Id,
                            CreatedDate = q.CreatedDate,
                            DuAnId = q.DuAnId,
                            ThoiGianHop = q.ThoiGianHop,
                            IsNoiBo = q.IsNoiBo,
                            TenDuAn = q.TenDuAn,
                            ThanhPhanThamGia = q.ThanhPhanThamGia,
                            NoiDungCuocHop = q.NoiDungCuocHop,
                            DiaDiemCuocHop = q.DiaDiemCuocHop,
                        };
            if (search == null)
            {

            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var data = query.ToList();
            foreach (var item in data)
            {
                item.ListTaiLieu = _taiLieuDinhKemRepository.FindBy(x => x.Item_ID == item.Id && x.LoaiTaiLieu == LoaiTaiLieuConstant.NoiDungCuocHop).Select(
                    x => new TaiLieuUpload { TenTaiLieu = x.TenTaiLieu, DuongDanFile = x.DuongDanFile,Id = x.Id }
                    ).ToList();
                item.SoTaiLieu = item.ListTaiLieu == null ? 0 : item.ListTaiLieu.Count();

            }
            return data;
        }
        public async Task<DA_NoiDungCuocHopDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)
                              select new DA_NoiDungCuocHopDto()
                              {
                                  DuAnId = q.DuAnId,
                                  ThoiGianHop = q.ThoiGianHop,
                                  IsNoiBo = q.IsNoiBo,
                                  TenDuAn = q.TenDuAn,
                                  ThanhPhanThamGia = q.ThanhPhanThamGia,
                                  NoiDungCuocHop = q.NoiDungCuocHop,
                                  DiaDiemCuocHop = q.DiaDiemCuocHop,
                              }).FirstOrDefaultAsync();

            return item;
        }
    }
}

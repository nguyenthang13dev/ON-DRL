using Hinet.Model.Entities;
using Hinet.Repository.DA_DuAnRepository;
using Hinet.Repository.DA_PhanCongRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DA_DuAnService.Dto;
using Hinet.Service.DA_DuAnService.ViewModels;
using Hinet.Service.DA_PhanCongService;
using Microsoft.EntityFrameworkCore;



namespace Hinet.Service.DA_DuAnService
{
    public class DA_DuAnService : Service<DA_DuAn>, IDA_DuAnService
    {
        private readonly IMapper _mapper;
        private readonly IDA_PhanCongService _dA_PhanCongService;
        private readonly IDA_PhanCongRepository _dA_PhanCongRepository;
        public DA_DuAnService(
            IDA_DuAnRepository dA_DuAnRepository
            , IMapper mapper,
            IDA_PhanCongService dA_PhanCongService,
            IDA_PhanCongRepository dA_PhanCongRepository) : base(dA_DuAnRepository)
        {
            _mapper = mapper;
            _dA_PhanCongService = dA_PhanCongService;
            _dA_PhanCongRepository = dA_PhanCongRepository;
        }

        public async Task<PagedList<DA_DuAnDto>> GetData(DA_DuAnSearch search)
        {

            var queryDuAn = GetQueryable();
            if(search != null && search.UserId.HasValue)
            {
                var idDuAns = _dA_PhanCongRepository.GetQueryable().Where(x => x.UserId == search.UserId).Select(x => x.DuAnId);
                queryDuAn = queryDuAn.Where(x => x.CreatedId == search.UserId || idDuAns.Contains(x.Id));
            }

            var query = from q in queryDuAn
                        select new DA_DuAnDto()
                        {
                            TenDuAn = q.TenDuAn,
                            NgayBatDau = q.NgayBatDau,
                            NgayKetThuc = q.NgayKetThuc,
                            MoTaDuAn = q.MoTaDuAn,
                            NgayTiepNhan = q.NgayTiepNhan,
                            YeuCauDuAn = q.YeuCauDuAn,
                            TrangThaiThucHien = q.TrangThaiThucHien,
                            TimeCaiDatMayChu = q.TimeCaiDatMayChu,
                            IsBackupMayChu = q.IsBackupMayChu,
                            LinkDemo = q.LinkDemo,
                            LinkThucTe = q.LinkThucTe,
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
                if (!string.IsNullOrEmpty(search.TenDuAn))
                {
                    query = query.Where(x => EF.Functions.Like(x.TenDuAn, $"%{search.TenDuAn}%"));
                }
                if (search.NgayBatDau.HasValue)
                {
                    query = query.Where(x => x.NgayBatDau == search.NgayBatDau);
                }
                if (search.NgayKetThuc.HasValue)
                {
                    query = query.Where(x => x.NgayKetThuc == search.NgayKetThuc);
                }
                if (!string.IsNullOrEmpty(search.MoTaDuAn))
                {
                    query = query.Where(x => EF.Functions.Like(x.MoTaDuAn, $"%{search.MoTaDuAn}%"));
                }
                if (search.NgayTiepNhan.HasValue)
                {
                    query = query.Where(x => x.NgayTiepNhan == search.NgayTiepNhan);
                }
                if (!string.IsNullOrEmpty(search.YeuCauDuAn))
                {
                    query = query.Where(x => EF.Functions.Like(x.YeuCauDuAn, $"%{search.YeuCauDuAn}%"));
                }
                if (search.TrangThaiThucHien.HasValue)
                {
                    query = query.Where(x => x.TrangThaiThucHien == search.TrangThaiThucHien);
                }
                if (search.TimeCaiDatMayChu.HasValue)
                {
                    query = query.Where(x => x.TimeCaiDatMayChu == search.TimeCaiDatMayChu);
                }
                if (search.IsBackupMayChu.HasValue)
                {
                    query = query.Where(x => x.IsBackupMayChu == search.IsBackupMayChu);
                }
                if (!string.IsNullOrEmpty(search.LinkDemo))
                {
                    query = query.Where(x => EF.Functions.Like(x.LinkDemo, $"%{search.LinkDemo}%"));
                }
                if (!string.IsNullOrEmpty(search.LinkThucTe))
                {
                    query = query.Where(x => EF.Functions.Like(x.LinkThucTe, $"%{search.LinkThucTe}%"));
                }
            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<DA_DuAnDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<DA_DuAnDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)

                              select new DA_DuAnDto()
                              {
                                  TenDuAn = q.TenDuAn,
                                  NgayBatDau = q.NgayBatDau,
                                  NgayKetThuc = q.NgayKetThuc,
                                  MoTaDuAn = q.MoTaDuAn,
                                  NgayTiepNhan = q.NgayTiepNhan,
                                  YeuCauDuAn = q.YeuCauDuAn,
                                  TrangThaiThucHien = q.TrangThaiThucHien,
                                  TimeCaiDatMayChu = q.TimeCaiDatMayChu,
                                  IsBackupMayChu = q.IsBackupMayChu,
                                  LinkDemo = q.LinkDemo,
                                  LinkThucTe = q.LinkThucTe,
                                  CreatedBy = q.CreatedBy,
                                  UpdatedBy = q.UpdatedBy,
                                  IsDelete = q.IsDelete,
                                  DeleteId = q.DeleteId,
                                  CreatedDate = q.CreatedDate,
                                  UpdatedDate = q.UpdatedDate,
                                  DeleteTime = q.DeleteTime,
                                  Id = q.Id,
                                  HasCheckListNghiemThuKyThuat = q.HasCheckListNghiemThuKyThuat,
                                  HasFileKeHoachTrienKhaiKhachHang = q.HasFileKeHoachTrienKhaiKhachHang,
                                  HasFileKhaoSat = q.HasFileKhaoSat,
                                  HasFileKeHoachTrienKhaiNoiBo = q.HasFileKeHoachTrienKhaiNoiBo,
                                  HasFileNghiemThuKyThuat = q.HasFileNghiemThuKyThuat,
                                  HasFileNoiDungKhaoSat = q.HasFileNoiDungKhaoSat,
                                  HasFileTestCase = q.HasFileTestCase,
                                  TenGoiThau=q.TenGoiThau,
                                  ChuDauTu=q.ChuDauTu,
                                  DiaDiemTrienKhai=q.DiaDiemTrienKhai
                              }).FirstOrDefaultAsync();
            if (item != null)
            {
                item.PhanCongList = await _dA_PhanCongService.ListPhanCong(id);
            }
            return item;
        }

        public async Task<DA_DuAnEditVM> GetForm(Guid idDuAn)
        {
            var data = new DA_DuAnEditVM();
            var getDuAn = await FirstOrDefaultAsync(x => x.Id == idDuAn);
            if (getDuAn != null)
            {
                data = _mapper.Map(getDuAn, data); // Map from entity to view model
                data.PhanCongList = await _dA_PhanCongService.GetByDuAn(idDuAn);
            }
            return data;
        }


    }
}

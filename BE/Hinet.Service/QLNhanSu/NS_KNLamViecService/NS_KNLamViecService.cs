using Hinet.Model.Entities.QLNhanSu;
using Hinet.Repository.QLNhanSu.NS_KNLamViecRepository;
using Hinet.Repository.QLNhanSu.NS_NhanSuRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;
using Hinet.Service.QLNhanSu.NS_KNLamViecService.Dto;
using Hinet.Service.QLNhanSu.NS_KNLamViecService.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_KNLamViecService
{
    public class NS_KNLamViecService : Service<NS_KinhNghiemLamViec>, INS_KNLamViecService
    {
        private readonly INS_NhanSuRepository _nS_NhanSuRepository;
        public NS_KNLamViecService(INS_KNLamViecRepository repository, INS_NhanSuRepository nS_NhanSuRepository) : base(repository)
        {
            _nS_NhanSuRepository = nS_NhanSuRepository;
        }


        #region Public Method
        public int TotalWorkExperienceMonth(DateTime? startDate, DateTime? endDate)
        {
            if (startDate == null || endDate == null)
                return 0;
            if (endDate.Value.Date < startDate.Value.Date)
                return 0;
            int TotalMonth = (endDate.Value.Year - startDate.Value.Year) * 12 + (endDate.Value.Month - startDate.Value.Month);
            if (endDate.Value.Day < startDate.Value.Day)
            {
                TotalMonth--;
            }
            return TotalMonth;
        }

        public async Task<PagedList<NS_KNLamViecDto>> GetListDto(Guid IdNhanSu)
        {
            var query = from q in GetQueryable()
                        join ns in _nS_NhanSuRepository.GetQueryable().Where(x => x.Id == IdNhanSu)
                        on q.MaNV equals ns.MaNV
                        select new NS_KNLamViecDto
                        {
                            Id = q.Id,
                            MaNV = q.MaNV,
                            NhanSuId = q.NhanSuId,
                            TenCongTy = q.TenCongTy,
                            TuNgay = q.TuNgay,
                            DenNgay = q.DenNgay,
                            HoTenNhanSu = ns.HoTen,
                            TotalMonth = q.TotalMonth,
                            CreatedDate = q.CreatedDate,
                        };
            query = query.OrderByDescending(x => x.CreatedDate);
            return await PagedList<NS_KNLamViecDto>.CreateAsync(query, new SearchBase ());
        }
        #endregion
    }
}

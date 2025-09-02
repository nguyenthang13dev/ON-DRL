using Hinet.Model.Entities.DA_Test_Case;
using Hinet.Repository.UC_UseCaseDemoRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.UC_UseCaseDemoService.Dto;
using Hinet.Service.Common;
using Hinet.Service.UC_UseCaseDemoService.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Service.UC_UseCaseDemoService
{
    public class UC_UseCaseDemoService : Service<UC_UseCaseDemo>, IUC_UseCaseDemoService
    {
        public UC_UseCaseDemoService(IUC_UseCaseDemoRepository uC_UseCaseDemoRepository) : base(uC_UseCaseDemoRepository)
        {
        }

        public async Task<PagedList<UC_UseCaseDemoDto>> GetData(UC_UseCaseDemoSearch search)
        {
            var query = from q in GetQueryable()
                        select new UC_UseCaseDemoDto()
                        {
                            Id = q.Id,
                            IdDuAn = q.IdDuAn,
                            TenUseCase = q.TenUseCase,
                            TacNhanChinh = q.TacNhanChinh,
                            TacNhanPhu = q.TacNhanPhu,
                            DoPhucTap = q.DoPhucTap,
                            loaiUseCaseCode = q.loaiUseCaseCode,
                            lstHanhDongNangCao = q.lstHanhDongNangCao,
                            lstHanhDong = q.lstHanhDong,
                            CreatedDate = q.CreatedDate
                        };

            if (search != null)
            {
                if (!string.IsNullOrEmpty(search.TenUseCase))
                    query = query.Where(x => x.TenUseCase.ToLower().Contains(search.TenUseCase.ToLower()));

                if (!string.IsNullOrEmpty(search.TacNhanChinh))
                    query = query.Where(x => x.TacNhanChinh.ToLower().Contains(search.TacNhanChinh.ToLower()));

                if (!string.IsNullOrEmpty(search.DoPhucTap))
                    query = query.Where(x => x.DoPhucTap.ToLower().Contains(search.DoPhucTap.ToLower()));

                if (search.IdDuAn.HasValue)
                    query = query.Where(x => x.IdDuAn == search.IdDuAn.Value);
            }

            query = query.OrderBy(x => x.CreatedDate);
            var result = await PagedList<UC_UseCaseDemoDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<UC_UseCaseDemoDto> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)
                              select new UC_UseCaseDemoDto()
                              {
                                  Id = q.Id,
                                  IdDuAn = q.IdDuAn,
                                  TenUseCase = q.TenUseCase,
                                  TacNhanChinh = q.TacNhanChinh,
                                  TacNhanPhu = q.TacNhanPhu,
                                  loaiUseCaseCode = q.loaiUseCaseCode,
                                  DoPhucTap = q.DoPhucTap,
                                  lstHanhDong = q.lstHanhDong
                              }).FirstOrDefaultAsync();

            return item;
        }
    }
}
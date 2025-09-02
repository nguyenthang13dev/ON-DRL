using Hinet.Model.Entities.DA_Test_Case;
using Hinet.Repository.TacNhan_UseCaseRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;
using Hinet.Service.TacNhan_UseCaseService.Dto;
using Hinet.Service.TacNhan_UseCaseService.ViewModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Hinet.Service.TacNhan_UseCaseService
{
    public class TacNhan_UseCaseService : Service<TacNhan_UseCase>, ITacNhan_UseCaseService
    {
        public TacNhan_UseCaseService(ITacNhan_UseCaseRepository repository) : base(repository)
        {
        }
        public async Task<PagedList<TacNhan_UseCaseDto>> GetData(TacNhan_UseCaseSearch search)
        {
            var query = GetQueryable().Select(x => new TacNhan_UseCaseDto
            {
                Id = x.Id,
                maTacNhan = x.maTacNhan,
                tenTacNhan = x.tenTacNhan,
                idDuAn = x.idDuAn,
                CreatedDate = x.CreatedDate,
            });
            if (!string.IsNullOrEmpty(search.MaTacNhan))
                query = query.Where(x => x.maTacNhan.ToLower().Contains(search.MaTacNhan.ToLower()));

            if (!string.IsNullOrEmpty(search.TenTacNhan))
                query = query.Where(x => x.tenTacNhan.ToLower().Contains(search.TenTacNhan.ToLower()));
            if(search.idDuAn.HasValue)
                query = query.Where(x => x.idDuAn == search.idDuAn.Value);
            query = query.OrderByDescending(x => x.CreatedDate);

            return await PagedList<TacNhan_UseCaseDto>.CreateAsync(query, search);
        }

        public async Task<TacNhan_UseCaseDto?> GetDto(Guid id)
        {
            var entity = await GetQueryable().FirstOrDefaultAsync(x => x.Id == id);
            if (entity == null) return null;
            return new TacNhan_UseCaseDto
            {
                Id = entity.Id,
                maTacNhan = entity.maTacNhan,
                tenTacNhan = entity.tenTacNhan
            };
        }

        public async Task<string> GenerateMaTacNhan()
        {
            var random = new Random();
            string generatedCode;
            bool isDuplicate;

            do
            {
                // Sinh mã ngẫu nhiên 3 chữ số
                int randomNumber = random.Next(1, 1000);
                generatedCode = $"TN{randomNumber:D3}";

                // Kiểm tra xem mã đã tồn tại chưa
                isDuplicate = await GetQueryable()
                    .AnyAsync(x => x.maTacNhan == generatedCode);

            } while (isDuplicate);

            return generatedCode;
        }
    }
}
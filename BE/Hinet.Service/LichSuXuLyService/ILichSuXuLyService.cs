using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.LichSuXuLyService.Dto;
using Hinet.Service.LichSuXuLyService.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Hinet.Service.LichSuXuLyService
{
    public interface ILichSuXuLyService : IService<LichSuXuLy>
    {
        Task<PagedList<LichSuXuLyDto>> GetData(LichSuXuLySearch search);
        Task<LichSuXuLyDto?> GetDto(Guid id);
        Task<List<LichSuXuLyDto>> GetByItemId(Guid itemId, string itemType);
    }
}
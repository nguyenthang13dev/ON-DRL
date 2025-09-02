using Hinet.Service.Common;
using Hinet.Service.Dto;
using System;

namespace Hinet.Service.LichSuXuLyService.ViewModels
{
    public class LichSuXuLySearch : SearchBase
    {
        public Guid? ItemId { get; set; }
        public string? ItemType { get; set; }
        public string? Note { get; set; }
    }
}
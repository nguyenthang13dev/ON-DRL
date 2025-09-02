using Hinet.Service.GroupTelegramService;
using Hinet.Service.GroupTelegramService.Dto;
using Hinet.Service.GroupTelegramService.ViewModels;
using Hinet.Api.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Hinet.Controllers;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Model.Entities;
using Hinet.Service.DM_NhomDanhMucService;
using Hinet.Service.DM_DuLieuDanhMucService;
using Microsoft.EntityFrameworkCore;
using Hinet.Service.DM_DuLieuDanhMucService.Dto;
using Hinet.Service.TelegramWebhookService;
using System.Collections.Generic;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    public class GroupTelegramController : HinetController
    {
        private readonly IGroupTelegramService _service;
        private readonly IMapper _mapper;
        private readonly IDM_NhomDanhMucService _dM_NhomDanhMucService;
        private readonly IDM_DuLieuDanhMucService _dM_DuLieuDanhMucService;
        private readonly ITelegramWebhookService _telegramWebhookService;

        public GroupTelegramController(IGroupTelegramService service, IMapper mapper, IDM_NhomDanhMucService dM_NhomDanhMucService, IDM_DuLieuDanhMucService dM_DuLieuDanhMucService, ITelegramWebhookService telegramWebhookService)
        {
            _service = service;
            _dM_NhomDanhMucService = dM_NhomDanhMucService;
            _dM_DuLieuDanhMucService = dM_DuLieuDanhMucService;
            _mapper = mapper;
            _telegramWebhookService = telegramWebhookService;
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<GroupTelegramDto>>> GetData([FromBody] GroupTelegramSearch search)
        {
            var data = await _service.GetData(search);
            return DataResponse<PagedList<GroupTelegramDto>>.Success(data);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<GroupTelegramDto?>> Get(Guid id)
        {
            var dto = await _service.GetDto(id);
            return DataResponse<GroupTelegramDto?>.Success(dto);
        }

        //[HttpPost("Create")]
        //public async Task<DataResponse> Create([FromBody] GroupTelegramCreateVM model)
        //{
        //    try
        //    {
        //        await _service.CreateGroupTelegram(model);

        //        return DataResponse.Success("Thêm mới thành công");
        //    }
        //    catch (ArgumentNullException ex)
        //    {
        //        return DataResponse.False($"Dữ liệu không hợp lệ: {ex.Message}");
        //    }
        //    catch (InvalidOperationException ex)
        //    {
        //        return DataResponse.False($"Lỗi khi thêm mới: {ex.Message}");
        //    }
        //    catch (Exception ex)
        //    {
        //        return DataResponse.False($"Thêm mới thất bại: {ex.Message}");
        //    }
        //}
        //[HttpGet("GetAllEventType")]
        //public async Task<DataResponse<List<DM_DuLieuDanhMucDto>>> GetAllEventType(string? tenDuLieuDM)
        //{
        //    try
        //    {
        //        var eventTypes = await _dM_NhomDanhMucService.GetQueryable().Where(a => a.GroupCode == "LoaiEventTypeCode").FirstOrDefaultAsync();
        //        if (eventTypes == null)
        //        {
        //            await _dM_NhomDanhMucService.CreateAsync(new DM_NhomDanhMuc
        //            {
        //                GroupCode = "LoaiEventTypeCode",
        //                GroupName = "Loại Nhóm Chat Telegram",
        //            });
        //            eventTypes = await _dM_NhomDanhMucService.GetQueryable().Where(a => a.GroupCode == "LoaiEventTypeCode").FirstOrDefaultAsync();
        //        }
        //        var eventTypesData = await _dM_DuLieuDanhMucService.GetQueryable()
        //            .Where(x => x.GroupId == eventTypes.Id)
        //            .ToListAsync();
        //        if (string.IsNullOrEmpty(tenDuLieuDM))
        //            eventTypesData = eventTypesData.Where(x => x.Name.ToLower().Contains(tenDuLieuDM.ToLower())).ToList();

        //        var eventTypesDto = _mapper.Map<List<DM_DuLieuDanhMuc>, List<DM_DuLieuDanhMucDto>>(eventTypesData);

        //        return DataResponse<List<DM_DuLieuDanhMucDto>>.Success(eventTypesDto, "Lấy danh sách loại nhóm Telegram thành công");
        //    }
        //    catch (Exception)
        //    {
        //        return DataResponse<List<DM_DuLieuDanhMucDto>>.False("Lỗi xảy ra khi lấy loại nhóm Telegram");
        //    }
        //}
        //[HttpPut("Update/{id}")]
        //public async Task<DataResponse> Update([FromBody] GroupTelegramEditVM model)
        //{
        //    try
        //    {
        //        await _service.UpdateGroupTelegram(model);
        //        return DataResponse.Success("Cập nhật thành công");
        //    }
        //    catch (ArgumentNullException ex)
        //    {
        //        return DataResponse.False($"Dữ liệu không hợp lệ: {ex.Message}");
        //    }
        //    catch (InvalidOperationException ex)
        //    {
        //        return DataResponse.False($"Lỗi khi cập nhật: {ex.Message}");
        //    }
        //    catch (Exception)
        //    {

        //        return DataResponse.False("Cập nhật thất bại");
        //    }
        //}

        //[HttpDelete("Delete/{id}")]
        //public async Task<DataResponse> Delete(Guid id)
        //{
        //    try
        //    {
        //        var entity = await _service.GetByIdAsync(id);
        //        if (entity == null) return DataResponse.False("Không tìm thấy bản ghi");
        //        await _service.DeleteAsync(entity);
        //        return DataResponse.Success("Xóa thành công");
        //    }
        //    catch (Exception)
        //    {
        //        return DataResponse.Success("Xóa thất bại");
        //    }
        //}

        [HttpGet("GetGroupTelegramLinkToken")]
        public DataResponse<string> GetGroupTelegramLinkToken(string groupName, string eventTypeCode)
        {
            var link = _telegramWebhookService.GenerateGroupTelegramLinkToken(groupName, eventTypeCode);
            return DataResponse<string>.Success(link, "Lấy link liên kết nhóm Telegram thành công");
        }

        [HttpPost("UnlinkGroups")]
        public async Task<DataResponse> UnlinkGroups([FromBody] List<string> chatIds)
        {
            var count = await _service.UnlinkGroups(chatIds);
            return DataResponse.Success($"Đã hủy liên kết {count} nhóm Telegram.");
        }

        [HttpPost("UnlinkGroupsByEventTypeCodes")]
        public async Task<DataResponse> UnlinkGroupsByEventTypeCodes([FromBody] List<string> eventTypeCodes)
        {
            var count = await _service.UnlinkGroupsByEventTypeCodes(eventTypeCodes);
            return DataResponse.Success($"Đã hủy liên kết {count} nhóm Telegram theo EventTypeCode.");
        }
    }
}
using Hinet.Api.Dto;
using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.QLThongBaoService;
using Hinet.Service.QLThongBaoService.Dto;
using Hinet.Service.QLThongBaoService.ViewModels;
using IronPdf.Editing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QLThongBaoController : ControllerBase
    {
        private readonly IQLThongBaoService _qLThongBaoService;
        private readonly ILogger<QLThongBaoController> _logger;
        private readonly IMapper _mapper;
        public QLThongBaoController(
                       IQLThongBaoService qLThongBaoService,
                                  ILogger<QLThongBaoController> logger,
                                             IMapper mapper)
        {
            _qLThongBaoService = qLThongBaoService;
            _logger = logger;
            _mapper = mapper;
        }

        #region Private Methods
        private  string GenCode(int length = 6)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var rd = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[rd.Next(s.Length)]).ToArray());
        }
        #endregion

        [HttpPost("Create")]
        public async Task<DataResponse<QLThongBao>> Create([FromBody] QLThongBaoCreateVM qLThongBaoCreateVM)
        {
            try
            {
                var entity = _mapper.Map<QLThongBaoCreateVM, QLThongBao>(qLThongBaoCreateVM);
                entity.MaThongBao = GenCode();
                await _qLThongBaoService.CreateAsync(entity);
                return DataResponse<QLThongBao>.Success(entity);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo DTNguoiNopDon");
                return DataResponse<QLThongBao>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }
        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<QLThongBaoDto>>> GetData([FromBody] QLThongBaoSearch search)
        {
            var data = await _qLThongBaoService.GetData(search);
            return DataResponse<PagedList<QLThongBaoDto>>.Success(data);

        }
        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse<bool>> Delete(Guid id)
        {
            try
            {
                var entity = await _qLThongBaoService.GetByIdAsync(id);
                if (entity == null)
                {
                    return DataResponse<bool>.False("Không tìm thấy bản ghi.");
                }
                await _qLThongBaoService.DeleteAsync(entity);
                return DataResponse<bool>.Success(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa bản ghi");
                return DataResponse<bool>.False("Đã xảy ra lỗi khi xóa bản ghi.");
            }
        }
        [HttpPut("Update")]
        public async Task<DataResponse<QLThongBao>> Update([FromBody] QLThongBaoEditVM model)
        {
            try
            {
                var entity = await _qLThongBaoService.GetByIdAsync(model.Id);
                if (entity == null)
                {
                    return DataResponse<QLThongBao>.False("Không tìm thấy bản ghi.");
                }
                entity = _mapper.Map(model, entity);
                await _qLThongBaoService.UpdateAsync(entity);
                return DataResponse<QLThongBao>.Success(entity);
            }
            catch(Exception ex)
            {
                return DataResponse<QLThongBao>.False("Đã xảy ra lỗi khi cập nhật dữ liệu.");
            }
        }
    }
}

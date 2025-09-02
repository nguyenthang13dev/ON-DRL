using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities.DA_Test_Case;
using Hinet.Service.UC_UseCaseDemoService;
using Hinet.Service.UC_UseCaseDemoService.Dto;
using Hinet.Service.UC_UseCaseDemoService.ViewModels;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Api.Filter;
using Hinet.Api.Dto;
using Microsoft.EntityFrameworkCore;
using OpenXmlPowerTools;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class UC_UseCaseDemoController : HinetController
    {
        private readonly IUC_UseCaseDemoService _uC_UseCaseDemoService;
        private readonly IMapper _mapper;
        private readonly ILogger<UC_UseCaseDemoController> _logger;

        public UC_UseCaseDemoController(
            IUC_UseCaseDemoService uC_UseCaseDemoService,
            IMapper mapper,
            ILogger<UC_UseCaseDemoController> logger)
        {
            _uC_UseCaseDemoService = uC_UseCaseDemoService;
            _mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<UC_UseCaseDemo>> Create([FromBody] UC_UseCaseDemoCreateVM model)
        {
            try
            {
                var entity = _mapper.Map<UC_UseCaseDemoCreateVM, UC_UseCaseDemo>(model);

                //var checkExist = await _uC_UseCaseDemoService.GetQueryable()
                //    .AnyAsync(x => !string.IsNullOrEmpty(x.TenUseCase) && x.TenUseCase == model.TenUseCase && x.IdDuAn == model.IdDuAn && x.loaiUseCaseCode == model.loaiUseCaseCode);
                //if (checkExist)
                //    return DataResponse<UC_UseCaseDemo>.False("Use Case đã tồn tại trong dự án này với loại Use Case đã chọn.");

                await _uC_UseCaseDemoService.CreateAsync(entity);
                return new DataResponse<UC_UseCaseDemo>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo UC_UseCaseDemo");
                return new DataResponse<UC_UseCaseDemo>()
                {
                    Data = null,
                    Status = false,
                    Message = $"Đã xảy ra lỗi khi tạo dữ liệu.{ex}"
                };
            }
        }
        [HttpPost("CreateMany")]
        public async Task<DataResponse<List<UC_UseCaseDemo>>> CreateMany([FromBody] List<UC_UseCaseDemoCreateVM> models)
        {
            try
            {
                var entitys = new List<UC_UseCaseDemo>();
                foreach (var model in models)
                {
                   var entity = _mapper.Map<UC_UseCaseDemoCreateVM, UC_UseCaseDemo>(model);
                    entitys.Add(entity);
                }

                //var checkExist = await _uC_UseCaseDemoService.GetQueryable()
                //    .AnyAsync(x => !string.IsNullOrEmpty(x.TenUseCase) && x.TenUseCase == model.TenUseCase && x.IdDuAn == model.IdDuAn && x.loaiUseCaseCode == model.loaiUseCaseCode);
                //if (checkExist)
                //    return DataResponse<UC_UseCaseDemo>.False("Use Case đã tồn tại trong dự án này với loại Use Case đã chọn.");
                await _uC_UseCaseDemoService.CreateAsync(entitys);
                return new DataResponse<List<UC_UseCaseDemo>>() { Data = entitys, Status = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo UC_UseCaseDemo");
                return new DataResponse<List<UC_UseCaseDemo>>()
                {
                    Data = null,
                    Status = false,
                    Message = $"Đã xảy ra lỗi khi tạo dữ liệu.{ex}"
                };
            }
        }

        [HttpPut("Update")]
        public async Task<DataResponse<UC_UseCaseDemo>> Update([FromBody] UC_UseCaseDemoEditVM model)
        {
            try
            {
                var entity = await _uC_UseCaseDemoService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<UC_UseCaseDemo>.False("UC_UseCaseDemo không tồn tại");

                entity = _mapper.Map(model, entity);
                await _uC_UseCaseDemoService.UpdateAsync(entity);
                return new DataResponse<UC_UseCaseDemo>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật UC_UseCaseDemo với Id: {Id}", model.Id);
                return new DataResponse<UC_UseCaseDemo>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }
        [HttpPut("UpdateMany")]
        public async Task<DataResponse<List<UC_UseCaseDemo>>> UpdateMany([FromBody] List<UC_UseCaseDemoEditVM> models)
        {
            try
            {
                var entitys = new List<UC_UseCaseDemo>();
                foreach (var model in models)
                {
                    var entity = await _uC_UseCaseDemoService.GetByIdAsync(model.Id);
                    if (entity == null)
                        continue;

                    entity = _mapper.Map(model, entity);
                    entitys.Add(entity);
                }
                    await _uC_UseCaseDemoService.UpdateAsync(entitys);

                return new DataResponse<List<UC_UseCaseDemo>>() { Data = entitys, Status = true };
            }
            catch (Exception ex)
            {
                return new DataResponse<List<UC_UseCaseDemo>>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<UC_UseCaseDemoDto>> Get(Guid id)
        {
            try
            {
                var data = await _uC_UseCaseDemoService.GetDto(id);
                return new DataResponse<UC_UseCaseDemoDto>()
                {
                    Message = "Lấy thông tin thành công",
                    Data = data,
                    Status = true
                };
            }
            catch (Exception ex)
            {
                return new DataResponse<UC_UseCaseDemoDto>()
                {
                    Message = "Lỗi lấy thông tin",
                    Status = false,
                    Errors = new string[] { ex.Message }
                };
            }
        }

        [HttpPost("GetData", Name = "Xem danh sách UC_UseCaseDemo hệ thống")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<UC_UseCaseDemoDto>>> GetData([FromBody] UC_UseCaseDemoSearch search)
        {
            try
            {
                return new DataResponse<PagedList<UC_UseCaseDemoDto>>()
                {
                    Data = await _uC_UseCaseDemoService.GetData(search),
                    Message = "Lấy thông tin thành công",
                    Status = true
                };
            }
            catch (Exception ex)
            {
                return new DataResponse<PagedList<UC_UseCaseDemoDto>>()
                {
                    Message = "Lỗi lấy thông tin",
                    Status = false,
                    Errors = new string[] { ex.Message }
                };
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _uC_UseCaseDemoService.GetByIdAsync(id);
                if (entity == null)
                    return DataResponse.False("UC_UseCaseDemo không tồn tại");

                await _uC_UseCaseDemoService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa UC_UseCaseDemo với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }
    }
}
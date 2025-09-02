using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.NhomUseCaseService;
using Hinet.Service.NhomUseCaseService.Dto;
using Hinet.Service.NhomUseCaseService.ViewModels;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Api.Filter; 
using CommonHelper.Excel;
using Hinet.Web.Common;
using Hinet.Api.ViewModels.Import;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Api.Dto;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class NhomUseCaseController : HinetController
    {
        private readonly INhomUseCaseService _nhomUseCaseService;
        private readonly IMapper _mapper;
        private readonly ILogger<NhomUseCaseController> _logger; 
        ITaiLieuDinhKemService _taiLieuDinhKemService;
        public NhomUseCaseController(
            INhomUseCaseService NhomUseCaseService,
            IMapper mapper,
            ILogger<NhomUseCaseController> logger, 
             ITaiLieuDinhKemService taiLieuDinhKemService
            )
        {
            this._nhomUseCaseService = NhomUseCaseService;
            this._mapper = mapper;
            _logger = logger; 
            _taiLieuDinhKemService = taiLieuDinhKemService;
        }
        
        [HttpPost("Create")]
        public async Task<DataResponse<NhomUseCase>> Create([FromBody] NhomUseCaseCreateVM model)
        {	
			try
			{
				var entity = _mapper.Map<NhomUseCaseCreateVM, NhomUseCase>(model);
				await _nhomUseCaseService.CreateAsync(entity);
				return new DataResponse<NhomUseCase>() { Data = entity, Status = true };
			}catch (Exception ex){
				_logger.LogError(ex, "Lỗi khi tạo NhomUseCase");
				return new DataResponse<NhomUseCase>()
				{
					Data = null,
					Status = false,
					Message = "Đã xảy ra lỗi khi tạo dữ liệu."
				};
			}
        }



        [HttpPut("Update")]
        public async Task<DataResponse<NhomUseCase>> Update([FromBody] NhomUseCaseEditVM model)
        {
			try
			{
				var entity = await _nhomUseCaseService.GetByIdAsync(model.Id);
				if (entity == null)
					return DataResponse<NhomUseCase>.False("NhomUseCase không tồn tại");
				  
				entity = _mapper.Map(model, entity);
				await _nhomUseCaseService.UpdateAsync(entity);
				return new DataResponse<NhomUseCase>() { Data = entity, Status = true };
			} 
			catch (Exception ex)
			{
				_logger.LogError(ex, "Lỗi khi cập nhật NhomUseCase với Id: {Id}", model.Id);
				return new DataResponse<NhomUseCase>()
				{
					Data = null,
					Status = false,
					Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
				};
			}
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<NhomUseCaseDto>> Get(Guid id)
        {
            try
            {
                var item = await _nhomUseCaseService.GetDto(id);
                return item != null 
                    ? DataResponse<NhomUseCaseDto>.Success(item) 
                    : DataResponse<NhomUseCaseDto>.False("NhomUseCase không tồn tại");
            }
            catch (Exception ex)
            {
                return DataResponse<NhomUseCaseDto>.False("Đã xảy ra lỗi khi lấy dữ liệu NhomUseCase.", new[] {ex.Message});
            }
        }

        [HttpPost("GetData", Name = "Xem danh sách NhomUseCase hệ thống")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<NhomUseCaseDto>>> GetData([FromBody] NhomUseCaseSearch search)
        {
            try
            {
                var data = await _nhomUseCaseService.GetData(search);
                return DataResponse<PagedList<NhomUseCaseDto>>.Success(data);
            }
            catch (Exception ex)
            {
                return DataResponse<PagedList<NhomUseCaseDto>>.False("Đã xảy ra lỗi khi lấy dữ liệu NhomUseCase.", new[] {ex.Message});
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
			try
			{
				var entity = await _nhomUseCaseService.GetByIdAsync(id);
				await _nhomUseCaseService.DeleteAsync(entity);
				return DataResponse.Success(null);
			}
			catch (Exception ex)
			{
				_logger.LogError(ex, "Lỗi khi xóa NhomUseCase với Id: {Id}", id);
				return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
			}
        }

        

        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new NhomUseCaseSearch();
                var data = await _nhomUseCaseService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<NhomUseCaseDto>(data?.Items);
                if (string.IsNullOrEmpty(base64Excel))
                {
                    return DataResponse.False("Kết xuất thất bại hoặc dữ liệu trống");
                }
                return DataResponse.Success(base64Excel);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Kết xuất thất bại");
            }
        }

        [HttpGet("exportTemplateImport")]
        public async Task<DataResponse> ExportTemplateImport()
        {
            try
            {
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "NhomUseCase");
                if (string.IsNullOrEmpty(base64))
                {
                    return DataResponse.False("Kết xuất thất bại hoặc dữ liệu trống");
                }
                return DataResponse.Success(base64);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Kết xuất thất bại");
            }
        }

        [HttpGet("import")]
        public async Task<DataResponse> import()
        {
            try
            {
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                ExcelImportExtention.CreateExcelWithDisplayNames<NhomUseCase>(rootPath, "NhomUseCase");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<NhomUseCase>();
                return DataResponse.Success(columns);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Lấy dữ liệu màn hình import thất bại");
            }
        }

        [HttpPost("importExcel")]
        public async Task<DataResponse> ImportExcel([FromBody] DataImport data)
        {
            try
            {
                #region Config để import dữ liệu    
                var filePathQuery = await _taiLieuDinhKemService.GetPathFromId(data.IdFile);
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                string filePath = rootPath + filePathQuery;

                var importHelper = new ImportExcelHelperNetCore<NhomUseCase>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<NhomUseCase>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<NhomUseCase>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _nhomUseCaseService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<NhomUseCase>();


                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Import thất bại");
            }
        }
    }
}
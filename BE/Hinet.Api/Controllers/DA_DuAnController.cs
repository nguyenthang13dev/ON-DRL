using CommonHelper.Excel;
using CommonHelper.String;
using Hinet.Api.Dto;
using Hinet.Api.Filter;
using Hinet.Api.ViewModels.Import;
using Hinet.Model.Entities;
using Hinet.Repository.Common;
using Hinet.Service.Common;
using Hinet.Service.Constant;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DA_DuAnService;
using Hinet.Service.DA_DuAnService.Dto;
using Hinet.Service.DA_DuAnService.ViewModels;
using Hinet.Service.DA_KeHoachThucHienService;
using Hinet.Service.DA_PhanCongService;
using Hinet.Service.DA_PhanCongService.ViewModels;
using Hinet.Service.Dto;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Web.Common;
using Microsoft.AspNetCore.Mvc;


namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class DA_DuAnController : HinetController
    {
        private readonly IDA_DuAnService _dA_DuAnService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;
        private readonly IMapper _mapper;
        private readonly ILogger<DA_DuAnController> _logger;
        private readonly IUnitOfWorkRepository _unitOfWork;
        private readonly IDA_PhanCongService _dA_PhanCongService;
        private readonly IDA_KeHoachThucHienService _dA_KeHoachThucHienService;


        public DA_DuAnController(
            IDA_DuAnService dA_DuAnService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<DA_DuAnController> logger,
            IUnitOfWorkRepository unitOfWork,
            IDA_PhanCongService dA_PhanCongService,
            IDA_KeHoachThucHienService dA_KeHoachThucHienService)
        {
            this._dA_DuAnService = dA_DuAnService;
            this._taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _dA_PhanCongService = dA_PhanCongService;
            _dA_KeHoachThucHienService = dA_KeHoachThucHienService;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<DA_DuAn>> Create([FromBody] DA_DuAnCreateVM model)
        {
            if (!ModelState.IsValid)
            {
                return DataResponse<DA_DuAn>.False("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại các trường bắt buộc.");
            }

            try
            {
                _unitOfWork.CreateTransaction();
                var entity = _mapper.Map<DA_DuAnCreateVM, DA_DuAn>(model);
                await _dA_DuAnService.CreateAsync(entity);

                // Lưu phân công nếu có
                if (model.PhanCongList != null && model.PhanCongList.Count > 0)
                {
                    short count = 0;
                    foreach (var pc in model.PhanCongList)
                    {
                        count++;
                        var phanCongEntity = new DA_PhanCong();
                        phanCongEntity.OrderBy = (short)count;
                        phanCongEntity.DuAnId = entity.Id;
                        phanCongEntity.VaiTroId = pc.VaiTroId;
                        phanCongEntity.UserId = pc.UserId;
                        await _dA_PhanCongService.CreateAsync(phanCongEntity);
                    }
                }

                // Lưu danh sách kế hoạch thực hiện dự án nếu có
                if (model.KeHoachList != null && model.KeHoachList.Count > 0)
                {
                    foreach (var kh in model.KeHoachList)
                    {
                        var keHoachEntity = new DA_KeHoachThucHien
                        {
                            Id = Guid.NewGuid(),
                            DuAnId = entity.Id,
                            IsKeHoachNoiBo = kh.IsKeHoachNoiBo,
                            NgayBatDau = kh.NgayBatDau.ToUtc(),
                            NgayKetThuc = kh.NgayKetThuc.ToUtc(),
                            IsCanhBao = kh.IsCanhBao,
                            CanhBaoTruocNgay = kh.CanhBaoTruocNgay.GetValueOrDefault(0),
                            GroupNoiDungId = kh.GroupNoiDungId,
                            NoiDungCongViec = kh.NoiDungCongViec,
                            PhanCong = kh.PhanCong
                        };
                        await _dA_KeHoachThucHienService.CreateAsync(keHoachEntity);
                    }
                }
               await  _unitOfWork.Commit();
                return DataResponse<DA_DuAn>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo DA_DuAn");
             await   _unitOfWork.Dispose();  
                return DataResponse<DA_DuAn>.False("Đã xảy ra lỗi khi tạo dữ liệu.");
            }
        }



        [HttpPut("Update")]
        public async Task<DataResponse<DA_DuAn>> Update([FromBody] DA_DuAnEditVM model)
        {
            try
            {
                var entity = await _dA_DuAnService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<DA_DuAn>.False("DA_DuAn không tồn tại");

                if (!string.IsNullOrEmpty(model.ChuDauTu) && !string.IsNullOrEmpty(model.DiaDiemTrienKhai) && !string.IsNullOrEmpty(model.TenGoiThau))
                {
                    entity.ChuDauTu = model.ChuDauTu;
                    entity.TenGoiThau = model.TenGoiThau;
                    entity.DiaDiemTrienKhai = model.DiaDiemTrienKhai;
                    await _dA_DuAnService.UpdateAsync(entity);
                }
                else
                {


                    entity = _mapper.Map(model, entity);
                    await _dA_DuAnService.UpdateAsync(entity);


                    // Xử lý phân công
                    if (model.PhanCongList != null)
                    {
                        // Xóa hết phân công cũ của dự án
                        await _dA_PhanCongService.DeleteRange(x => x.DuAnId == entity.Id);

                        // Thêm lại các phân công mới
                        foreach (var pc in model.PhanCongList)
                        {
                            var phanCongEntity = _mapper.Map<DA_PhanCongCreateVM, DA_PhanCong>(pc);
                            phanCongEntity.DuAnId = entity.Id;
                            await _dA_PhanCongService.CreateAsync(phanCongEntity);
                        }
                    }
                }
                return DataResponse<DA_DuAn>.Success(entity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật DA_DuAn với Id: {Id}", model.Id);
                return new DataResponse<DA_DuAn>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }
        [HttpGet("Get/{id}")]
        public async Task<DataResponse<DA_DuAnDto>> Get(Guid id)
        {
            var dto = await _dA_DuAnService.GetDto(id);
            return DataResponse<DA_DuAnDto>.Success(dto);
        }

        [HttpGet("GetFormById/{id}")]
        public async Task<DataResponse<DA_DuAnEditVM>> GetFormById(Guid id)
        {
            var data = await _dA_DuAnService.GetForm(id);
            return DataResponse<DA_DuAnEditVM>.Success(data);
        }



        [HttpPost("GetData")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<DA_DuAnDto>>> GetData([FromBody] DA_DuAnSearch search)
        {
            if (search == null)
            {
                search = new DA_DuAnSearch();
            }
            if (!HasRole([VaiTroConstant.Admin, VaiTroConstant.TongGiamDoc]))
            {
                search.UserId = UserId;
            }
            var data = await _dA_DuAnService.GetData(search);
            return DataResponse<PagedList<DA_DuAnDto>>.Success(data);
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _dA_DuAnService.GetByIdAsync(id);
                await _dA_DuAnService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa DA_DuAn với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }

        [HttpGet("GetDropdowns")]
        public async Task<DataResponse<Dictionary<string, List<DropdownOption>>>> GetDropdowns(
            [FromQuery] string[] types)
        {
            var dropdown = new Dictionary<string, List<DropdownOption>>
            {
                { "SatusDuAn", ConstantExtension.GetDropdownOptions<DuAnStatusConstant>() },
            };

            return DataResponse<Dictionary<string, List<DropdownOption>>>.Success(dropdown);
        }

        //     [HttpGet("GetDropdowns")]
        //    public async Task<DataResponse<Dictionary<string, List<DropdownOption>>>> GetDropdowns(
        //    [FromQuery] string[] types)
        //        {
        //            var tuple = await _qLNhomNoiGuiService.GetDropdownOptions(x => x.Ten, x => x.Id);
        //            var dropdown = new Dictionary<string, List<DropdownOption>>
        //    {
        //        { "QLNhomNoiGui", tuple }
        //    };

        //    return DataResponse<Dictionary<string, List<DropdownOption>>>.Success(dropdown);
        //}


        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel()
        {
            try
            {
                var search = new DA_DuAnSearch();
                if (!HasRole([VaiTroConstant.Admin, VaiTroConstant.TongGiamDoc]))
                {
                    search.UserId = UserId;
                }
                var data = await _dA_DuAnService.GetData(search);
                var base64Excel = await ExportExcelHelperNetCore.Export<DA_DuAnDto>(data?.Items);
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

        [HttpGet("ExportTemplateImport")]
        public async Task<DataResponse<string>> ExportTemplateImport()
        {
            try
            {
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var base64 = ExcelImportExtention.ConvertToBase64(rootPath, "DA_DuAn");
                if (string.IsNullOrEmpty(base64))
                {
                    return DataResponse<string>.False("Kết xuất thất bại hoặc dữ liệu trống");
                }
                return DataResponse<string>.Success(base64);
            }
            catch (Exception)
            {
                return DataResponse<string>.False("Kết xuất thất bại");
            }
        }

        [HttpGet("Import")]
        public async Task<DataResponse> Import()
        {
            try
            {
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                ExcelImportExtention.CreateExcelWithDisplayNames<DA_DuAn>(rootPath, "DA_DuAn");
                var columns = ExcelImportExtention.GetColumnNamesWithOrder<DA_DuAn>();
                return DataResponse.Success(columns);
            }
            catch (Exception)
            {
                return DataResponse.False("Lấy dữ liệu màn hình import thất bại");
            }
        }

        [HttpPost("ImportExcel")]
        public async Task<DataResponse> ImportExcel([FromBody] DataImport data)
        {
            try
            {
                #region Config để import dữ liệu    
                var filePathQuery = await _taiLieuDinhKemService.GetPathFromId(data.IdFile);
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                string filePath = rootPath + filePathQuery;

                var importHelper = new ImportExcelHelperNetCore<DA_DuAn>();
                importHelper.PathTemplate = filePath;
                importHelper.StartCol = 1;
                importHelper.StartRow = 2;
                importHelper.ConfigColumn = new List<ConfigModule>();
                importHelper.ConfigColumn = ExcelImportExtention.GetConfigCol<DA_DuAn>(data.Collection);
                #endregion
                var rsl = importHelper.Import();

                var listImportReponse = new List<DA_DuAn>();
                if (rsl.ListTrue != null && rsl.ListTrue.Count > 0)
                {
                    listImportReponse.AddRange(rsl.ListTrue);
                    await _dA_DuAnService.CreateAsync(rsl.ListTrue);
                }

                var response = new ResponseImport<DA_DuAn>();


                response.ListTrue = listImportReponse;
                response.lstFalse = rsl.lstFalse;

                return DataResponse.Success(response);
            }
            catch (Exception)
            {
                return DataResponse.False("Import thất bại");
            }
        }

        
    }
}
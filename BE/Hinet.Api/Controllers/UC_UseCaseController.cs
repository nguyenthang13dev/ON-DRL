using Autofac.Features.Metadata;
using CommonHelper.Excel;
using DocumentFormat.OpenXml.Office2010.Excel;
using Hinet.Api.Dto;
using Hinet.Api.Filter;
using Hinet.Api.ViewModels.Import;
using Hinet.Model.Entities;
using Hinet.Repository.Common;
using Hinet.Repository.UC_TemplateTestCaseRepository;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DA_DuAnService;
using Hinet.Service.Dto;
using Hinet.Service.TacNhan_UseCaseService;
using Hinet.Service.TaiLieuDinhKemService;
using Hinet.Service.UC_MoTa_UseCaseService;
using Hinet.Service.UC_MoTa_UseCaseService.ViewModels;
using Hinet.Service.UC_UseCaseService;
using Hinet.Service.UC_UseCaseService.Dto;
using Hinet.Service.UC_UseCaseService.ViewModels;
using Hinet.Web.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class UC_UseCaseController : HinetController
    {
        private readonly IUC_UseCaseService _uC_UseCaseService;
        private readonly IMapper _mapper;
        private readonly IUnitOfWorkRepository _unitOfWork;
        private readonly ILogger<UC_UseCaseController> _logger;
        private readonly IDA_DuAnService _duAnService;
        private readonly IUC_MoTa_UseCaseService _uC_MoTa_UseCaseService;
        private readonly ITacNhan_UseCaseService _tacNhan_UseCaseService;
        private readonly IUC_TemplateTestCaseRepository _uC_TemplateTestCaseRepository;
        ITaiLieuDinhKemService _taiLieuDinhKemService;
        public UC_UseCaseController(
            IUC_UseCaseService UC_UseCaseService,
            IMapper mapper,
            ITacNhan_UseCaseService tacNhan_UseCaseService,
            IUnitOfWorkRepository unitOfWork,
            IDA_DuAnService duAnService,
            ILogger<UC_UseCaseController> logger,
            IUC_MoTa_UseCaseService uC_MoTa_UseCaseService,
            IUC_TemplateTestCaseRepository uC_TemplateTestCaseRepository,
             ITaiLieuDinhKemService taiLieuDinhKemService
            )
        {
            this._uC_UseCaseService = UC_UseCaseService;
            this._mapper = mapper;
            _unitOfWork = unitOfWork;
            _tacNhan_UseCaseService = tacNhan_UseCaseService;
            _duAnService = duAnService;
            _logger = logger;
            _uC_MoTa_UseCaseService = uC_MoTa_UseCaseService;
            _uC_TemplateTestCaseRepository = uC_TemplateTestCaseRepository;
            _taiLieuDinhKemService = taiLieuDinhKemService;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<UC_UseCase>> Create([FromBody] List<UC_UseCaseCreateVM> model)
        {
            try
            {
                var listUseCase = new List<UC_UseCase>();
                var listMoTaUseCase = new List<UC_MoTa_UseCase>();
                var templateUsecase = _uC_TemplateTestCaseRepository.GetQueryable();

                foreach (var item in model)
                {
                    #region Validate input
                    if (item.IdDuAn == Guid.Empty)
                        return DataResponse<UC_UseCase>.False("Dự án không được để trống");
                    var duAn = await _duAnService.GetByIdAsync(item.IdDuAn);
                    if (duAn == null)
                        return DataResponse<UC_UseCase>.False("Dự án không tồn tại");
                    if (string.IsNullOrEmpty(item.TenUseCase))

                        return DataResponse<UC_UseCase>.False("Tên Use Case không được để trống");
                    if (string.IsNullOrEmpty(item.TacNhanChinh))
                        return DataResponse<UC_UseCase>.False("Tác nhân chính không được để trống");
                    if (string.IsNullOrEmpty(item.DoPhucTap))
                        return DataResponse<UC_UseCase>.False("Độ phức tạp không được để trống");
                    if (item.lstMoTa == null || item.lstMoTa.Count == 0)
                        return DataResponse<UC_UseCase>.False("Danh sách mô tả không được để trống");
                    List<string> dsTacNhan = item.TacNhanChinh.Split(',').Select(x => x.Trim()).ToList();
                    if (dsTacNhan.Count == 0)
                        return DataResponse<UC_UseCase>.False("Tác nhân chính không được để trống");
                    List<string> dsTenTacNhan = await _tacNhan_UseCaseService.GetQueryable()
                        .Where(x =>  dsTacNhan.Contains(x.maTacNhan))
                        .Select(x => x.tenTacNhan)
                        .ToListAsync();
                    if (dsTenTacNhan.Count == 0)
                        return DataResponse<UC_UseCase>.False("Không tìm thấy tác nhân chính trong hệ thống");
                    if (dsTenTacNhan.Count != dsTacNhan.Count)
                        return DataResponse<UC_UseCase>.False("Có tác nhân chính không tồn tại trong hệ thống");
                    string tacNhanChinh = string.Join(", ", dsTenTacNhan);

                    var uc = new UC_UseCase()
                    {
                        Id = Guid.NewGuid(),
                        IdDuAn = item.IdDuAn,
                        TenUseCase = item.TenUseCase,
                        TacNhanChinh = tacNhanChinh,
                        DoPhucTap = item.DoPhucTap
                    };
                    listUseCase.Add(uc);
                    foreach (var moTa in item.lstMoTa)
                    {
                        if (string.IsNullOrEmpty(moTa))
                            return DataResponse<UC_UseCase>.False("Mô tả không được để trống");
                        if (moTa.Length > 500)
                            return DataResponse<UC_UseCase>.False("Mô tả không được vượt quá 500 ký tự");
                        if (moTa.Length < 10)
                            return DataResponse<UC_UseCase>.False("Mô tả phải có ít nhất 10 ký tự");
                        if (moTa.Contains("\n"))
                            return DataResponse<UC_UseCase>.False("Mô tả không được chứa ký tự xuống dòng");
                        if (moTa.Contains("\r"))
                            return DataResponse<UC_UseCase>.False("Mô tả không được chứa ký tự xuống dòng");
                        if (moTa.Contains("\t"))
                            return DataResponse<UC_UseCase>.False("Mô tả không được chứa ký tự tab");
                        if (moTa.Contains("<") || moTa.Contains(">") || moTa.Contains("&"))
                            return DataResponse<UC_UseCase>.False("Mô tả không được chứa ký tự đặc biệt như <, >, &");

                        var existingUC = await _uC_UseCaseService.GetQueryable()
                        .Where(x => x.TenUseCase == item.TenUseCase && x.IdDuAn == item.IdDuAn).ToListAsync();
                        await _uC_UseCaseService.DeleteAsync(existingUC);
                        foreach (var existing in existingUC)
                        {
                            var existingMoTa = await _uC_MoTa_UseCaseService.GetQueryable()
                                .Where(x => x.IdUseCase == existing.Id).ToListAsync();
                            if (existingMoTa.Count > 0)
                            {
                                await _uC_MoTa_UseCaseService.DeleteAsync(existingMoTa);
                            }
                        }

                        #endregion

                        // Tạo MoTaKiemThu từ template
                        var keyword = moTa?.Replace("  ", " ").Trim().ToLower();
                        var content = templateUsecase
                            .AsEnumerable()
                            .Select(x =>
                            {
                                var matchedKeyword = x.KeyWord?
                                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                                    .FirstOrDefault(kw => keyword?.Contains(kw) ?? false);

                                return new
                                {
                                    x.TemplateContent,
                                    MatchedKeyword = matchedKeyword
                                };
                            })
                            .FirstOrDefault(x => x.MatchedKeyword != null);

                        var moTaKiemThu = "";
                        if (content != null)
                        {
                            moTaKiemThu = content.TemplateContent
                                .Replace("{TacNhanChinh}", tacNhanChinh.Replace("  ", " ") ?? "")
                                .Replace("{TenUseCase}", item.TenUseCase ?? "")
                                .Replace("{TuKhoa}", content.MatchedKeyword ?? "");
                        }
                        else
                        {
                            // Nếu không có template khớp, sử dụng trực tiếp giá trị mô tả
                            moTaKiemThu = moTa;
                        }

                        var mtuc = new UC_MoTa_UseCase()
                        {
                            IdUseCase = uc.Id,
                            HanhDong = moTa,
                            MoTaKiemThu = moTaKiemThu
                        };
                        listMoTaUseCase.Add(mtuc);
                    }
                }
                if (listUseCase.Count == 0)
                    return DataResponse<UC_UseCase>.False("Không có Use Case nào để tạo");
                await _uC_UseCaseService.CreateAsync(listUseCase);
                if (listMoTaUseCase.Count > 0)
                    await _uC_MoTa_UseCaseService.CreateAsync(listMoTaUseCase);
                return new DataResponse<UC_UseCase>() { Data = null, Status = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo UC_UseCase");
                return new DataResponse<UC_UseCase>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi tạo dữ liệu."
                };
            }
        }

        [HttpPut("Update")]
        public async Task<DataResponse<UC_UseCase>> Update([FromBody] UC_UseCaseEditVM model)
        {
            try
            {
                var entity = await _uC_UseCaseService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<UC_UseCase>.False("UC_UseCase không tồn tại");

                entity = _mapper.Map(model, entity);
                await _uC_UseCaseService.UpdateAsync(entity);
                return new DataResponse<UC_UseCase>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi cập nhật UC_UseCase với Id: {Id}", model.Id);
                return new DataResponse<UC_UseCase>()
                {
                    Data = null,
                    Status = false,
                    Message = "Đã xảy ra lỗi khi cập nhật dữ liệu."
                };
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<UC_UseCaseDto>> Get(Guid id)
        {
            try
            {
                var item = await _uC_UseCaseService.GetDto(id);
                return DataResponse<UC_UseCaseDto>.Success(item);
            }
            catch (Exception ex)
            {

                return DataResponse<UC_UseCaseDto>.False("Không tìm thấy dữ liệu với Id: " + id, new[] { ex.Message });
            }
        }

        [HttpPost("GetData", Name = "Xem danh sách UC_UseCase hệ thống")]
        [ServiceFilter(typeof(LogActionFilter))]
        public async Task<DataResponse<PagedList<UC_UseCaseDto>>> GetData([FromBody] UC_UseCaseSearch search)
        {

            try
            {
                var data = await _uC_UseCaseService.GetData(search);
                return DataResponse<PagedList<UC_UseCaseDto>>.Success(data);
            }
            catch (Exception ex)
            {

                return DataResponse<PagedList<UC_UseCaseDto>>.False("Lỗi lấy danh sách dữ liệu", new[] { ex.Message });
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                //xoa ca mota usecase

                var entity = await _uC_UseCaseService.GetByIdAsync(id);
                if (entity != null)
                {
                    _unitOfWork.CreateTransaction();
                    var listMotaUsecase = _uC_MoTa_UseCaseService.GetQueryable().Where(x => x.IdUseCase == entity.Id).ToList();
                    _uC_MoTa_UseCaseService.DeleteRange(listMotaUsecase);
                    await _uC_UseCaseService.DeleteAsync(entity);
                    await _unitOfWork.Commit();
                }

                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollBack();
                await _unitOfWork.Dispose();
                _logger.LogError(ex, "Lỗi khi xóa UC_UseCase với Id: {Id}", id);
                return DataResponse.False("Đã xảy ra lỗi khi xóa dữ liệu.");
            }
        }


        [HttpPost("ReadExcel")]
        public async Task<DataResponse<ReadExcelResult>> ReadImportExcel(IFormFile fileTestCase, [FromQuery] Guid idDuAn)
        {
            try
            {
                if (fileTestCase == null || fileTestCase.Length == 0)
                {
                    return DataResponse<ReadExcelResult>.False("Không có tệp để nhập dữ liệu");
                }
                var result = await _uC_UseCaseService.ReadImportExcel(fileTestCase, idDuAn);
                return DataResponse<ReadExcelResult>.Success(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi nhập dữ liệu từ Excel");
                return DataResponse<ReadExcelResult>.False("Đã xảy ra lỗi khi nhập dữ liệu từ Excel", new[] { ex.Message });
            }
        }


        [HttpPost("ImportExcelSaveRange")]
        public async Task<DataResponse<List<UseCaseData2Level>>> saveRange(List<UseCaseData2Level> listdatatree, Guid DuAnId)
        {
            try
            {
                var res = await _uC_UseCaseService.SaveRange(listdatatree, DuAnId);
                return DataResponse<List<UseCaseData2Level>>.Success(listdatatree, "Save Thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + ex.StackTrace);
                return DataResponse<List<UseCaseData2Level>>.False("Lỗi hệ thống ");
            }
        }


        [HttpGet("GetDataintoUseCaseMota")]
        public async Task<DataResponse<List<UseCaseData2Level>>> GetDataIntoMotaUsecases([FromQuery] Guid DuAnId)
        {
            try
            {
                var data = await _uC_UseCaseService.GetDataIntoMotaUsecase(DuAnId);
                return DataResponse<List<UseCaseData2Level>>.Success(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy dữ liệu mô tả use case cho dự án với Id: {DuAnId}", DuAnId);
                return DataResponse<List<UseCaseData2Level>>.False("Lỗi lấy dữ liệu mô tả use case", new[] { ex.Message });
            }
        }

        [HttpPost("CreateUseCaseAndTestCase")]
        public async Task<DataResponse<UseCaseData2Level>> CreateUseCaseAndTestCase(UseCaseData2Level useCaseData2Level, Guid idDuAn)
        {
            try
            {
                if (idDuAn == null)
                {
                    return DataResponse<UseCaseData2Level>.False("Không tìm thấy Dự Án");
                }
                var result = await _uC_UseCaseService.createUseCaseAndTestcase(useCaseData2Level, idDuAn);
                return DataResponse<UseCaseData2Level>.Success(result, "Tạo Use Case và Test Case thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo Use Case và Test Case");
                return DataResponse<UseCaseData2Level>.False("Đã xảy ra lỗi khi tạo Use Case và Test Case", new[] { ex.Message });
            }
        }


        [HttpGet("ExportExcelUseCase")]
        public async Task<DataResponse> exportExcel(Guid duAnId)
        {
            try
            {
                var base64Excel = await _uC_UseCaseService.ExportExcel(duAnId);

                return DataResponse.Success(base64Excel, "export thanh cong");

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + ex.StackTrace);
                return DataResponse.False("Lỗi hệ thống .Vui lòng thử lại sau");
            }
        }



    }
}
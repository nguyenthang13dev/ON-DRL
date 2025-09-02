using Hinet.Model.Entities;
using Hinet.Repository.UC_UseCaseRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.UC_UseCaseService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;
using Hinet.Service.UC_MoTa_UseCaseService.ViewModels;
using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using Hinet.Repository.UC_TemplateTestCaseRepository;
using Hinet.Repository.Common;
using Hinet.Repository.UC_MoTa_UseCaseRepository;
using Hinet.Service.DA_NhatKyTrienKhaiService.ViewModels;
using OfficeOpenXml.Style;
using DocumentFormat.OpenXml.Office2010.Excel;
using Xceed.Drawing;
using DocumentFormat.OpenXml.Vml.Spreadsheet;

namespace Hinet.Service.UC_UseCaseService
{
    public class UC_UseCaseService : Service<UC_UseCase>, IUC_UseCaseService
    {
        private readonly IUC_UseCaseRepository uC_UseCaseRepository;
        private readonly IUC_TemplateTestCaseRepository _uC_TemplateTestCaseRepository;
        private readonly IUC_MoTa_UseCaseRepository _uC_MoTa_UseCaseRepository;
        private readonly IUnitOfWorkRepository _unitOfWork;

        public UC_UseCaseService(
            IUC_UseCaseRepository uC_UseCaseRepository,
            IUC_TemplateTestCaseRepository uC_TemplateTestCaseRepository,
            IUC_MoTa_UseCaseRepository uC_MoTa_UseCaseRepository,
            IUnitOfWorkRepository unitOfWork
            ) : base(uC_UseCaseRepository)
        {
            this.uC_UseCaseRepository = uC_UseCaseRepository;
            _uC_TemplateTestCaseRepository = uC_TemplateTestCaseRepository;
            _uC_MoTa_UseCaseRepository = uC_MoTa_UseCaseRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<UseCaseData2Level> createUseCaseAndTestcase(UseCaseData2Level useCaseData, Guid DuAnId)
        {
            try
            {
                _unitOfWork.CreateTransaction();
                var newUseCase = new UC_UseCase
                {
                    IdDuAn = DuAnId,
                    TenUseCase = useCaseData.TenUseCase,
                    TacNhanChinh = useCaseData.TacNhanChinh,
                    TacNhanPhu = useCaseData.TacNhanPhu,
                    DoCanThiet = useCaseData.DoCanThiet,
                    DoPhucTap = useCaseData.DoPhucTap,
                    ParentId = useCaseData.ParentId,
                    NhomId = useCaseData.NhomId,
                    MoTa = useCaseData.MoTa,

                };
                await CreateAsync(newUseCase);

                // Tạo MoTaKiemThu cho từng mô tả
                if (useCaseData.listUC_mota != null && useCaseData.listUC_mota.Any())
                {
                    foreach (var mota in useCaseData.listUC_mota)
                    {
                        mota.IdUseCase = newUseCase.Id;
                        mota.MoTaKiemThu = GenerateMoTaKiemThu(mota.HanhDong, useCaseData.TacNhanChinh, useCaseData.TenUseCase);
                    }
                    await _uC_MoTa_UseCaseRepository.InsertRange(useCaseData.listUC_mota);
                }

                await _unitOfWork.Commit();

                return useCaseData;
            }
            catch (Exception ex)
            {
                await _unitOfWork.RollBack();
                await _unitOfWork.Dispose();
                return new UseCaseData2Level();
            }
        }

        /// <summary>
        /// Tạo mô tả kiểm thử từ template dựa trên hành động, tác nhân và tên use case
        /// </summary>
        private string GenerateMoTaKiemThu(string hanhDong, string tacNhanChinh, string tenUseCase)
        {
            if (string.IsNullOrEmpty(hanhDong))
                return hanhDong;

            var templateUsecase = _uC_TemplateTestCaseRepository.GetQueryable();
            var keyword = hanhDong?.Trim().ToLower();

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

            if (content != null)
            {
                return content.TemplateContent
                    .Replace("{TacNhanChinh}", tacNhanChinh ?? "")
                    .Replace("{TenUseCase}", tenUseCase ?? "")
                    .Replace("{TuKhoa}", content.MatchedKeyword ?? "");
            }

            // Nếu không có template khớp, trả về hành động gốc
            return hanhDong;
        }

        public async Task<string> ExportExcel(Guid duAnId)
        {
            var query = from usecase in GetQueryable().Where(x => x.IdDuAn == duAnId)
                        join mota in _uC_MoTa_UseCaseRepository.GetQueryable()
                        on usecase.Id equals mota.IdUseCase
                        select new { usecase, mota };

            var grouped = await query
                .GroupBy(x => x.usecase)
                .Select(g => new UseCaseData2Level
                {
                    Id = g.Key.Id,
                    IdDuAn = g.Key.IdDuAn,
                    TenUseCase = g.Key.TenUseCase,
                    TacNhanChinh = g.Key.TacNhanChinh,
                    TacNhanPhu = g.Key.TacNhanPhu,
                    DoCanThiet = g.Key.DoCanThiet,
                    DoPhucTap = g.Key.DoPhucTap,
                    ParentId = g.Key.ParentId,
                    NhomId = g.Key.NhomId,
                    CreatedDate = g.Key.CreatedDate,
                    MoTa = g.Key.MoTa,
                    listUC_mota = g.Select(x => x.mota).ToList()
                }).OrderBy(x => x.CreatedDate).ToListAsync();

            try
            {
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                string templatePath = Path.Combine(rootPath, "UC_UseCase/Template", "TemplateEportUsecase.xlsx");


                if (!File.Exists(templatePath))
                {
                    // Ghi log lỗi nếu cần thiết
                    return "";
                }

                string namefile = $"ExportUsecase{Guid.NewGuid()}.xlsx";
                string urlfile = Path.Combine("UC_UseCase", namefile);
                string tempFilePath = Path.Combine(rootPath, "UC_UseCase", namefile);
                using (var package = new ExcelPackage(new FileInfo(templatePath)))
                {
                    var worksheet = package.Workbook.Worksheets[0]; // Lấy sheet đầu tiên


                    int row = 2;
                    int tt = 1;
                    int totalsimple = 0, totalmedium = 0, totalcomplex = 0, totalTransaction = 0;

                    foreach (var item in grouped)
                    {
                        worksheet.Cells[row, 1, row, 8].Style.Font.Name = "Times New Roman";
                        worksheet.Cells[row, 1, row, 8].Style.Font.Size = 12;
                        var range = worksheet.Cells[row, 1, row, 8];
                        range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        //range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;



                        var groupRange = worksheet.Cells[row, 1, row, 7];
                        groupRange.Style.Font.Bold = true;
                        groupRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        groupRange.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightGray);

                        worksheet.Cells[row, 1].Value = tt++;
                        worksheet.Cells[row, 2].Value = item.TenUseCase;
                        worksheet.Cells[row, 3].Value = item.TacNhanChinh;
                        worksheet.Cells[row, 4].Value = item.TacNhanPhu;
                        worksheet.Cells[row, 5].Value = item.DoCanThiet;
                        worksheet.Cells[row, 6].Value = item.DoPhucTap;
                        worksheet.Cells[row, 7].Value = Constant.UseCase.UseCaseComplex.MotaUseCase;
                        worksheet.Cells[row, 8].Value = item.MoTa;

                        int simpleCount = item.DoPhucTap?.ToLower().Trim() == Constant.UseCase.UseCaseComplex.DonGian.ToLower() ? 1 : 0;
                        int mediumCount = item.DoPhucTap?.ToLower().Trim() == Constant.UseCase.UseCaseComplex.TrungBinh.ToLower() ? 1 : 0;
                        int complexCount = item.DoPhucTap?.ToLower().Trim() == Constant.UseCase.UseCaseComplex.PhucTap.ToLower() ? 1 : 0;
                        int transactionCount = item.listUC_mota.Count;

                        totalsimple += simpleCount;
                        totalmedium += mediumCount;
                        totalcomplex += complexCount;
                        totalTransaction += transactionCount;

                        //worksheet.Cells[row, 9].Value = transactionCount;
                        //worksheet.Cells[row, 10].Value = simpleCount;
                        //worksheet.Cells[row, 11].Value = mediumCount;
                        //worksheet.Cells[row, 12].Value = complexCount;
                        worksheet.Cells[row, 7].Style.WrapText = true;
                        worksheet.Cells[row, 8].Style.WrapText = true;
                        worksheet.Cells[row, 2].Style.WrapText = true;
                        worksheet.Cells[row, 3].Style.WrapText = true;
                        worksheet.Row(row).CustomHeight = false;
                        row++;

                        if (item.listUC_mota != null && item.listUC_mota.Any())
                        {


                            totalTransaction += item.listUC_mota.Count;
                            foreach (var mota in item.listUC_mota)
                            {
                                worksheet.Cells[row, 1, row, 12].Style.Font.Name = "Times New Roman";
                                worksheet.Cells[row, 1, row, 12].Style.Font.Size = 12;
                                worksheet.Cells[row, 7].Value = mota.HanhDong;
                                worksheet.Cells[row, 8].Value = mota.MoTaKiemThu;
                                worksheet.Cells[row, 7].Style.WrapText = true;
                                worksheet.Cells[row, 8].Style.WrapText = true;
                                worksheet.Row(row).CustomHeight = false;
                                var rangchild = worksheet.Cells[row, 1, row, 8];
                                rangchild.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                                rangchild.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                                rangchild.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                                rangchild.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                                worksheet.Cells[row, 7].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                //worksheet.Cells[row, 7].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                row++;
                            }
                        }

                    }
                    //worksheet.Cells[2, 9].Value = totalTransaction;
                    //worksheet.Cells[2, 10].Value = totalsimple;
                    //worksheet.Cells[2, 11].Value = totalmedium;
                    //worksheet.Cells[2, 12].Value = totalcomplex;

                    await File.WriteAllBytesAsync(tempFilePath, package.GetAsByteArray());
                    return urlfile;
                }
            }
            catch (Exception ex)
            {
                // Ghi log lỗi nếu cần thiết
                return ex.Message;
            }
        }

        public async Task<PagedList<UC_UseCaseDto>> GetData(UC_UseCaseSearch search)
        {
            var query = from q in GetQueryable()
                        select new UC_UseCaseDto()
                        {
                            IdDuAn = q.IdDuAn,
                            TenUseCase = q.TenUseCase,
                            TacNhanChinh = q.TacNhanChinh,
                            TacNhanPhu = q.TacNhanPhu,
                            DoCanThiet = q.DoCanThiet,
                            DoPhucTap = q.DoPhucTap,
                            ParentId = q.ParentId,
                            CreatedDate = q.CreatedDate,
                        };
            if (search != null)
            {

            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<UC_UseCaseDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<List<UseCaseData2Level>> GetDataIntoMotaUsecase(Guid DuAnId)
        {
            var query = from usecase in GetQueryable().Where(x => x.IdDuAn == DuAnId)
                        join mota in _uC_MoTa_UseCaseRepository.GetQueryable()
                        on usecase.Id equals mota.IdUseCase into motaGroup
                        from mota in motaGroup.DefaultIfEmpty()
                        select new { usecase, mota };

            var grouped = await query
                .GroupBy(x => x.usecase)
                .Select(g => new UseCaseData2Level
                {
                    Id = g.Key.Id,
                    IdDuAn = g.Key.IdDuAn,
                    TenUseCase = g.Key.TenUseCase,
                    TacNhanChinh = g.Key.TacNhanChinh,
                    TacNhanPhu = g.Key.TacNhanPhu,
                    DoCanThiet = g.Key.DoCanThiet,
                    DoPhucTap = g.Key.DoPhucTap,
                    ParentId = g.Key.ParentId,
                    NhomId = g.Key.NhomId,
                    CreatedDate = g.Key.CreatedDate,
                    MoTa = g.Key.MoTa,
                    listUC_mota = g.Select(x => x.mota).ToList()
                }).OrderBy(x => x.CreatedDate).ToListAsync();

            return grouped;
        }


        public async Task<UC_UseCaseDto> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)
                              select new UC_UseCaseDto()
                              {
                                  IdDuAn = q.IdDuAn,
                                  TenUseCase = q.TenUseCase,
                                  TacNhanChinh = q.TacNhanChinh,
                                  TacNhanPhu = q.TacNhanPhu,
                                  DoCanThiet = q.DoCanThiet,
                                  DoPhucTap = q.DoPhucTap,
                                  ParentId = q.ParentId,
                              }).FirstOrDefaultAsync();
            return item;
        }


        public async Task<ReadExcelResult> ReadImportExcel(IFormFile fileTestCase, Guid idDuAn)
        {
            var result = new ReadExcelResult();
            var useCases = new List<UseCaseReadExcel>();
            UseCaseReadExcel currentParent = null;
            var templateUsecase = _uC_TemplateTestCaseRepository.GetQueryable();

            using (var package = new ExcelPackage(fileTestCase.OpenReadStream()))
            {
                var worksheet = package.Workbook.Worksheets[0];
                int rowCount = worksheet.Dimension.Rows;

                for (int row = 3; row <= rowCount; row++) // Bỏ qua header
                {
                    var errors = new List<string>();
                    bool isParent = !string.IsNullOrEmpty(worksheet.Cells[row, 1].Text);
                    bool hasMoTa = !string.IsNullOrEmpty(worksheet.Cells[row, 7].Text);

                    var moTadata = worksheet.Cells[row, 7].Text;
                    var keyword = moTadata?.Trim().ToLower();

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

                    // Lấy giá trị từ currentParent nếu là dòng con
                    var tacNhanChinh = isParent ? worksheet.Cells[row, 3].Value?.ToString().Trim() : currentParent?.TacNhanChinh;
                    var tenUseCase = isParent ? worksheet.Cells[row, 2].Value?.ToString().Trim() : currentParent?.TenUseCase;

                    // Kiểm tra giá trị không được null hoặc rỗng
                    if (string.IsNullOrEmpty(tacNhanChinh))
                    {
                        errors.Add($"Dòng {row}: Tác nhân chính không được để trống");
                    }
                    if (string.IsNullOrEmpty(tenUseCase))
                    {
                        errors.Add($"Dòng {row}: Tên trường hợp sử dụng không được để trống");
                    }

                    var filledContent = "";
                    if (content != null)
                    {
                        var normalizedTemplate = content.TemplateContent.Normalize();
                        filledContent = content.TemplateContent
                            .Replace("{TacNhanChinh}", tacNhanChinh ?? "")
                            .Replace("{TenUseCase}", tenUseCase ?? "")
                            .Replace("{TuKhoa}", content.MatchedKeyword ?? "");
                    }
                    else
                    {
                        // Nếu không có template khớp, sử dụng trực tiếp giá trị từ cột 7
                        filledContent = moTadata;
                    }

                    if (isParent)
                    {
                        currentParent = new UseCaseReadExcel
                        {
                            Id = Guid.NewGuid(),
                            IdDuAn = idDuAn == default ? Guid.Empty : idDuAn,
                            TenUseCase = worksheet.Cells[row, 2].Text,
                            TacNhanChinh = worksheet.Cells[row, 3].Text,
                            TacNhanPhu = worksheet.Cells[row, 4].Text,
                            DoCanThiet = worksheet.Cells[row, 5].Text,
                            DoPhucTap = worksheet.Cells[row, 6].Text,
                            ParentId = null,
                            RowIndex = row,
                            MoTa = filledContent,
                            Errors = errors
                        };

                        if (string.IsNullOrEmpty(currentParent.TenUseCase))
                            errors.Add($"Dòng {row}: Tên trường hợp sử dụng không được để trống");
                        if (string.IsNullOrEmpty(currentParent.DoPhucTap))
                            errors.Add($"Dòng {row}: Độ phức tạp không được để trống");

                        useCases.Add(currentParent);

                        if (currentParent.IsValid)
                            result.SoLuongThanhCong++;
                        else
                            result.SoLuongThatBai++;
                    }
                    else if (hasMoTa && currentParent != null)
                    {
                        var moTa = new UC_MoTa_UseCase
                        {
                            Id = Guid.NewGuid(),
                            IdUseCase = currentParent.Id,
                            HanhDong = worksheet.Cells[row, 7].Text,
                            MoTaKiemThu = filledContent // Gán MoTaKiemThu từ filledContent
                        };

                        if (string.IsNullOrEmpty(moTa.HanhDong))
                            errors.Add($"Dòng {row}: Hành động không được để trống");

                        currentParent.listUC_mota.Add(moTa);

                        if (errors.Count == 0)
                            result.SoLuongThanhCong++;
                        else
                        {
                            currentParent.Errors.AddRange(errors);
                            result.SoLuongThatBai++;
                        }
                    }
                    else
                    {
                        // Handle invalid row (neither parent nor valid child)
                        result.SoLuongThatBai++;
                        var invalidRow = new UseCaseReadExcel
                        {
                            Id = Guid.NewGuid(),
                            IdDuAn = idDuAn == default ? Guid.Empty : idDuAn,
                            RowIndex = row,
                            Errors = errors
                        };

                        if (!isParent && currentParent == null)
                            errors.Add($"Dòng {row}: Không có parent hợp lệ cho dòng con");
                        if (!hasMoTa)
                            errors.Add($"Dòng {row}: Mô tả không được để trống cho dòng con");

                        useCases.Add(invalidRow);
                    }
                }
            }

            result.Data = useCases;
            return result;
        }

        public async Task<List<UseCaseData2Level>> SaveRange(List<UseCaseData2Level> listdatatree, Guid DuAnId)
        {
            var listdata = new List<UseCaseData2Level>();
            if (DuAnId == Guid.Empty)
                return listdata;

            using var transaction = _unitOfWork.CreateTransaction();

            try
            {
                // Lấy toàn bộ dữ liệu hiện tại của dự án
                var usecases = GetQueryable().Where(x => x.IdDuAn == DuAnId).ToList();

                // Lấy danh sách ID để xoá mô tả liên quan
                var usecaseIds = usecases.Select(x => x.Id).ToList();

                // Lấy mô tả liên quan
                var moTaList = _uC_MoTa_UseCaseRepository
                                .GetQueryable()
                                .Where(x => usecaseIds.Contains(x.IdUseCase))
                                .ToList();

                // Xoá mô tả và usecase
                _uC_MoTa_UseCaseRepository.DeleteRange(moTaList);
                DeleteRange(usecases);

                // Lưu mới lại dữ liệu từ listdatatree
                foreach (var item in listdatatree)
                {
                    var newUseCase = new UC_UseCase
                    {

                        IdDuAn = DuAnId,
                        TenUseCase = item.TenUseCase,
                        TacNhanChinh = item.TacNhanChinh,
                        TacNhanPhu = item.TacNhanPhu,
                        DoCanThiet = item.DoCanThiet,
                        DoPhucTap = item.DoPhucTap,
                        ParentId = item.ParentId,
                        NhomId = item.NhomId,
                        MoTa = item.MoTa,

                    };
                    await CreateAsync(newUseCase);

                    if (item.listUC_mota != null && item.listUC_mota.Any())
                    {
                        foreach (var mota in item.listUC_mota)
                        {
                            mota.Id = Guid.NewGuid();
                            mota.IdUseCase = newUseCase.Id;
                            // Tạo MoTaKiemThu từ template
                            mota.MoTaKiemThu = GenerateMoTaKiemThu(mota.HanhDong, item.TacNhanChinh, item.TenUseCase);
                            _uC_MoTa_UseCaseRepository.Add(mota);
                        }
                    }

                    listdata.Add(new UseCaseData2Level
                    {
                        IdDuAn = DuAnId,
                        TenUseCase = item.TenUseCase,
                        TacNhanChinh = item.TacNhanChinh,
                        TacNhanPhu = item.TacNhanPhu,
                        DoCanThiet = item.DoCanThiet,
                        DoPhucTap = item.DoPhucTap,
                        ParentId = item.ParentId,
                        NhomId = item.NhomId,
                        MoTa = item.MoTa,
                        listUC_mota = item.listUC_mota
                    });
                }

                await _unitOfWork.Commit();
                return listdata;
            }
            catch (Exception)
            {
                _unitOfWork.Dispose();
                throw;
            }

            return listdata;
        }

    }
}

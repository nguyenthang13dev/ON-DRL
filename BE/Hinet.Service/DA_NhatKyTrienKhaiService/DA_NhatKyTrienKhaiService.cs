using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Hinet.Extensions;
using Hinet.Model.Entities.DuAn;
using Hinet.Repository;
using Hinet.Repository.DA_DuAnRepository;
using Hinet.Repository.DA_KeHoachThucHienRepository;
using Hinet.Repository.DA_NhatKyTrienKhaiRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Constant.DuAn;
using Hinet.Service.DA_KeHoachThucHienService.ViewModels;
using Hinet.Service.DA_NhatKyTrienKhaiService.Dto;
using Hinet.Service.DA_NhatKyTrienKhaiService.ViewModels;
using Hinet.Service.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.Office.Interop.Word;
using MongoDB.Driver.Linq;
using OfficeOpenXml;
using SharpCompress.Common;
using Xceed.Words.NET;
using static System.Runtime.InteropServices.JavaScript.JSType;
using MSDocument = Microsoft.Office.Interop.Word.Document;
using MSWordApp = Microsoft.Office.Interop.Word.Application;

namespace Hinet.Service.DA_NhatKyTrienKhaiService
{
    public class DA_NhatKyTrienKhaiService : Service<DA_NhatKyTrienKhai>, IDA_NhatKyTrienKhaiService
    {
        private readonly IDA_NhatKyTrienKhaiRepository _repository;
        private readonly IDA_KeHoachThucHienRepository _dA_KeHoachThucHienRepository;
        private readonly IDA_DuAnRepository _dA_DuAnRepository;

        public DA_NhatKyTrienKhaiService(IDA_NhatKyTrienKhaiRepository repository,
            IDA_KeHoachThucHienRepository dA_KeHoachThucHienRepository,
            IDA_DuAnRepository dA_DuAnRepository) : base(repository)
        {
            _repository = repository;
            _dA_KeHoachThucHienRepository = dA_KeHoachThucHienRepository;
            _dA_DuAnRepository = dA_DuAnRepository;
        }

        public async Task<DA_NhatKyTrienKhaiReponseImportExcel> ReadNhatKyTrienKhai(IFormFile fileNhatKyTrienKhai, Guid idDuAn)
        {
            var result = new DA_NhatKyTrienKhaiReponseImportExcel();

            try
            {
                using (var package = new ExcelPackage(fileNhatKyTrienKhai.OpenReadStream()))
                {
                    var worksheet = package.Workbook.Worksheets[0];
                    var rowCount = worksheet.Dimension.Rows;

                    for (int row = 2; row <= rowCount; row++)
                    {
                        var item = new DA_NhatKyTrienKhaiImportItemDto { RowIndex = row };

                        try
                        {
                            var hangMucCell = worksheet.Cells[row, 2];
                            var noiDungCell = worksheet.Cells[row, 3];
                            var dateRangeCell = worksheet.Cells[row, 4];


                            var phanCong = worksheet.Cells[row, 5].Text?.Trim();
                            string hangMuc = hangMucCell.Text?.Trim();
                            string noiDung = noiDungCell.Text?.Trim();
                            string dateRange = dateRangeCell.Text?.Trim();

                            if (string.IsNullOrWhiteSpace(hangMuc))
                                item.Errors.Add($"Thiếu Hạng mục công việc (Cột {GetExcelColumnName(hangMucCell.Start.Column)})");

                            if (string.IsNullOrWhiteSpace(noiDung))
                                item.Errors.Add($"Thiếu Nội dung thực hiện (Cột {GetExcelColumnName(noiDungCell.Start.Column)})");

                            if (string.IsNullOrWhiteSpace(dateRange))
                                item.Errors.Add($"Thiếu ngày bắt đầu - kết thúc (Cột {GetExcelColumnName(dateRangeCell.Start.Column)})");

                            var (ngayBatDau, ngayKetThuc) = ParseDateRange(dateRange);

                            if (!ngayBatDau.HasValue)
                                item.Errors.Add($"Ngày bắt đầu không hợp lệ (Cột {GetExcelColumnName(dateRangeCell.Start.Column)})");

                            if (!ngayKetThuc.HasValue)
                                item.Errors.Add($"Ngày kết thúc không hợp lệ (Cột {GetExcelColumnName(dateRangeCell.Start.Column)})");

                            item.Data = new DA_NhatKyTrienKhai
                            {
                                DuAnId = idDuAn,
                                HangMucCongViec = hangMuc,
                                NoiDungThucHien = noiDung,
                                NgayBatDau = ngayBatDau,
                                NgayKetThuc = ngayKetThuc,
                                PhanCong = phanCong,
                            };

                            if (item.IsValid)
                                result.SoLuongThanhCong++;
                            else
                                result.SoLuongThatBai++;

                            result.listDA_NhatKyTrienKhai.Add(item);


                        }
                        catch (Exception exRow)
                        {
                            item.Errors.Add($"Lỗi xử lý dòng: {exRow.Message}");
                            result.SoLuongThatBai++;
                            result.listDA_NhatKyTrienKhai.Add(item);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return new DA_NhatKyTrienKhaiReponseImportExcel
                {
                    listDA_NhatKyTrienKhai = new List<DA_NhatKyTrienKhaiImportItemDto>
            {
                new DA_NhatKyTrienKhaiImportItemDto
                {
                    RowIndex = 0,
                    Errors = new List<string> { "Lỗi tổng khi xử lý file: " + ex.Message }
                }
            },
                    SoLuongThanhCong = 0,
                    SoLuongThatBai = 1
                };
            }

            return result;
        }

        public Task<List<DA_NhatKyTrienKhai>> CreateRangeTrienKhai(List<DA_NhatKyTrienKhai> listdA_NhatKyTrienKhais)
        {
            throw new NotImplementedException();
        }


        public async Task<PagedList<DA_NhatKyTrienKhaiDto>> GetData(DA_NhatKyTrienKhaiSearchVM search)
        {
            var query = _repository.GetQueryable()
                 .Where(x => x.DuAnId == search.DuAnId)
                 .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search.HangMucCongViec))
            {
                query = query.Where(x => x.HangMucCongViec.Contains(search.HangMucCongViec));
            }
            if (search.NgayBatDau.HasValue)
            {
                query = query.Where(x => x.NgayBatDau >= search.NgayBatDau.Value);
            }
            if (search.NgayKetThuc.HasValue)
            {
                query = query.Where(x => x.NgayKetThuc <= search.NgayKetThuc.Value);
            }
            if (!string.IsNullOrEmpty(search.NoiDungThucHien))
            {
                query = query.Where(x => x.NoiDungThucHien.Contains(search.NoiDungThucHien));

            }
            if (!string.IsNullOrEmpty(search.PhanCong))
            {
                query = query.Where(x => x.PhanCong.Contains(search.PhanCong));
            }
            if (search.PageIndex <= 0)
            {
                search.PageIndex = 1;
            }
            if (search.PageSize <= 0)
            {
                search.PageSize = 20; // Default page size
            }
            var dataqueryTest = query.ToList();
            var queryDuAnDto = from q in query
                               select new DA_NhatKyTrienKhaiDto()
                               {
                                   Id = q.Id,
                                   DuAnId = q.DuAnId,
                                   HangMucCongViec = q.HangMucCongViec,
                                   NoiDungThucHien = q.NoiDungThucHien,
                                   NgayBatDau = q.NgayBatDau,
                                   NgayKetThuc = q.NgayKetThuc,
                                   PhanCong = q.PhanCong,
                                   CreatedBy = q.CreatedBy,
                                   CreatedDate = q.CreatedDate,
                                   UpdatedBy = q.UpdatedBy,
                                   UpdatedDate = q.UpdatedDate,
                                   IsDelete = q.IsDelete
                               };
            var queryDuAnDtoWithPaging = queryDuAnDto
                .OrderBy(x => x.CreatedDate)
                .Skip((search.PageIndex - 1) * search.PageSize)
                .Take(search.PageSize);

            var pageList = await PagedList<DA_NhatKyTrienKhaiDto>.CreateAsync(queryDuAnDtoWithPaging, search);

            return pageList;
        }



        public async Task<UrlFilePath> ExportWordNhatKyTrienKhai(Guid duAnId, string tableTitle = "phanCong")
        {
            // 1. Lấy dữ liệu và chuyển đổi (Tối ưu truy vấn)
            // Tối ưu hóa: Select chỉ các trường cần thiết ngay trong truy vấn để giảm tải dữ liệu
            var resdata = (from nhatkytrienkhai in _repository.GetQueryable()
                           join duan in _dA_DuAnRepository.GetQueryable()
                           on nhatkytrienkhai.DuAnId equals duan.Id
                           where nhatkytrienkhai.DuAnId == duAnId
                           orderby nhatkytrienkhai.CreatedDate
                           select new DA_NhatKyTrienKhaiEportWord
                           {
                               // Chỉ chọn các trường cần thiết cho việc xuất Word
                               Id = nhatkytrienkhai.Id,
                               HangMucCongViec = nhatkytrienkhai.HangMucCongViec,
                               NoiDungThucHien = nhatkytrienkhai.NoiDungThucHien,
                               NgayBatDau = nhatkytrienkhai.NgayBatDau,
                               NgayKetThuc = nhatkytrienkhai.NgayKetThuc,
                               PhanCong = nhatkytrienkhai.PhanCong,
                               TenDuAnText = duan.TenDuAn ?? "Chưa xác định",
                               ChuDauTu = duan.ChuDauTu ?? "Chưa xác định",
                               DiaDiemTrienKhai = duan.DiaDiemTrienKhai ?? "Chưa xác định",
                               TenGoiThau = duan.TenGoiThau ?? "Chưa xác định",
                           }).ToList();

            if (resdata == null || resdata.Count == 0)
            {
                return new UrlFilePath { };
            }

            // Lấy dữ liệu cho placeholder (phần tử đầu tiên)
            var firstEntry = resdata.First();

            // 2. Định nghĩa đường dẫn và tạo tệp tạm
            string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            string templatePath = Path.Combine(rootPath, "DA_NhatKyTrienKhai/Template", "NhatKyCongTacTrienKhaiTemplate.docx");

            if (!File.Exists(templatePath))
            {
                // Ghi log lỗi nếu cần thiết
                return new UrlFilePath { };
            }

            string namefile = $"NhatKyTrienKhai_{Guid.NewGuid()}_temp.docx";
            string urlfile = Path.Combine("DA_NhatKyTrienKhai", namefile);
            string tempFilePath = Path.Combine(rootPath, "DA_NhatKyTrienKhai", namefile);

            File.Copy(templatePath, tempFilePath);

            // 3. Thao tác với Word bằng DocX (Tối ưu hóa)
            // Loại bỏ hoàn toàn Microsoft.Office.Interop.Word để tăng hiệu suất và độ ổn định.
            try
            {
                using (DocX docX = DocX.Load(tempFilePath))
                {
                    // Điền dữ liệu vào các placeholder (DocX)
                    docX.ReplaceText("{{ThoiGianChuanBi}}",
                    $"{firstEntry.NgayBatDau?.ToString("dd/MM/yyyy")} - {firstEntry.NgayKetThuc?.ToString("dd/MM/yyyy")}");
                    docX.ReplaceText("{{NhiemVuChuanBi}}", firstEntry.HangMucCongViec ?? "Chưa xác định");
                    docX.ReplaceText("{{CongViecChuanBi}}", firstEntry.NoiDungThucHien ?? "Chưa xác định");
                    docX.ReplaceText("{{NhanSuChuanBi}}", firstEntry.PhanCong ?? "Chưa xác định");
                    docX.ReplaceText("{{TenGoiThau}}", firstEntry.TenGoiThau);
                    docX.ReplaceText("{{TenDuAn}}", firstEntry.TenDuAnText);
                    docX.ReplaceText("{{DiaDiemTrienKhai}}", firstEntry.DiaDiemTrienKhai);
                    docX.ReplaceText("{{ChuDauTu}}", firstEntry.ChuDauTu);

                    // 4. Thao tác với bảng bằng DocX

                    // Tìm bảng trong tài liệu
                    var tables = docX.Tables;
                    if (tables.Count > 0)
                    {
                        // Giả sử bảng cần thao tác là bảng đầu tiên hoặc dựa trên một logic cụ thể
                        // Nếu mẫu của bạn có nhiều bảng, bạn cần tìm bảng theo tiêu đề hoặc vị trí.
                        // DocX không hỗ trợ tìm kiếm bảng theo Title như Interop, thường bạn sẽ dùng chỉ mục hoặc tìm theo nội dung/heading gần đó.

                        // Lấy bảng đầu tiên (ví dụ)
                        var table = tables[2];
                        var res = table.ColumnCount;

                        // Lặp qua dữ liệu từ phần tử thứ 2 (bỏ qua phần tử đầu tiên đã dùng cho placeholder)
                        int stt = 1;
                        // Sử dụng Skip(1) để bỏ qua phần tử đầu tiên
                        foreach (var item in resdata.Skip(1))
                        {
                            // Chèn một hàng mới vào bảng
                            var newRow = table.InsertRow();

                            // Điền dữ liệu vào các cột (chỉ mục bắt đầu từ 0 trong DocX, không phải 1 như Interop)

                            // Cột 0: STT
                            newRow.Cells[0].Paragraphs.First().Append(stt.ToString()).Bold();

                            // Cột 1: Thời gian
                            newRow.Cells[1].Paragraphs.First().Append($"{item.NgayBatDau?.ToString("dd/MM/yyyy")} - {item.NgayKetThuc?.ToString("dd/MM/yyyy")}");

                            // Cột 2: Nội dung công việc (Bạn cần thêm logic để chèn đoạn văn bản với định dạng)
                            var contentCell = newRow.Cells[2].Paragraphs.First();

                            // Vì DocX không có chức năng InsertFormattedParagraph sẵn như Interop, 
                            // bạn cần AppendText() và áp dụng định dạng nếu cần.
                            contentCell.Alignment = Xceed.Document.NET.Alignment.left;
                            contentCell.Append($"1. {item.HangMucCongViec}").Bold();
                            contentCell.AppendLine("");
                            contentCell.AppendLine("Nhân sự dự án:").Bold();
                            contentCell.AppendLine("");
                            contentCell.Append(item.PhanCong);
                            contentCell.AppendLine("Công việc thực hiện:").Bold();
                            contentCell.AppendLine("");
                            contentCell.Append(item.NoiDungThucHien);
                            contentCell.AppendLine("");
                            contentCell.AppendLine("2. Xác nhận kết quả kiểm thử, vận hành thử đối với công việc được hoàn thành:\n").Bold();
                            contentCell.Append("Không có\n");
                            // ... Thêm các đoạn khác tương tự ...

                            // Cột 3: Ý kiến của Giám sát thi công
                            newRow.Cells[3].Paragraphs.First().Append("Ý kiến của Giám sát thi công:");

                            stt++;
                        }
                    }

                    // Lưu tài liệu sau khi hoàn thành
                    docX.Save();
                }

                // Trả về đường dẫn file đã xuất
                return new UrlFilePath
                {
                    tenFile = namefile,
                    urlFile = urlfile
                };
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và xóa tệp tạm nếu có lỗi trong quá trình tạo
                if (File.Exists(tempFilePath))
                {
                    File.Delete(tempFilePath);
                }
                // Ghi log lỗi
                return new UrlFilePath { };
            }
        }

        public async Task<UrlFilePath> ExportWordNhatKyTrienKhaiTuKeHoachThucHien(Guid duAnId, bool isDay)
        {
         
            var data = _dA_KeHoachThucHienRepository.GetQueryable()
            .Where(x => x.DuAnId == duAnId && !string.IsNullOrEmpty(x.NoiDungCongViec) && x.IsKeHoachNoiBo == false)
            .OrderBy(x => x.CreatedDate)
            .ToList();

            var duAnDict = _dA_DuAnRepository.GetQueryable()
                .Where(x => x.Id == duAnId)
                .ToDictionary(x => x.Id, x => x); // Cache lại để tránh join

            var parents = data.Where(x => x.GroupNoiDungId == null).ToList();
            var firstParentWithChildren = parents.FirstOrDefault(p => data.Any(x => x.GroupNoiDungId == p.Id));
            var duAn = duAnDict.ContainsKey(firstParentWithChildren.DuAnId) ? duAnDict[firstParentWithChildren.DuAnId] : null;
            var childrenfirstParentWithChildre = data.Where(x => x.GroupNoiDungId == firstParentWithChildren.Id).ToList();
            var noiDungThucHienfirst = string.Join("\n", childrenfirstParentWithChildre.Select(c => $"- {c.NoiDungCongViec}"));



            var firstDataChilrent=new DA_NhatKyTrienKhaiEportWord
            {
                Id = firstParentWithChildren.Id,
                DuAnId = firstParentWithChildren.DuAnId,
                CreatedDate = firstParentWithChildren.CreatedDate,
                HangMucCongViec = firstParentWithChildren.NoiDungCongViec,
                PhanCong = firstParentWithChildren.PhanCongKH,
                NoiDungThucHien = string.IsNullOrEmpty(noiDungThucHienfirst) ? "- Không có công việc con" : noiDungThucHienfirst,
                TenDuAnText = duAn?.TenDuAn ?? "Chưa xác định",
                KetQuaThucHien = childrenfirstParentWithChildre.Any()
            ? string.Join("\n", childrenfirstParentWithChildre
                                .Select(c => $" - Đã hoàn thành {c.NoiDungCongViec.ToLower()} "))
                            : "- Không có công việc con",
                ChuDauTu = duAn?.ChuDauTu ?? "Chưa xác định",
                DiaDiemTrienKhai = duAn?.DiaDiemTrienKhai ?? "Chưa xác định",
                TenGoiThau = duAn?.TenGoiThau ?? "Chưa xác định",
                NgayBatDau = firstParentWithChildren.NgayBatDau,
                NgayKetThuc = firstParentWithChildren.NgayKetThuc,
            };


            var resdata = new List<DA_NhatKyTrienKhaiEportWord>();

            foreach (var parent in parents)
            {
                if (parent.Id == firstParentWithChildren?.Id)
                    continue;
                var children = data.Where(x => x.GroupNoiDungId == parent.Id).ToList();
                var noiDungThucHien = string.Join("\n", children.Select(c => $"- {c.NoiDungCongViec}"));


                // Tính danh sách ngày theo yêu cầu
                var startDate = parent.NgayBatDau ?? DateTime.Now;
                var endDate = parent.NgayKetThuc ?? DateTime.Now;

                if (isDay)
                {
                    // Theo ngày: lặp từng ngày từ Thứ 2 đến Thứ 6
                    for (var date = startDate.Date; date <= endDate.Date; date = date.AddDays(1))
                    {
                        if (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                            continue;

                        // Tạo danh sách trạng thái cho từng nhiệm vụ con, ưu tiên "Đã hoàn thành" lên đầu
                        var ketQuaThucHien = children.Any()
                            ? string.Join("\n", children
                                .OrderBy(c => c.NgayKetThuc.HasValue && c.NgayKetThuc.Value.Date <= date ? 0 : 1) // Đã hoàn thành (0) lên trước Đang thực hiện (1)
                                .Select(c => $"- {(c.NgayKetThuc.HasValue && c.NgayKetThuc.Value.Date <= date ? "Đã hoàn thành" : "Đang thực hiện")} {c.NoiDungCongViec.ToLower()}"))
                            : "- Không có công việc con";

                        var exportItem = new DA_NhatKyTrienKhaiEportWord
                        {
                            Id = parent.Id,
                            DuAnId = parent.DuAnId,
                            CreatedDate = parent.CreatedDate,
                            HangMucCongViec = parent.NoiDungCongViec,
                            PhanCong = parent.PhanCongKH,
                            NoiDungThucHien = string.IsNullOrEmpty(noiDungThucHien) ? "- Không có công việc con" :  noiDungThucHien,
                            TenDuAnText = duAn?.TenDuAn ?? "Chưa xác định",
                            KetQuaThucHien = ketQuaThucHien,
                            ChuDauTu = duAn?.ChuDauTu ?? "Chưa xác định",
                            DiaDiemTrienKhai = duAn?.DiaDiemTrienKhai ?? "Chưa xác định",
                            TenGoiThau = duAn?.TenGoiThau ?? "Chưa xác định",
                            NgayBatDau = date,
                            NgayKetThuc = date,
                        };

                        resdata.Add(exportItem);
                    }
                }
                else
                {
                    // Theo tuần: lặp từng tuần, nhưng mỗi tuần chỉ ghi Thứ 2–Thứ 6
                    var current = startDate.Date;

                    // Trường hợp đặc biệt: startDate == endDate
                    if (startDate.Date == endDate.Date)
                    {
                        // Tạo danh sách trạng thái cho từng nhiệm vụ con, ưu tiên "Đã hoàn thành" lên đầu
                        var ketQuaThucHien = children.Any()
                            ? string.Join("\n", children
                                .OrderBy(c => c.NgayKetThuc.HasValue && c.NgayKetThuc.Value.Date <= endDate.Date ? 0 : 1)
                                .Select(c => $"- {(c.NgayKetThuc.HasValue && c.NgayKetThuc.Value.Date <= endDate.Date ? "Đã hoàn thành" : "Đang thực hiện")} {c.NoiDungCongViec.ToLower()}"))
                            : "- Không có công việc con";

                        var singleDayExport = new DA_NhatKyTrienKhaiEportWord
                        {
                            Id = parent.Id,
                            DuAnId = parent.DuAnId,
                            HangMucCongViec = parent.NoiDungCongViec,
                            PhanCong = parent.PhanCongKH,
                            CreatedDate = parent.CreatedDate,
                            NoiDungThucHien = string.IsNullOrEmpty(noiDungThucHien) ? "- Không có công việc con" :  noiDungThucHien,
                            TenDuAnText = duAn?.TenDuAn ?? "Chưa xác định",
                            KetQuaThucHien = ketQuaThucHien,
                            ChuDauTu = duAn?.ChuDauTu ?? "Chưa xác định",
                            DiaDiemTrienKhai = duAn?.DiaDiemTrienKhai ?? "Chưa xác định",
                            TenGoiThau = duAn?.TenGoiThau ?? "Chưa xác định",
                            NgayBatDau = startDate.Date,
                            NgayKetThuc = endDate.Date,
                        };
                        resdata.Add(singleDayExport);
                    }
                    else
                    {
                        while (current <= endDate.Date)
                        {
                            // Lấy ngày đầu tuần là Thứ 2
                            var startOfWeek = current.AddDays(-(int)current.DayOfWeek + (int)DayOfWeek.Monday);
                            if (startOfWeek < startDate.Date)
                                startOfWeek = startDate.Date;

                            // Ngày cuối tuần là Chủ nhật (để kiểm tra nhiệm vụ hoàn thành vào T7, CN)
                            var endOfWeek = startOfWeek.AddDays(6);
                            if (endOfWeek > endDate.Date)
                                endOfWeek = endDate.Date;

                            // Tạo danh sách trạng thái cho từng nhiệm vụ con, ưu tiên "Đã hoàn thành" lên đầu
                            var ketQuaThucHien = children.Any()
                                ? string.Join("\n", children
                                    .OrderBy(c => c.NgayKetThuc.HasValue && c.NgayKetThuc.Value.Date <= endOfWeek ? 0 : 1)
                                    .Select(c => $"- {(c.NgayKetThuc.HasValue && c.NgayKetThuc.Value.Date <= endOfWeek ? "Đã hoàn thành" : "Đang thực hiện")} {c.NoiDungCongViec.ToLower()}"))
                                : "- Không có công việc con";

                            // Chỉ tạo 1 bản ghi cho mỗi tuần (T2–T6)
                            var exportItem = new DA_NhatKyTrienKhaiEportWord
                            {
                                Id = parent.Id,
                                DuAnId = parent.DuAnId,
                                HangMucCongViec = parent.NoiDungCongViec,
                                PhanCong = parent.PhanCongKH,
                                CreatedDate = parent.CreatedDate,
                                NoiDungThucHien = string.IsNullOrEmpty(noiDungThucHien) ? "- Không có công việc con" :  noiDungThucHien,
                                TenDuAnText = duAn?.TenDuAn ?? "Chưa xác định",
                                KetQuaThucHien = ketQuaThucHien,
                                ChuDauTu = duAn?.ChuDauTu ?? "Chưa xác định",
                                DiaDiemTrienKhai = duAn?.DiaDiemTrienKhai ?? "Chưa xác định",
                                TenGoiThau = duAn?.TenGoiThau ?? "Chưa xác định",
                                NgayBatDau = startOfWeek,
                                NgayKetThuc = startOfWeek.AddDays(4), // Giữ báo cáo từ T2-T6
                            };

                            resdata.Add(exportItem);

                            // Tăng sang tuần tiếp theo
                            current = startOfWeek.AddDays(7);
                        }
                    }
                }
            }



            if (resdata == null || resdata.Count == 0)
            {
                return new UrlFilePath { };
            }
            resdata = resdata.OrderBy(x => x.CreatedDate).ToList();

            // Lấy dữ liệu cho placeholder (phần tử đầu tiên)
            var firstEntry = resdata.First();

            // 2. Định nghĩa đường dẫn và tạo tệp tạm
            string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
            string templatePath = Path.Combine(rootPath, "DA_NhatKyTrienKhai/Template", "NhatKyCongTacTrienKhaiTemplate.docx");

            if (!File.Exists(templatePath))
            {
                // Ghi log lỗi nếu cần thiết
                return new UrlFilePath { };
            }

            string namefile = $"NhatKyTrienKhai_{Guid.NewGuid()}_temp.docx";
            string urlfile = Path.Combine("DA_NhatKyTrienKhai", namefile);
            string tempFilePath = Path.Combine(rootPath, "DA_NhatKyTrienKhai", namefile);

            File.Copy(templatePath, tempFilePath);

            // 3. Thao tác với Word bằng DocX (Tối ưu hóa)
            // Loại bỏ hoàn toàn Microsoft.Office.Interop.Word để tăng hiệu suất và độ ổn định.
            try
            {
                using (DocX docX = DocX.Load(tempFilePath))
                {
                    // Điền dữ liệu vào các placeholder (DocX)
                    docX.ReplaceText("{{ThoiGianChuanBi}}",
                    $"{firstDataChilrent.NgayBatDau?.ToString("dd/MM/yyyy")} đến {firstDataChilrent.NgayKetThuc?.ToString("dd/MM/yyyy")}");
                    docX.ReplaceText("{{NhiemVuChuanBi}}", firstDataChilrent.HangMucCongViec ?? "Chưa xác định");
                    docX.ReplaceText("{{CongViecChuanBi}}", firstDataChilrent.NoiDungThucHien ?? "Chưa xác định");
                    docX.ReplaceText("{{NhanSuChuanBi}}", firstDataChilrent.PhanCong ?? "Chưa xác định");
                    docX.ReplaceText("{{TenGoiThau}}", firstDataChilrent.TenGoiThau);
                    docX.ReplaceText("{{KetQuaThucHien}}", firstDataChilrent.KetQuaThucHien??"Chưa xác định");
                    docX.ReplaceText("{{TenDuAn}}", firstDataChilrent.TenDuAnText);
                    docX.ReplaceText("{{DiaDiemTrienKhai}}", firstDataChilrent.DiaDiemTrienKhai);
                    docX.ReplaceText("{{ChuDauTu}}", firstDataChilrent.ChuDauTu);

                    // 4. Thao tác với bảng bằng DocX

                    // Tìm bảng trong tài liệu
                    var tables = docX.Tables;
                    if (tables.Count > 0)
                    {
                        

                        // Lấy bảng đầu tiên (ví dụ)
                        var table = tables[3];
                        var res = table.ColumnCount;

                        // Lặp qua dữ liệu từ phần tử thứ 2 (bỏ qua phần tử đầu tiên đã dùng cho placeholder)
                        int stt = 1;

                        // Sử dụng Skip(1) để bỏ qua phần tử đầu tiên
                        foreach (var item in resdata.Skip(1))
                        {
                            // Chèn một hàng mới vào bảng
                            var newRow = table.InsertRow();

                            // Điền dữ liệu vào các cột (chỉ mục bắt đầu từ 0 trong DocX, không phải 1 như Interop)

                            // Cột 0: STT
                            newRow.Cells[0].Paragraphs.First().Append(stt.ToString()).Bold();

                            // Cột 1: Thời gian
                            newRow.Cells[1].Paragraphs.First().Append($"{item.NgayBatDau?.ToString("dd/MM/yyyy")} đến {item.NgayKetThuc?.ToString("dd/MM/yyyy")}");

                            // Cột 2: Nội dung công việc (Bạn cần thêm logic để chèn đoạn văn bản với định dạng)
                            var contentCell = newRow.Cells[2].Paragraphs.First();

                            // Vì DocX không có chức năng InsertFormattedParagraph sẵn như Interop, 
                            // bạn cần AppendText() và áp dụng định dạng nếu cần.
                            contentCell.Alignment = Xceed.Document.NET.Alignment.left;                         
                            contentCell.Append("1. Nhân sự dự án: \n").Bold();
                            contentCell.AppendLine("");
                            contentCell.Append($"{item.PhanCong} \n");
                            contentCell.AppendLine($"2. Công việc thực hiện: {item.HangMucCongViec} \n").Bold();
                            contentCell.AppendLine("");
                            contentCell.Append($"{item.NoiDungThucHien} \n");
                          
                            contentCell.AppendLine("3. Kết quả công việc triển khai \n").Bold();
                            contentCell.Append($"{item.KetQuaThucHien} \n");                       
                            contentCell.AppendLine("4. Xác nhận kết quả kiểm thử, vận hành thử đối với công việc được hoàn thành:\n").Bold();
                            contentCell.AppendLine("");
                            contentCell.Append("Không có \n");
                            contentCell.AppendLine("5.  Những sai lệch so với hồ sơ thiết kế thi công, ghi rõ nguyên nhân, kèm theo biện pháp sửa chữa:\n").Bold();
                            contentCell.AppendLine("");
                            contentCell.Append("Không có\n");
                            contentCell.AppendLine("Xác nhận của cán bộ phụ trách thi công").Bold();
                            contentCell.AppendLine("");
                            contentCell.AppendLine("");
                            contentCell.AppendLine("");
                            contentCell.AppendLine("");
                            contentCell.AppendLine("");
                            stt++;
                  
                        }

                    }

                    // Lưu tài liệu sau khi hoàn thành
                    docX.Save();
                }

                // Trả về đường dẫn file đã xuất
                return new UrlFilePath
                {
                    tenFile = namefile,
                    urlFile = urlfile
                };
            }
            catch (Exception ex)
            {
                // Xử lý lỗi và xóa tệp tạm nếu có lỗi trong quá trình tạo
                if (File.Exists(tempFilePath))
                {
                    File.Delete(tempFilePath);
                }
                // Ghi log lỗi
                return new UrlFilePath { };
            }
        }
        #region ho tro excel 
        private (DateTime? StartDate, DateTime? EndDate) ParseDateRange(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return (null, null);

            var parts = input.Split('-');
            if (parts.Length != 2)
                return (null, null);

            string startDateStr = parts[0].Trim();
            string endDateStr = parts[1].Trim();

            DateTime? startDate = null;
            DateTime? endDate = null;

            if (DateTime.TryParseExact(startDateStr, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out DateTime parsedStart))
            {
                startDate = parsedStart;
            }

            if (DateTime.TryParseExact(endDateStr, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out DateTime parsedEnd))
            {
                endDate = parsedEnd;
            }

            return (startDate, endDate);
        }
        private string GetExcelColumnName(int columnNumber)
        {
            string columnName = string.Empty;
            while (columnNumber > 0)
            {
                int modulo = (columnNumber - 1) % 26;
                columnName = Convert.ToChar('A' + modulo) + columnName;
                columnNumber = (columnNumber - modulo) / 26;
            }
            return columnName;
        }




        #endregion

    }
}

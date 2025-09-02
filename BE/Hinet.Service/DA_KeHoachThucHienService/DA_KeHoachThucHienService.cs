using Hinet.Model.Entities;
using Hinet.Repository.DA_KeHoachThucHienRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.DA_KeHoachThucHienService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;
using DocumentFormat.OpenXml.Office2010.Excel;
using Hinet.Service.DA_KeHoachThucHienService.ViewModels;
using CommonHelper.Excel;
using System.Drawing;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using Hinet.Repository.DA_DuAnRepository;
using CommonHelper.String;
using Hinet.Service.Constant.DuAn;
using Hinet.Service.Core.Mapper;
using BitMiracle.LibTiff.Classic;
using Hinet.Repository.NotificationRepository;



namespace Hinet.Service.DA_KeHoachThucHienService
{
    public class DA_KeHoachThucHienService : Service<DA_KeHoachThucHien>, IDA_KeHoachThucHienService
    {
        private readonly IDA_KeHoachThucHienRepository _dA_KeHoachThucHienRepository;
        private readonly IDA_DuAnRepository _dA_DuAnRepository;
        private readonly INotificationRepository _notificationRepository;
        private readonly IMapper _mapper;

        public DA_KeHoachThucHienService(
            IDA_KeHoachThucHienRepository dA_KeHoachThucHienRepository,
            IDA_DuAnRepository dA_DuAnRepository,
            INotificationRepository notificationRepository,
            IMapper mapper
            ) : base(dA_KeHoachThucHienRepository)
        {
            _dA_KeHoachThucHienRepository = dA_KeHoachThucHienRepository;
            _dA_DuAnRepository = dA_DuAnRepository;
            _notificationRepository = notificationRepository;
            _mapper = mapper;
        }

        public async Task<string> ExportKeHoachThucHien(Guid duAnId, bool isKeHoachNoiBo)
        {
            if (string.IsNullOrEmpty(duAnId.ToString()))
            {
                return "";
            }

            var tenDuAn = await _dA_DuAnRepository.GetQueryable().Where(x => x.Id == duAnId).Select(x => x.TenDuAn).FirstOrDefaultAsync();

            var data = await _dA_KeHoachThucHienRepository.GetQueryable()
                   .Where(x => x.DuAnId == duAnId && !string.IsNullOrEmpty(x.NoiDungCongViec) && x.IsKeHoachNoiBo == isKeHoachNoiBo)
                   .OrderBy(x => x.CreatedDate)
                   .ToListAsync();

            if (data == null || !data.Any())
            {
                return "";
            }

            // Cha: GroupNoiDungId == null
            var parents = data.Where(x => x.GroupNoiDungId == null).OrderBy(x => x.CreatedDate).ToList();

            var result = new List<DA_KeHoachThucHienTree>();

            foreach (var parent in parents)
            {
                var treeItem = new DA_KeHoachThucHienTree
                {
                    Id = parent.Id,
                    DuAnId = parent.DuAnId,
                    IsKeHoachNoiBo = parent.IsKeHoachNoiBo,
                    NgayBatDau = parent.NgayBatDau,
                    NgayKetThuc = parent.NgayKetThuc,
                    IsCanhBao = parent.IsCanhBao,
                    CanhBaoTruocNgay = parent.CanhBaoTruocNgay,
                    GroupNoiDungId = parent.GroupNoiDungId,
                    NoiDungCongViec = parent.NoiDungCongViec,
                    PhanCong = parent.PhanCong,
                    Stt = parent.Stt,
                    CreatedDate = parent.CreatedDate,
                    UpdatedDate = parent.UpdatedDate,
                    CreatedBy = parent.CreatedBy,
                    UpdatedBy = parent.UpdatedBy,
                    ListdA_KeHoachThucHienTrees = data
                        .Where(x => x.GroupNoiDungId == parent.Id)
                        .Select(child => new DA_KeHoachThucHienTree
                        {
                            Id = child.Id,
                            DuAnId = child.DuAnId,
                            IsKeHoachNoiBo = child.IsKeHoachNoiBo,
                            NgayBatDau = child.NgayBatDau,
                            NgayKetThuc = child.NgayKetThuc,
                            IsCanhBao = child.IsCanhBao,
                            CanhBaoTruocNgay = child.CanhBaoTruocNgay,
                            GroupNoiDungId = child.GroupNoiDungId,
                            NoiDungCongViec = child.NoiDungCongViec,
                            PhanCong = child.PhanCong,
                            Stt = child.Stt,
                            CreatedDate = child.CreatedDate,
                            UpdatedDate = child.UpdatedDate,
                            CreatedBy = child.CreatedBy,
                            UpdatedBy = child.UpdatedBy,
                            ListdA_KeHoachThucHienTrees = new List<DA_KeHoachThucHienTree>() // Không cần sâu hơn 2 cấp
                        }).OrderBy(x => x.CreatedDate).ToList()
                };

                result.Add(treeItem);
            }

            // Tìm ngày bắt đầu và kết thúc của toàn bộ dự án
            DateTime? startDate = null;
            DateTime? endDate = null;

            foreach (var item in data)
            {
                if (item.NgayBatDau.HasValue)
                {
                    if (!startDate.HasValue || item.NgayBatDau.Value < startDate.Value)
                    {
                        startDate = item.NgayBatDau.Value;
                    }
                }

                if (item.NgayKetThuc.HasValue)
                {
                    if (!endDate.HasValue || item.NgayKetThuc.Value > endDate.Value)
                    {
                        endDate = item.NgayKetThuc.Value;
                    }
                }
            }

            if (!startDate.HasValue || !endDate.HasValue)
            {
                return "";
            }

            // Tính khoảng thời gian giữa ngày bắt đầu và kết thúc
            TimeSpan duration = endDate.Value - startDate.Value;
            bool isLessThanOneMonth = duration.TotalDays <= 30;

            //ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                // Đường dẫn đến file template
                string rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                string templatePath = Path.Combine(rootPath, "DA_KeHoachNoiBo", "BC Timeline trien khai_Du-Lich-Hai-Phong_2203.xlsx");

                // Kiểm tra file template tồn tại
                if (!System.IO.File.Exists(templatePath))
                {
                    return "";
                }

                // Mở file template
                using (var package = new ExcelPackage(new FileInfo(templatePath)))
                {
                    var worksheet = package.Workbook.Worksheets[0]; // Lấy sheet đầu tiên

                    // Cập nhật tiêu đề với tên dự án
                    worksheet.Cells[1, 1].Value = "Time Line Kế Hoạch " + tenDuAn;
                    worksheet.Cells[1, 2].Value = tenDuAn;

                    // Xác định vị trí bắt đầu của dữ liệu
                    int startRow = 4; // Bắt đầu từ dòng 4
                    int currentRow = startRow;
                    int sttCol = 1; // Cột STT
                    int noiDungCol = 2; // Cột Nội dung công việc
                    int timelineStartCol = 3; // Cột bắt đầu của timeline

                    // Thêm tiêu đề cột
                    worksheet.Cells[3, sttCol].Value = "STT";
                    worksheet.Cells[3, noiDungCol].Value = "Nội dung công việc";

                    // Format tiêu đề cột
                    using (var headerRange = worksheet.Cells[3, sttCol, 3, noiDungCol])
                    {
                        headerRange.Style.Font.Bold = true;
                        headerRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        headerRange.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(146, 208, 230)); // Màu xanh nhạt
                        headerRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        headerRange.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        headerRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        headerRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        headerRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        headerRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    }

                    // Xóa dữ liệu mẫu hiện có (nếu có)
                    int lastRow = worksheet.Dimension.End.Row;
                    if (lastRow >= startRow)
                    {
                        worksheet.Cells[startRow, 1, lastRow, worksheet.Dimension.End.Column].Clear();
                    }

                    // Tạo timeline header dựa vào khoảng thời gian
                    List<DateTime> timelineDates = new List<DateTime>();
                    int timelineEndCol = 0;
                    if (isLessThanOneMonth)
                    {
                        // Hiển thị theo ngày (loại bỏ Thứ 7 và CN)
                        for (DateTime date = startDate.Value.Date; date <= endDate.Value.Date; date = date.AddDays(1))
                        {
                            if (date.DayOfWeek != DayOfWeek.Saturday && date.DayOfWeek != DayOfWeek.Sunday)
                            {
                                timelineDates.Add(date);
                                worksheet.Cells[2, timelineStartCol + timelineDates.Count - 1].Value = date.ToString("d/M");
                                worksheet.Column(timelineStartCol + timelineDates.Count - 1).Width = 15;
                            }
                        }
                    }
                    else
                    {
                        DateTime current = startDate.Value.Date;

                        // --- Tuần đầu: startDate đến hết tuần làm việc (Thứ 6 hoặc Thứ 7) ---
                        if (current.DayOfWeek != DayOfWeek.Sunday && current <= endDate.Value.Date)
                        {
                            DateTime weekStart = current;
                            DateTime weekEnd;

                            if (isKeHoachNoiBo)
                            {
                                int daysToSaturday = ((int)DayOfWeek.Saturday - (int)current.DayOfWeek + 7) % 7;
                                // Lấy đến Thứ 7 trong tuần

                                weekEnd = current.AddDays(daysToSaturday);
                            }
                            else
                            {
                                // Lấy đến Thứ 6 trong tuần
                                int daysToFriday = ((int)DayOfWeek.Friday - (int)current.DayOfWeek + 7) % 7;

                                weekEnd = current.AddDays(daysToFriday);
                            }

                            if (weekEnd > endDate.Value.Date)
                            {
                                weekEnd = endDate.Value.Date;
                            }

                            timelineDates.Add(weekStart);
                            string label = $"{weekStart: d/M} ~ {weekEnd: d/M}";
                            worksheet.Cells[2, timelineStartCol + timelineDates.Count - 1].Value = label;
                            worksheet.Column(timelineStartCol + timelineDates.Count - 1).Width = 20;

                            // Move to next Monday
                            current = weekEnd.AddDays(1);
                            while (current.DayOfWeek != DayOfWeek.Monday && current <= endDate.Value.Date)
                            {
                                current = current.AddDays(1);
                            }
                        }

                        // --- Các tuần tiếp theo (Thứ 2 → Thứ 6 hoặc Thứ 7) ---
                        while (current <= endDate.Value.Date)
                        {
                            DateTime weekStart = current;
                            DateTime weekEnd = isKeHoachNoiBo
                                ? weekStart.AddDays(5)  // Thứ 2 → Thứ 6
                                : weekStart.AddDays(4); // Thứ 2 → Thứ 7

                            if (weekEnd > endDate.Value.Date)
                            {
                                weekEnd = endDate.Value.Date;
                            }

                            timelineDates.Add(weekStart);
                            string label = $"{weekStart: d/M} ~ {weekEnd: d/M}";
                            worksheet.Cells[2, timelineStartCol + timelineDates.Count - 1].Value = label;
                            worksheet.Column(timelineStartCol + timelineDates.Count - 1).Width = 20;

                            current = current.AddDays(7);
                        }
                    }


                    timelineEndCol = timelineStartCol + timelineDates.Count - 1;

                    // Format the date headers
                    for (int i = 0; i < timelineDates.Count; i++)
                    {
                        var cell = worksheet.Cells[2, timelineStartCol + i];
                        cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        cell.Style.Font.Bold = true;

                    }

                    // Thêm cột Tiến Độ sau timeline ở cùng hàng với các ngày
                    int tienDoCol = timelineEndCol + 1;
                    worksheet.Cells[2, tienDoCol].Value = "Tiến Độ";
                    worksheet.Row(2).Height = 25;
                    worksheet.Column(tienDoCol).Width = 30; // Đặt độ rộng cho cột Tiến Độ

                    // Format cột Tiến Độ
                    using (var cell = worksheet.Cells[2, tienDoCol])
                    {

                        cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        cell.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(146, 208, 230)); // Màu xanh nhạt
                        cell.Style.Font.Bold = true;
                        cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        cell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        cell.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        cell.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        cell.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        cell.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    }

                    // Thiết lập freeze panes để cố định các cột STT và Nội dung công việc
                    worksheet.View.FreezePanes(4, 3);

                    // Điền dữ liệu
                    int stt = 1;

                    foreach (var parent in result)
                    {
                        // Dòng nhóm công việc (parent)
                        worksheet.Cells[currentRow, sttCol].Value = stt++;
                        worksheet.Cells[currentRow, noiDungCol].Value = parent.NoiDungCongViec;

                        // Format dòng nhóm
                        using (var range = worksheet.Cells[currentRow, sttCol, currentRow, tienDoCol + 1])
                        {
                            range.Style.Font.Bold = true;
                            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            worksheet.Row(currentRow).Height = 40;


                        }

                        currentRow++;

                        // Các công việc con
                        foreach (var child in parent.ListdA_KeHoachThucHienTrees)
                        {
                            worksheet.Cells[currentRow, sttCol].Value = $"{stt - 1}.{parent.ListdA_KeHoachThucHienTrees.IndexOf(child) + 1}";
                            worksheet.Cells[currentRow, noiDungCol].Value = child.NoiDungCongViec;

                            // Format dòng con
                            using (var range = worksheet.Cells[currentRow, sttCol, currentRow, tienDoCol + 1])
                            {

                                range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                                range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                                range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                                range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                                range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                                worksheet.Row(currentRow).Height = 40;


                            }

                            // Tô màu timeline cho công việc con
                            if (child.NgayBatDau.HasValue && child.NgayKetThuc.HasValue)
                            {
                                // Xác định cột bắt đầu và kết thúc cho công việc
                                int startColIndex = -1;
                                int endColIndex = -1;

                                for (int i = 0; i < timelineDates.Count; i++)
                                {
                                    DateTime currentDate = timelineDates[i];

                                    if (isLessThanOneMonth)
                                    {
                                        // Chế độ theo ngày
                                        if (currentDate.Date >= child.NgayBatDau.Value.Date && startColIndex == -1)
                                        {
                                            startColIndex = i;
                                        }

                                        if (currentDate.Date <= child.NgayKetThuc.Value.Date)
                                        {
                                            endColIndex = i;
                                        }
                                    }
                                    else
                                    {
                                        // Chế độ theo tuần
                                        DateTime weekStart = currentDate;
                                        DateTime weekEnd = weekStart.AddDays(6);

                                        // Nếu công việc bắt đầu trong tuần này
                                        if ((child.NgayBatDau.Value.Date >= weekStart && child.NgayBatDau.Value.Date <= weekEnd) ||
                                            (i == 0 && child.NgayBatDau.Value.Date < weekStart))
                                        {
                                            startColIndex = i;
                                        }

                                        // Nếu công việc kết thúc trong tuần này
                                        if ((child.NgayKetThuc.Value.Date >= weekStart && child.NgayKetThuc.Value.Date <= weekEnd) ||
                                            (i == timelineDates.Count - 1 && child.NgayKetThuc.Value.Date > weekEnd))
                                        {
                                            endColIndex = i;
                                        }
                                    }
                                }

                                // Nếu tìm thấy cả cột bắt đầu và kết thúc
                                if (startColIndex != -1 && endColIndex != -1)
                                {
                                    int startCol = timelineStartCol + startColIndex;
                                    int endCol = timelineStartCol + endColIndex;

                                    // Merge các ô và tô màu
                                    if (startCol <= endCol)
                                    {
                                        using (var range = worksheet.Cells[currentRow, startCol, currentRow, endCol])
                                        {
                                            range.Merge = true;
                                            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
                                            range.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(169, 208, 142)); // Màu xanh lá
                                            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                                            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                                            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                                            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                                        }
                                    }
                                }
                            }

                            currentRow++;
                        }
                    }

                    // Căn chỉnh chiều cao hàng
                    for (int i = 1; i <= currentRow; i++)
                    {
                        worksheet.Row(i).Height = 40; // Đặt chiều cao cố định cho tất cả các hàng
                    }

                    // Lưu file vào MemoryStream
                    var stream = new MemoryStream();
                    package.SaveAs(stream);
                    stream.Position = 0;

                    // Chuyển đổi MemoryStream thành Base64
                    return Convert.ToBase64String(stream.ToArray());
                }
            }
            catch (Exception ex)
            {
                // Xử lý lỗi nếu có
                return "";
            }
        }

        private void ColorTimelineCells(ExcelWorksheet worksheet, int row, int startCol, List<DateTime> timelineDates,
            DateTime startDate, DateTime endDate, bool isLessThanOneMonth, System.Drawing.Color color)
        {
            for (int i = 0; i < timelineDates.Count; i++)
            {
                DateTime currentDate = timelineDates[i];

                if (isLessThanOneMonth)
                {
                    // Chế độ theo ngày
                    if (currentDate.Date >= startDate.Date && currentDate.Date <= endDate.Date)
                    {
                        worksheet.Cells[row, startCol + i].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[row, startCol + i].Style.Fill.BackgroundColor.SetColor(color);
                    }
                }
                else
                {
                    // Chế độ theo tuần
                    // Lấy ngày đầu tuần và cuối tuần
                    DateTime weekStart = currentDate;
                    DateTime weekEnd = weekStart.AddDays(6);

                    // Kiểm tra xem tuần này có overlap với khoảng thời gian công việc không
                    if ((weekStart <= endDate && weekEnd >= startDate))
                    {
                        worksheet.Cells[row, startCol + i].Style.Fill.PatternType = ExcelFillStyle.Solid;
                        worksheet.Cells[row, startCol + i].Style.Fill.BackgroundColor.SetColor(color);
                    }
                }
            }
        }

        // Hàm lấy số tuần trong năm theo chuẩn ISO 8601


        public async Task<PagedList<DA_KeHoachThucHienDto>> GetData(DA_KeHoachThucHienSearch search)
        {
            var query = from q in GetQueryable()

                        select new DA_KeHoachThucHienDto()
                        {
                            DuAnId = q.DuAnId,
                            GroupNoiDungId = q.GroupNoiDungId,
                            NgayBatDau = q.NgayBatDau,
                            NgayKetThuc = q.NgayKetThuc,
                            CanhBaoTruocNgay = q.CanhBaoTruocNgay,
                            IsKeHoachNoiBo = q.IsKeHoachNoiBo,
                            IsCanhBao = q.IsCanhBao,
                            NoiDungCongViec = q.NoiDungCongViec,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                        };
            if (search != null)
            {
                if (search.DuAnId.HasValue)
                {
                    query = query.Where(x => x.DuAnId == search.DuAnId);
                }
                if (search.GroupNoiDungId.HasValue)
                {
                    query = query.Where(x => x.GroupNoiDungId == search.GroupNoiDungId);
                }
                //if(!string.IsNullOrEmpty(search.NgayBatDau))
                //{
                //	query = query.Where(x => EF.Functions.Like(x.NgayBatDau, $"%{search.NgayBatDau}%"));
                //}
                //if(!string.IsNullOrEmpty(search.NgayKetThuc))
                //{
                //	query = query.Where(x => EF.Functions.Like(x.NgayKetThuc, $"%{search.NgayKetThuc}%"));
                //}
                if (search.CanhBaoTruocNgay.HasValue)
                {
                    query = query.Where(x => x.CanhBaoTruocNgay == search.CanhBaoTruocNgay);
                }
                if (search.IsKeHoachNoiBo.HasValue)
                {
                    query = query.Where(x => x.IsKeHoachNoiBo == search.IsKeHoachNoiBo);
                }
                if (search.IsCanhBao.HasValue)
                {
                    query = query.Where(x => x.IsCanhBao == search.IsCanhBao);
                }
                if (!string.IsNullOrEmpty(search.NoiDungCongViec))
                {
                    query = query.Where(x => EF.Functions.Like(x.NoiDungCongViec, $"%{search.NoiDungCongViec}%"));
                }
            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<DA_KeHoachThucHienDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<DA_KeHoachThucHienDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)

                              select new DA_KeHoachThucHienDto()
                              {
                                  DuAnId = q.DuAnId,
                                  GroupNoiDungId = q.GroupNoiDungId,
                                  NgayBatDau = q.NgayBatDau,
                                  NgayKetThuc = q.NgayKetThuc,
                                  CanhBaoTruocNgay = q.CanhBaoTruocNgay,
                                  IsKeHoachNoiBo = q.IsKeHoachNoiBo,
                                  IsCanhBao = q.IsCanhBao,
                                  NoiDungCongViec = q.NoiDungCongViec,
                                  CreatedBy = q.CreatedBy,
                                  UpdatedBy = q.UpdatedBy,
                                  IsDelete = q.IsDelete,
                                  DeleteId = q.DeleteId,
                                  CreatedDate = q.CreatedDate,
                                  UpdatedDate = q.UpdatedDate,
                                  DeleteTime = q.DeleteTime,
                                  Id = q.Id,
                              }).FirstOrDefaultAsync();

            return item;
        }

        public async Task<List<DA_KeHoachThucHienTree>> getDropDownKeHoachThuchien(Guid id, bool isKeHoachNoiBo)
        {


            var data = await _dA_KeHoachThucHienRepository.GetQueryable()
                  .Where(x => x.DuAnId == id && !string.IsNullOrEmpty(x.NoiDungCongViec) && x.IsKeHoachNoiBo == isKeHoachNoiBo)
                  .OrderBy(x => x.CreatedDate)
                  .ToListAsync();



            // Cha: GroupNoiDungId == null
            var parents = data.Where(x => x.GroupNoiDungId == null).ToList();

            var result = new List<DA_KeHoachThucHienTree>();

            foreach (var parent in parents)
            {
                var treeItem = new DA_KeHoachThucHienTree
                {
                    Id = parent.Id,
                    DuAnId = parent.DuAnId,
                    IsKeHoachNoiBo = parent.IsKeHoachNoiBo,
                    NgayBatDau = parent.NgayBatDau.HasValue ? parent.NgayBatDau.Value.ToLocalTime() : parent.NgayBatDau,
                    NgayKetThuc = parent.NgayKetThuc.HasValue ? parent.NgayKetThuc.Value.ToLocalTime() : parent.NgayKetThuc,
                    IsCanhBao = parent.IsCanhBao,
                    CanhBaoTruocNgay = parent.CanhBaoTruocNgay,
                    GroupNoiDungId = parent.GroupNoiDungId,
                    NoiDungCongViec = parent.NoiDungCongViec,
                    PhanCong = parent.PhanCong,
                    Stt = parent.Stt,
                    CreatedDate = parent.CreatedDate,
                    UpdatedDate = parent.UpdatedDate,
                    CreatedBy = parent.CreatedBy,
                    UpdatedBy = parent.UpdatedBy,
                    Progress = parent.Progress,
                    PhanCongKH = parent.PhanCongKH,
                    ListdA_KeHoachThucHienTrees = data
                        .Where(x => x.GroupNoiDungId == parent.Id)
                        .Select(child => new DA_KeHoachThucHienTree
                        {
                            Id = child.Id,
                            DuAnId = child.DuAnId,
                            IsKeHoachNoiBo = child.IsKeHoachNoiBo,
                            NgayBatDau = child.NgayBatDau.HasValue ? child.NgayBatDau.Value.ToLocalTime() : child.NgayBatDau,
                            NgayKetThuc = child.NgayKetThuc.HasValue ? child.NgayKetThuc.Value.ToLocalTime() : child.NgayKetThuc,
                            IsCanhBao = child.IsCanhBao,
                            CanhBaoTruocNgay = child.CanhBaoTruocNgay,
                            GroupNoiDungId = child.GroupNoiDungId,
                            NoiDungCongViec = child.NoiDungCongViec,
                            PhanCong = child.PhanCong,
                            Stt = child.Stt,
                            CreatedDate = child.CreatedDate,
                            UpdatedDate = child.UpdatedDate,
                            CreatedBy = child.CreatedBy,
                            Progress = child.Progress,
                            UpdatedBy = child.UpdatedBy,
                            ListdA_KeHoachThucHienTrees = new List<DA_KeHoachThucHienTree>() // Không cần sâu hơn 2 cấp
                        }).ToList()
                };

                result.Add(treeItem);
            }
            return result;
        }
        public async Task<List<DA_KeHoachThucHienTree>> getDropDownKeHoachThuchienTemplate(Guid id, bool isKeHoachNoiBo)
        {
            var duAnTime = await _dA_DuAnRepository.GetQueryable().Where(x => x.Id == id).Select(x => new { x.NgayBatDau, x.NgayKetThuc }).FirstOrDefaultAsync();
            if (duAnTime == null || !duAnTime.NgayBatDau.HasValue || !duAnTime.NgayKetThuc.HasValue)
            {
                return new List<DA_KeHoachThucHienTree>(); // Return empty list if project or dates not found
            }

            // Calculate project duration
            var projectDuration = (duAnTime.NgayKetThuc.Value - duAnTime.NgayBatDau.Value).TotalDays;

            // Define durations for each group
            var durations = new double[]
            {
                    1, // Group 1: 1 day
                    1, // Group 2: 1 day
                    projectDuration / 8.0, // Group 3: 1/8 of total duration
                    projectDuration * 3.0 / 8.0, // Group 4: 3/8 of total duration
                    projectDuration / 40.0, // Group 5: 1/40 (1/8 ÷ 5)
                    projectDuration / 40.0, // Group 6: 1/40
                    projectDuration / 40.0, // Group 7: 1/40
                    projectDuration / 40.0, // Group 8: 1/40
                    projectDuration / 40.0  // Group 9: 1/40
            };

            // Retrieve data
            var data = await _dA_KeHoachThucHienRepository.GetQueryable()
                .Where(x => x.DuAnId == KeHoachThucHienConstant.DuAnId.ToGuid() && !string.IsNullOrEmpty(x.NoiDungCongViec))
                .OrderBy(x => x.CreatedDate)
                .ToListAsync();

            // Group parents: GroupNoiDungId == null
            var parents = data.Where(x => x.GroupNoiDungId == null).ToList();

            var result = new List<DA_KeHoachThucHienTree>();

            // Assign timeline to each group
            double currentOffset = 0;
            for (int i = 0; i < parents.Count && i < 9; i++)
            {
                var parent = parents[i];
               
                var groupStartDate = duAnTime.NgayBatDau.Value.AddDays(currentOffset);
                var groupEndDate = duAnTime.NgayBatDau.Value.AddDays(currentOffset + durations[i]);
                currentOffset += durations[i];

                var treeItem = new DA_KeHoachThucHienTree
                {
                    Id = parent.Id,
                    DuAnId = parent.DuAnId,
                    IsKeHoachNoiBo = parent.IsKeHoachNoiBo,
                    NgayBatDau = groupStartDate.ToLocalTime(),
                    NgayKetThuc = groupEndDate.ToLocalTime(),
                    IsCanhBao = parent.IsCanhBao,
                    CanhBaoTruocNgay = parent.CanhBaoTruocNgay,
                    GroupNoiDungId = parent.GroupNoiDungId,
                    NoiDungCongViec = parent.NoiDungCongViec,
                    PhanCong = parent.PhanCong,
                    Stt = parent.Stt,
                    CreatedDate = parent.CreatedDate,
                    UpdatedDate = parent.UpdatedDate,
                    CreatedBy = parent.CreatedBy,
                    UpdatedBy = parent.UpdatedBy,
                    Progress = parent.Progress,
                    PhanCongKH = parent.PhanCongKH,
                    ListdA_KeHoachThucHienTrees = data
                        .Where(x => x.GroupNoiDungId == parent.Id)
                        .Select(child => new DA_KeHoachThucHienTree
                        {
                            Id = child.Id,
                            DuAnId = child.DuAnId,
                            IsKeHoachNoiBo = child.IsKeHoachNoiBo,
                            NgayBatDau = groupStartDate.ToLocalTime(),
                            NgayKetThuc = groupEndDate.ToLocalTime(),
                            IsCanhBao = child.IsCanhBao,
                            CanhBaoTruocNgay = child.CanhBaoTruocNgay,
                            GroupNoiDungId = child.GroupNoiDungId,
                            NoiDungCongViec = child.NoiDungCongViec,
                            PhanCong = child.PhanCong,
                            Stt = child.Stt,
                            CreatedDate = child.CreatedDate,
                            UpdatedDate = child.UpdatedDate,
                            CreatedBy = child.CreatedBy,
                            Progress = child.Progress,
                            UpdatedBy = child.UpdatedBy,
                            ListdA_KeHoachThucHienTrees = new List<DA_KeHoachThucHienTree>()
                        }).ToList()
                };

                result.Add(treeItem);
            }

            var res = result;
            return result;
        }

        public async Task<List<DA_KeHoachThucHien>> SaveImportDataIntoExcel(List<DA_KeHoachThucHienCreateVM> dA_KeHoachThucHienCreateVMs, Guid duAnId, bool isKeHoachNoiBo)
        {

            if (dA_KeHoachThucHienCreateVMs != null && dA_KeHoachThucHienCreateVMs.Any() && duAnId != null)
            {
                var listKHCU = GetQueryable().Where(x => x.DuAnId == duAnId && x.IsKeHoachNoiBo == isKeHoachNoiBo).ToList();
                DeleteRange(listKHCU);

                //  Gọi tiền xử lý
                var preprocessedData = PreprocessKeHoachThucHienData(dA_KeHoachThucHienCreateVMs);

                var listData = new List<DA_KeHoachThucHien>();
                var groupData = preprocessedData.Where(x => !string.IsNullOrEmpty(x.NoiDungCongViec)).GroupBy(x => x.Group).ToList();

                foreach (var group in groupData)
                {
                    var groupEntity = _mapper.Map<DA_KeHoachThucHienCreateVM, DA_KeHoachThucHien>(group.FirstOrDefault(x => x.IsGroup == true));
                    await CreateAsync(groupEntity);

                    var listChild = group.Where(x => x.IsGroup != true).ToList();
                    foreach (var child in listChild)
                    {
                        var entity = _mapper.Map<DA_KeHoachThucHienCreateVM, DA_KeHoachThucHien>(child);
                        entity.GroupNoiDungId = groupEntity.Id;
                        listData.Add(entity);
                    }
                }

                await InsertRange(listData);
                return listData;
            }
            else
            {
                return new List<DA_KeHoachThucHien>();
            }


        }

        #region ham ho tro createKHTH
        private List<DA_KeHoachThucHienCreateVM> PreprocessKeHoachThucHienData(List<DA_KeHoachThucHienCreateVM> input)
        {
            var result = new List<DA_KeHoachThucHienCreateVM>();

            foreach (var item in input)
            {
                if (!string.IsNullOrEmpty(item.NoiDungCongViec))
                {
                    // Tách chuỗi thành từng dòng nhỏ
                    var subContents = item.NoiDungCongViecCon
                             .Split(new[] { '\n', '\r' }, StringSplitOptions.RemoveEmptyEntries)
                             .Select(x => x.Trim())
                             .Where(x => !string.IsNullOrWhiteSpace(x))
                             .Select(x => x.StartsWith("-") ? x.Substring(1).TrimStart() : x) //  bỏ dấu '-' nếu có
                             .ToList();

                    // Nếu có ít nhất 1 nội dung con, tạo công việc cha
                    if (subContents.Count > 0)
                    {
                        var groupItem = new DA_KeHoachThucHienCreateVM
                        {
                            Stt = item.Stt,
                            Group = Guid.NewGuid().ToString(), // Nhóm tạm (dùng để group sau này)
                            IsGroup = true,
                            DuAnId = item.DuAnId,
                            NgayBatDau = item.NgayBatDau,
                            NgayKetThuc = item.NgayKetThuc,
                            IsKeHoachNoiBo = item.IsKeHoachNoiBo,
                            NoiDungCongViec = item.NoiDungCongViec,
                            // Hạng mục làm nội dung nhóm

                            PhanCongKH = item.PhanCong
                        };
                        result.Add(groupItem);

                        // Tạo công việc con
                        foreach (var sub in subContents)
                        {
                            result.Add(new DA_KeHoachThucHienCreateVM
                            {
                                Group = groupItem.Group, // Trùng để group sau
                                IsGroup = false,
                                DuAnId = item.DuAnId,
                                NgayBatDau = item.NgayBatDau,
                                NgayKetThuc = item.NgayKetThuc,
                                IsKeHoachNoiBo = item.IsKeHoachNoiBo,
                                NoiDungCongViec = sub,


                            });
                        }
                    }
                    else
                    {
                        // Nếu không có nội dung tách thì giữ nguyên
                        result.Add(item);
                    }
                }
                else
                {
                    result.Add(item);
                }
            }

            return result;
        }



        #endregion
    }
}

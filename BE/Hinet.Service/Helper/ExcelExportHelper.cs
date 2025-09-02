using OfficeOpenXml;
using OfficeOpenXml.Style;
using Color = System.Drawing.Color;

namespace Hinet.Service.Helper
{
    public static class ExcelExportHelper
    {
        static ExcelExportHelper()
        {
            // Set license context
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        }

        

        /// <summary>
        /// Khởi tạo các style thường dùng trong workbook
        /// </summary>
        public static void InitializeCommonStyles(ExcelPackage package)
        {
            // Tạo header style cho đầu bảng
            if (package.Workbook.Styles.NamedStyles.All(s => s.Name != "HeaderStyle"))
            {
                var headerStyle = package.Workbook.Styles.CreateNamedStyle("HeaderStyle");
                headerStyle.Style.Font.Bold = true;
                headerStyle.Style.Fill.PatternType = ExcelFillStyle.Solid;
                headerStyle.Style.Fill.BackgroundColor.SetColor(Color.LightGray);
                headerStyle.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                headerStyle.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                headerStyle.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                headerStyle.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                headerStyle.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                headerStyle.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                headerStyle.Style.WrapText = true;
            }

            // Tạo style cho dữ liệu số
            if (package.Workbook.Styles.NamedStyles.All(s => s.Name != "NumericStyle"))
            {
                var numericStyle = package.Workbook.Styles.CreateNamedStyle("NumericStyle");
                numericStyle.Style.Numberformat.Format = "#,##0";
                numericStyle.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                numericStyle.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                numericStyle.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                numericStyle.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                numericStyle.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                numericStyle.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            }

            // Tạo style cho tổng cộng
            if (package.Workbook.Styles.NamedStyles.All(s => s.Name != "SummaryStyle"))
            {
                var summaryStyle = package.Workbook.Styles.CreateNamedStyle("SummaryStyle");
                summaryStyle.Style.Font.Bold = true;
                summaryStyle.Style.Numberformat.Format = "#,##0";
                summaryStyle.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                summaryStyle.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                summaryStyle.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                summaryStyle.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                summaryStyle.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                summaryStyle.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            }

            // Add percentage style
            if (package.Workbook.Styles.NamedStyles.All(s => s.Name != "PercentageStyle"))
            {
                var percentageStyle = package.Workbook.Styles.CreateNamedStyle("PercentageStyle");
                percentageStyle.Style.Numberformat.Format = "0.00\\%";
                percentageStyle.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                percentageStyle.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                percentageStyle.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                percentageStyle.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                percentageStyle.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                percentageStyle.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            }
            
            // Tạo style cho dữ liệu văn bản
            if (package.Workbook.Styles.NamedStyles.Any(s => s.Name == "TextStyle"))
            {
                return;
            }

            var textStyle = package.Workbook.Styles.CreateNamedStyle("TextStyle");
            textStyle.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            textStyle.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            textStyle.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            textStyle.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            textStyle.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            textStyle.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            textStyle.Style.WrapText = true;
        }

        /// <summary>
        /// Áp dụng style cho tiêu đề hoặc phần header của bảng
        /// </summary>
        public static void ApplyTitleStyle(ExcelRange range, string value, int fontSize = 14)
        {
            range.Value = value;
            range.Merge = true;
            range.Style.Font.Bold = true;
            range.Style.Font.Size = fontSize;
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
        }

/// <summary>
/// Applies a named style to a range, with special handling for known style names
/// </summary>
/// <param name="range">The Excel range to style</param>
/// <param name="styleName">The name of the predefined style to apply</param>
public static void ApplyStyleToRange(ExcelRange range, string styleName)
{
    switch (styleName)
    {
        case "HeaderStyle":
            // Headers with bold text, borders, background color and centered text
            range.Style.Font.Bold = true;
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(204, 204, 204)); // Light gray
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            range.Style.WrapText = true;
            break;

        case "IndexStyle":
            // Index row with bold text, borders and centered alignment
            range.Style.Font.Bold = true;
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(222, 222, 222)); // Lighter gray
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            break;

        case "DataStyle":
            // Regular data with borders
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            break;

        case "NumericStyle":
            // Numeric values with right alignment
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            range.Style.Numberformat.Format = "#,##0";
            break;

        case "PercentStyle":
            // Percentage formatting
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            range.Style.Numberformat.Format = "0.00%";
            break;

        case "DateStyle":
            // Date formatting
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            range.Style.Numberformat.Format = "dd/MM/yyyy";
            break;

        case "SummaryStyle":
            // Summary row with bold text and borders
            range.Style.Font.Bold = true;
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(222, 222, 222)); // Lighter gray
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            break;

        case "TitleStyle":
            // Report title style
            range.Style.Font.Bold = true;
            range.Style.Font.Size = 14;
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            break;

        case "SubtitleStyle":
            // Subtitle style
            range.Style.Font.Bold = true;
            range.Style.Font.Size = 12;
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            break;
            
        case "GuidanceStyle":
            // For guidance text
            range.Style.Font.Italic = true;
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            range.Style.WrapText = true;
            break;
            
        case "ErrorStyle":
            // Highlight errors
            range.Style.Font.Color.SetColor(Color.Red);
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(255, 235, 235));
            break;

        default:
            // Default style if none specified
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            break;
    }
}
        
        /// <summary>
        /// Thêm phần hướng dẫn vào báo cáo
        /// </summary>
        public static void AddGuidanceSection(ExcelWorksheet worksheet, int startRow, int columnCount, string[] guidanceLines)
        {
            // Tiêu đề hướng dẫn
            worksheet.Cells[startRow, 1].Value = "Hướng dẫn cách ghi biểu:";
            worksheet.Cells[startRow, 1, startRow, columnCount].Merge = true;
            worksheet.Cells[startRow, 1].Style.Font.Bold = true;

            // Nội dung hướng dẫn
            for (var i = 0; i < guidanceLines.Length; i++)
            {
                var cell = worksheet.Cells[startRow + i + 1, 1, startRow + i + 1, columnCount];
                cell.Merge = true;
                cell.Value = guidanceLines[i];
            }
        }

        /// <summary>
        /// Áp dụng các cell header từ danh sách
        /// </summary>
        public static void ApplyHeaderCells(ExcelWorksheet worksheet, 
            List<(int Row, int Col, string Value, int MergeRowSpan, int MergeColSpan)> headerCells)
        {
            foreach (var cell in headerCells)
            {
                // Set the value
                worksheet.Cells[cell.Row, cell.Col].Value = cell.Value;
        
                // Merge if needed
                if (cell.MergeRowSpan > 1 || cell.MergeColSpan > 1)
                {
                    worksheet.Cells[cell.Row, cell.Col, 
                        cell.Row + cell.MergeRowSpan - 1, 
                        cell.Col + cell.MergeColSpan - 1].Merge = true;
                }
            }
    
            // Apply styles to all affected cells after merging
            var minRow = headerCells.Min(c => c.Row);
            var maxRow = headerCells.Max(c => c.Row + c.MergeRowSpan - 1);
            var minCol = headerCells.Min(c => c.Col);
            var maxCol = headerCells.Max(c => c.Col + c.MergeColSpan - 1);
    
            ApplyStyleToRange(worksheet.Cells[minRow, minCol, maxRow, maxCol], "HeaderStyle");
        }

        
        
        /// <summary>
        /// Creates summary formulas (SUM) for a range of columns in the summary row
        /// </summary>
        /// <param name="worksheet">The worksheet to add formulas to</param>
        /// <param name="summaryRow">The row number where summary formulas should be placed</param>
        /// <param name="startDataRow">The first row of data to include in the sum</param>
        /// <param name="endDataRow">The last row of data to include in the sum</param>
        /// <param name="startCol">The first column to create a formula for</param>
        /// <param name="endCol">The last column to create a formula for</param>
        public static void CreateSummaryFormulas(ExcelWorksheet worksheet, int summaryRow, int startDataRow, int endDataRow, int startCol, int endCol)
        {
            for (int col = startCol; col <= endCol; col++)
            {
                // Get column letters for the formula
                string columnLetter = GetExcelColumnName(col);
        
                // Create formula: =SUM(B5:B9) format
                string formula = $"=SUM({columnLetter}{startDataRow}:{columnLetter}{endDataRow})";
        
                // Apply formula to the cell
                worksheet.Cells[summaryRow, col].Formula = formula;
            }
        }
        
        public static void OptimizeColumnWidths(ExcelWorksheet worksheet, int startCol, int endCol, double minWidth = 12, double maxWidth = 50)
        {
            for (var i = startCol; i <= endCol; i++)
            {
                // AutoFit will calculate width based on visible content
                worksheet.Column(i).AutoFit();
        
                // Apply min/max constraints
                if (worksheet.Column(i).Width < minWidth)
                    worksheet.Column(i).Width = minWidth;
                else if (worksheet.Column(i).Width > maxWidth)
                {
                    worksheet.Column(i).Width = maxWidth;
            
                    // When limiting width, ensure text wrapping is enabled for cells in this column
                    for (var row = 1; row <= worksheet.Dimension.End.Row; row++)
                    {
                        if (worksheet.Cells[row, i].Value != null)
                        {
                            worksheet.Cells[row, i].Style.WrapText = true;
                        }
                    }
                }
            }
        }

        
        /// <summary>
        /// Tạo dòng đánh số cột
        /// </summary>
        public static void CreateIndexRow(ExcelWorksheet worksheet, int indexRow, int columnCount)
        {
            // Create an IndexStyle if it doesn't exist yet
            if (!worksheet.Workbook.Styles.NamedStyles.Any(s => s.Name == "IndexStyle"))
            {
                var indexStyle = worksheet.Workbook.Styles.CreateNamedStyle("IndexStyle");
                indexStyle.Style.Fill.PatternType = ExcelFillStyle.Solid;
                indexStyle.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(240, 240, 240)); // Light gray
                indexStyle.Style.Font.Bold = true;
                indexStyle.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                indexStyle.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                indexStyle.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                indexStyle.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                indexStyle.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                indexStyle.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            }
    
            // Fill values
            for (var i = 1; i <= columnCount; i++)
            {
                worksheet.Cells[indexRow, i].Value = i;
            }
    
            // Apply style to the entire range at once, outside the using statement
            var indexRange = worksheet.Cells[indexRow, 1, indexRow, columnCount];
            indexRange.StyleName = "IndexStyle";
        }


        /// <summary>
        /// Tạo bảng dữ liệu nhanh từ danh sách đối tượng
        /// </summary>
        public static void LoadDataTable<T>(ExcelWorksheet worksheet, IEnumerable<T> data, int startRow, int startCol,
            Func<T, List<object>> rowDataSelector, bool applyNumericStyle = true)
        {
            // Tạo danh sách các mảng dữ liệu
            var dataList = data.Select(item => rowDataSelector(item).ToArray()).ToList();

            // Nạp dữ liệu vào worksheet
            if (dataList.Any())
            {
                worksheet.Cells[startRow, startCol].LoadFromArrays(dataList);

                // Áp dụng style cho cột đầu tiên (thường là tên đơn vị hoặc mô tả)
                int lastRow = startRow + dataList.Count - 1;
                worksheet.Cells[startRow, startCol, lastRow, startCol].StyleName = "TextStyle";

                // Áp dụng style số cho các cột còn lại nếu yêu cầu
                if (applyNumericStyle && dataList[0].Length > 1)
                {
                    int lastCol = startCol + dataList[0].Length - 1;
                    worksheet.Cells[startRow, startCol + 1, lastRow, lastCol].StyleName = "NumericStyle";
                }
            }
        }

        /// <summary>
        /// Tạo dòng tổng cộng tự động
        /// </summary>
        public static void CreateSummaryRow(ExcelWorksheet worksheet, int summaryRow, int startCol, int endCol,
            int dataStartRow, int dataEndRow, string summaryText = "Tổng")
        {
            // Đặt tên cho dòng tổng
            worksheet.Cells[summaryRow, startCol].Value = summaryText;

            // Tạo công thức tổng cho các cột số liệu
            for (var col = startCol + 1; col <= endCol; col++)
            {
                var colLetter = GetExcelColumnName(col);
                worksheet.Cells[summaryRow, col].Formula = $"SUM({colLetter}{dataStartRow}:{colLetter}{dataEndRow})";
            }

            // Áp dụng style tổng
            worksheet.Cells[summaryRow, startCol, summaryRow, endCol].StyleName = "SummaryStyle";
        }

        /// <summary>
        /// Lấy tên cột trong Excel (A, B, C, ... AA, AB, ...)
        /// </summary>
        public static string GetExcelColumnName(int columnNumber)
        {
            string columnName = "";
            while (columnNumber > 0)
            {
                int modulo = (columnNumber - 1) % 26;
                columnName = Convert.ToChar('A' + modulo) + columnName;
                columnNumber = (columnNumber - modulo) / 26;
            }

            return columnName;
        }

        // Giữ các phương thức định dạng hiện tại để tương thích ngược
        public static void ApplyHeaderRangeStyle(ExcelRange range)
        {
            range.Style.Font.Bold = true;
            range.Style.Fill.PatternType = ExcelFillStyle.Solid;
            range.Style.Fill.BackgroundColor.SetColor(Color.LightGray);
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            range.Style.WrapText = true;
        }

        public static void ApplyDataCellStyle(ExcelRange range, bool enableWrapping = true)
        {
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            range.Style.WrapText = enableWrapping;
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
        }

        public static void ApplyNumericCellStyle(ExcelRange range)
        {
            range.Style.Numberformat.Format = "#,##0";
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
        }

        public static void ApplySummaryRowStyle(ExcelRange range)
        {
            range.Style.Font.Bold = true;
            range.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            range.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            range.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
            range.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
        }


        /// <summary>
        /// Exports data to Excel and returns as base64 string
        /// </summary>
        public static async Task<string> ExportToBase64(Action<ExcelPackage> buildExcelAction)
        {
            using var package = new ExcelPackage();
            buildExcelAction(package);

            // Convert to base64
            var stream = new MemoryStream();
            await package.SaveAsAsync(stream);
            stream.Position = 0;

            return Convert.ToBase64String(stream.ToArray());
        }
    }
}
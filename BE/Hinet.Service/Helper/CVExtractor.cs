using Hinet.Service.CvAnalyzerService.Dto;
using System.Globalization;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Text;

public static class CVExtractor
{
    private static readonly List<string> hoVietNam = new List<string> {
        "dinh", "nguyen", "tran", "le", "pham", "hoang", "huynh", "phan", "vu", "vo",
    "dang", "bui", "do", "ho", "ngo", "duong", "ly", "trinh", "ta", "to",
    "cao", "lam", "ha", "mai", "doan", "truong", "vuong", "la", "chau",
    "kieu", "dao", "trieu", "ton", "luu", "tang", "thach", "anh", "giang", "luong",
    "cat", "diep", "mac", "khong", "lac", "vi", "cung", "khau", "au",
    "vien", "quy", "khuong", "phung", "bang", "giap", "phung", "co", "dao",
    "quach", "vinh", "tuan", "khuong", "ung", "tong", "han", "khiem", "khuat",
    "bach", "dau", "chung", "khuc", "du", "duc", "thach", "vien", "phu", "bang",
    "giap", "khong", "khuong", "lam", "lac", "ma", "man", "moc", "nham", "nong",
    "phu", "quy", "tong", "ung", "van", "vi", "vinh", "quach", "nham", "giac",
    "du", "dieu", "khuu", "lam", "lo", "mieng", "nong", "phi", "phong", "tiep",
    "vong", "vong", "uong", "cat", "di", "dinh", "khuong", "khuu", "lang",
    "mong", "nghiem", "nghi", "nham", "thach", "tien", "ung", "vien", "y", "ung"
    };

    private static readonly List<string> tinhThanhVN = new List<string> {
        "Ha Noi", "Ha Giang", "Cao Bang", "Bac Kan", "Tuyen Quang", "Lao Cai", "Dien Bien", "Lai Chau",
        "Son La", "Yen Bai", "Hoa Binh", "Thai Nguyen", "Lang Son", "Quang Ninh", "Bac Giang", "Phu Tho",
        "Vinh Phuc", "Bac Ninh", "Hai Duong", "Hai Phong", "Hung Yen", "Thai Binh", "Ha Nam", "Nam Dinh",
        "Ninh Binh", "Thanh Hoa", "Nghe An", "Ha Tinh", "Quang Binh", "Quang Tri", "Thua Thien Hue",
        "Da Nang", "Quang Nam", "Quang Ngai", "Binh Dinh", "Phu Yen", "Khanh Hoa", "Ninh Thuan", "Binh Thuan",
        "Kon Tum", "Gia Lai", "Dak Lak", "Dak Nong", "Lam Dong", "Binh Phuoc", "Tay Ninh", "Binh Duong",
        "Dong Nai", "Ba Ria - Vung Tau", "Ho Chi Minh", "Long An", "Tien Giang", "Ben Tre", "Tra Vinh",
        "Vinh Long", "Dong Thap", "An Giang", "Kien Giang", "Can Tho", "Hau Giang", "Soc Trang", "Bac Lieu", "Ca Mau"
    };

    private static readonly List<string> keywordLoaiTru = new List<string> {
        "intern", "developer", "cv", "curriculum", "vitae", "engineer", "student", "software", "programmer"
    };

    public static string ExtractInfoAsJson(string rawText)
    {
        var info = new CvAnalyzeDto();
        var rawTextNoDiacritics = RemoveDiacritics(rawText).ToLower();

        // Email
        var emailMatch = Regex.Match(rawText, @"[\w\.-]+@[\w\.-]+\.\w+");
        info.Email = emailMatch.Success ? emailMatch.Value : null;

        // Quê quán
        info.Hometown = DetectLocation(rawText);

        // Họ tên (loại bỏ nếu trùng địa danh)
        var detectedName = DetectVietnameseName(rawText, info.Hometown);
        info.FullName = CleanFullName(detectedName) ?? "";

        // Ngày sinh
        var dobMatch = Regex.Match(rawTextNoDiacritics, @"\b(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})\b");
        if (dobMatch.Success && DateTime.TryParse(dobMatch.Value, out var dob))
        {
            info.DateOfBirth = dob.ToString("yyyy-MM-ddTHH:mm:ssZ");
        }

        // SĐT
        var phoneMatch = Regex.Match(rawText, @"(\+84|0)[1-9][0-9]{8,9}");
        info.PhoneNumber = phoneMatch.Success ? phoneMatch.Value : null;

        return JsonSerializer.Serialize(info, new JsonSerializerOptions
        {
            DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull
        });
    }

    public static string DetectVietnameseName(string rawText, string currentLocation = null)
    {
        var rawNoDiacritics = RemoveDiacritics(rawText);
        var lines = rawText.Split('\n', '\r')
                           .Select(x => x.Trim())
                           .Where(x => !string.IsNullOrWhiteSpace(x))
                           .ToList();

        foreach (var line in lines)
        {
            var lineNoDiacritics = RemoveDiacritics(line).ToLower();

            // Loại bỏ nếu chứa từ khóa nghề nghiệp
            if (keywordLoaiTru.Any(k => lineNoDiacritics.Contains(k)))
                continue;

            // Tách từ
            var words = lineNoDiacritics.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (words.Length < 2 || words.Length > 6) continue;

            // Họ nằm đầu
            if (hoVietNam.Contains(words[0]))
            {
                // Không phải là tỉnh/thành
                if (currentLocation != null && RemoveDiacritics(currentLocation).ToLower().Contains(words[0]))
                    continue;

                return line.Trim();
            }
        }

        return null;
    }

    public static string DetectLocation(string rawText)
    {
        var rawNoDiacritics = RemoveDiacritics(rawText).ToLower();
        foreach (var city in tinhThanhVN)
        {
            var cityNoDiacritics = RemoveDiacritics(city).ToLower();
            if (rawNoDiacritics.Contains(cityNoDiacritics))
            {
                return city;
            }
        }
        return null;
    }

    public static string CleanFullName(string fullNameRaw)
    {
        if (string.IsNullOrWhiteSpace(fullNameRaw))
            return null;

        // Bỏ ký tự đặc biệt
        var name = Regex.Replace(fullNameRaw, @"[^a-zA-ZÀ-ỹ\s]", "").Trim();

        // Capitalize
        return string.Join(" ", name
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(w => char.ToUpper(w[0]) + w.Substring(1).ToLower()));
    }

    private static string RemoveDiacritics(string text)
    {
        if (string.IsNullOrEmpty(text)) return text;
        var normalized = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (char c in normalized)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }
        return sb.ToString().Normalize(NormalizationForm.FormC);
    }
}

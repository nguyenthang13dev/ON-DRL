using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Windows;

namespace CommonHelper.CrawlProvider
{

    public static class CrawlProvider
    {

        private readonly static HttpClient _client = new HttpClient();

        //public static void SetHeader()
        //{
        //    _client.DefaultRequestHeaders
        //}
        public static void CheckDirectory(string path)
        {
            if (!Directory.Exists(path))
            {
                try
                {
                    Directory.CreateDirectory(path);
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        public static void CheckFile(string path)
        {
            if (!File.Exists(path))
            {
                try
                {
                    File.Create(path).Close();
                }
                catch (Exception ex)
                {
                    throw;
                }
            }
        }

        public static bool IsNullOrEmpty(this string value)
        {
            return string.IsNullOrEmpty(value);
        }
        public async static Task<string> GetHtml(string url)
        {

            try
            {
                using (var response = await _client.GetAsync(url, HttpCompletionOption.ResponseHeadersRead))
                {
                    var html = await response.Content.ReadAsStringAsync();
                    return html;
                }

            }
            catch (Exception ex)
            {
                return "";
            }

        }
        public static List<string> GetInnerRegex(string pattem, string input)
        {
            var result = new List<string>();
            Regex regex = new Regex(pattem, RegexOptions.Multiline | RegexOptions.Singleline);
            var match = regex.Match(input);
            if (match.Success)
            {
                for (int i = 1; i < match.Groups.Count; i++)
                {
                    result.Add(match.Groups[i].Value);
                }
            }
            if (result.Count == 0)
                result.Add("");
            return result;
        }

        public static List<List<string>> GetListInnerRegex(string pattem, string input)
        {
            var result = new List<List<string>>();
            Regex regex = new Regex(pattem, RegexOptions.Multiline | RegexOptions.Singleline);
            var matches = regex.Matches(input);
            foreach (Match match in matches)
            {
                var data = new List<string>();
                for (int i = 1; i < match.Groups.Count; i++)
                {
                    data.Add(match.Groups[i].Value);
                }
                result.Add(data);
            }
            return result;
        }

        public static List<T> To<T>(string[] properties, List<List<string>> values) where T : new()
        {
            var result = new List<T>();
            var type = typeof(T);
            foreach (var value in values)
            {
                var entity = new T();
                for (int i = 0; i < properties.Length; i++)
                {
                    var property = type.GetProperty(properties[i]);
                    if (property != null)
                    {
                        property.SetValue(entity, value[i]);
                    }
                }
                result.Add(entity);
            }
            return result;
        }

        public static string HtmlDecode(this string str)
        {
            return HttpUtility.HtmlDecode(str);
        }

        public static void HtmlDecode(ref string str)
        {
            str = HttpUtility.HtmlDecode(str);
        }

        public static string UrlDecode(this string url)
        {
            return HttpUtility.UrlDecode(url);
        }

        public static string RemoveTag(string str, string[] tags = null)
        {
            if (str is null)
                return str;
            if (tags == null || tags.Length == 0)
            {
                tags = new string[] { "b", "i", "a", "p", "span", "div", "strong", "em", "figure", "figcaption", "table", "img", "ntrs" };
            }

            foreach (var tag in tags)
            {
                var regex = new Regex($@"<{tag}.*?>", RegexOptions.Singleline | RegexOptions.Multiline);
                str = regex.Replace(str, string.Empty);
                str = str.Replace($"</{tag}>", string.Empty);
            }
            if (tags.Contains("table"))
            {
                var regexTable = new Regex(@"<table .*? </table>");
                str = regexTable.Replace(str, string.Empty);
            }
            if (tags.Contains("img"))
            {
                var regexImg = new Regex(@"<img.*?>");
                str = regexImg.Replace(str, string.Empty);
            }
            if (tags.Contains("ntrs"))
            {
                str = str.RemoveNTRS();
            }
            return str;
        }

        public static string AddBaseUrlForHref(this string str, string baseUrl)
        {
            var lstHref = GetListInnerRegex(@"href=""(.*?)""", str);
            foreach (var href in lstHref)
            {
                var h = href.FirstOrDefault();
                if (h != null && (h.StartsWith("/") || h.StartsWith("\\")) && !h.StartsWith(baseUrl))
                {
                    str = str.Replace(h, baseUrl + h);
                }
            }
            return str;
        }

        public static string RemoveNTRS(this string str)
        {
            return str.Replace("\n", string.Empty).Replace("\r", string.Empty).Replace("\t", string.Empty).Trim();
        }
        public static string GetContentInHtml(string html)
        {
            return RemoveTag(HtmlDecode(html));
        }

        public static DateTime? ToDateTime(this string str, string parseExact = null)
        {
            if (string.IsNullOrEmpty(str))
                return DateTime.Now;

            if (!string.IsNullOrEmpty(parseExact))
            {
                return DateTime.ParseExact(str, parseExact, null);
            }

            return Convert.ToDateTime(str);
        }

        public static string AddBaseUrl(this string item, string baseUrl)
        {
            if (!string.IsNullOrEmpty(item) && !item.StartsWith(baseUrl))
            {
                item = baseUrl + item;
            }
            return item;
        }

        public static async void SaveImage(string url, string pathImage)
        {
            var response = await _client.GetAsync(url);
            byte[] content = await response.Content.ReadAsByteArrayAsync();
            //return "data:image/png;base64," + Convert.ToBase64String(content);
            File.WriteAllBytes(pathImage, content);
        }

        //public static void SaveToFile(string path, string fileName, object entity)
        //{
        //    var pathFile = fileName;
        //    if (!string.IsNullOrEmpty(path))
        //    {
        //        CheckDirectory(path);
        //        pathFile = Path.Combine(path, fileName);
        //    }
        //    CheckFile(pathFile);
        //    try
        //    {
        //        if (entity.GetType() == typeof(string))
        //        {
        //            File.WriteAllText(pathFile, entity.ToString());
        //        }
        //        else
        //        {
        //            var content = JsonConvert.SerializeObject(entity);
        //            File.WriteAllText(pathFile, content);
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        throw;
        //    }
        //}

    }

}



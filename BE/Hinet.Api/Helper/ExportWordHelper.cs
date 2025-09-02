using Google.Protobuf.WellKnownTypes;
using Microsoft.Extensions.Hosting.Internal;
using System.Reflection;
using System.Text.RegularExpressions;
using Xceed.Words.NET;
using MSWordApp = Microsoft.Office.Interop.Word.Application;
using MSDocument = Microsoft.Office.Interop.Word.Document;
using System.Threading.Tasks; 

namespace Hinet.Api.Helper
{
    public class ExportWordHelper<T> where T : class
    {
        public ExportWordHelper(string templateFilePath, string tempFolderPath, string outputFolderPath, string fileName)
        {
            this.templateFilePath = templateFilePath;
            this.tempFolderPath = tempFolderPath;
            this.outputFolderPath = outputFolderPath;
            this.fileName = fileName;
        }
        public ExportWordHelper()
        {
        }
        //private static string UploadFolderPath = HostingEnvironment.MapPath("/");
        public string templateFilePath { set; get; } //đường dẫn file mẫu
        public string tempFolderPath { set; get; } //thư mục chứa file tạm
        public string outputFolderPath { set; get; } //thư mục chứa file kết quả
        public string fileName { set; get; } //tên file kết quả

        public MSWordApp app { set; get; }
        public MSDocument doc { set; get; }
         
        private string SetNewFileName(string oldFileName, string itemid = "")
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var tmp = new string(Enumerable.Repeat(chars, 10).Select(s => s[random.Next(s.Length)]).ToArray());
            string result = string.Empty;
            result = oldFileName.Replace(".doc", string.Empty)
                    .Replace(".dot", string.Empty)
                    .Replace(".docx", string.Empty)
                    .Replace(".docm", string.Empty)
                    .Replace(".dotx", string.Empty)
                    .Replace(".dotm", string.Empty)
                    .Replace("docb", string.Empty) + DateTime.Now.ToString("-ddMMyyyy_hhmmss") + "_" + tmp + "_" + itemid + ".docx";
            return result;
        }

        public class ExportWordResult
        {
            public bool exportSuccess { set; get; }
            public string exportResultMessage { set; get; }
            public string exportResultUrl { set; get; }
            public string exportResultFileName { set; get; }
            public string exportResultUrlPDF { set; get; }
            public ExportWordResult()
            {
                exportResultMessage = string.Empty;
                exportResultUrl = string.Empty;
                exportResultFileName = string.Empty;
                exportResultUrlPDF = string.Empty;
            }
        }
    }
}

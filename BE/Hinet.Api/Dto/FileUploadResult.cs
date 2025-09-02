namespace Hinet.Api.Dto
{
    public class FileUploadResult
    {
        public string? OriginalName { get; set; }
        public string? StoredName { get; set; }
        public string? FilePath { get; set; }
        public long Size { get; set; }
        public string? ContentType { get; set; }
        public DateTime UploadDate { get; set; }
    }
}

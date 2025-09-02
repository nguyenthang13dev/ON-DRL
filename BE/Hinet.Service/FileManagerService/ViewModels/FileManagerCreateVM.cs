using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.FileManagerService.ViewModels
{
    public class FileManagerCreateVM
    {
        [Required] public string Name { get; set; }

        public Guid? ParentId { get; set; }
        public string? Path { get; set; }
        public long? Size { get; set; }
        public bool? IsDirectory { get; set; }
        public string? FileExtension { get; set; }
        public string? MimeType { get; set; }
    }
}
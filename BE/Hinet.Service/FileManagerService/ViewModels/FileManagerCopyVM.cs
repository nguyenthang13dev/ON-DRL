using Hinet.Model.Entities;

namespace Hinet.Service.FileManagerService.ViewModels
{
    public class FileManagerCopyVM
    {
        public List<FileManager> SourceItems { get; set; }
        public FileManager? DestinationFolder { get; set; }
    }
}
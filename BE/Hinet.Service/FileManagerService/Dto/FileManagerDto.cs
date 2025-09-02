using Hinet.Model.Entities;

namespace Hinet.Service.FileManagerService.Dto
{
    public class FileManagerDto : FileManager
    {
        public FilePermissionDto? Permission { get; set; }
        public string? TenLoaiVanBan { get; set; }
    }
}
namespace Hinet.Service.FileManagerService.Dto
{
    public class FilePermissionDto
    {
        public bool Create { get; set; }
        public bool Upload { get; set; }
        public bool Move { get; set; }
        public bool Copy { get; set; }
        public bool Rename { get; set; }
        public bool Download { get; set; }
        public bool Delete { get; set; }
        public bool Share { get; set; }

        public FilePermissionDto()
        {
            Create = true;
            Upload = true;
            Move = true;
            Copy = true;
            Rename = true;
            Download = true;
            Delete = true;
            Share = true;
        }
    }
}
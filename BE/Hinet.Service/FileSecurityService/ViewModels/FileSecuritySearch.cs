using Hinet.Service.Dto;

namespace Hinet.Service.FileSecurityService.Dto
{
    public class FileSecuritySearch : SearchBase
    {
        public Guid? SharedByID {get; set; }
		public Guid? fileID {get; set; }
		public string? SharedToType {get; set; }
		public Guid? SharedToID {get; set; }
		public bool? canRead {get; set; }
		public bool? canWrite {get; set; }
		public bool? canDelete {get; set; }
		public bool? canShare {get; set; }
    }
}

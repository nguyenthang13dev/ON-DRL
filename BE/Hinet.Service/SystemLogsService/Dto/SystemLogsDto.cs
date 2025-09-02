using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Constant;

namespace Hinet.Service.SystemLogsService.Dto
{
    public class SystemLogsDto : SystemLogs
    {
        public string? AppUserName {get; set; }
		public string? MaQuanLyName {get; set; }
		public string? LevelName => ConstantExtension.GetName<LogLevelConstant>(Level);
    }
}

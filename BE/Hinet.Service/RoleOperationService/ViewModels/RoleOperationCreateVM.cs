
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.RoleOperationService.ViewModels
{
    public class RoleOperationCreateVM
    {
		public Guid RoleId { get; set; }
        public List<OperationIdCreateVM> ListOperationCreateVM { get; set; } = new List<OperationIdCreateVM>();
    }

	public class OperationIdCreateVM
	{
        public int IsAccess { get; set; }
        public Guid OperationId { get; set; }
    }
}
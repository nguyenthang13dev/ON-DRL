using Hinet.Model.Entities;
using System.ComponentModel;

namespace Hinet.Service.DepartmentService.Dto
{
    public class FormTemplateDto : Department
    {
        public List<DepartmentUser> Users { get; set; } = new List<DepartmentUser>();
    }

    public class DepartmentUser
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class DepartmentExport
    {
       
        public int STT { get; set; }
        [DisplayName("Tên")]
        public string Name { get; set; }
        [DisplayName("Mã")]
        public string Code { get; set; }
        [DisplayName("Trạng thái")]
        public string Status { get; set; }

        [DisplayName("Tổ chức/đơn vị cha")]
        public string Parent { get; set; }
        [DisplayName("Ngày tạo")]
        public string CreatedDate { get; set; }
    }
}

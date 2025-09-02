using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.OperationService.Dto
{
    public class MenuDto
    {
        public Guid Id { get; set; }
        public Guid ModuleId { get; set; }
        public string? Name { get; set; }
        public string? URL { get; set; }
        public string? Code { get; set; }
        public string? Css { get; set; }
        public bool IsShow { get; set; }
        public int Order { get; set; }
        /// <summary>
        /// Icon hiển thị trên Mobile
        /// </summary>
        public string? Icon { get; set; }
        public string? TrangThaiHienThi { get; set; }
        public bool IsAccess { get; set; }
    }

    public class MenuDataDto
    {
        public Guid Id { get; set; }
        public string? Code { get; set; }
        public string? Name { set; get; }
        public int Order { get; set; }
        public bool IsShow { get; set; }
        public string? Icon { get; set; }
        public string? ClassCss { get; set; }
        public string? StyleCss { get; set; }
        public string? Link { get; set; }
        public bool? AllowFilterScope { get; set; }
        public bool? IsMobile { get; set; }
        public bool? IsAccess { get; set; } //User có thể thấy module hay không
        public List<MenuDto>? ListMenu { get; set; }
    }
}

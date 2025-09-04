
namespace Hinet.Service.TypeDanhMucService.ViewModels
{
    public class TypeDanhMucCreateVM
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public string? CodeDm { get; set; }
        public int? Min { get; set; }
        public int? Max { get; set; }
    }
}
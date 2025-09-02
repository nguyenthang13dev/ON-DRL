using Hinet.Model.Entities;

namespace Hinet.Api.ViewModels.CdsNhomTIeuChi
{
    public class ConfigVM
    {
        public List<SelectListAntd>? ListTieuChiTinhDiemMinMax { get; set; }
    }

    public class SelectListAntd
    {
        public string? Label { get; set; }
        public string? Value { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.Constant.QLNhanSu
{
    public class TrangThaiLamViecConstant
    {
    }
    public enum TrangThaiLamViecEnum
    {
        [Description("Nghỉ việc")]
        NghiViec = 0,

        [Description("Đang làm việc")]
        DangLamViec = 1,

        [Description("Nghỉ phép")]
        NghiPhep = 2,

        [Description("Nghỉ ốm")]
        NghiOm = 3,

        [Description("Tạm nghỉ")]
        TamNghi = 4,

        [Description("Chờ quyết định")]
        ChoQuyetDinh = 5
    }
    public static class EnumExtensions
    {
        public static string GetDescription(this Enum value)
        {
            var field = value.GetType().GetField(value.ToString());
            var attribute = field?.GetCustomAttribute<DescriptionAttribute>();
            return attribute?.Description ?? value.ToString();
        }
    }
}

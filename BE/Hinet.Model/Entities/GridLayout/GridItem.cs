using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.GridLayout
{
    public class GridItem
    {

        public string i { get; set; }  // ID của item
        public int x { get; set; }     // Vị trí cột
        public int y { get; set; }     // Vị trí hàng
        public int w { get; set; }     // Chiều rộng
        public int h { get; set; }     // Chiều cao
        public bool? moved { get; set; }  // Có di chuyển không?
        public bool? isDraggable { get; set; }
        public bool? isResizable { get; set; }
        public bool? isBounded { get; set; }
        public int? minW { get; set; }
        public int? minH { get; set; }
        public int? maxW { get; set; }
        public int? maxH { get; set; }
        public int? ThuTuHienThi { get; set; }
    }
}

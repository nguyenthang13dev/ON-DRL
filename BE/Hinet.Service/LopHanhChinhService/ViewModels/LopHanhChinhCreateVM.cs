using Hinet.Model.Entities;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.LopHanhChinhService.ViewModels
{
    public class LopHanhChinhCreateVM
    {
        public string TenLop { get; set; }
        public Guid KhoaId { get; set; }
        public Guid? GiaoVienCoVanId { get; set; }
    }
}

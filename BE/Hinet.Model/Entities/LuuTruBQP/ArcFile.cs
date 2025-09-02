using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities.LuuTruBQP
{
    [Table("ArcFile")]
    public class ArcFile : AuditableEntity
    {
        [MaxLength(13)]
        public string FileCode { get; set; }
        [MaxLength(13)]
        public string? OrganId { get; set; }
        [MaxLength(10)]
        public long FileCataLog { get; set; }
        [MaxLength(20)]
        public string FileNotation { get; set; }
        [MaxLength(1000)]
        public string Title { get; set; }
        [MaxLength(100)]
        public string Maintenance { get; set; }
        public bool Rights { get; set; }
        [MaxLength(100)]
        public string Language { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        [MaxLength(10)]
        public long? TotalDoc { get; set; }
        [MaxLength(2000)]
        public string? Description { get; set; }
        [MaxLength(30)]
        public string? InforSign { get; set; }

        [MaxLength(100)]
        public string KeyWord { get; set; }
        [MaxLength(10)]
        public long? SheetNumber { get; set; }
        [MaxLength(10)]
        public long? PageNumber { get; set; }
        [MaxLength(50)]
        public string Format { get; set; }
        public int Nam { get; set; }

    }
}

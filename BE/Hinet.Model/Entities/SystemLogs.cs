using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Model.Entities
{
    [Table("SystemLogs")]
    public class SystemLogs : AuditableEntity
    {
        public Guid? UserId { get; set; }
        public Guid? MaQuanLyId { get; set; }
        public string? UserName { get; set; }
        public DateTime? Timestamp { get; set; }
        public string? IPAddress { get; set; }
        public string? Level { get; set; }
        public string? Message { get; set; }
    }
}

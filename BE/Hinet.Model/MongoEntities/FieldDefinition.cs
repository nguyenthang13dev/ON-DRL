using AspNetCore.Identity.MongoDbCore.Models;
using Hinet.Model.Entities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Model.MongoEntities
{
    public class FieldDefinition : AuditableEntity
    {
        //[BsonElement("fieldId")]
        //public string FieldId { get; set; } = default!;
        [BsonElement("label")] 
        public string Label { get; set; } = default!;
        [BsonElement("type")] 
        public string Type { get; set; } = default!; // text|textarea|select|checkbox|date|number ...
        [BsonElement("placeholder")] 
        public string? Placeholder { get; set; }
        [BsonElement("required")] 
        public bool Required { get; set; }
        [BsonElement("options")] 
        public List<string>? Options { get; set; }
        [BsonElement("cssClass")] 
        public string? CssClass { get; set; }
        [BsonElement("config")] 
        public Dictionary<string, object>? Config { get; set; }
    }
}
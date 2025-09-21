using AspNetCore.Identity.MongoDbCore.Models;
using Hinet.Model.Entities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Model.MongoEntities
{
    public class FormTemplate :  AuditableEntity
    {
        [BsonElement("name")]
        public string Name { get; set; } = default!;
        [BsonElement("description")]
        public string? Description { get; set; }
        // GridFS file id
        [BsonElement("originalFilePath")]
        public string? OriginalFilePath { get; set; }
        // cached HTML preview from docx
        [BsonElement("htmlPreview")]
        public string HtmlPreview { get; set; } = "";

        [BsonElement("isClassMonitorHandled")]
        public bool IsClassMonitorHandled { get; set; } = false;

        [BsonElement("fields")]
        public List<FieldDefinition> Fields { get; set; } = new();
    }

    public class FieldDefinition : AuditableEntity
    {
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
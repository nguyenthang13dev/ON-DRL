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
        [BsonElement("fields")]
        public List<FieldDefinition> Fields { get; set; } = new();
    }
}
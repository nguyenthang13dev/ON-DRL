using AspNetCore.Identity.MongoDbCore.Models;
using Hinet.Model.Entities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Model.MongoEntities
{
    public class FormDeclaration : AuditableEntity
    {
        [BsonElement("formTemplateId")] 
        public Guid FormTemplateId { get; set; }
        [BsonElement("name")] 
        public string Name { get; set; }
        [BsonElement("userId")] 
        public Guid UserId { get; set; } //người kê khai
        [BsonElement("status")]
        public string Status { get; set; } = "NHAP";
        [BsonElement("declaration")] 
        public Dictionary<string, object> Declaration { get; set; } = new();
    }
}
using AspNetCore.Identity.MongoDbCore.Models;
using Hinet.Model.Entities;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Model.MongoEntities
{
    public class FormResponse : AuditableEntity
    {
        //[BsonId] public ObjectId Id { get; set; }
        [BsonElement("formTemplateId")] 
        public Guid FormTemplateId { get; set; }
        [BsonElement("userId")] 
        public string UserId { get; set; } = default!;
        [BsonElement("responses")] 
        public Dictionary<string, object> Responses { get; set; } = new();
        [BsonElement("submittedAt")] 
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }
}
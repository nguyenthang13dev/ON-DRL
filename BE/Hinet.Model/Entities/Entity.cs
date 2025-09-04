using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities
{

    public class BaseEntity
    {
        public static bool operator ~(BaseEntity baseEntity) => baseEntity is not null;
    }


    public interface IEntity
    {
        public Guid Id { get; set; }
    }


    public class Entity : BaseEntity, IEntity
    {
        [Key]
        [BsonId]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //[BsonRepresentation(BsonType.ObjectId)]
        public Guid Id { get; set; }
    }
}

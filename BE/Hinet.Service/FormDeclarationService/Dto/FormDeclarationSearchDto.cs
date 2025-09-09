using Hinet.Model.MongoEntities;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Service.FormDeclarationService.Dto
{
    public class FormDeclarationSearchDto
    {
        public Guid FormTemplateId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string DeclaratingUser { get; set; } = string.Empty;
        public DateTime FromDate { get; set; }
        public DateTime EndDate { get; set; }
    }

}

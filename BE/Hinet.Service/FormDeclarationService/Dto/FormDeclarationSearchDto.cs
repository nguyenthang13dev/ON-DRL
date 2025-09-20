using Hinet.Model.MongoEntities;
using Hinet.Service.Dto;
using MongoDB.Bson.Serialization.Attributes;

namespace Hinet.Service.FormDeclarationService.Dto
{
    public class FormDeclarationSearchDto : SearchBase
    {
        public Guid? FormTemplateId { get; set; }
        public string? Status { get; set; } = string.Empty;
        public string? DeclaringUser { get; set; } = string.Empty;
        public DateTime? FromDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

}

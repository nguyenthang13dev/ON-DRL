using Hinet.Model.MongoEntities;


namespace Hinet.Service.FormDeclarationService.Dto
{
    public class FormDeclarationCreateDto
    {
        public Guid FormTemplateId { get; set; }
        public string Name { get; set; }
        public Guid UserId { get; set; }
        public Dictionary<string, object> Declaration { get; set; } = new();
    }

}
using Hinet.Service.Dto;

namespace Hinet.Service.FieldDefinitionService.Dto
{
    public class FieldDefinitionUpdateDto 
    {
        public Guid FormTemplateId { get; set; }
        public FieldDefinitionDto Field {  get; set; }
    }

}

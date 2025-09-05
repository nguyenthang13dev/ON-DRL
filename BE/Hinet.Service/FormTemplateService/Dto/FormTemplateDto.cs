using Hinet.Model.Entities;
using Hinet.Model.MongoEntities;
using Microsoft.AspNetCore.Http;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel;

namespace Hinet.Service.FormTemplateService.Dto
{
    public class FormTemplateDto : FormTemplate
    {
       
    }

    public class FormTemplateCreateUpdateDto
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public IFormFile OriginalFile { get; set; }
        public bool IsClassMonitorHandled { get; set; }
    }

}

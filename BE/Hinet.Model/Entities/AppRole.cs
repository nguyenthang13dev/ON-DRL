using AspNetCore.Identity.MongoDbCore.Models;
using Microsoft.AspNetCore.Identity;

namespace Hinet.Model.Entities
{
    public class AppRole : MongoIdentityRole<Guid>, IEntity
    {
    }
}

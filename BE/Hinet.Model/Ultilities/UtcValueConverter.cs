using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Hinet.Model.Ultilities
{
    public class UtcDateTimeConverter : ValueConverter<DateTime, DateTime>
    {
        public UtcDateTimeConverter() : base(
            toDb => toDb.Kind == DateTimeKind.Utc ? toDb : toDb.ToUniversalTime(),
            fromDb => DateTime.SpecifyKind(fromDb, DateTimeKind.Utc))
        {
        }
    }

    public class NullableUtcDateTimeConverter : ValueConverter<DateTime?, DateTime?>
    {
        public NullableUtcDateTimeConverter() : base(
            toDb => toDb.HasValue ? (toDb.Value.Kind == DateTimeKind.Utc ? toDb : toDb.Value.ToUniversalTime()) : null,
            fromDb => fromDb.HasValue ? DateTime.SpecifyKind(fromDb.Value, DateTimeKind.Utc) : null)
        {
        }
    }
    public static class UtcDateTimeConvention
    {
        public static void ApplyUtcDateTimeConverter(this ModelBuilder modelBuilder)
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var properties = entityType.ClrType.GetProperties()
                    .Where(p => p.PropertyType == typeof(DateTime) || p.PropertyType == typeof(DateTime?));

                foreach (var property in properties)
                {
                    var propertyBuilder = modelBuilder.Entity(entityType.ClrType).Property(property.Name);

                    if (property.PropertyType == typeof(DateTime))
                        propertyBuilder.HasConversion(new UtcDateTimeConverter());
                    else if (property.PropertyType == typeof(DateTime?))
                        propertyBuilder.HasConversion(new NullableUtcDateTimeConverter());
                }
            }
        }
    }

}

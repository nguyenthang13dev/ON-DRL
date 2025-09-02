using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonHelper.String
{
    public static class DateTimeExtensions
    {
        public static DateTime? ToUtc(this DateTime? dateTime)
        {
            if (!dateTime.HasValue)
                return null;

            return dateTime.Value.Kind == DateTimeKind.Utc
                ? dateTime
                : dateTime.Value.ToUniversalTime();
        }

        public static DateTime ToUtc(this DateTime dateTime)
        {
            return dateTime.Kind == DateTimeKind.Utc
                ? dateTime
                : dateTime.ToUniversalTime();
        }

    }
}

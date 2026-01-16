using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CommonHelper.Extenions
{
    public static class DictionaryExtension
    {
        public static ExpandoObject ToObject(Dictionary<string, string> dict)
        {
            var expando = new ExpandoObject();
            var expandoDict = (IDictionary<string, object>)expando;

            foreach (var kvp in dict)
            {
                expandoDict[kvp.Key] = kvp.Value;
            }

            return expando;
        } 
    }
}

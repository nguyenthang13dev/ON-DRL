namespace Hinet.Api.ViewModels.Import
{
    public class DataImport
    {
        public Guid IdFile { get; set; }
        public List<FieldAndSTT> Collection { get; set; }
    }

    public class FieldAndSTT
    {
        public int Order { get; set; }
        public string ColumnName { get; set; }
        public string DisplayName { get; set; }
    }

    public class DataSearchImage
    {
        public List<Guid>? ListIdImageSearch { get; set; }
    }
}

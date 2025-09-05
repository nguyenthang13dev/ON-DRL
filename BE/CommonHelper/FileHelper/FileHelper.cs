namespace CommonHelper.File
{
    public static class FileHelper
    {
        public static string GetAbsoluteFilePath(string relativePath, bool includeUploads = true)
        {
            string rootPath = Directory.GetCurrentDirectory();

            if (includeUploads)
            {
                rootPath = Path.Combine(rootPath, "wwwroot", "uploads");
            }
            else
            {
                rootPath = Path.Combine(rootPath, "wwwroot");
            }

            string sanitizedPath = relativePath.TrimStart('\\', '/');
            string absolutePath = Path.Combine(rootPath, sanitizedPath);

            return absolutePath;
        }

        public static string GetRelativeFilePath(string absolutePath, bool includeUploads = true)
        {
            string rootPath = Directory.GetCurrentDirectory();

            if (includeUploads)
            {
                rootPath = Path.Combine(rootPath, "wwwroot", "uploads");
            }
            else
            {
                rootPath = Path.Combine(rootPath, "wwwroot");
            }

            // Normalize both paths
            rootPath = Path.GetFullPath(rootPath);
            absolutePath = Path.GetFullPath(absolutePath);

            if (!absolutePath.StartsWith(rootPath, StringComparison.OrdinalIgnoreCase))
            {
                throw new ArgumentException("Đường dẫn tuyệt đối không nằm trong thư mục gốc cho phép.");
            }

            string relativePath = absolutePath.Substring(rootPath.Length).TrimStart(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
            return relativePath.Replace(Path.DirectorySeparatorChar, '/'); // chuẩn hóa dấu gạch chéo
        }

    }
}
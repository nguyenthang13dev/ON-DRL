using Hinet.Model.Entities;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.FileManagerService.Dto;
using Hinet.Service.FileManagerService.ViewModels;
using Hinet.Service.FileSecurityService.Dto;
using Microsoft.AspNetCore.Http;

namespace Hinet.Service.FileManagerService
{
    public interface IFileManagerService : IService<FileManager>
    {
        Task CopyFileOrFolder(FileManager sourceItem, FileManager? destinationFolder, List<FileManager> allFile,
            string rootPath);

        Task<FileManagerDto?> CreateFile(string rootPath, FileManagerUploadFileVM model);
        Task<FileManagerDto> CreateFileFromDB(FileManagerUploadFileVM model, string physicalPath);
        Task<FileManagerDto> CreateFolderFromDB(FileManager folder);
        Task<string> CreatePhysicalFile(string rootPath, IFormFile file);
        Task<bool> DeleteFileorFolders(List<Guid> ids, string rootPath);
        Task<bool> DeleteFileOrFolder(FileManager file, List<FileManager> allFile, string rootPath);
        Task<bool> DeletePhysical(string direction);
        Task<bool> ExistsName(Guid? parentId, string newName);
        Task<List<FileManager>> GetChilds(List<Guid>? ids, List<FileManager> allFiles);
        Task<List<FileManagerDto>> GetDataAll(FileManagerSearch search);
        Task<FileManagerDto?> GetDto(Guid id);
        Task<string> GetPath(Guid? parentID, string name);
        Task MoveFileOrFolder(FileManager sourceItem, FileManager? destinationFolder, List<FileManager> allFile);
        Task UpdatePathChilds(FileManager file);
        Task<FileManager> RenameFileOrFolder(FileManager file, string newName);
        Task<bool> SaveSecurity(List<FileSecurity> fileSecurities, Guid fileID, Guid SharedById);
        Task<List<FileSecurityDto>> GetShare(Guid fileID, Guid sharedByID);
        Task<string> Download(List<Guid> fileIDs, string rootPath, string rootZipPath, FileManagerSearch searchModal);
        Task<List<FileManagerDto>> SearchData(FileManagerSearch search);
        Task<bool> RemoveSecurity(List<FileManager> listFilemanagers);
    }
}
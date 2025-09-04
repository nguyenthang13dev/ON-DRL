using Hinet.Model.Entities;
using Hinet.Model.MongoEntities;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.FormTemplateRepository;
using Hinet.Repository.RoleRepository;
using Hinet.Repository.UserRoleRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Constant;
using Hinet.Service.DepartmentService.ViewModels;
using Hinet.Service.DM_NhomDanhMucService.Dto;
using Hinet.Service.Dto;
using Hinet.Service.FormTemplateService.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Text.RegularExpressions;

namespace Hinet.Service.FormTemplateService
{
    public class FormTemplateService : Service<FormTemplate>, IFormTemplateService
    {
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IAppUserRepository _appUserRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IMemoryCache _cache;
        private readonly TimeSpan _defaultCacheDuration = TimeSpan.FromHours(1);
        private readonly IFormTemplateRepository _formTemplateRepository;

        public FormTemplateService(
            IFormTemplateRepository formTemplateRepository,
            IUserRoleRepository userRoleRepository,
            IAppUserRepository appUserRepository,
            IRoleRepository roleRepository,
            IMemoryCache cache) : base(formTemplateRepository)
        {
            _userRoleRepository = userRoleRepository;
            _appUserRepository = appUserRepository;
            _roleRepository = roleRepository;
            _cache = cache;
            _formTemplateRepository = formTemplateRepository;
        }

        public async Task<PagedList<FormTemplateDto>> GetData(FormTemplateSearchDto search)
        {
            try
            {
                var query = from q in GetQueryable()
                            select new FormTemplateDto
                            {
                                Id = q.Id,
                                Name = q.Name,
                                Description = q.Description,
                                OriginalFilePath = q.OriginalFilePath,
                                HtmlPreview = q.HtmlPreview,
                                Fields = q.Fields,
                                CreatedId = q.CreatedId,
                                UpdatedId = q.UpdatedId,
                                CreatedBy = q.CreatedBy,
                                UpdatedBy = q.UpdatedBy,
                                DeleteId = q.DeleteId,
                                CreatedDate = q.CreatedDate,
                                UpdatedDate = q.UpdatedDate,
                                DeleteTime = q.DeleteTime,
                                IsDelete = q.IsDelete,
                            };

                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.Name))
                    {
                        var searchStr = search.Name.Trim().ToLower();
                        query = query.Where(x => x.Name.ToLower().Contains(searchStr));
                    }
                }

                query = query.OrderByDescending(x => x.CreatedDate);
                return await PagedList<FormTemplateDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message);
            }
        }



        public async Task<FormTemplate> UploadFormAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new Exception("File không hợp lệ");

            // 1. Lưu file vào local
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads/Forms");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // 2. Convert Word -> HTML
            string htmlPreview;
            using (var docStream = System.IO.File.OpenRead(filePath))
            {
                var result = new Mammoth.DocumentConverter().ConvertToHtml(docStream);
                htmlPreview = result.Value;
            }

            // 3. Detect placeholder [[fieldId]]
            var fieldMatches = Regex.Matches(htmlPreview, @"\[\[(.*?)\]\]");
            foreach (Match m in fieldMatches)
            {
                var fieldId = m.Groups[1].Value;
                var placeholder = $"[[{fieldId}]]";
                var replacement = $"<span class='form-field' data-field-id='{fieldId}'>"
                                + $"<span class='field-label'>...</span>"
                                + $"<span class='field-config' data-id='{fieldId}'>⚙️</span>"
                                + $"</span>";
                htmlPreview = htmlPreview.Replace(placeholder, replacement);
            }
            var fields = fieldMatches.Cast<Match>().Select(m => new FieldDefinition
            {
                //FieldId = m.Groups[1].Value,
                Label = m.Groups[1].Value,
                Type = "text",
                Required = false,
                Options = new List<string>()
            }).ToList();

            // 4. Tạo template
            var formTemplate = new FormTemplate
            {
                Name = Path.GetFileNameWithoutExtension(file.FileName),
                OriginalFilePath = filePath,
                HtmlPreview = htmlPreview,
                Fields = fields,
            };

            await CreateAsync(formTemplate);

            return formTemplate;
        }
    }
}
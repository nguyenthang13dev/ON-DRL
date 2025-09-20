using DocumentFormat.OpenXml.Packaging;
using Hinet.Model.MongoEntities;
using Hinet.Repository.AppUserRepository;
using Hinet.Repository.FormTemplateRepository;
using Hinet.Repository.RoleRepository;
using Hinet.Repository.UserRoleRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.FormTemplateService.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using OpenXmlPowerTools;
using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace Hinet.Service.FormTemplateService
{
    public class FormTemplateService : Service<FormTemplate>, IFormTemplateService
    {
        private readonly IUserRoleRepository _userRoleRepository;
        private readonly IAppUserRepository _appUserRepository;
        private readonly IRoleRepository _roleRepository;
        private readonly IMemoryCache _cache;
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
                                IsClassMonitorHandled = q.IsClassMonitorHandled,
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


        public async Task<FormTemplate> CreateOrUpdateAsync(FormTemplateCreateUpdateDto dto)
        {
            var file = dto.OriginalFile;
            if (file == null || file.Length == 0)
                throw new Exception("File không hợp lệ");

            // 1. Lưu file vào local
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads/Forms");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var filePath = Path.Combine(uploadsFolder, file.FileName);
            var relativePath = Path.Combine("Uploads\\Forms", file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // 2. Convert Word -> HTML
            string htmlPreview = ConvertDocxToHtml(filePath);
            //using (var docStream = System.IO.File.OpenRead(filePath))
            //{
            //    var result = new Mammoth.DocumentConverter().ConvertToHtml(docStream);
            //    htmlPreview = result.Value;
            //}

            //using (var wordDoc = WordprocessingDocument.Open(filePath, false))
            //{
            //    var settings = new HtmlConverterSettings()
            //    {
            //        PageTitle = "Preview",
            //        FabricateCssClasses = true,
            //        CssClassPrefix = "pt-",
            //        RestrictToSupportedLanguages = false,
            //        RestrictToSupportedNumberingFormats = false,
            //    };

            //    XElement htmlElement = HtmlConverter.ConvertToHtml(wordDoc, settings);
            //    htmlPreview = htmlElement.ToString(SaveOptions.DisableFormatting);
            //}

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
            var formTemplate = new FormTemplate();
            if (dto.Id.HasValue)
            {
                formTemplate = await _formTemplateRepository.GetByIdAsync(dto.Id.Value);
                if (formTemplate == null) throw new Exception("form template not found");
                formTemplate.Name = !string.IsNullOrEmpty(dto.Name) ? dto.Name : Path.GetFileNameWithoutExtension(file.FileName);
                formTemplate.OriginalFilePath = relativePath;
                formTemplate.HtmlPreview = htmlPreview;
                formTemplate.Fields = fields;
                formTemplate.Description = dto.Description;
                formTemplate.IsClassMonitorHandled = dto.IsClassMonitorHandled;
                await UpdateAsync(formTemplate);

            }
            else
            {
                formTemplate = new FormTemplate
                {
                    Name = !string.IsNullOrEmpty(dto.Name) ? dto.Name : Path.GetFileNameWithoutExtension(file.FileName),
                    OriginalFilePath = relativePath,
                    HtmlPreview = htmlPreview,
                    Fields = fields,
                    Description = dto.Description,
                    IsClassMonitorHandled = dto.IsClassMonitorHandled
                };
                await CreateAsync(formTemplate);
            }

            return formTemplate;
        }


        public async Task<FormTemplate> UpdateFieldAsync(Guid templateId, FieldDefinitionDto dto)
        {
            var formTemplate = await GetByIdAsync(templateId);
            if (formTemplate == null) throw new Exception("Không tìm thấy form template");
            var updatingField = formTemplate.Fields.FirstOrDefault(f => f.Label.Equals(dto.Label));
            if (updatingField == null) return formTemplate;
            updatingField.Label = dto.Label;
            updatingField.Type = dto.Type;
            updatingField.Placeholder = dto.Placeholder;
            updatingField.Required = dto.Required;
            updatingField.Options = dto.Options;
            updatingField.CssClass = dto.CssClass;
            await UpdateAsync(formTemplate);
            return formTemplate;
        }
        
        public async Task<FormTemplate> GenerateFormHtmlAsync(Guid templateId)
        {
            var formTemplate = await GetByIdAsync(templateId);
            if (formTemplate == null) throw new Exception("Không tìm thấy form template");
            string filePath = Path.Combine(Path.Combine(Directory.GetCurrentDirectory(), formTemplate.OriginalFilePath));
            string html = ConvertDocxToHtml(filePath);
            // 2. Apply field configs
            string finalHtml = ApplyFieldConfig(html, formTemplate.Fields, formTemplate.Id);
            formTemplate.HtmlPreview = finalHtml;
            return formTemplate;
        }

        private static string ConvertDocxToHtml(string filePath)
        {
            byte[] byteArray = File.ReadAllBytes(filePath);
            using (MemoryStream memoryStream = new MemoryStream())
            {
                memoryStream.Write(byteArray, 0, byteArray.Length);
                using (WordprocessingDocument wDoc = WordprocessingDocument.Open(memoryStream, true)) // mở RW trong memory
                {
                    var settings = new WmlToHtmlConverterSettings()
                    {
                        PageTitle = "Form Template",
                        FabricateCssClasses = true,
                        CssClassPrefix = "pt-",
                        RestrictToSupportedLanguages = false,
                        RestrictToSupportedNumberingFormats = false
                    };

                    XElement html = WmlToHtmlConverter.ConvertToHtml(wDoc, settings);
                    return html.ToString(SaveOptions.DisableFormatting);
                }
            }
        }

        private static string ApplyFieldConfig(string html, List<FieldDefinition> fields, Guid templateId)
        {
            foreach (var field in fields)
            {
                // Build common attributes
                var attrs = new List<string>();
                if (!string.IsNullOrEmpty(field.Placeholder))
                    attrs.Add($"placeholder='{field.Placeholder}'");
                if (field.Required)
                    attrs.Add("required");

                string inlineStyle = "border:none; border-bottom:1px dotted #000; outline:none;";

                if (!string.IsNullOrEmpty(field.CssClass))
                {
                    // Check có class dạng w-XX không
                    var match = System.Text.RegularExpressions.Regex.Match(field.CssClass, @"w-(\d{1,3})");
                    if (match.Success)
                    {
                        int percent = int.Parse(match.Groups[1].Value);
                        if (percent >= 1 && percent <= 100)
                        {
                            inlineStyle += $" width:{percent}%;";
                            // Bỏ w-xx khỏi class để tránh bị dư class không có CSS định nghĩa
                            field.CssClass = System.Text.RegularExpressions.Regex.Replace(field.CssClass, @"w-(\d{1,3})", "").Trim();
                        }
                    }

                    if (!string.IsNullOrWhiteSpace(field.CssClass))
                        attrs.Add($"class='{field.CssClass}'");
                }

                // Add inline style cuối cùng
                attrs.Add($"style=\"{inlineStyle}\"");

                if (field.Config != null)
                {
                    foreach (var kv in field.Config)
                    {
                        attrs.Add($"{kv.Key}='{kv.Value}'");
                    }
                }

                string attrStr = string.Join(" ", attrs);

                // Build replacement element
                string replacement = field.Type switch
                {
                    "text" => $"<input type='text' name='{field.Label}' {attrStr} />",

                    "textarea" => $"<textarea name='{field.Label}' {attrStr}></textarea>",

                    "number" => $"<input type='number' name='{field.Label}' {attrStr} />",

                    "date" => $"<input type='date' name='{field.Label}' {attrStr} />",

                    "select" => field.Options != null
                        ? $"<select name='{field.Label}' {attrStr}>" +
                          string.Join("", field.Options.Select(o => $"<option value='{o}'>{o}</option>")) +
                          "</select>"
                        : $"<select name='{field.Label}' {attrStr}></select>",

                    "checkbox" => field.Options != null
                        ? string.Join("<br/>", field.Options.Select(o =>
                            $"<label><input type='checkbox' name='{field.Label}' value='{o}' {attrStr}/> {o}</label>"))
                        : $"<input type='checkbox' name='{field.Label}' {attrStr} />",

                    "radio" => field.Options != null
                        ? string.Join("<br/>", field.Options.Select(o =>
                            $"<label><input type='radio' name='{field.Label}' value='{o}' {attrStr}/> {o}</label>"))
                        : $"<input type='radio' name='{field.Label}' {attrStr} />",

                    _ => $"<input type='text' name='{field.Label}' {attrStr} />"
                };

                // Replace placeholder [[Label]]
                html = html.Replace($"[[{field.Label}]]", replacement);
            }
            //string formHtml = $"<form method='post' action='/FormTemplate/Submit?templateId={templateId}'>{html}</form>";
            string formHtml = $"<form id=\"dynamicForm\">{html}</form>";
            return formHtml;
        }


    }
}
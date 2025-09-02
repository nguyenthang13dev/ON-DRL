using DocumentFormat.OpenXml.Office2010.Excel;
using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Model.Entities;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using Hinet.Service.Common;
using Hinet.Service.Core.Mapper;
using Hinet.Service.DM_DuLieuDanhMucService;
using Hinet.Service.DM_DuLieuDanhMucService.Dto;
using Hinet.Service.DM_NhomDanhMucService;
using Hinet.Service.EmailTemplateService;
using Hinet.Service.EmailTemplateService.Dto;
using Hinet.Service.EmailTemplateService.ViewModel;
using Hinet.Service.KeyEmailTemplateService;
using Hinet.Service.KeyEmailTemplateService.Dto;
using Hinet.Service.KeyEmailTemplateService.ViewModel;
using Hinet.Service.RoleService;
using Hinet.Service.TD_ViTriTuyenDungService;
using Hinet.Service.UserRoleService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailTemplateController : HinetController
    {
        private readonly IEmailTemplateService _service;
        private readonly IMapper _mapper;
        private readonly IKeyEmailTemplateService _keyEmailTemplateService;
        private readonly IDM_DuLieuDanhMucService _dM_DuLieuDanhMucService;
        private readonly IDM_NhomDanhMucService _dM_NhomDanhMucService;
        public EmailTemplateController(IEmailTemplateService service, IDM_NhomDanhMucService dM_NhomDanhMucService, IDM_DuLieuDanhMucService dM_DuLieuDanhMucService, IMapper mapper, IKeyEmailTemplateService keyEmailTemplateService)
        {
            _service = service;
            _mapper = mapper;
            _keyEmailTemplateService = keyEmailTemplateService;
            _dM_DuLieuDanhMucService = dM_DuLieuDanhMucService;
            _dM_NhomDanhMucService = dM_NhomDanhMucService;
        }

        [HttpPost("GetAll")]
        public async Task<DataResponse<PagedList<EmailTemplateDto>>> GetAll(EmailTemplateSearch emailTemplateSearch)
        {
            var result = await _service.GetData(emailTemplateSearch);
            return new DataResponse<PagedList<EmailTemplateDto>>
            {
                Data = result,
                Message = "Lấy danh sách template email thành công",
                Status = true
            };
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<EmailTemplateDto>> Get(Guid id)
        {
            var entity = await _service.getDto(id);
            if (entity == null)
                return DataResponse<EmailTemplateDto>.False("Không tìm thấy template email với ID đã cho");

            return DataResponse<EmailTemplateDto>.Success(entity, "Lấy thông tin template email thành công");
        }

        [HttpGet("GetByCode/{code}")]
        public async Task<DataResponse<EmailTemplateDto>> GetByCode(string code)
        {
            var entity = await _service.GetByCodeAsync(code);
            if (entity == null)
                return DataResponse<EmailTemplateDto>.False("Không tìm thấy template email với mã đã cho");
            return DataResponse<EmailTemplateDto>.Success(entity, "Lấy thông tin template email thành công");
        }

        [HttpPost("Create")]
        [Authorize]
        public async Task<DataResponse<EmailTemplateDto>> Create([FromBody] EmailTemplateCreateVM model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return DataResponse<EmailTemplateDto>.False("Dữ liệu không hợp lệ");

                var existEmailTemPlate = await _service.GetQueryable().Where(x => x.Code == model.Code).ToListAsync();
                if (existEmailTemPlate != null && existEmailTemPlate.Any())
                    return DataResponse<EmailTemplateDto>.False("Đã tồn tại template có mã Code này");

                if(string.IsNullOrEmpty(model.LoaiTemPlate))
                    return DataResponse<EmailTemplateDto>.False("Loại template không được để trống");
                var loaiNhomDanhMuc = await _dM_NhomDanhMucService.GetQueryable().Where(x => x.GroupCode == "LOAITEMPLATE").FirstOrDefaultAsync();

                var loaiTemplate = await _dM_DuLieuDanhMucService.GetQueryable().Where(x=>x.Code == model.LoaiTemPlate).FirstOrDefaultAsync();
                if (loaiTemplate == null)
                    return DataResponse<EmailTemplateDto>.False("Loại template không hợp lệ");

                if(loaiTemplate.GroupId != loaiNhomDanhMuc.Id)
                    return DataResponse<EmailTemplateDto>.False("Loại template không nằm trong danh sách loại template");

                var entity = _mapper.Map<EmailTemplateCreateVM, EmailTemplate>(model);
                await _service.CreateAsync(entity);

                if (model.lstKeyEmailTemplate.Any(k => string.IsNullOrWhiteSpace(k.Key) || (string.IsNullOrWhiteSpace(k.Value) && !new[] { "TenUngVien", "ViTri", "ThoiGianPhongVan", "NamHienTai" }.Contains(k.Key))))
                    return DataResponse<EmailTemplateDto>.False("Danh sách key email template không được để trống và không có phần tử rỗng");

                if (model.lstKeyEmailTemplate.Any(k => string.IsNullOrWhiteSpace(k.Key) || (string.IsNullOrWhiteSpace(k.Value) && !new[] { "TenUngVien", "ViTri", "ThoiGianPhongVan", "NamHienTai" }.Contains(k.Key))))
                    return DataResponse<EmailTemplateDto>.False("Danh sách key email template không được để trống và không có phần tử rỗng");

                if (model.lstKeyEmailTemplate != null && model.lstKeyEmailTemplate.Any())
                {
                    foreach (var kv in model.lstKeyEmailTemplate)
                    {
                        if (new[] { "TenUngVien", "ViTri", "ThoiGianPhongVan", "NamHienTai" }.Contains(kv.Key))
                        {
                            continue;
                        }
                       
                        var existingKey = await _keyEmailTemplateService.GetExistKey(kv.Key, entity.Id);
                        if (existingKey != null)
                        {
                            existingKey.Value = kv.Value;
                            await _keyEmailTemplateService.UpdateAsync(existingKey);
                        }
                        else
                        {
                            var keyEmail = new KeyEmailTemplateCreateVM
                            {
                                Key = kv.Key,
                                Value = kv.Value,
                                EmailTemplateId = entity.Id
                            };
                            var keyEmailEntity = _mapper.Map<KeyEmailTemplateCreateVM, KeyEmailTemplate>(keyEmail);
                            await _keyEmailTemplateService.CreateAsync(keyEmailEntity);
                        }
                    }
                }

                return DataResponse<EmailTemplateDto>.Success(_mapper.Map<EmailTemplate, EmailTemplateDto>(entity), "Tạo mới template email thành công");
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return DataResponse<EmailTemplateDto>.False("Đã xảy ra lỗi khi tạo mới template email: " + e.Message);
            }
        }

        [HttpPut("Edit")]
        public async Task<DataResponse<EmailTemplateDto>> Edit([FromBody] EmailTemplateEditVM model)
        {
            if (!ModelState.IsValid)
                return DataResponse<EmailTemplateDto>.False("Dữ liệu không hợp lệ");
            var entity = await _service.GetByIdAsync(model.Id);
            if (entity == null)
                return DataResponse<EmailTemplateDto>.False("Không tìm thấy template email với ID đã cho");
            var existEmailTemPlate = await _service.GetQueryable().Where(x => x.Code == model.Code).ToListAsync();
            if (existEmailTemPlate != null && existEmailTemPlate.Any(t=>t.Id != entity.Id))
                return DataResponse<EmailTemplateDto>.False("Đã tồn tại template có mã Code này");

            var loaiNhomDanhMuc = await _dM_NhomDanhMucService.GetQueryable().Where(x => x.GroupCode == "LOAITEMPLATE").FirstOrDefaultAsync();

            var loaiTemplate = await _dM_DuLieuDanhMucService.GetQueryable().Where(x => x.Code == model.LoaiTemPlate).FirstOrDefaultAsync();
            if (loaiTemplate == null)
                return DataResponse<EmailTemplateDto>.False("Loại template không hợp lệ");

            if (loaiTemplate.GroupId != loaiNhomDanhMuc.Id)
                return DataResponse<EmailTemplateDto>.False("Loại template không nằm trong danh sách loại template");

            entity.Code = model.Code;
            entity.Name = model.Name;
            entity.Content = model.Content;
            entity.LoaiTemPlate = model.LoaiTemPlate;
            entity.Description = model.Description;
            entity.UpdatedDate = DateTime.UtcNow;
            await _service.UpdateAsync(entity);


            if (model.lstKeyEmailTemplate != null && model.lstKeyEmailTemplate.Any())
            {
                foreach (var kv in model.lstKeyEmailTemplate)
                {
                    if (new[] { "TenUngVien", "ViTri", "ThoiGianPhongVan", "NamHienTai" }.Contains(kv.Key))
                    {
                        continue;
                    }
                    var existingKey = await _keyEmailTemplateService.GetExistKey(kv.Key, entity.Id);
                    if (existingKey != null)
                    {
                        existingKey.Value = kv.Value;
                        await _keyEmailTemplateService.UpdateAsync(existingKey);
                    }
                    else
                    {
                        var keyEmail = new KeyEmailTemplateDto
                        {
                            Key = kv.Key,
                            Value = kv.Value,
                            EmailTemplateId = entity.Id
                        };
                        var keyEmailEntity = _mapper.Map<KeyEmailTemplateDto, KeyEmailTemplate>(keyEmail);
                        await _keyEmailTemplateService.CreateAsync(keyEmailEntity);
                    }
                }
            }
            return DataResponse<EmailTemplateDto>.Success(_mapper.Map<EmailTemplate, EmailTemplateDto>(entity), "Cập nhật template email thành công");
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse<EmailTemplateDto>> Delete(Guid id)
        {
            var entity = await _service.GetByIdAsync(id);
            if (entity == null)
                return DataResponse<EmailTemplateDto>.False("Không tìm thấy template email với ID đã cho");
            await _service.DeleteAsync(entity);
            var existingKey = await _keyEmailTemplateService.GetQueryable().Where(x => x.EmailTemplateId == entity.Id).ToListAsync();
            if (existingKey != null || existingKey.Any())
                await _keyEmailTemplateService.DeleteAsync(existingKey);
            return DataResponse<EmailTemplateDto>.Success(null, "Xóa template email thành công");
        }

        [HttpPost("SetActive")]
        public async Task<DataResponse<EmailTemplateDto>> SetActive([FromBody] EmailTemplateActiveVM model)
        {
            var entity = await _service.GetByIdAsync(model.Id);
            if (entity == null)
                return DataResponse<EmailTemplateDto>.False("Không tìm thấy template email với ID đã cho");
            entity.IsActive = model.IsActive;
            await _service.UpdateAsync(entity);
            return
                DataResponse<EmailTemplateDto>.Success(_mapper.Map<EmailTemplate, EmailTemplateDto>(entity), "Cập nhật trạng thái hoạt động của template email thành công");
        }

        [HttpGet("GetAlLoaiTemplate")]
        public async Task<DataResponse> GetAlLoaiTemplate()
        {
            var loaiNhomDanhMuc = await _dM_NhomDanhMucService.GetQueryable().Where(x => x.GroupCode == "LOAITEMPLATE").FirstOrDefaultAsync();
            if (loaiNhomDanhMuc == null)
            {
                var loai = new DM_NhomDanhMuc
                {
                    GroupCode = "LOAITEMPLATE",
                    GroupName = "Loại Email Template"
                };
                await _dM_NhomDanhMucService.CreateAsync(loai);
            }    

            var result = await _dM_DuLieuDanhMucService.GetQueryable().Where(x => x.GroupId == loaiNhomDanhMuc.Id)
                .Select(x => new DM_DuLieuDanhMucDto
                {
                    Id = x.Id,
                    Code = x.Code,
                    Name = x.Name,
                }).ToListAsync();
            return new DataResponse
            {
                Data = result,
                Message = "Lấy danh sách loại template thành công",
                Status = true
            };
        }
    }
}
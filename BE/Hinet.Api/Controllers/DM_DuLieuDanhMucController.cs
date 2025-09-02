using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.DM_DuLieuDanhMucService;
using Hinet.Service.DM_DuLieuDanhMucService.Dto;
using Hinet.Service.DM_DuLieuDanhMucService.ViewModels;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Service.TaiLieuDinhKemService;
using Microsoft.AspNetCore.Authorization;
using Hinet.Service.Constant;
using Microsoft.EntityFrameworkCore;
using CommonHelper.Excel;
using Hinet.Api.Dto;
using CommonHelper.CrawlProvider;
using Hinet.Service.XaService.Dto;
using Hinet.Service.DepartmentService.Dto;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class DM_DuLieuDanhMucController : HinetController
    {
        private readonly IDM_DuLieuDanhMucService _dM_DuLieuDanhMucService;
        private readonly ITaiLieuDinhKemService _taiLieuDinhKemService;

        private readonly IMapper _mapper;
        private readonly ILogger<DM_DuLieuDanhMucController> _logger;

        public DM_DuLieuDanhMucController(
            IDM_DuLieuDanhMucService dM_DuLieuDanhMucService,
            ITaiLieuDinhKemService taiLieuDinhKemService,
            IMapper mapper,
            ILogger<DM_DuLieuDanhMucController> logger
            )
        {
            this._dM_DuLieuDanhMucService = dM_DuLieuDanhMucService;
            _taiLieuDinhKemService = taiLieuDinhKemService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<DM_DuLieuDanhMuc>> Create([FromBody] DM_DuLieuDanhMucCreateVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    if (_dM_DuLieuDanhMucService.FindBy(x => x.Code.Equals(model.Code)).Any())
                    {
                        return DataResponse<DM_DuLieuDanhMuc>.False("Mã danh mục đã tồn tại!");
                    }

                    var entity = _mapper.Map<DM_DuLieuDanhMucCreateVM, DM_DuLieuDanhMuc>(model);
                    await _dM_DuLieuDanhMucService.CreateAsync(entity);

                    if (model.FileDinhKem != null)
                    {
                        var file = await _taiLieuDinhKemService.GetByIdAsync(model.FileDinhKem);
                        if (file != null)
                        {
                            file.Item_ID = entity.Id;
                            await _taiLieuDinhKemService.UpdateAsync(file);
                            entity.DuongDanFile = file.DuongDanFile;
                            await _dM_DuLieuDanhMucService.UpdateAsync(entity);
                        }
                    }

                    return new DataResponse<DM_DuLieuDanhMuc>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    return DataResponse<DM_DuLieuDanhMuc>.False("Error", new string[] { ex.Message });
                }
            }
            return DataResponse<DM_DuLieuDanhMuc>.False("Some properties are not valid", ModelStateError);
        }

        [HttpPut("Update")]
        public async Task<DataResponse<DM_DuLieuDanhMuc>> Update([FromBody] DM_DuLieuDanhMucEditVM model)
        {
            try
            {
                var entity = await _dM_DuLieuDanhMucService.GetByIdAsync(model.Id);
                if (entity == null)
                    return DataResponse<DM_DuLieuDanhMuc>.False("Không tìm thấy danh mục để sửa!");

                if (_dM_DuLieuDanhMucService.FindBy(x => x.Code.Equals(model.Code) && x.Id != model.Id).Any())
                {
                    return DataResponse<DM_DuLieuDanhMuc>.False("Mã danh mục đã tồn tại!");
                }

                entity = _mapper.Map(model, entity);

                if (model.FileDinhKem != null)
                {
                    var removedAttachments = await _taiLieuDinhKemService.GetQueryable().Where(x => x.LoaiTaiLieu.Equals(LoaiTaiLieuConstant.FileDuLieuDanhMuc)
                            && x.Item_ID.Equals(entity.Id) && x.Id != model.FileDinhKem).ToListAsync();
                    await _taiLieuDinhKemService.DeleteAsync(removedAttachments);
                    var file = await _taiLieuDinhKemService.GetByIdAsync(model.FileDinhKem);
                    if (file != null)
                    {
                        file.Item_ID = entity.Id;
                        await _taiLieuDinhKemService.UpdateAsync(file);
                        entity.DuongDanFile = file.DuongDanFile;
                    }
                }

                await _dM_DuLieuDanhMucService.UpdateAsync(entity);

                return new DataResponse<DM_DuLieuDanhMuc>() { Data = entity, Status = true };
            }
            catch (Exception ex)
            {
                return DataResponse<DM_DuLieuDanhMuc>.False(ex.Message);
            }
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<DM_DuLieuDanhMucDto>> Get(Guid id)
        {
            var result = await _dM_DuLieuDanhMucService.GetDto(id);

            return new DataResponse<DM_DuLieuDanhMucDto>
            {
                Data = result,
                Message = "Get DM_DuLieuDanhMucDto thành công",
                Status = true
            };
        }
        [HttpGet("GetByCode/{code}")]
        public async Task<DataResponse<DM_DuLieuDanhMucDto>> GetByCode(string code)
        {
            try
            {
                var result = await _dM_DuLieuDanhMucService.GetDtoByCode(code);
                if (result == null)
                {
                    return DataResponse<DM_DuLieuDanhMucDto>.False("Không tìm thấy danh mục với mã đã cho.");

                }
                return DataResponse<DM_DuLieuDanhMucDto>.Success(result, "Lấy dữ liệu thành công");
            }
            catch (Exception ex)
            {
                return DataResponse<DM_DuLieuDanhMucDto>.False($"Lỗi khi lấy danh mục theo mã: {ex.Message}");
            }
        }
        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<DM_DuLieuDanhMucDto>>> GetData([FromBody] DM_DuLieuDanhMucSearch search)
        {
            var result = await _dM_DuLieuDanhMucService.GetData(search);
            return new DataResponse<PagedList<DM_DuLieuDanhMucDto>>
            {
                Data = result,
                Message = "GetData PagedList<DM_DuLieuDanhMucDto> thành công",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _dM_DuLieuDanhMucService.GetByIdAsync(id);
                await _dM_DuLieuDanhMucService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpPost("Export")]
        public async Task<DataResponse> ExportExcel([FromBody] DM_DuLieuDanhMucSearch search)
        {
            try
            {
                var data = await _dM_DuLieuDanhMucService.GetData(search);
                var exportData = new List<DM_DuLieuDanhMucExportDto>();
                foreach (var item in data.Items)
                {
                    var nhomDanhMucExport = new DM_DuLieuDanhMucExportDto()
                    {
                        Code = item.Code,
                        Name = item.Name,
                        Priority = item.Priority,
                        Note = item.Note
                    };
                    exportData.Add(nhomDanhMucExport);
                }

                var base64Excel = await ExportExcelHelperNetCore.Export<DM_DuLieuDanhMucExportDto>(exportData);

                if (string.IsNullOrEmpty(base64Excel))
                {
                    return DataResponse.False("Kết xuất thất bại hoặc dữ liệu trống");
                }
                return DataResponse.Success(base64Excel);
            }
            catch (Exception ex)
            {
                return DataResponse.False("Kết xuất thất bại");
            }
        }

        [HttpGet("GetDropdownByGroupCode/{GroupCode}")]
        public async Task<DataResponse> GetDropdownByGroupCode(string GroupCode)
        {
            var result = new DataResponse();
            try
            {
                result.Data = await _dM_DuLieuDanhMucService.GetDropdownByGroupCode(GroupCode);
                result.Status = true;
                result.Message = "Lấy dropdown danh mục thành công";
            }
            catch (Exception)
            {
                result.Data = null;
                result.Status = false;
                result.Message = "Lấy danh mục không thành công!";
            }
            return result;
        }

        [HttpGet("GetHierarchicalDropdownList")]
        public async Task<DataResponse<DropdownOptionTree>> GetHierarchicalDropdownList(Guid? id,bool disabledParent = true)
        {
            var response = new DropdownOptionTree();
            try
            {
                response = await _dM_DuLieuDanhMucService.GetEduLevelTreeOption(id, disabledParent);
                return DataResponse<DropdownOptionTree>.Success(response, "Lấy dữ liệu thành công");
            }
            catch (Exception ex)
            {
                return DataResponse<DropdownOptionTree>.False("Lấy dữ liệu thành công");
            }

        }

        [HttpGet("GetDropdownCode/{GroupCode}")]
        public async Task<DataResponse> GetDropdownCode(string GroupCode)
        {
            var result = new DataResponse();
            try
            {
                result.Data = await _dM_DuLieuDanhMucService.GetDropdownCodeByGroupCode(GroupCode);
                result.Status = true;
                result.Message = "Lấy dropdown danh mục thành công";
            }
            catch (Exception)
            {
                result.Data = null;
                result.Status = false;
                result.Message = "Lấy danh mục không thành công!";
            }
            return result;
        }
        [HttpGet("GetListDataByGroupCode/{GroupCode}")]
        public async Task<DataResponse<List<DM_DuLieuDanhMucDto>>> GetListDataByGroupCode(string GroupCode)
        {
            var result = await _dM_DuLieuDanhMucService.GetListDataByGroupCode(GroupCode);
            return new DataResponse<List<DM_DuLieuDanhMucDto>>
            {
                Data = result,
                Message = "GetData List<DM_DuLieuDanhMucDto> thành công",
                Status = true
            };
        }
        [HttpGet("GetDropdownTreeOption/{GroupCode}")]
        public async Task<DataResponse> GetDropdownTreeOption(string GroupCode)
        {
            var result = new DataResponse();
            try
            {
                result.Data = await _dM_DuLieuDanhMucService.GetDropdownOptionTrees(GroupCode);
                result.Status = true;
                result.Message = "Lấy dropdown tree danh mục thành công";
            }
            catch (Exception)
            {
                result.Data = null;
                result.Status = false;
                result.Message = "Lấy danh mục tree không thành công!";
            }
            return result;
        }
        [HttpGet("GetDropdownCodeAndNote/{GroupCode}/{Note}")]
        public async Task<DataResponse> GetDropdownCodeAndNote(string GroupCode, string Note)
        {
            var result = new DataResponse();
            try
            {
                result.Data = await _dM_DuLieuDanhMucService.GetDropdownCodeByGroupCodeAndNote(GroupCode, Note);
                result.Status = true;
                result.Message = "Lấy dropdown danh mục thành công";
            }
            catch (Exception)
            {
                result.Data = null;
                result.Status = false;
                result.Message = "Lấy danh mục không thành công!";
            }
            return result;
        }
        [HttpGet("GetDropDownByDonViId/{id}")]      
        public async Task<DataResponse<List<DropdownOption>>> GetDropDownByDonViId(Guid id)
        {
            try
            {
                var response = await _dM_DuLieuDanhMucService.GetDropDownByDonViId(id);
                return DataResponse<List<DropdownOption>>.Success(response,"Lấy dữ liệu thành công!");
            }
            catch(Exception ex)
            {
                return DataResponse<List<DropdownOption>>.False($"Lỗi lấy dữ liệu:{ex}");
            }

        }




    }
}
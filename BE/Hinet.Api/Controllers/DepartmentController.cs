using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.DepartmentService;
using Hinet.Service.DepartmentService.Dto;
using Hinet.Service.DepartmentService.ViewModels;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using CommonHelper.Excel;
using Hinet.Service.AppUserService.Dto;
using Hinet.Api.Dto;
using Aspose.Cells.DataModels;
using OfficeOpenXml;
using Microsoft.AspNetCore.Authorization;
using CommonHelper.String;
using Aspose.Cells;
using Hinet.Service.Constant;
using IronSoftware;
using Microsoft.AspNetCore.Components.Web;
using DocumentFormat.OpenXml.Presentation;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class DepartmentController : HinetController
    {
        private readonly IDepartmentService _departmentService;
        private readonly IMapper _mapper;
        private readonly ILogger<DepartmentController> _logger;

        public DepartmentController(
            IDepartmentService departmentService,
            IMapper mapper,
            ILogger<DepartmentController> logger
            )
        {
            this._departmentService = departmentService;
            this._mapper = mapper;
            _logger = logger;
        }

        [HttpPost("SaveDepartmentChanges")]
        public async Task<DataResponse<List<Department>>> SaveDepartmentChanges(List<Department> departments)
        {
            var exitingIds = new List<Guid>();
            var errors = new List<string>();

            try
            {
                if (departments != null && departments.Any())
                {
                    foreach (var dept in departments)
                    {
                        var currentDept = await _departmentService.GetByIdAsync(dept.Id);
                        if (currentDept == null)
                        {
                            await _departmentService.CreateAsync(dept);
                            exitingIds.Add(dept.Id);
                        }
                        else
                        {
                            currentDept.Name = dept.Name;
                            currentDept.Code = dept.Code;
                            currentDept.ShortName = dept.ShortName;
                            currentDept.DiaDanh = dept.DiaDanh;
                            currentDept.ParentId = dept.ParentId;
                            currentDept.Priority = dept.Priority;
                            currentDept.Level = dept.Level;
                            currentDept.Loai = dept.Loai;
                            currentDept.IsActive = dept.IsActive;
                            currentDept.CapBac = dept.CapBac;
                            currentDept.SoNgayTiepTrenThang = dept.SoNgayTiepTrenThang;
                            await _departmentService.UpdateAsync(currentDept);
                            exitingIds.Add(currentDept.Id);
                        }
                    }
                }

                var removeDepts = _departmentService.FindBy(x => !exitingIds.Contains(x.Id));
                if (removeDepts.Any())
                {
                    await _departmentService.DeleteAsync(removeDepts);
                }
                var response = new DataResponse<List<Department>> { Data = departments, Status = true };
                return response;
            }
            catch (Exception ex)
            {
                var response = new DataResponse<List<Department>> { Data = null, Status = false, Message = ex.Message };
                return response;
            }
        }

        [HttpPost("Create")]
        public async Task<DataResponse<Department>> Create([FromBody] DepartmentCreateVM model)
        {
            var entity = _mapper.Map<DepartmentCreateVM, Department>(model);
            await _departmentService.CreateAsync(entity);
            return new DataResponse<Department>() { Data = entity, Status = true };
        }

        [HttpPut("Update")]
        public async Task<DataResponse<Department>> Update([FromBody] DepartmentEditVM model)
        {
            var entity = await _departmentService.GetByIdAsync(model.Id);
            if (entity == null)
                return DataResponse<Department>.False("Department not found");

            entity = _mapper.Map(model, entity);
            await _departmentService.UpdateAsync(entity);
            return new DataResponse<Department>() { Data = entity, Status = true };
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<DepartmentDto>> Get(Guid id)
        {
            var data = await _departmentService.GetDto(id);
            return new DataResponse<DepartmentDto> { Data = data, Status = true };
        }
        [HttpGet("GetByCode/{code}")]
        public async Task<DataResponse<DepartmentDto>> GetByCode(string code)
        {
            try
            {
                var result = await _departmentService.GetDtoByCode(code);
                if (result == null)
                {
                    return DataResponse<DepartmentDto>.False("Không tìm thấy phòng ban với mã code: " + code);
                }
                return DataResponse<DepartmentDto>.Success(result, "Lấy dữ liệu thành công");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy phòng ban theo mã code: {Code}", code);
                return DataResponse<DepartmentDto>.False("Đã xảy ra lỗi khi lấy dữ liệu phòng ban.");
            }
        }
        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<DepartmentDto>>> GetData([FromBody] DepartmentSearch search)
        {
            var data = await _departmentService.GetData(search);
            return new DataResponse<PagedList<DepartmentDto>> { Data = data, Status = true };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            var entity = await _departmentService.GetByIdAsync(id);
            await _departmentService.DeleteAsync(entity);
            return DataResponse.Success(null);
        }

        [HttpPut("deactive/{id}")]
        public async Task<DataResponse> Deactive(Guid id)
        {
            var entity = await _departmentService.GetByIdAsync(id);
            entity.IsActive = !entity.IsActive;
            await _departmentService.UpdateAsync(entity);
            return DataResponse.Success(entity);
        }

        [HttpGet("GetDepartmentsWithHierarchy")]
        public async Task<DataResponse<List<DepartmentHierarchy>>> GetDepartmentsWithHierarchy()
        {
            var data = _departmentService.GetDepartmentHierarchy();
            return new DataResponse<List<DepartmentHierarchy>> { Data = data, Status = true };
        }

        [HttpPost("GetDropDepartment")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropDepartment(string? selected)
        {
            var result = await _departmentService.GetDropDown(selected);

            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "GetDropDepartment thành công",
                Status = true
            };
        }
        [HttpGet("GetDropDepartmentByShortName")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropDepartmentByShortName(string? shortName)
        {
            var result = await _departmentService.GetDropDownByShortName(shortName);

            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "GetDropDepartment thành công",
                Status = true
            };
        }

        [HttpPost("GetDropRolesInDepartment")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropRolesInDepartment(Guid? departmentId, Guid? userId)
        {
            //var deparment = _departmentService.FindBy(x => x.Code == departmentCode).FirstOrDefault();
            if (departmentId == null)
            {
                return DataResponse<List<DropdownOption>>.False("Vui lÃ²ng chá»n phÃ²ng ban");
            }

            var result = await _departmentService.GetDropRolesInDepartment(departmentId, userId);

            return new DataResponse<List<DropdownOption>>
            {
                Data = result,
                Message = "GetDropRolesInDepartment thành công",
                Status = true
            };
        }

        [HttpGet("export")]
        public async Task<DataResponse> ExportExcel(string type)
        {
            try
            {
                var exportData = await _departmentService.GetDepartmentExportData(type);
                var base64Excel = ExportExcelHelperNetCore.ExportExcel(exportData);
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

        [HttpGet("GetHierarchicalDropdownList")]
        public async Task<DataResponse<List<DropdownOptionTree>>> GetHierarchicalDropdownList(bool disabledParent = true)
        {
            var response = await _departmentService.GetDropdownTreeOption(disabledParent);
            return DataResponse<List<DropdownOptionTree>>.Success(response, "Lấy dữ liệu thành công");
        }
        [HttpGet("GetHierarchicalDropdownListCode")]
        public async Task<DataResponse<List<DropdownOptionTree>>> GetHierarchicalDropdownListCode(bool disabledParent = true)
        {
            var response = await _departmentService.GetCodeDropdownTreeOption(disabledParent);
            return DataResponse<List<DropdownOptionTree>>.Success(response, "Lấy dữ liệu thành công");
        }

        [HttpGet("GetDropdownListByUserDepartment")]
        public async Task<DataResponse<List<DropdownOptionTree>>> GetDropdownListByUserDepartment(bool disabledParent = true)
        {
            var donViId = HasRole(VaiTroConstant.Admin) ? null : DonViId;
            var response = await _departmentService.GetDropdownTreeOptionByUserDepartment(disabledParent, donViId);
            return DataResponse<List<DropdownOptionTree>>.Success(response, "Lấy dữ liệu thành công");
        }

        [HttpGet("ImportLiveFile")]
        public bool ImportLiveFile()
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads/ImportCoCauToChuc.xlsx");
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage(new FileInfo(filePath)))
            {
                var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                if (worksheet == null) return false;

                int rowCount = worksheet.Dimension.Rows;

                // bắt đầu đọc từ dòng 2;
                var lstDepartment = new List<DepartmentCreateVM>();

                for (int row = 5; row <= rowCount; row++)
                {
                    var item = new DepartmentCreateVM();
                    item.Priority = long.Parse(worksheet.Cells[row, 1].Text.Trim());
                    item.Name = worksheet.Cells[row, 2].Text.Trim();
                    item.Loai = worksheet.Cells[row, 3].Text.Trim();
                    item.Level = int.Parse(worksheet.Cells[row, 4].Text.Trim());
                    item.idcha = worksheet.Cells[row, 5].Text.Trim();
                    item.idchinhno = worksheet.Cells[row, 6].Text.Trim();
                    item.Code = StringUtilities.GenerateCode(item.Name);
                    lstDepartment.Add(item);
                }

                var lstLevel0 = lstDepartment.Where(x => x.Level == 0).ToList();

                foreach (var item in lstLevel0)
                {
                    // insert vào db
                    var newDepartment = new Department();
                    newDepartment.Priority = item.Priority;
                    newDepartment.Name = item.Name;
                    newDepartment.Code = item.Code;
                    newDepartment.Loai = item.Loai;
                    newDepartment.Level = item.Level;
                    newDepartment.IsActive = true;

                    _departmentService.CreateAsync(newDepartment);

                    // lstcon - level1
                    if (string.IsNullOrWhiteSpace(item.idchinhno)) continue;
                    var lstLevel1 = lstDepartment.Where(x => x.idcha == item.idchinhno);

                    if (lstLevel1 != null && lstLevel1.Any())
                    {
                        foreach (var item1 in lstLevel1)
                        {
                            var newDepartment2 = new Department();
                            newDepartment2.Priority = item1.Priority;
                            newDepartment2.Name = item1.Name;
                            newDepartment2.Code = item1.Code;
                            newDepartment2.Loai = item1.Loai;
                            newDepartment2.Level = item1.Level;
                            newDepartment2.ParentId = newDepartment.Id;
                            newDepartment2.IsActive = true;

                            _departmentService.CreateAsync(newDepartment2);

                            // lstcon - level2
                            if (string.IsNullOrWhiteSpace(item1.idchinhno)) continue;
                            var lstLevel2 = lstDepartment.Where(x => x.idcha == item1.idchinhno);

                            if (lstLevel2 != null && lstLevel2.Any())
                            {
                                foreach (var item2 in lstLevel2)
                                {
                                    var newDepartment3 = new Department();
                                    newDepartment3.Priority = item2.Priority;
                                    newDepartment3.Name = item2.Name;
                                    newDepartment3.Code = item2.Code;
                                    newDepartment3.Loai = item2.Loai;
                                    newDepartment3.Level = item2.Level;
                                    newDepartment3.ParentId = newDepartment2.Id;
                                    newDepartment3.IsActive = true;
                                    _departmentService.CreateAsync(newDepartment3);

                                    // lstcon - level3
                                    if (string.IsNullOrWhiteSpace(item2.idchinhno)) continue;
                                    var lstLevel3 = lstDepartment.Where(x => x.idcha == item2.idchinhno);

                                    if (lstLevel3 != null && lstLevel3.Any())
                                    {
                                        foreach (var item3 in lstLevel3)
                                        {
                                            var newDepartment4 = new Department();
                                            newDepartment4.Priority = item3.Priority;
                                            newDepartment4.Name = item3.Name;
                                            newDepartment4.Code = item3.Code;
                                            newDepartment4.Loai = item3.Loai;
                                            newDepartment4.Level = item3.Level;
                                            newDepartment4.ParentId = newDepartment3.Id;
                                            newDepartment4.IsActive = true;
                                            _departmentService.CreateAsync(newDepartment4);

                                            // lstcon - level4
                                            if (string.IsNullOrWhiteSpace(item3.idchinhno)) continue;
                                            var lstLevel4 = lstDepartment.Where(x => x.idcha == item3.idchinhno);

                                            if (lstLevel4 != null && lstLevel4.Any())
                                            {
                                                foreach (var item4 in lstLevel4)
                                                {
                                                    var newDepartment5 = new Department();
                                                    newDepartment5.Priority = item4.Priority;
                                                    newDepartment5.Name = item4.Name;
                                                    newDepartment5.Code = item4.Code;
                                                    newDepartment5.Loai = item4.Loai;
                                                    newDepartment5.Level = item4.Level;
                                                    newDepartment5.ParentId = newDepartment4.Id;
                                                    newDepartment5.IsActive = true;
                                                    _departmentService.CreateAsync(newDepartment5);
                                                }
                                            }

                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            }

            return true;
        }

        [HttpGet("GetSubAndCurrentUnitDropdown")]
        public async Task<DataResponse<List<DropdownOptionTree>>> GetSubAndCurrentUnitDropdown(bool disabledParent = true)
        {
            var response = await _departmentService.GetSubAndCurrentUnitDropdownTreeByUserDepartment(disabledParent, DonViId);
            return DataResponse<List<DropdownOptionTree>>.Success(response, "Lấy dữ liệu thành công");
        }

        [HttpGet("GetDropdownTypeDepartment")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropdownTypeDepartment(string? selected)
        {
            var response = ConstantExtension.GetDropdownOptions<LoaiDepartmentConstant>(selected);
            return DataResponse<List<DropdownOption>>.Success(response, "Lấy dropdown typeDepartment");
        }

        [HttpGet("GetDropdownCapBac")]
        public async Task<DataResponse<List<DropdownOption>>> GetDropdownCapBac(string? selected)
        {
            var response = ConstantExtension.GetDropdownOptions<CapBacDepartmentConstant>(selected);
            return DataResponse<List<DropdownOption>>.Success(response, "Lấy dropdown capBacDepartment");
        }


        [HttpGet("GetUserIdByRoleCodeAndDepartmentId")]
        public async Task<DataResponse<Guid>> GetUserIdByRoleAndDepartment(Guid donViId, string maVaiTro)
        {
            var response = await _departmentService.GetUserIdByRoleAndDepartment(donViId, maVaiTro);
            return DataResponse<Guid>.Success(response, "Lấy dropdown capBacDepartment");
        }

    }
}
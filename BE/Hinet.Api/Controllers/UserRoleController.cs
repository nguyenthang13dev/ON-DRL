using Hinet.Service.Core.Mapper;
using Microsoft.AspNetCore.Mvc;
using Hinet.Model.Entities;
using Hinet.Service.UserRoleService;
using Hinet.Service.UserRoleService.Dto;
using Hinet.Service.UserRoleService.ViewModels;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using System;
using Hinet.Service.RoleService;
using Hinet.Service.DepartmentService;
using StackExchange.Redis;
using System.Data;
//using Hinet.Service.GroupRoleService;
using System.Collections.Generic;
using Hinet.Service.AppUserService;
using Hinet.Service.TinhService.Dto;
using Hinet.Api.Dto;

namespace Hinet.Controllers
{
    [Route("api/[controller]")]
    public class UserRoleController : HinetController
    {
        private readonly IUserRoleService _userRoleService;
        private readonly IRoleService _roleService;
        private readonly IDepartmentService _departmentService;
        //private readonly IGroupRoleService _groupRoleService;
        private readonly IAppUserService _appUserService;

        private readonly IMapper _mapper;
        private readonly ILogger<UserRoleController> _logger;

        public UserRoleController(
            IUserRoleService userRoleService,
            IMapper mapper,
            ILogger<UserRoleController> logger
            , IRoleService roleService,
            IDepartmentService departmentService,
            //IGroupRoleService groupRoleService,
            IAppUserService appUserService)
        {
            this._userRoleService = userRoleService;
            this._mapper = mapper;
            _logger = logger;
            _roleService = roleService;
            _departmentService = departmentService;
            //_groupRoleService = groupRoleService;
            _appUserService = appUserService;
        }

        [HttpPost("Create")]
        public async Task<DataResponse<UserRole>> Create([FromBody] UserRoleCreateVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    //lấy các quyền đang có trong hệ thống
                    var listRole = _roleService.GetQueryable().ToList();

                    // các mã quyền hiện tại
                    var listUserRoleCode = _userRoleService.GetListRoleCodeByUserId(model.UserId);

                    // các quyền được thêm mới
                    var listNewRoleCode = (model.RoleCode ?? new List<string>())
                                        .Except(listUserRoleCode ?? new List<string>())
                                        .ToList();
                    // các quyền bị xóa
                    var listDeletedRoleCode = (listUserRoleCode ?? new List<string>())
                                            .Except(model.RoleCode ?? new List<string>())
                                            .ToList();

                    // thêm mới các quyền cho acc
                    if (listNewRoleCode != null && listNewRoleCode.Any())
                    {
                        var listUserRole = new List<UserRole>();
                        foreach (var item in listNewRoleCode)
                        {
                            var roleId = listRole.FirstOrDefault(x => x.Code == item)?.Id;
                            if (roleId != null)
                            {
                                var userRole = new UserRole();
                                userRole.UserId = model.UserId;
                                userRole.RoleId = (Guid)roleId;
                                listUserRole.Add(userRole);
                            }
                        }
                        if (listUserRole != null && listUserRole.Any())
                        {
                            await _userRoleService.CreateAsync(listUserRole);
                        }
                    }

                    // xóa các quyền cho acc
                    if (listDeletedRoleCode != null && listDeletedRoleCode.Any())
                    {
                        var listIdRoleDeleted = listRole
                            .Where(x => listDeletedRoleCode.Contains(x.Code))
                            .Select(x => x.Id)
                            .ToList();

                        var listUserRoleDeleted = _userRoleService.GetQueryable()
                            .Where(x => x.UserId == model.UserId &&
                            listIdRoleDeleted.Contains(x.RoleId))
                            .ToList();

                        if (listUserRoleDeleted != null && listUserRoleDeleted.Any())
                        {
                            await _userRoleService.DeleteAsync(listUserRoleDeleted);
                        }
                    }

                    return DataResponse<UserRole>.Success(null, "");
                }
                catch (Exception ex)
                {
                    return DataResponse<UserRole>.False("Error", new string[] { ex.Message });
                }
            }
            return DataResponse<UserRole>.False("Some properties are not valid", ModelStateError);
        }

        [HttpPost("Update")]
        public async Task<DataResponse<UserRole>> Update([FromBody] UserRoleEditVM model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var entity = await _userRoleService.GetByIdAsync(model.Id);
                    if (entity == null)
                        return DataResponse<UserRole>.False("UserRole not found");

                    entity = _mapper.Map(model, entity);
                    await _userRoleService.UpdateAsync(entity);
                    return new DataResponse<UserRole>() { Data = entity, Status = true };
                }
                catch (Exception ex)
                {
                    DataResponse<UserRole>.False(ex.Message);
                }
            }
            return DataResponse<UserRole>.False("Some properties are not valid", ModelStateError);
        }

        [HttpGet("Get/{id}")]
        public async Task<DataResponse<UserRoleDto>> Get(Guid id)
        {
            var result = await _userRoleService.GetDto(id);
            return new DataResponse<UserRoleDto>
            {
                Data = result,
                Message = "Get UserRoleDto thành công",
                Status = true
            };
        }

        [HttpPost("GetData")]
        public async Task<DataResponse<PagedList<UserRoleDto>>> GetData([FromBody] UserRoleSearch search)
        {
            var result = await _userRoleService.GetData(search);
            return new DataResponse<PagedList<UserRoleDto>>
            {
                Data = result,
                Message = "GetData PagedList<UserRoleDto> thành công",
                Status = true
            };
        }

        [HttpDelete("Delete/{id}")]
        public async Task<DataResponse> Delete(Guid id)
        {
            try
            {
                var entity = await _userRoleService.GetByIdAsync(id);
                await _userRoleService.DeleteAsync(entity);
                return DataResponse.Success(null);
            }
            catch (Exception ex)
            {
                return DataResponse.False(ex.Message);
            }
        }

        [HttpPost("CreateNew")]
        public async Task<DataResponse<List<UserRole>>> CreateNew([FromBody] UserRoleCreateVM_GanNguoi model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var listRoleAdd = new List<UserRole>();
                    if (model.ListDataRole != null && model.ListDataRole.Any())
                    {
                        foreach (var item in model.ListDataRole)
                        {
                            var obj = new UserRole();
                            obj.UserId = model.UserId;
                            obj.RoleId = item;

                            var objTonTai = _userRoleService.GetByUserAndRole(model.UserId, item);
                            if (objTonTai == null)
                            {
                                listRoleAdd.Add(obj);
                                await _userRoleService.CreateAsync(obj);
                            }
                        }

                        var listTonTaiTheoUserId = _userRoleService.GetByUser(model.UserId);
                        var listBiXoa = listTonTaiTheoUserId.Where(x => !model.ListDataRole.Contains(x.RoleId)).ToList();
                        foreach (var item in listBiXoa)
                        {
                            await _userRoleService.DeleteAsync(item);
                        }
                    }
                    else
                    {
                        var listXoa = _userRoleService.GetByUser(model.UserId);
                        await _userRoleService.DeleteAsync(listXoa);
                    }
                    return new DataResponse<List<UserRole>>() { Data = listRoleAdd, Status = true };
                }
                catch (Exception ex)
                {
                    return DataResponse<List<UserRole>>.False("Error", new string[] { ex.Message });
                }
            }
            return DataResponse<List<UserRole>>.False("Some properties are not valid", ModelStateError);
        }

        [HttpPost("SetupRole")]
        public async Task<DataResponse<UserRoleVM>> SetupRole(Guid id)
        {
            var result = await _userRoleService.GetUserRoleVM(id);
            return new DataResponse<UserRoleVM>
            {
                Data = result,
                Message = "SetupRole UserRoleVM thành công",
                Status = true
            };
        }
    }
}
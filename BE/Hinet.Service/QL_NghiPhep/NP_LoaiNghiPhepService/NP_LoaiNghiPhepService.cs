using Hinet.Model.Entities.NghiPhep;
using Hinet.Repository;
using Hinet.Repository.NghiPhep.NP_LoaiNghiPhepRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.Dto;
using Hinet.Service.QL_NghiPhep.NP_LoaiNghiPhepService.Dto;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QL_NghiPhep.NP_LoaiNghiPhepService
{
    public class NP_LoaiNghiPhepService : Service<NP_LoaiNghiPhep>, INP_LoaiNghiPhepService
    {

        public NP_LoaiNghiPhepService(INP_LoaiNghiPhepRepository repository) : base(repository)
        {
        }

        public async Task<PagedList<NP_LoaiNghiPhepDto>> GetData(NP_LoaiNghiPhepSearchDto search)
        {
            try
            {
                var q = from lh in GetQueryable()
                        select new NP_LoaiNghiPhepDto
                        {
                            CreatedBy = lh.CreatedBy,
                            CreatedDate = lh.CreatedDate,
                            Id = lh.Id,
                            UpdatedBy = lh.UpdatedBy,
                            UpdatedDate = lh.UpdatedDate,
                            TenLoaiPhep = lh.TenLoaiPhep,
                            MaLoaiPhep = lh.MaLoaiPhep,
                            SoNgayMacDinh = lh.SoNgayMacDinh,
                            CreatedId = lh.CreatedId,
                            UpdatedId = lh.UpdatedId,
                            DeleteId = lh.DeleteId,
                            DeleteTime = lh.DeleteTime,
                            IsDelete = lh.IsDelete
                        };
                if (search != null)
                {

                }
                q = q.OrderByDescending(x => x.CreatedDate);
                return await PagedList<NP_LoaiNghiPhepDto>.CreateAsync(q, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Lỗi lấy dữ liệu: " + ex.Message);
            }
        }

        public async Task<NP_LoaiNghiPhep> GetById(Guid id)
        {
            return await GetById(id);
        }
        public async Task<NP_LoaiNghiPhep> GetByMa(string MaLoaiPhep)
        {
            return await GetQueryable().FirstOrDefaultAsync(x => x.MaLoaiPhep.Equals(MaLoaiPhep));
        }

        public async Task<List<DropdownOption>> GetDropdown()
        {
            try
            {
                return await Task.Run(() => GetQueryable()
                    .Select(x => new DropdownOption
                    {
                        Label = x.TenLoaiPhep,
                        Value = x.MaLoaiPhep,
                    }).ToList());
            }
            catch (Exception ex)
            {
                throw new Exception("Không thể lấy dữ liệu loại nghỉ phép: " + ex.Message);
            }
        }
    }
}

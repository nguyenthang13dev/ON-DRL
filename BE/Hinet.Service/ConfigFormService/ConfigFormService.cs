using Hinet.Model.Entities;
using Hinet.Repository.ConfigFormRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.ConfigFormService.Dto;
using Hinet.Service.Common;
using Microsoft.EntityFrameworkCore;
using Hinet.Repository.DM_NhomDanhMucRepository;
using Hinet.Service.Dto;
using Hinet.Repository.DepartmentRepository;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Reflection;
using Hinet.Model.Entities.ConfigAssign;

namespace Hinet.Service.ConfigFormService
{
    public class ConfigFormService : Service<ConfigForm>, IConfigFormService
    {
      

        public ConfigFormService(
            IConfigFormRepository ConfigFormRepository) : base(ConfigFormRepository)
        {
       
        }

        public async Task<PagedList<ConfigFormDto>> GetData(ConfigFormSearchVM search)
        {
            try
            {
                var query = from q in GetQueryable()
                            select new ConfigFormDto
                            {
                                CreatedId = q.CreatedId,
                                UpdatedId = q.UpdatedId,
                                Id = q.Id,
                                CreatedBy = q.CreatedBy,
                                UpdatedBy = q.UpdatedBy,
                                DeleteId = q.DeleteId,
                                CreatedDate = q.CreatedDate,
                                UpdatedDate = q.UpdatedDate,
                                DeleteTime = q.DeleteTime,
                            };

                if (search != null)
                {
                   
                }
                query = query.OrderByDescending(x => x.CreatedDate);
                return await PagedList<ConfigFormDto>.CreateEfAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message);
            }
        }

        public async Task<ConfigFormDto> GetDto(Guid id)
        {
            try
            {
                var item = await (from q in GetQueryable().Where(x => x.Id == id)
                                  select new ConfigFormDto
                                  {
                                      CreatedId = q.CreatedId,
                                      UpdatedId = q.UpdatedId,
                                      Id = q.Id,
                                      CreatedBy = q.CreatedBy,
                                      UpdatedBy = q.UpdatedBy,
                                      DeleteId = q.DeleteId,
                                      CreatedDate = q.CreatedDate,
                                      UpdatedDate = q.UpdatedDate,
                                      DeleteTime = q.DeleteTime,
                                  }).FirstOrDefaultAsync();

                return item ?? throw new Exception("Data not found for ID: " + id);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve DTO: " + ex.Message);
            }
        }
    }
}
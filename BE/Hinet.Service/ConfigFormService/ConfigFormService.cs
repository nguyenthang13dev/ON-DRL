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
using Hinet.Service.NotificationService.Dto;
using MongoDB.Driver.Linq;
using Hinet.Repository.SoLieuKeKhaiRepostiory;
using Hinet.Model.MongoEntities;
using Hinet.Service.KeKhaiSumaryService.Dto;
using Hinet.Repository.KeKhaiSumaryRepository;
using Hinet.Service.Constant;

namespace Hinet.Service.ConfigFormService
{
    public class ConfigFormService : Service<ConfigForm>, IConfigFormService
    {
      
        private readonly IConfigFormRepository _configFormRepository;
        private readonly IKeKhaiSumaryRepository _keKhaiSumaryRepository;
        private readonly ISoLieuKeKhaiRepository _soLieuKeKhaiRepostiory;

        public ConfigFormService(
            IConfigFormRepository ConfigFormRepository, ISoLieuKeKhaiRepository soLieuKeKhaiRepostiory, IKeKhaiSumaryRepository keKhaiSumaryRepository) : base(ConfigFormRepository)
        {
            _configFormRepository = ConfigFormRepository;
            _soLieuKeKhaiRepostiory = soLieuKeKhaiRepostiory;
            _keKhaiSumaryRepository = keKhaiSumaryRepository;
        }



        public async Task<TaiLieuDinhKem> GetTaiLieuDinhKem(Guid Id)
        {
            try
            {
                var resFiles = await _configFormRepository.GetByIdAsync(Id);
                if (resFiles is null)
                {
                    throw new Exception("Files is not exits");
                } else
                {
                    return resFiles.FileDinhKems;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<List<DanhSachFormDto>> GetKeKhaiByUser(ConfigFormSearchVM search)
        {
            var listConf = _configFormRepository.GetQueryable().ToList();

            var keKhaiSummarys = _keKhaiSumaryRepository.GetQueryable().Where(t => t.UserId == search.UserId);

            var query = listConf.Select(t => new DanhSachFormDto
            {
                Name = t.Name,
                Description = t.Description,
                Status = keKhaiSummarys.FirstOrDefault(x => x.FormId == t.Id)?.Status ?? StatusConstant.CHUAKEKHAI,
                IsDanhGia = keKhaiSummarys.FirstOrDefault(x => x.FormId == t.Id)?.IsDanhGia ?? false,
                Processs = keKhaiSummarys.FirstOrDefault(x => x.FormId == t.Id)?.Processs ?? 0,
                CreateDate = keKhaiSummarys.FirstOrDefault(x => x.FormId == t.Id)?.CreatedDate ?? null,
                FormId = t.Id,
            }).ToList();

            return query;


        }


        public async Task<PagedList<ConfigFormDto>> GetData(ConfigFormSearchVM search)
        {
            try
            {
                var query =GetQueryable().Select(q => new ConfigFormDto
                {
                    CreatedId = q.CreatedId,
                    UpdatedId = q.UpdatedId,
                    Id = q.Id,
                    Description = q.Description,
                    FileDinhKems = q.FileDinhKems,
                    IsActive = q.IsActive,
                    Subject = q.Subject,
                    Name = q.Name,
                    CreatedBy = q.CreatedBy,
                    CreatedDate = q.CreatedDate,
                    UpdatedDate = q.UpdatedDate,
                });
                if (search != null)
                {
                   
                }
                //query = query.OrderByDescending(x => x.CreatedDate);
                return await PagedList<ConfigFormDto>.CreateAsync(query, search);
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
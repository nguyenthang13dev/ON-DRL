using Hinet.Model.Entities;
using Hinet.Repository.TinhRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.TinhService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using MongoDB.Driver.Linq;
using MongoDB.Driver;
using Hinet.Repository;
using Hinet.Service.SubjectService.Dto;
using Hinet.Repository.KhoaRepository;
using Microsoft.EntityFrameworkCore;

namespace Hinet.Service.SubjectService
{
    public class SubjectService : Service<Subject>, ISubjectService
    {
        private readonly IKhoaRepository _khoaRepository;

        public SubjectService(IRepository<Subject> repository, IKhoaRepository khoaRepository) : base(repository)
        {
            _khoaRepository = khoaRepository;
        }
        public async Task<List<DropdownOption>> GetDropDownSubject()
        {
            var query = GetQueryable()
                         .Select(t => new DropdownOption
                         {
                             Label = t.Name,
                             Value = t.Id.ToString()
                         }).ToList();
            return query;
        }

        public async Task<PagedList<SubjectDto>> GetData(SubjectSearch search)
        {
            try
            {
                var query = from q in GetQueryable()
                            join khoa in _khoaRepository.GetQueryable() on q.Department equals khoa.Id
                            select new SubjectDto()
                            {
                                Id = q.Id,
                                Name = q.Name,
                                AssessmentMethod = q.AssessmentMethod,
                                Code = q.Code,  
                                DepartmentName = khoa != null ? khoa.TenKhoa : "Ch?a có thông tin",
                                Corequisites = q.Corequisites,
                                Department = q.Department,
                                Description = q.Description,
                                Credits = q.Credits,
                                PracticeHours = q.PracticeHours,
                                Prerequisites = q.Prerequisites,
                                TheoryHours = q.TheoryHours,
                                Semester = q.Semester,
                                IsElective = q.IsElective,
                                UpdatedDate = q.UpdatedDate,
                                CreatedDate = q.CreatedDate
                            };

                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.SubjectCode))
                    {
                        query = query.Where(t => t.Code.Contains(search.SubjectCode));
                    }
                    if (!string.IsNullOrEmpty(search.Name))
                    {
                        query = query.Where(t => t.Name.Contains(search.Name));      
                    }
                    if (search.Department != null)
                    {
                        query = query.Where(t => t.Department == search.Department);
                    }
                }

                query = query.OrderByDescending(x => x.CreatedDate);
                return await PagedList<SubjectDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message, ex);
            }
        }

        public async Task<SubjectDto> GetDto(Guid id)
        {
            try
            {
                var item = await (from q in GetQueryable().Where(x => x.Id == id)
                                  select new SubjectDto()
                                  {
                                      Id = q.Id,
                                      CreatedDate = q.CreatedDate,
                                  }).FirstOrDefaultAsync()
                                  ?? throw new Exception($"No Tinh found with ID {id}");

                return item;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to retrieve Tinh with ID {id}: " + ex.Message, ex);
            }
        }
       
    }
}
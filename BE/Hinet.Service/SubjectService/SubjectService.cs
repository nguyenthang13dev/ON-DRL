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

namespace Hinet.Service.SubjectService
{
    public class SubjectService : Service<Subject>, ISubjectService
    {
        public SubjectService(IRepository<Subject> repository) : base(repository)
        {

        }
        public async Task<PagedList<SubjectDto>> GetData(SubjectSearch search)
        {
            try
            {
                var query = from q in GetQueryable()
                            select new SubjectDto()
                            {
                                Id = q.Id,
                                Name = q.Name,
                                AssessmentMethod = q.AssessmentMethod,
                                Code = q.Code,  
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

        public async Task<List<DropdownOption>> GetDropdown()
        {
            try
            {
                var datas = await (from q in GetQueryable()
                                   select new DropdownOption()
                                   {
                                   }).ToListAsync();

                return datas;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve dropdown options: " + ex.Message, ex);
            }
        }
    }
}
using Hinet.Model.Entities;
using Hinet.Repository.User_GroupUserRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.User_GroupUserService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Hinet.Model.Entities;
using MongoDB.Driver.Linq;

namespace Hinet.Service.User_GroupUserService
{
    public class User_GroupUserService : Service<User_GroupUser>, IUser_GroupUserService
    {
        public User_GroupUserService(
            IUser_GroupUserRepository user_GroupUserRepository
            ) : base(user_GroupUserRepository)
        {
        }

        public async Task<PagedList<User_GroupUserDto>> GetData(User_GroupUserSearch search)
        {
            var query = from q in GetQueryable()
                        select new User_GroupUserDto()
                        {
                            UserId = q.UserId,
							GroupUserId = q.GroupUserId,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                        };
            if(search != null )
            {
                if(search.UserId.HasValue)
				{
					query = query.Where(x => x.UserId == search.UserId);
				}
				if(search.GroupUserId.HasValue)
				{
					query = query.Where(x => x.GroupUserId == search.GroupUserId);
				}
            }
            query = query.OrderByDescending(x=>x.CreatedDate);
            var result = await PagedList<User_GroupUserDto>.CreateAsync(query, search);
            return result;
        }

        public async Task<User_GroupUserDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x=>x.Id == id)
                        select new User_GroupUserDto()
                        {
                            UserId = q.UserId,
							GroupUserId = q.GroupUserId,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                        }).FirstOrDefaultAsync();
            
            return item;
        }

    }
}

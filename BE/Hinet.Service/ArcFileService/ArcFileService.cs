using Hinet.Model.Entities;
using Hinet.Repository.ArcFileRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.ArcFileService.Dto;
using Hinet.Service.Common;
using Hinet.Service.Dto;
using Microsoft.EntityFrameworkCore;
using Hinet.Model.Entities.LuuTruBQP;
using Hinet.Repository.DM_DuLieuDanhMucRepository;
using Hinet.Repository.DM_NhomDanhMucRepository;
using Hinet.Service.Constant;



namespace Hinet.Service.ArcFileService
{
    public class ArcFileService : Service<ArcFile>, IArcFileService
    {

        private readonly IDM_DuLieuDanhMucRepository _dM_DuLieuDanhMucRepository;
        private readonly IDM_NhomDanhMucRepository _NhomDanhMucRepository;
        public ArcFileService(
            IArcFileRepository arcFileRepository
, IDM_DuLieuDanhMucRepository dM_DuLieuDanhMucRepository,
IDM_NhomDanhMucRepository nhomDanhMucRepository) : base(arcFileRepository)
        {
            _dM_DuLieuDanhMucRepository = dM_DuLieuDanhMucRepository;
            _NhomDanhMucRepository = nhomDanhMucRepository;
        }

        public async Task<PagedList<ArcFileDto>> GetData(ArcFileSearch search)
        {

            var duLieuDanhMucs = from dm in _dM_DuLieuDanhMucRepository.GetQueryable()
                                 join nhom in _NhomDanhMucRepository.GetQueryable()
                                 on dm.GroupId equals nhom.Id
                                 select new { dm.Code, dm.Name, nhom.GroupCode };
                                 

            var maintences = duLieuDanhMucs.Where(x => x.GroupCode == MaDanhMucConstant.THBQ);
            var langs = duLieuDanhMucs.Where(x => x.GroupCode == MaDanhMucConstant.LANG);


            var query = from q in GetQueryable()
                        join mt in maintences on q.Maintenance equals mt.Code into mtGroup
                        from mt in mtGroup.DefaultIfEmpty()
                        

                        select new ArcFileDto()
                        {
                            FileCode = q.FileCode,
                            OrganId = q.OrganId,
                            FileCataLog = q.FileCataLog,
                            FileNotation = q.FileNotation,
                            Title = q.Title,
                            Maintenance = q.Maintenance,
                            Rights = q.Rights,
                            Language = q.Language,
                            StartDate = q.StartDate,
                            EndDate = q.EndDate,
                            TotalDoc = q.TotalDoc,
                            Description = q.Description,
                            InforSign = q.InforSign,
                            KeyWord = q.KeyWord,
                            SheetNumber = q.SheetNumber,
                            PageNumber = q.PageNumber,
                            Format = q.Format,
                            Nam = q.Nam,
                            CreatedBy = q.CreatedBy,
                            UpdatedBy = q.UpdatedBy,
                            IsDelete = q.IsDelete,
                            DeleteId = q.DeleteId,
                            CreatedDate = q.CreatedDate,
                            UpdatedDate = q.UpdatedDate,
                            DeleteTime = q.DeleteTime,
                            Id = q.Id,
                            MaintenceName = mt != null ? mt.Name : "",
                        };

            if (search != null)
            {
                if (!string.IsNullOrEmpty(search.FileCode))
                {
                    query = query.Where(x => EF.Functions.Like(x.FileCode.ToLower(), $"%{search.FileCode.Trim().ToLower()}%"));
                }
                if (!string.IsNullOrEmpty(search.Title))
                {
                    query = query.Where(x => EF.Functions.Like(x.Title.ToLower(), $"%{search.Title.Trim().ToLower()}%"));
                }
                if (search.Rights.HasValue)
                {
                    query = query.Where(x => x.Rights == search.Rights);
                }
                if (!string.IsNullOrEmpty(search.Language))
                {
                    query = query.Where(x => EF.Functions.Like(x.Language.ToLower(), $"%{search.Language.Trim().ToLower()}%"));
                }
                if (!string.IsNullOrWhiteSpace(search.OrganId))
                {
                    query = query.Where(x => x.OrganId.Equals(search.OrganId));
                }

            }
            query = query.OrderByDescending(x => x.CreatedDate);
            var result = await PagedList<ArcFileDto>.CreateAsync(query, search);

            if (result.Items != null && result.Items.Any())
            {
                foreach (var item in result.Items)
                {
                    if (string.IsNullOrEmpty(item.Language)) continue;
                    try
                    {
                        var langName = "";
                        var lstLangCode = item.Language.Split(',').ToList();
                        if (lstLangCode != null && lstLangCode.Any())
                        {
                            var lstLangName = langs
                                .Where(x => lstLangCode.Contains(x.Code))
                                .Select(x => x.Name)
                                .OrderByDescending(x => x)
                                .ToList();
                            langName = lstLangName.Any() ? string.Join(",", lstLangName) : "";
                        }
                        item.LangName = langName;
                    }
                    catch (Exception)
                    {
                        continue;
                    }
                }
            }

            return result;
        }

        public async Task<ArcFileDto?> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)

                              select new ArcFileDto()
                              {
                                  FileCode = q.FileCode,
                                  OrganId = q.OrganId,
                                  FileCataLog = q.FileCataLog,
                                  FileNotation = q.FileNotation,
                                  Title = q.Title,
                                  Maintenance = q.Maintenance,
                                  Rights = q.Rights,
                                  Language = q.Language,
                                  StartDate = q.StartDate,
                                  EndDate = q.EndDate,
                                  TotalDoc = q.TotalDoc,
                                  Description = q.Description,
                                  InforSign = q.InforSign,
                                  KeyWord = q.KeyWord,
                                  SheetNumber = q.SheetNumber,
                                  PageNumber = q.PageNumber,
                                  Format = q.Format,
                                  Nam = q.Nam,
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

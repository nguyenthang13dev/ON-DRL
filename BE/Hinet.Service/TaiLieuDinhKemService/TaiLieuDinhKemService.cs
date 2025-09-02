using Hinet.Model.Entities;
using Hinet.Repository.TaiLieuDinhKemRepository;
using Hinet.Service.Common.Service;
using Hinet.Service.TaiLieuDinhKemService.Dto;
using Hinet.Service.Common;
using Microsoft.EntityFrameworkCore;
using CommonHelper.String;
using Hinet.Service.Constant;
using System.Security.Cryptography.Pkcs;
using System.Security.Cryptography.X509Certificates;

namespace Hinet.Service.TaiLieuDinhKemService
{
    public class TaiLieuDinhKemService : Service<TaiLieuDinhKem>, ITaiLieuDinhKemService
    {
        public TaiLieuDinhKemService(ITaiLieuDinhKemRepository taiLieuDinhKemRepository) : base(taiLieuDinhKemRepository)
        {
        }

        public async Task<List<TaiLieuDinhKem>> GetByItemAsync(Guid itemId)
        {
            return await Where(x => x.Item_ID == itemId).ToListAsync();
        }

        public Task<List<TaiLieuDinhKem>> GetByIdsAsync(string ids)
        {
            var guidIds = ids.Split(',').Select(x => x.ToGuid()).Where(x => x.HasValue).ToList();
            return Where(x => guidIds.Contains(x.Id)).ToListAsync();
        }

        public async Task UpdateItemIdAsync(string ids, Guid itemId)
        {
            var items = await GetByIdsAsync(ids);
            foreach (var item in items)
            {
                item.Item_ID = itemId;
            }
            await UpdateAsync(items);
        }

        public async Task<string> GetPathItem(Guid itemId)
        {
            var query = await GetQueryable().FirstOrDefaultAsync(t => t.Item_ID.Equals(itemId));
            return query?.DuongDanFile ?? string.Empty;
        }

        public async Task<TaiLieuDinhKem> AddOrEditPath(string filePath, Guid id)
        {
            var attach = await Where(t => t.Id.Equals(id)).FirstOrDefaultAsync()
                ?? throw new Exception("Not found attachment");

            attach.DuongDanFilePDF = filePath;
            await UpdateAsync(attach);
            return attach;
        }

        public async Task<PagedList<TaiLieuDinhKemDto>> GetData(TaiLieuDinhKemSearch search)
        {
            try
            {
                var query = from q in GetQueryable()
                            select new TaiLieuDinhKemDto
                            {
                                Item_ID = q.Item_ID,
                                UserId = q.UserId,
                                KichThuoc = q.KichThuoc,
                                TenTaiLieu = q.TenTaiLieu,
                                LoaiTaiLieu = q.LoaiTaiLieu,
                                MoTa = q.MoTa,
                                DuongDanFile = q.DuongDanFile,
                                DuongDanFilePDF = q.DuongDanFilePDF,
                                DinhDangFile = q.DinhDangFile,
                                NgayPhatHanh = q.NgayPhatHanh,
                                CreatedDate = q.CreatedDate,
                                UpdatedDate = q.UpdatedDate,
                                Id = q.Id,
                            };

                if (search != null)
                {
                    if (!string.IsNullOrEmpty(search.TenTaiLieu))
                    {
                        query = query.Where(x => x.TenTaiLieu.ToUpper().Contains(search.TenTaiLieu.Trim().ToUpper()));
                    }

                    if (!string.IsNullOrEmpty(search.DinhDangFile))
                    {
                        query = query.Where(x => x.DinhDangFile.ToUpper().Equals(search.DinhDangFile.Trim().ToUpper()));
                    }

                    if (search.KichThuocMin != null)
                    {
                        query = query.Where(x => x.KichThuoc != null && x.KichThuoc >= search.KichThuocMin);
                    }

                    if (search.KichThuocMax != null)
                    {
                        query = query.Where(x => x.KichThuoc != null && x.KichThuoc <= search.KichThuocMax);
                    }

                    if (!string.IsNullOrEmpty(search.LoaiTaiLieu))
                    {
                        query = query.Where(x => x.LoaiTaiLieu != null && x.LoaiTaiLieu.ToUpper().Equals(search.LoaiTaiLieu.Trim().ToUpper()));
                    }

                    if (!string.IsNullOrEmpty(search.Item_ID))
                    {
                        query = query.Where(x => x.Item_ID != null && x.Item_ID.ToString().ToUpper().Equals(search.Item_ID.Trim().ToUpper()));
                    }

                    if (search.IsDonVi.HasValue && search.IsDonVi.Value)
                    {
                        query = query.Where(x => x.LoaiTaiLieu != null &&
                            x.LoaiTaiLieu.ToLower().Equals(LoaiTaiLieuConstant.TaiLieuDonVi) &&
                            x.Item_ID != null &&
                            x.Item_ID.ToString().ToUpper().Equals(search.Item_ID.Trim().ToUpper()));
                    }
                }

                query = query.OrderByDescending(x => x.CreatedDate);
                return await PagedList<TaiLieuDinhKemDto>.CreateAsync(query, search);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve data: " + ex.Message, ex);
            }
        }

        public async Task<TaiLieuDinhKemDto> GetDto(Guid id)
        {
            try
            {
                var item = await (from q in GetQueryable().Where(x => x.Id == id)
                                  select new TaiLieuDinhKemDto
                                  {
                                      Item_ID = q.Item_ID,
                                      UserId = q.UserId,
                                      IdDonViUpload = q.IdDonViUpload,
                                      IdDotKeKhaiSoLieu = q.IdDotKeKhaiSoLieu,
                                      IdDonViKhaoSat = q.IdDonViKhaoSat,
                                      IdDotKhaoSat = q.IdDotKhaoSat,
                                      IdRootItem = q.IdRootItem,
                                      CreatedId = q.CreatedId,
                                      UpdatedId = q.UpdatedId,
                                      SoLuongDownload = q.SoLuongDownload,
                                      LanKeKhai = q.LanKeKhai,
                                      ThangKhaoSat = q.ThangKhaoSat,
                                      QuyKhaoSat = q.QuyKhaoSat,
                                      NamKhaoSat = q.NamKhaoSat,
                                      IsTempDelete = q.IsTempDelete,
                                      IsKySo = q.IsKySo,
                                      KichThuoc = q.KichThuoc,
                                      TenTaiLieu = q.TenTaiLieu,
                                      LoaiTaiLieu = q.LoaiTaiLieu,
                                      MoTa = q.MoTa,
                                      DuongDanFile = q.DuongDanFile,
                                      DuongDanFilePDF = q.DuongDanFilePDF,
                                      DinhDangFile = q.DinhDangFile,
                                      NgayPhatHanh = q.NgayPhatHanh,
                                      Guid = q.Guid,
                                      KeyTieuChiKeKhai = q.KeyTieuChiKeKhai,
                                      NguoiKy = q.NguoiKy,
                                      DonViPhatHanh = q.DonViPhatHanh,
                                      NgayKy = q.NgayKy,
                                      CreatedBy = q.CreatedBy,
                                      CreatedDate = q.CreatedDate,
                                      UpdatedDate = q.UpdatedDate,
                                      DeleteTime = q.DeleteTime,
                                      UpdatedBy = q.UpdatedBy,
                                      IsDelete = q.IsDelete,
                                      DeleteId = q.DeleteId,
                                      Id = q.Id,
                                  }).FirstOrDefaultAsync()
                                  ?? throw new Exception("Attachment not found");

                return item;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to retrieve DTO: " + ex.Message, ex);
            }
        }

        public async Task<List<TaiLieuDinhKem>> GetKySo(List<Guid> ids)
        {
            try
            {
                SignedCms signedCms = new SignedCms();
                var allFile = GetQueryable().Where(x => ids.Contains(x.Id)).ToList();

                foreach (var file in allFile)
                {
                    string filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot/uploads", file.DuongDanFile);
                    if (File.Exists(filePath))
                    {
                        byte[] content = File.ReadAllBytes(filePath);
                        signedCms.Decode(content);

                        file.IsKySo = signedCms.SignerInfos.Count > 0;

                        foreach (SignerInfo signer in signedCms.SignerInfos)
                        {
                            X509Certificate2 certificate = signer.Certificate;
                            file.NguoiKy = certificate.Subject;
                            file.DonViPhatHanh = certificate.Issuer;
                            file.NgayKy = certificate.GetEffectiveDateString();
                        }
                    }
                }

                return allFile;
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to process signed documents: " + ex.Message, ex);
            }
        }

        public async Task<string> GetPathFromId(Guid id)
        {
            var entity = await GetQueryable().FirstOrDefaultAsync(x => x.Id == id);
            return entity?.DuongDanFile ?? throw new Exception("Attachment not found");
        }

        public async Task<TaiLieuDinhKem> GetTaiLieuByType(string Type)
        {
            var attach = await Where(t => t.LoaiTaiLieu.Equals(LoaiTaiLieuConstant.CAUHINHDANGKYNGHIPHEP)).FirstOrDefaultAsync()
                ?? throw new Exception("Not found attachment");
            return attach;
        }
    }
}
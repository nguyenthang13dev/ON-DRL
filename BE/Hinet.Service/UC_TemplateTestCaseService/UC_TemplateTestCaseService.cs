using Hangfire.Storage.Monitoring;
using Hinet.Model.Entities;
using Hinet.Model.Entities.DA_Test_Case;
using Hinet.Repository.UC_TemplateTestCaseRepository;
using Hinet.Service.Common;
using Hinet.Service.Common.Service;
using Hinet.Service.DM_DuLieuDanhMucService;
using Hinet.Service.DM_NhomDanhMucService;
using Hinet.Service.Dto;
using Hinet.Service.TacNhan_UseCaseService;
using Hinet.Service.UC_TemplateTestCaseService.Dto;
using Hinet.Service.UC_UseCaseDemoService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Hinet.Service.UC_TemplateTestCaseService
{
    public class UC_TemplateTestCaseService : Service<UC_TemplateTestCase>, IUC_TemplateTestCaseService
    {
        private readonly ITacNhan_UseCaseService _tacNhanUseCaseService;
        private readonly IDM_DuLieuDanhMucService _dM_DuLieuDanhMucService;
        private readonly IDM_NhomDanhMucService _dM_NhomDanhMucService;
        private readonly IUC_UseCaseDemoService _uC_UseCaseDemoService;

        public UC_TemplateTestCaseService(
            IUC_TemplateTestCaseRepository uC_TemplateTestCaseRepository,
            ITacNhan_UseCaseService tacNhanUseCaseService,
            IDM_DuLieuDanhMucService dM_DuLieuDanhMucService,
            IDM_NhomDanhMucService dM_NhomDanhMucService,
            IUC_UseCaseDemoService uC_UseCaseDemoService
            ) : base(uC_TemplateTestCaseRepository)
        {
            _tacNhanUseCaseService = tacNhanUseCaseService;
            _dM_NhomDanhMucService = dM_NhomDanhMucService;
            _dM_DuLieuDanhMucService = dM_DuLieuDanhMucService;
            _uC_UseCaseDemoService = uC_UseCaseDemoService;
        }

        public async Task<PagedList<UC_TemplateTestCaseDto>> GetData(UC_TemplateTestCaseSearch search)
        {
            var query = from q in GetQueryable()
                        select new UC_TemplateTestCaseDto()
                        {
                            Id = q.Id,
                            TemplateName = q.TemplateName,
                            KeyWord = q.KeyWord,
                            TemplateContent = q.TemplateContent,
                            CreatedDate = q.CreatedDate
                        };

            var test = query.ToList();

            if (query != null)
            {

                if (!string.IsNullOrEmpty(search.TemplateName))
                    query = query.Where(x => x.TemplateName.ToLower().Contains(search.TemplateName.ToLower()));

                if (!string.IsNullOrEmpty(search.KeyWord))
                    query = query.Where(x => x.KeyWord.ToLower().Contains(search.KeyWord.ToLower()));

            }
            query = query.OrderByDescending(x => x.CreatedDate);

            var result = await PagedList<UC_TemplateTestCaseDto>.CreateAsync(query, search);
            return result;


        }

        public async Task<UC_TemplateTestCaseDto> GetDto(Guid id)
        {
            var item = await (from q in GetQueryable().Where(x => x.Id == id)
                              select new UC_TemplateTestCaseDto()
                              {
                                  TemplateName = q.TemplateName,
                                  KeyWord = q.KeyWord,
                                  TemplateContent = q.TemplateContent,
                              }).FirstOrDefaultAsync();

            return item;

        }

        public async Task<List<UseCaseGenerateResultDto>> GenerateUseCaseStrings(List<UseCaseInputDto> inputList)
        {
            try
            {
                var nhomLoaiUseCase = await _dM_NhomDanhMucService.GetQueryable()
                    .Where(x => x.GroupCode == "LOAI_USECASE")
                    .FirstOrDefaultAsync();
                if (nhomLoaiUseCase == null)
                {
                    var newtemplate = new DM_NhomDanhMuc
                    {
                        GroupCode = "LOAI_USECASE",
                        GroupName = "Loại UseCase"
                    };
                    await _dM_NhomDanhMucService.CreateAsync(newtemplate);
                }

                var loaiUseCase = await _dM_DuLieuDanhMucService.GetQueryable()
                        .Where(x => x.GroupId == nhomLoaiUseCase.Id).OrderBy(x => x.Priority).ToListAsync();

                var groupCodes = loaiUseCase.Select(x => x.Code).ToList();

                var AllnhomLoaiUseCaseItem = await _dM_NhomDanhMucService.GetQueryable().Where(x => groupCodes.Contains(x.GroupCode)).ToListAsync();
                var AllnhomLoaiUseCaseItemId = AllnhomLoaiUseCaseItem.Select(x => x.Id).ToList();

                var Alldm_LoaiUseCaseItems = await _dM_DuLieuDanhMucService.GetQueryable().Where(x => AllnhomLoaiUseCaseItemId.Contains(x.GroupId.Value)).ToListAsync();

                
                var result = new List<UseCaseGenerateResultDto>();
                var createdEntities = new List<UC_UseCaseDemo>();

                foreach (var input in inputList)
                {
                    string[] loaiUseCase_Codes = input.loaiUseCaseCode.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                    if (loaiUseCase == null || !loaiUseCase.Any())
                        continue;

                    if (!loaiUseCase_Codes.All(code => loaiUseCase.Any(x => x.Code == code)))
                        continue;

                    var AlltacNhan = await _tacNhanUseCaseService.GetQueryable()
                                    .Where(x => x.idDuAn == input.IdDuAn)
                                    .ToListAsync();


                    foreach (var loaiUseCase_Code in loaiUseCase_Codes)
                    {
                        var nhomLoaiUseCaseItem = AllnhomLoaiUseCaseItem.Where(x => x.GroupCode == loaiUseCase_Code).FirstOrDefault();
                        if (nhomLoaiUseCaseItem == null)
                            continue;

                        var dm_LoaiUseCaseItems = Alldm_LoaiUseCaseItems.Where(x => x.GroupId == nhomLoaiUseCaseItem.Id).OrderBy(x => x.Priority);
                        if (dm_LoaiUseCaseItems == null || !dm_LoaiUseCaseItems.Any())
                            continue;

                        string mucDoPhucTapCode = loaiUseCase.Where(x => x.Code == loaiUseCase_Code).Select(x => x.Note).FirstOrDefault();
                        var DoPhucTap = await _dM_DuLieuDanhMucService.GetDtoByCode(mucDoPhucTapCode ?? input.DoPhucTapCode);
                        if (DoPhucTap == null)
                            continue;

                        var tacNhanChinh = "";
                        string matacNhanChinhs = input.MaTacNhanChinhs != null ? string.Join(",", input.MaTacNhanChinhs) : "";
                        if (input.MaTacNhanChinhs != null && input.MaTacNhanChinhs.Any())
                        {
                            var tacNhanNames = new List<string>();
                            foreach (var maTacNhan in input.MaTacNhanChinhs)
                            {
                                var tacNhan = AlltacNhan
                                    .Where(x => x.maTacNhan == maTacNhan)
                                    .Select(x => x.tenTacNhan).FirstOrDefault();

                                if (!string.IsNullOrEmpty(tacNhan))
                                {
                                    tacNhanNames.Add(tacNhan);
                                }
                            }
                            tacNhanChinh = string.Join(", ", tacNhanNames);
                        }

                        var lstHanhDong = new List<string>();
                        var lstHanhDongNangCao = new List<string>();

                        // Xử lý từng dm_LoaiUseCaseItem để lấy nội dung
                        // Giới hạn số lượng theo DoPhucTap.Note
                        int maxRecords = int.Parse(DoPhucTap.Note ?? "1");
                        int currentRecord = 0;

                        foreach (var dmItem in dm_LoaiUseCaseItems)
                        {
                            if (currentRecord >= maxRecords) break; // Dừng khi đã đủ số lượng

                            if (!string.IsNullOrEmpty(dmItem.NoiDung))
                            {
                                // Tìm và trích xuất lstNoiDung
                                var lstNoiDungMatch = Regex.Match(dmItem.NoiDung, @"lstNoiDung:\s*\{([^}]+)\}");
                                if (lstNoiDungMatch.Success)
                                {
                                    var lstNoiDungContent = lstNoiDungMatch.Groups[1].Value.Trim();
                                    // Thay thế placeholder và thêm vào lstHanhDong
                                    var hanhDong = lstNoiDungContent
                                        .Replace("[Tác nhân chính]", tacNhanChinh)
                                        .Replace("[đối tượng]", input.TenUseCase);
                                    lstHanhDong.Add(hanhDong);
                                }

                                // Tìm và trích xuất lstNoiDungNangCao
                                var lstNoiDungNangCaoMatch = Regex.Match(dmItem.NoiDung, @"lstNoiDungNangCao:\s*\{([^}]+)\}");
                                if (lstNoiDungNangCaoMatch.Success)
                                {
                                    var lstNoiDungNangCaoContent = lstNoiDungNangCaoMatch.Groups[1].Value.Trim();
                                    // Thay thế placeholder và thêm vào lstHanhDongNangCao
                                    var hanhDongNangCao = lstNoiDungNangCaoContent
                                        .Replace("[Tác nhân chính]", tacNhanChinh)
                                        .Replace("[đối tượng]", input.TenUseCase);
                                    lstHanhDongNangCao.Add(hanhDongNangCao);
                                }

                                currentRecord++; // Tăng số bản ghi đã xử lý
                            }
                        }

                        // Join các list thành string với dấu phân cách "||"
                        var lstHanhDongString = string.Join("||", lstHanhDong);
                        var lstHanhDongNangCaoString = string.Join("||", lstHanhDongNangCao);

                        //  var checkExist = await _uC_UseCaseDemoService.GetQueryable()
                        //.FirstOrDefaultAsync(x => x.TenUseCase == input.TenUseCase && x.IdDuAn == input.IdDuAn && x.loaiUseCaseCode == loaiUseCase_Code);
                        //  if (checkExist != null)
                        //  {
                        //      checkExist.TacNhanChinh = tacNhanChinh;
                        //      checkExist.loaiUseCaseCode = loaiUseCase_Code;
                        //      checkExist.lstHanhDong = lstHanhDongString;
                        //      checkExist.lstHanhDongNangCao = lstHanhDongNangCaoString;
                        //      await _uC_UseCaseDemoService.UpdateAsync(checkExist);
                        //      createdEntities.Add(checkExist);
                        //      continue; // Bỏ qua việc tạo mới, đã cập nhật thành công
                        //  }

                        if (input.id != null && input.id != Guid.Empty)
                        {
                            var existingUseCase = await _uC_UseCaseDemoService.GetByIdAsync(input.id.Value);
                            if (existingUseCase != null)
                            {
                                existingUseCase.TenUseCase = input.TenUseCase;
                                existingUseCase.TacNhanChinh = tacNhanChinh;
                                existingUseCase.TacNhanPhu = input.TacNhanPhu;
                                existingUseCase.DoPhucTap = DoPhucTap?.Code ?? "";
                                existingUseCase.loaiUseCaseCode = loaiUseCase_Code;
                                existingUseCase.lstHanhDong = lstHanhDongString;
                                existingUseCase.lstHanhDongNangCao = lstHanhDongNangCaoString;
                                await _uC_UseCaseDemoService.UpdateAsync(existingUseCase);
                                createdEntities.Add(existingUseCase);
                                continue; // Bỏ qua việc tạo mới, đã cập nhật thành công
                            }
                        }


                        // Tạo UC_UseCaseDemo entity và lưu vào database
                        var useCaseDemo = new UC_UseCaseDemo
                        {
                            IdDuAn = input.IdDuAn,
                            TenUseCase = input.TenUseCase,
                            TacNhanChinh = matacNhanChinhs,
                            TacNhanPhu = input.TacNhanPhu,
                            DoPhucTap = DoPhucTap?.Code ?? "",
                            loaiUseCaseCode = loaiUseCase_Code,
                            lstHanhDong = lstHanhDongString,
                            lstHanhDongNangCao = lstHanhDongNangCaoString
                        };

                        await _uC_UseCaseDemoService.CreateAsync(useCaseDemo);
                        createdEntities.Add(useCaseDemo);
                    }
                }
                return result;
            }
            catch (Exception e)
            {

                throw;
            }
        }

    }
}

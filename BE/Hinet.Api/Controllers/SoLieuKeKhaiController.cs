using CommonHelper.Extenions;
using CommonHelper.Word;
using DocumentFormat.OpenXml.Vml.Spreadsheet;
using Hinet.Api.Dto;
using Hinet.Controllers;
using Hinet.Model.MongoEntities;
using Hinet.Service.AppUserService;
using Hinet.Service.ConfigFormKeyService;
using Hinet.Service.ConfigFormService;
using Hinet.Service.Constant;
using Hinet.Service.Core.Mapper;
using Hinet.Service.KeKhaiSumaryService;
using Hinet.Service.SoLieuKeKhaiService;
using Hinet.Service.SoLieuKeKhaiService.ViewModels;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Hinet.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SoLieuKeKhaiController : HinetController
    {
        private readonly IConfigFormService _configFormService;
        private readonly IConfigFormKeyService _configFormKeyService;
        private readonly ISoLieuKeKhaiService _soLieuKeKhaiService;
        private readonly IAppUserService _appUserService;
        private readonly IKeKhaiSumaryService _keKhaiSumaryService;
        private readonly IMapper _mapper;

        public SoLieuKeKhaiController(ISoLieuKeKhaiService soLieuKeKhaiService, IMapper mapper, IConfigFormService configFormService, IAppUserService appUserService, IConfigFormKeyService configFormKeyService, IKeKhaiSumaryService keKhaiSumaryService)
        {
            _soLieuKeKhaiService = soLieuKeKhaiService;
            _mapper = mapper;
            _configFormService = configFormService;
            _appUserService = appUserService;
            _configFormKeyService = configFormKeyService;
            _keKhaiSumaryService = keKhaiSumaryService;
        }


        private decimal CheckProcess(List<SoLieuKeKhaiCreateVM> model)
        {
            return Math.Round((model.Count(x => !string.IsNullOrEmpty(x.KTT_VALUE)) / (decimal)model.Count()) * 100, 2);
        }
          

        //Submit key
        [HttpPost("KeKhaiForm")]
        public async Task<DataResponse<List<SoLieuKeKhai>>> KeKhaiForm([FromBody] SoLieuKeKhaiForm model)
        {
            //
            var user = await _appUserService.GetByIdAsync(UserId.Value);
            var configForm = await _configFormService.GetByIdAsync(model.FormId);
            if (configForm == null) return DataResponse<List<SoLieuKeKhai>>.False("Khong tim thay form ke khai");
            var configKeys = await _configFormKeyService.GetConfig(configForm.Id);




            if (model.Lst_KeKhai.Any())
            {
                var lstKeys = await _soLieuKeKhaiService.GetConfsByFormId(configForm.Id);

                var keKhaiSum = _keKhaiSumaryService.GetQueryable().Where(x => x.UserId == UserId.Value && x.FormId == configForm.Id).FirstOrDefault();
                if (keKhaiSum != null)
                {
                    keKhaiSum.Processs = CheckProcess(model.Lst_KeKhai);
                    await _keKhaiSumaryService.UpdateAsync(keKhaiSum);
                }
                else
                {
                    keKhaiSum = new KeKhaiSummary
                    {
                        UserId = UserId.Value,
                        FormId = configForm.Id,
                        IsDanhGia = true,
                        Processs = CheckProcess(model.Lst_KeKhai)
                    };
                    keKhaiSum.Status = StatusConstant.DANGKEKHAI;
                    await _keKhaiSumaryService.CreateAsync(keKhaiSum);
                }

                if (lstKeys.Any())
                {
                    lstKeys.Where(x => x.KTT_KEY != null).ToList().ForEach(t =>
                    {
                        t.KTT_VALUE = model.Lst_KeKhai.FirstOrDefault(x => x.KTT_KEY == t.KTT_KEY.KTT_KEY)?.KTT_VALUE ?? t.KTT_VALUE;
                    });
                    await _soLieuKeKhaiService.UpdateAsync(lstKeys);


                    return DataResponse<List<SoLieuKeKhai>>.Success(lstKeys);
                } else
                {
                    var ListFormConfig = model.Lst_KeKhai.Select(t => new
                    SoLieuKeKhai
                    {
                        ConfigForm = configForm,
                        KTT_KEY = configKeys.FirstOrDefault(x => x.KTT_KEY ==  t.KTT_KEY),
                        UserId = user,
                        KTT_VALUE = t.KTT_VALUE
                    }).ToList();
                    await _soLieuKeKhaiService.CreateAsync(ListFormConfig);
                    return DataResponse<List<SoLieuKeKhai>>.Success(ListFormConfig);

                }

                

            } else
            {
                return DataResponse<List<SoLieuKeKhai>>.False("Không có số liệu kê khai");
            }

        }


        // Get số liệu kê khai
        [HttpGet("GetSoLieuKeKhai")]
        public async Task<DataResponse<List<SoLieuKeKhai>>> GetSoLieuKeKhai([FromQuery] Guid Id)
        {
            var res = await _soLieuKeKhaiService.GetConfsByFormIdAndUser(Id, UserId.Value);
            return DataResponse<List<SoLieuKeKhai>>.Success(res);
        }


        [HttpGet("PreviewSoLieuFilePdf")]
        public async Task<DataResponse<object>> GetPreviewFile([FromQuery] Guid Id)
        {
            string outputDir = "wwwroot/previews";

            var ListSoLieuKeKhai = await _soLieuKeKhaiService.GetConfsByFormIdAndUser(Id, UserId.Value);
            var configForm = await _configFormService.GetByIdAsync(Id);
            var ListConfigsForm = await _configFormKeyService.GetConfig(Id);
            // Tạo file mới 
            var rootPathPreview = $"wwwroot/PreViewTailieu/{Id}";
            if (!Directory.Exists(Path.Combine(rootPathPreview)))
            {
                Directory.CreateDirectory(rootPathPreview);
            }
            // 
            string sourceDestination = configForm.FileDinhKems.DuongDanFile;
            // Copy file từ src cũ qua src mói
            string newFileCopyName = $"{UserId.Value}_{Id}_{DateTime.Now.ToString("dd_MM_yyyy_HH_ss_mm")}.docx";
            byte[] fileBytes = System.IO.File.ReadAllBytes(Path.Combine("wwwroot/uploads", sourceDestination.Substring(1)));
            using (FileStream file =  new FileStream(Path.Combine(rootPathPreview, newFileCopyName) , FileMode.Create, FileAccess.Write))
            {
                file.Write(fileBytes, 0, fileBytes.Length);
            }
            var dictObj = ListSoLieuKeKhai.Where(t => t.KTT_KEY != null && !string.IsNullOrEmpty(t.KTT_VALUE)).ToDictionary(x => x.KTT_KEY.KTT_KEY, y => y.KTT_VALUE);
            var newPathCopy = Path.Combine(rootPathPreview, newFileCopyName);
            if (System.IO.File.Exists(newPathCopy))
            {
                WordHelper.ReplacePlaceholdersWithDictionary(newPathCopy, dictObj);
            }
            if (!Directory.Exists(Path.Combine(outputDir)))
            {
                Directory.CreateDirectory(Path.Combine(outputDir));
            }
            // Tên Fiel sau khi parse
            string outputFileName = Path.GetFileNameWithoutExtension(newPathCopy) + DateTime.Now.ToString("_dd_MM_yyyy_hh:mm:ss") + ".pdf";
            var FileConversionResult = WordHelper.ToPDF(newPathCopy, outputDir);

            if (FileConversionResult.Status)
            {
                return DataResponse<object>.Success(new
                {
                    Path = FileConversionResult.FilePath
                });
            }
            else
            {
                return DataResponse<object>.Success(new
                {
                    Path = ""
                });
            }

          
        }

    }
}

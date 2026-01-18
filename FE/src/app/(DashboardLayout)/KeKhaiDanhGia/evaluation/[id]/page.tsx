"use client";

import Flex from "@/components/shared-components/Flex";
import RenderHtmlWithInput from "@/components/shared-components/renderHtmlFormKeKhai";
import KySoInfo from "@/components/signature/SisnatureInfo";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import { configFormService } from "@/services/ConfigForm/ConfigForm.service";
import { configFormKeyService } from "@/services/configFormKey/configFormKey.service";
import { soLieuKeKhaiService } from "@/services/SoLieuKeKhai/soLieuKeKhai.service";
import { useSelector } from "@/store/hooks";
import { ConfigFormKeyType } from "@/types/ConfigFormKey/ConfigFormKey";
import { SoLieuKeKhaiType, SoLieuKeKhaiUserDto } from "@/types/SoLieuKeKhai/soLieuKeKhai";
import { message } from "antd";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

const KeKhaiDanhGia = () => {
    const params = useParams();
    const id = params.id as string;
    const [htmlContent, setHtmlContent] = useState<string>("");
    const [fieldConfig, setFieldConfig] = useState<ConfigFormKeyType[]>([]);

  const users = useSelector((state: any) => state.auth.users);
  const [ loading, setLoading ] = useState( false );


  const [defaultValues, setDefaultValues] = useState<SoLieuKeKhaiUserDto[]>([]);

    const handleGetTemplate = useCallback(async () => {
        const res = await configFormService.PrerviewConfigSetting(id);
        if (res.status) {
            setHtmlContent(res.data.htmlContent);
        }
    }, [id]);

    const handleGetAllConfigField = useCallback(async () => {
        setLoading(true);
        try {
            const res = await configFormKeyService.GetAllConfigByForm(id ?? "");
            if (res.status && res.data) {
                setFieldConfig(res.data);
            } else {
            }
            setLoading(false);
        } catch (error) {
            message.error("Lỗi khi lấy dữ liệu xem trước");
        } finally {
            setLoading(false);
        }
    }, [ id ] );
  

    const handleGetSoLieuKeKhaiByFormAndUser = useCallback(async () => {
        try {
            const res = await soLieuKeKhaiService.GetSoLieuKeKhaiByFormAndUser(id ?? "");
            if (res.status && res.data) {
                setDefaultValues(res.data);
            } else {
            }
            setLoading(false);
        } catch (error) {
            message.error("Lỗi khi lấy dữ liệu xem trước");
        } finally {
            setLoading(false);
        }
    }, [ id ] );
  
  const handleSubmitEvaluation = async (formData: SoLieuKeKhaiType) => {
    try {
      setLoading(true);
      console.log("Dữ liệu form đang gửi:", formData);

      const res = await soLieuKeKhaiService.KeKhaiSoLieu(formData);
      console.log("Kết quả API:", res);
      
      if (res.status) {
        toast.success("Kê khai số liệu thành công!");
        // Có thể redirect hoặc làm gì đó sau khi thành công
      } else {
        toast.error("Kê khai thất bại: " + (res.message || "Lỗi không xác định"));
      }
    } catch (error) {
      console.error("Lỗi kê khai:", error);
      toast.error("Có lỗi xảy ra khi kê khai số liệu");
    } finally {
      setLoading(false);
    }
  };
  
  
    useEffect(() => {
        handleGetAllConfigField();
      handleGetTemplate();
      handleGetSoLieuKeKhaiByFormAndUser()
    }, [id, handleGetAllConfigField, handleGetTemplate]);

    return (
      <>
        
        <Flex>
          <AutoBreadcrumb /> 
        </Flex>


        
        <div
      className="safe-html-renderer"
      style={{
        width: "100%",
        overflowX: "auto",
        background: "#fff",
        borderRadius: 8,
        padding: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <KySoInfo idBieuMau={id} idDTTienTrinhXuLy="" isLopTruongOrGvhd={false} idUser={users?.id} />


      <div
        className="html-content"
        style={{
          maxWidth: "100%",
          overflowWrap: "break-word",
        }}
      >
         <RenderHtmlWithInput 
           html={htmlContent} 
           fieldConfig={fieldConfig} 
              onSubmit={handleSubmitEvaluation}
              defaultValues={defaultValues}
           loading={loading}
         />
      </div>
    </div>
        
        


        </>
    );
};
export default KeKhaiDanhGia;

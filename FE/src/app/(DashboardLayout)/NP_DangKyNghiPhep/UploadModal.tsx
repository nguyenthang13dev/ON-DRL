import React, { useCallback, useEffect, useState } from "react";
import { Modal, Typography } from "antd";
import UploadFiler from "@/libs/UploadFilter";
import { UploadFile } from "antd/lib";
import { toast } from "react-toastify";
import DanhMucConstant from "@/constants/DanhMucConstant";
import { ConfigUpload } from "@/types/NP_DangKyNghiPhep/NP_DangKyNghiphep";
import { nP_DangKyNghiPhepService } from "@/services/NghiPhep/NP_DangKyNghiPhep/NP_DangKyNghiPhep.service";

const { Text } = Typography;

interface UploadModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  open,
  onOk,
  onCancel
}) => {
  const [fileListImport, setFileListImport] = useState<UploadFile[]>([]);
  const [uploadedData, setUploadedData] = useState<string[]>([]);

  const handleGetTapTin = useCallback(async () => {
    try {
      const { data, status } = await nP_DangKyNghiPhepService.getTaiLieuDinhKem();
      if (status && data != null) {
        const baseUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL || "";
        setFileListImport([
          {
            uid: `${data.id}`,
            name: data.tenTaiLieu,
            status: "done",
            url: `${baseUrl + data.duongDanFile}`,
            type: data.dinhDangFile,
          },
        ]);
      }
    } catch (error) {
      toast.error("Không lấy được thông tin tài liệu");
    }
  }, []);

  const handleSubmit = async () => {
    if (!uploadedData[0]) {
      toast.warning("Vui lòng chọn file trước khi tải lên");
      return;
    }

    const dataToSend: ConfigUpload = {
      fileId: uploadedData[0]
    };
    try {
      const res = await nP_DangKyNghiPhepService.configUpload(dataToSend);
      toast.success("Tải lên tập tin cấu hình thành công");
    } catch (error) {
      toast.error("Tải lên tập tin cấu hình thất bại");
    }
  };

  useEffect(() => {
    if (open) {
      handleGetTapTin();
    }
  }, [open, handleGetTapTin]);

  return (
    <Modal
      title={`Upload file mẫu đăng ký nghỉ phép`}
      open={open}
      onOk={async () => {
        await handleSubmit();
        onOk();
      }}
      onCancel={onCancel}
    >
      <Text strong>Chọn tập tin: </Text>
      <UploadFiler
        maxFiles={1}
        setUploadedData={setUploadedData}
        fileList={fileListImport}
        setFileList={setFileListImport}
        type={DanhMucConstant.CauHinhDangKyNghiPhep}
      />
    </Modal>
  );
};

export default UploadModal;

import React, { useEffect, useState } from "react";
import { Drawer, Empty, Spin } from "antd";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { tableNP_DangKyNghiPhepDataType } from "@/types/NP_DangKyNghiPhep/NP_DangKyNghiphep";
import { nP_DangKyNghiPhepService } from "@/services/NghiPhep/NP_DangKyNghiPhep/NP_DangKyNghiPhep.service";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { toast } from "react-toastify";

interface NP_DangKyNghiPhepViewProps {
  nP_DangKyNghiPhep?: tableNP_DangKyNghiPhepDataType | null;
  isOpen: boolean;
  onClose: () => void;
}

const NP_DangKyNghiPhepDetail: React.FC<NP_DangKyNghiPhepViewProps> = ({
  nP_DangKyNghiPhep,
  isOpen,
  onClose,
}) => {
  const base_path = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState<string>("");
  const handleGetData = async () => {
    setLoading(true);
    try {
      const response = await nP_DangKyNghiPhepService.Preview(
        nP_DangKyNghiPhep?.id ?? ""
      );
      if(response && response.status) {
        setPath(response.data.path ?? "");
      }else{
        toast.error(response?.message || "Không tìm thấy file PDF");
      }
    } catch (error) {
      console.error("Lỗi tải PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && nP_DangKyNghiPhep != null) {
      handleGetData();
    } else {
      setPath("");
    }
  }, [isOpen, nP_DangKyNghiPhep]);

  return (
    <Drawer
      title="Thông tin chi tiết"
      placement="right"
      size="large"
      onClose={onClose}
      closable={true}
      open={isOpen}
    >
      <Spin
        spinning={loading}
        tip="Đang tải file PDF..."
        style={{ marginTop: "20px" }}
      >
        {path ? (
          <Worker workerUrl="/pdf.worker.min.js">
            <Viewer
              fileUrl={base_path + path}
              plugins={[defaultLayoutPluginInstance]}
            />
          </Worker>
        ) : !loading ? (
          <Empty description="Không có file PDF để hiển thị" />
        ) : null}
      </Spin>
    </Drawer>
  );
};

export default NP_DangKyNghiPhepDetail;

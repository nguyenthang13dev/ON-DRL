import React, { useState } from "react";
import {
  Modal,
  Upload,
  Button,
  Space,
  Typography,
  Card,
  Divider,
  Alert,
  Progress,
  List,
  Tag,
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import type { UploadFile } from "antd/es/upload/interface";
import nS_ChamCongService from "@/services/QLNhanSu/nS_ChamCong/nS_ChamCongService";
import ImportErrorModal from "./ImportErrorModal";

const { Title, Text } = Typography;

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const NS_ChamCongImportExcel: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState<any>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      const response = await nS_ChamCongService.exportTemplateImport();
      if (response.status) {
        toast.success("Tải template thành công!");
        // Handle download logic here
      } else {
        toast.error(response.message || "Không thể tải template");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải template");
    }
  };

  const handleImportExcel = async () => {
    if (fileList.length === 0) {
      toast.error("Vui lòng chọn file Excel để import!");
      return;
    }

    const file = fileList[0].originFileObj;
    if (!file) {
      toast.error("File không hợp lệ!");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await nS_ChamCongService.importExcel(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.status) {
        setImportResult(response.data);
        toast.success("Import dữ liệu chấm công thành công!");
        onSuccess();
      } else {
        toast.error(response.message || "Import thất bại!");
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Có lỗi xảy ra khi import dữ liệu");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (info: any) => {
    const { fileList } = info;
    setFileList(fileList.slice(-1)); // Only keep the last file
    setImportResult(null);
  };

  const beforeUpload = (file: File) => {
    const isExcel =
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel" ||
      file.name.endsWith(".xlsx") ||
      file.name.endsWith(".xls");

    if (!isExcel) {
      toast.error("Chỉ được phép upload file Excel (.xlsx, .xls)!");
      return false;
    }

    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      toast.error("File phải nhỏ hơn 10MB!");
      return false;
    }

    return false; // Prevent auto upload
  };

  const handleCancel = () => {
    if (isUploading) {
      toast.warning("Đang import dữ liệu, vui lòng chờ...");
      return;
    }
    setFileList([]);
    setImportResult(null);
    setShowErrorModal(false);
    onClose();
  };

  return (
    <Modal
      title={null}
      open={true}
      onCancel={handleCancel}
      width={700}
      footer={null}
      closable={false}
      maskClosable={!isUploading}
      destroyOnClose
    >
      {/* Custom Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px",
          margin: "-24px -24px 24px -24px",
          color: "white",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Space>
          <FileExcelOutlined style={{ fontSize: "20px" }} />
          <Title level={4} style={{ color: "white", margin: 0 }}>
            IMPORT DỮ LIỆU CHẤM CÔNG
          </Title>
        </Space>
        <Text
          style={{
            color: "rgba(255,255,255,0.8)",
            display: "block",
            marginTop: "8px",
          }}
        >
          Tải lên file Excel để import dữ liệu chấm công vào hệ thống
        </Text>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Alert
          message="Hướng dẫn import dữ liệu"
          description={
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              {/* <li>Tải xuống file template Excel mẫu</li>
              <li>Điền đầy đủ thông tin chấm công vào file template</li> */}
              <li>Chọn file Excel đã điền thông tin để upload</li>
              <li>Nhấn Import để thực hiện import dữ liệu</li>
              <li>
                Sau khi import kiểm tra kết quả trong phần Kết quả import
              </li>
              <li>
                Nếu có lỗi, kiểm tra lại lỗi trong phần chi tiết lỗi và kiểm tra
                lại file import. Sau đó import lại
              </li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: "20px" }}
        />
      </motion.div>

      {/* Download Template */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card 
          title="1. Tải template Excel" 
          size="small" 
          style={{ marginBottom: "20px" }}
        >
          <Space>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadTemplate}
              disabled={isUploading}
            >
              Tải template mẫu
            </Button>
            <Text type="secondary">
              Tải file Excel mẫu để điền thông tin chấm công
            </Text>
          </Space>
        </Card>
      </motion.div> */}

      {/* Upload File */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card
          title="1. Chọn file Excel để import"
          size="small"
          style={{ marginBottom: "20px" }}
        >
          <Upload.Dragger
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleFileChange}
            accept=".xlsx,.xls"
            disabled={isUploading}
            style={{
              background: fileList.length > 0 ? "#f0f8ff" : "#fafafa",
              border:
                fileList.length > 0
                  ? "1px dashed #667eea"
                  : "1px dashed #d9d9d9",
            }}
          >
            <p className="ant-upload-drag-icon">
              <FileExcelOutlined
                style={{
                  fontSize: "48px",
                  color: fileList.length > 0 ? "#667eea" : "#d9d9d9",
                }}
              />
            </p>
            <p className="ant-upload-text">
              {fileList.length > 0
                ? "File đã chọn"
                : "Kéo thả file Excel vào đây hoặc nhấn để chọn file"}
            </p>
            <p className="ant-upload-hint">
              Chỉ hỗ trợ file .xlsx, .xls (tối đa 10MB)
            </p>
          </Upload.Dragger>
        </Card>
      </motion.div>

      {/* Upload Progress */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card size="small" style={{ marginBottom: "20px" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text>Đang import dữ liệu...</Text>
              <Progress percent={uploadProgress} status="active" />
            </Space>
          </Card>
        </motion.div>
      )}

      {/* Import Result */}
      {importResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card
            title="Kết quả import"
            size="small"
            style={{ marginBottom: "20px" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space>
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
                <Text strong style={{ color: "#52c41a" }}>
                  Import hoàn tất!
                </Text>
              </Space>

              {/* Tổng số bản ghi */}
              {importResult.totalRecords && (
                <Space>
                  <Text strong>Tổng số bản ghi:</Text>
                  <Tag color="blue" style={{ fontWeight: "bold" }}>
                    {importResult.totalRecords}
                  </Tag>
                </Space>
              )}

              {/* Tổng số bản ghi thành công */}
              {importResult.totalRecordsSuccess !== undefined && (
                <Space>
                  <Text strong>Tổng số bản ghi thành công:</Text>
                  <Tag color="green" style={{ fontWeight: "bold" }}>
                    {importResult.totalRecordsSuccess}
                  </Tag>
                </Space>
              )}

              {/* Tổng số bản ghi thất bại */}
              {importResult.totalRecordsError !== undefined && (
                <Space>
                  <Text strong>Tổng số bản ghi thất bại:</Text>
                  <Tag color="red" style={{ fontWeight: "bold" }}>
                    {importResult.totalRecordsError}
                  </Tag>
                </Space>
              )}

              {/* Tổng số lỗi - có thể click để xem chi tiết */}
              {importResult.errors && importResult.errors.length > 0 && (
                <Space>
                  <Text strong>Tổng số lỗi:</Text>
                  <Tag
                    color="red"
                    style={{
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => setShowErrorModal(true)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#ff7875";
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#ff4d4f";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    {importResult.errors.length} (Nhấn để xem chi tiết)
                  </Tag>
                </Space>
              )}
            </Space>
          </Card>
        </motion.div>
      )}

      <Divider />

      {/* Footer Actions */}
      <Space style={{ width: "100%", justifyContent: "flex-end" }}>
        <Button
          onClick={handleCancel}
          disabled={isUploading}
          icon={<CloseOutlined />}
        >
          Đóng
        </Button>
        <Button
          type="primary"
          onClick={handleImportExcel}
          disabled={fileList.length === 0 || isUploading}
          loading={isUploading}
          icon={<UploadOutlined />}
          style={{
            color: "white",
            fontWeight: "bold",
          }}
        >
          {isUploading ? "Đang import..." : "Import dữ liệu"}
        </Button>
      </Space>

      {/* Error Detail Modal */}
      {importResult && importResult.errors && (
        <ImportErrorModal
          open={showErrorModal}
          onClose={() => setShowErrorModal(false)}
          errors={importResult.errors}
          totalErrors={importResult.errors.length}
        />
      )}
    </Modal>
  );
};

export default NS_ChamCongImportExcel;

import React, { useEffect } from "react";
import { Modal, Button } from "antd";
import { FileOutlined, DownloadOutlined } from "@ant-design/icons";
import { TaiLieuDinhKem } from "@/types/taiLieuDinhKem/taiLieuDinhKem";

interface UploadedFilesModalProps {
  open: boolean;
  onClose: () => void;
  files: TaiLieuDinhKem[];
  onDelete?: (fileId: string) => void;
  title?: string;
  onAfterClose?: () => void;
}

const UploadedFilesModal: React.FC<UploadedFilesModalProps> = ({
  open,
  onClose,
  files,
  onDelete,
  title = "Danh sách file đã tải lên",
  onAfterClose
}) => {
  const handleDownload = (file: TaiLieuDinhKem) => {
    if (file.duongDanFile) {
      const duongdanfile = file.duongDanFile.trim();
      console.log(process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL + duongdanfile);
      window.open(process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL + duongdanfile);
    }
  };

  const handleClose = () => {
    onClose();
    onAfterClose?.();
  };

  const handleDelete = (file: TaiLieuDinhKem) => {
    Modal.confirm({
      title: "Xác nhận xóa file",
      content: `Bạn có chắc chắn muốn xóa file "${file.tenTaiLieu}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => {
        onDelete?.(file.id);
      }
    });
  };

  // Tự động đóng modal khi không còn file nào
  useEffect(() => {
    if (open && (!files || files.length === 0)) {
      handleClose();
    }
  }, [files, open]);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      afterClose={onAfterClose}
      footer={null}
      title={title}
      width={600}
      bodyStyle={{ padding: 32, paddingTop: 0 }}
    >
      {files && files.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {files.map((file) => (
            <li
              key={file.id}
              style={{ display: "flex", alignItems: "center", fontSize: 15, padding: "7px 0", borderBottom: "1px solid #f0f0f0" }}
            >
              <span style={{ flex: 1, display: "flex", alignItems: "center", gap: 7 }}>
                <FileOutlined style={{ color: "#52c41a", fontSize: 17 }} /> {file.tenTaiLieu}
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  type="text"
                  icon={<DownloadOutlined style={{ fontSize: 18 }} />}
                  onClick={() => handleDownload(file)}
                  style={{ color: "#1677ff" }}
                  title="Tải xuống"
                />
                {onDelete && (
                  <Button
                    type="text"
                    danger
                    onClick={() => handleDelete(file)}
                    style={{ fontSize: 13 }}
                  >
                    Xóa
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div style={{ color: '#bfbfbf', textAlign: 'center', padding: '24px 0' }}>Chưa có file nào được tải lên.</div>
      )}
    </Modal>
  );
};

export default UploadedFilesModal;

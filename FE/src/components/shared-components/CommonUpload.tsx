import React, { useRef, useState, useEffect } from "react";
import { Button, message, Popconfirm } from "antd";
import { UploadOutlined, SaveOutlined, FileOutlined } from "@ant-design/icons";
import styles from "./CommonUpload.module.css";
import TaiLieuDinhKemService from "@/services/taiLieuDinhKem/taiLieuDinhKem.service";
import { TaiLieuDinhKem } from "@/types/taiLieuDinhKem/taiLieuDinhKem";

interface CommonUploadProps {
  /**
   * Cho phép chọn nhiều file hay không
   */
  multiple?: boolean;
  /**
   * Định dạng file cho phép upload, ví dụ: ".pdf,.docx"
   * Nếu không truyền sẽ lấy mặc định: .pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar
   */
  accept?: string;
  /**
   * Số lượng file tối đa cho phép upload
   */
  maxCount?: number;
  /**
   * Kích thước tối đa cho mỗi file (tính bằng MB). Nếu không truyền sẽ không giới hạn.
   */
  maxSizeMB?: number;
  /**
   * Callback khi danh sách file thay đổi
   */
  onChange?: (files: File[]) => void;
  /**
   * Callback khi bấm upload
   * Nhận danh sách file và extraData (nếu có)
   */
  onUpload?: (files: File[], extraData?: Record<string, any>) => Promise<void>;
  /**
   * Text hiển thị trên nút chọn file
   */
  buttonText?: string;
  /**
   * Style custom cho container
   */
  style?: React.CSSProperties;
  /**
   * Tham số bổ sung gửi kèm khi upload (ví dụ: LoaiTaiLieu, ItemId...)
   */
  extraData?: Record<string, any>;
}

const CommonUpload: React.FC<CommonUploadProps> = ({
  multiple = true,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar",
  maxCount = 10,
  maxSizeMB,
  onChange,
  onUpload,
  buttonText = "Chọn file",
  style,
  extraData,
}) => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [savedFiles, setSavedFiles] = useState<TaiLieuDinhKem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lấy danh sách file đã lưu dựa vào ItemId và LoaiTaiLieu
  useEffect(() => {
    const fetchSavedFiles = async () => {
      if (extraData?.ItemId && extraData?.LoaiTaiLieu !== undefined) {
        try {
          const res = await TaiLieuDinhKemService.getByItemIdAndLoaiTaiLieu(
            extraData.ItemId,
            extraData.LoaiTaiLieu
          );
          if (res.status && res.data) setSavedFiles(res.data);
          else setSavedFiles([]);
        } catch {
          setSavedFiles([]);
        }
      } else {
        setSavedFiles([]);
      }
    };
    fetchSavedFiles();
  }, [extraData?.ItemId, extraData?.LoaiTaiLieu]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    let newFiles = files;
    if (maxCount && files.length + fileList.length > maxCount) {
      message.warning(`Chỉ được chọn tối đa ${maxCount} file.`);
      newFiles = files.slice(0, maxCount - fileList.length);
    }
    // Lọc file vượt quá maxSizeMB nếu có
    if (typeof maxSizeMB === 'number' && maxSizeMB > 0) {
      const overSize = newFiles.filter(f => f.size > maxSizeMB * 1024 * 1024);
      if (overSize.length > 0) {
        message.warning(`Có ${overSize.length} file vượt quá dung lượng tối đa ${maxSizeMB}MB và sẽ bị loại bỏ.`);
      }
      newFiles = newFiles.filter(f => f.size <= maxSizeMB * 1024 * 1024);
    }
    const merged = [...fileList, ...newFiles];
    setFileList(merged);
    onChange?.(merged);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (index: number) => {
    const newList = fileList.filter((_, i) => i !== index);
    setFileList(newList);
    onChange?.(newList);
  };

  const handleUpload = async () => {
    if (!fileList.length || !onUpload) return;
    setUploading(true);
    try {
      await onUpload(fileList, extraData);
      setFileList([]);
    //   message.success("Tải lên thành công!");
    } catch (err) {
        console.error("Upload error:", err);
    //   message.error("Tải lên thất bại!");
    } finally {
      setUploading(false);
    }
  };

  // Xoá file đã lưu
  const handleDeleteSavedFile = async (fileId: string) => {
    try {
      await TaiLieuDinhKemService.delete(fileId);
      setSavedFiles((prev) => prev.filter((f) => f.id !== fileId));
      message.success("Xoá file thành công!");
    } catch {
      message.error("Xoá file thất bại!");
    }
  };

  return (
    <div className={styles.container} style={style}>
      {/* Hiển thị danh sách file đã lưu */}
      {savedFiles.length > 0 && (
        <div style={{ width: '100%', marginBottom: 10 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#1677ff', marginBottom: 4, letterSpacing: 0.2 }}>
            Danh sách file đã tải lên
          </div>
          <ul className={styles.fileList} style={{ marginBottom: 0 }}>
            {savedFiles.map((file) => (
              <li key={file.id} className={styles.fileItem} style={{ fontSize: 12, padding: '5px 10px', marginBottom: 4 }}>
                <span className={styles.fileName}><FileOutlined style={{color:'#52c41a', fontSize: 15}} /> {file.tenTaiLieu}</span>
                <Popconfirm
                  title="Bạn có chắc muốn xoá file này?"
                  okText="Xoá"
                  cancelText="Huỷ"
                  placement="left"
                  onConfirm={() => handleDeleteSavedFile(file.id)}
                >
                  <Button size="small" type="link" danger className={styles.removeBtn} style={{ fontSize: 12, padding: '0 6px' }}>
                    Xóa
                  </Button>
                </Popconfirm>
              </li>
            ))}
          </ul>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        icon={<UploadOutlined />}
        onClick={() => inputRef.current?.click()}
        className={styles.uploadBtn}
      >
        {buttonText}
      </Button>
      <ul className={styles.fileList}>
        {fileList.map((file, idx) => (
          <li key={idx} className={styles.fileItem}>
            <span className={styles.fileName}><FileOutlined style={{color:'#1677ff'}} /> {file.name}</span>
            <Popconfirm
              title="Bạn có chắc muốn xoá file này?"
              okText="Xoá"
              cancelText="Huỷ"
              placement="left"
              onConfirm={() => handleRemove(idx)}
            >
              <Button size="small" type="link" danger className={styles.removeBtn}>
                Xóa
              </Button>
            </Popconfirm>
          </li>
        ))}
      </ul>
      <Button
        onClick={handleUpload}
        disabled={!fileList.length || uploading}
        loading={uploading}
        className={styles.saveBtn}
      >
        <SaveOutlined style={{ fontSize: 16 }} />
        Lưu file
      </Button>
    </div>
  );
};

export default CommonUpload;

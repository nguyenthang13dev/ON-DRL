import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaRegCheckCircle, FaRegFile } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { useFileIcons } from "@/hooks/useFileIcons";
import { useFiles } from "@/contexts/FilesContext";
import { getDataSize } from "@/utils/fileManagerUtils/getDataSize";
import { getFileExtension } from "@/utils/fileManagerUtils/getFileExtension";
import { FileDataType, FileManagerThongTinVanBanType } from "@/types/fileManager/fileManager";
import { toast } from "react-toastify";

type UploadItemProps = {
  index: number;
  fileData: FileDataType;
  setFiles: React.Dispatch<React.SetStateAction<FileDataType[]>>;
  setIsUploading: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  fileUploadConfig: {
    url: string;
    method?: string;
    headers?: Record<string, string>;
  };
  onFileUploaded: (response: any) => void;
  handleFileRemove: (index: number) => void;
  isSubmit?: boolean;
  thongTinVanBan?: FileManagerThongTinVanBanType;
};

const UploadItem = ({
  index,
  fileData,
  setFiles,
  setIsUploading,
  fileUploadConfig,
  onFileUploaded,
  handleFileRemove,
  isSubmit,
  thongTinVanBan
}: UploadItemProps) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isCanceled, setIsCanceled] = useState<boolean>(false);
  const [uploadFailed, setUploadFailed] = useState<boolean>(false);
  const fileIcons = useFileIcons(33);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const { onError } = useFiles();

  const handleUploadError = (xhr: XMLHttpRequest) => {
    setUploadProgress(0);
    setIsUploading((prev) => ({ ...prev, [index]: false }));

    const error = {
      type: "upload",
      message: "Tải lên không thành công.",
      response: {
        status: xhr.status,
        statusText: xhr.statusText,
        data: xhr.response,
      },
    };

    setFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, error: error.message } : file))
    );

    setUploadFailed(true);
    onError(error);
    onError(error, fileData.file);
  };

  // hàm tải file call api
  const fileUpload = (fileData: FileDataType): Promise<any> => {
    if (fileData.error) {
      toast.error(fileData.error);
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      setIsUploading((prev) => ({ ...prev, [index]: true }));

      xhr.upload.onprogress = (event: ProgressEvent) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        setIsUploading((prev) => ({ ...prev, [index]: false }));
        if (xhr.status === 200 || xhr.status === 201) {
          setIsUploaded(true);
          onFileUploaded(xhr.response);
          resolve(xhr.response);
          toast.success("Thêm mới thông tin văn bản thành công")
        } else {
          handleUploadError(xhr);
          reject(xhr.statusText);
          toast.error("Đã xảy ra lỗi khi thêm thông tin văn bản")
        }
      };

      xhr.onerror = () => {
        handleUploadError(xhr);
        reject(xhr.statusText);
      };

      xhr.open(fileUploadConfig.method || "POST", fileUploadConfig.url, true);

      const headers = fileUploadConfig.headers || {};
      for (const key in headers) {
        xhr.setRequestHeader(key, headers[key]);
      }

      const formData = new FormData();
      const appendData = fileData.appendData || {};
      for (const key in appendData) {
        if (appendData[key]) {
          formData.append(key, appendData[key]);
        }
      }

      formData.append("file", fileData.file);
      formData.append("loaiVanBan", thongTinVanBan?.loaiVanBan ?? "");
      formData.append("soKyHieu", thongTinVanBan?.soKyHieu ?? "");
      formData.append("ngayBanHanh", thongTinVanBan?.ngayBanHanh ?? null);
      formData.append("trichYeu", thongTinVanBan?.trichYeu ?? "");
      xhr.send(formData);

    });
  };

  useEffect(() => {
    if (!xhrRef.current && isSubmit) {
      fileUpload(fileData);
    }
  }, [isSubmit]);

  const handleAbortUpload = (index: number) => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      setIsUploading((prev) => ({ ...prev, [index]: false }));
      setIsCanceled(true);
      setUploadProgress(0);
    }

    setFiles((prev) => prev.filter((_, i) => i !== index));

  };

  const handleRetry = () => {
    setFiles((prev) =>
      prev.map((file, i) => (i === index ? { ...file, error: false } : file))
    );
    setIsCanceled(false);
    setUploadFailed(false);
    fileUpload(fileData);
  };

  if (fileData.removed) return null;

  return (
    <li>
      <div className="file-icon">
        {fileIcons[getFileExtension(fileData.file.name) as keyof typeof fileIcons] ?? (
          <FaRegFile size={33} />
        )}
      </div>
      <div className="file">
        <div className="file-details">
          <div className="file-info">
            <span className="file-name text-truncate" title={fileData.file.name}>
              {fileData.file.name}
            </span>
            <span className="file-size">{getDataSize(fileData.file.size)}</span>
          </div>
          {isUploaded ? (
            <FaRegCheckCircle title="Uploaded" className="upload-success" />
          ) : isCanceled || uploadFailed ? (
            <IoMdRefresh className="retry-upload"
              title="Retry"
              style={{ width: "25px", height: "25px" }}
              onClick={handleRetry} />
          ) : (
            <div
              className="rm-file"
              title={fileData.error ? "Remove" : "Abort Upload"}
              style={{ width: "25px", height: "25px" }}
              onClick={fileData.error ? () => handleFileRemove(index) : () => handleAbortUpload(index)}
            >
              <AiOutlineClose />
            </div>
          )}
        </div>
        {/* <Progress
          percent={uploadProgress}
          isCanceled={isCanceled}
          isCompleted={isUploaded}
          error={fileData.error}
        /> */}
      </div>
    </li>
  );
};

export default UploadItem;

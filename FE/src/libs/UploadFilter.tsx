import { TaiLieuDinhKem } from "@/types/taiLieuDinhKem/taiLieuDinhKem";
import { uploadFileService } from "@/services/File/uploadFile.service";
import {
  DeleteOutlined,
  DownloadOutlined,
  FileDoneOutlined,
  PaperClipOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Modal,
  Space,
  Tooltip,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { UploadListType, UploadType } from "antd/es/upload/interface";
import { forwardRef, useEffect, useState } from "react";
import "./uploadFiler.css"; // Make sure this CSS file is created and imported

const validFileTypes = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

export interface CustomUploadFile extends UploadFile {
  isExisting?: boolean;
}

type FileUploaderProps = {
  maxFiles?: number;
  setUploadedData: React.Dispatch<React.SetStateAction<string[]>>;
  type?: string;
  setFileList: React.Dispatch<React.SetStateAction<CustomUploadFile[]>>;
  fileList: CustomUploadFile[];
  uploadType?: UploadType;
  listType?: UploadListType;
  handleSuccess?: (taiLieus: TaiLieuDinhKem[]) => void;
  allowedFileTypes?: string[];
};

const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const UploadFiler = forwardRef(
  (
    {
      maxFiles = 10, // Default changed to 10 as seen in usage
      setUploadedData,
      type,
      setFileList,
      fileList,
      uploadType = "select",
      listType = "text",
      handleSuccess,
      allowedFileTypes = validFileTypes,
    }: FileUploaderProps,
    ref
  ) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
      const needsUpdate = fileList.some(
        (file) =>
          file.url && !file.originFileObj && file.isExisting === undefined
      );
      if (needsUpdate) {
        setFileList((currentList) =>
          currentList.map((file) => {
            if (
              file.url &&
              !file.originFileObj &&
              file.isExisting === undefined
            ) {
              let finalUrl = file.url;
              if (
                StaticFileUrl &&
                !/^https?:\/\//i.test(file.url) &&
                !file.url.startsWith("//")
              ) {
                const baseUrl = StaticFileUrl.replace(/\/$/, "");
                const relativePath = file.url.replace(/^\//, "");
                finalUrl = `${baseUrl}/${relativePath}`;
              }
              return {
                ...file,
                url: finalUrl,
                isExisting: true,
                status: file.status || "done",
              };
            }
            return file;
          })
        );
      }
    }, [fileList, setFileList]);

    const handlePreview = async (file: CustomUploadFile) => {
      if (!file.url && !file.preview && file.originFileObj) {
        file.preview = await getBase64(file.originFileObj as File);
      }
      setPreviewImage(file.url || (file.preview as string));
      setPreviewVisible(true);
    };
    const handleCancel = () => setPreviewVisible(false);

    const handleChange: UploadProps["onChange"] = (info) => {
      let newFileList = [...info.fileList] as CustomUploadFile[];
      newFileList = newFileList.slice(-maxFiles);

      newFileList = newFileList.map((file) => {
        const currentFile = { ...file };

        if (currentFile.originFileObj && currentFile.status !== "done") {
          const isValid =
            currentFile.type && allowedFileTypes.includes(currentFile.type);
          if (!isValid) {
            currentFile.status = "error";
            currentFile.error = "Tệp tin tải lên không hợp lệ";
          }
          currentFile.isExisting = false;
        }

        if (currentFile.response && currentFile.status === "done") {
          // Assuming customRequest's onSuccess(result) sets file.response = result
          // And result.data is an array of file objects, each with a 'url'
          const responseData = currentFile.response.data;
          if (
            responseData &&
            Array.isArray(responseData) &&
            responseData.length > 0
          ) {
            const responseFile = responseData[0]; // Assuming the first file in data array is the relevant one
            if (responseFile && responseFile.url) {
              currentFile.url = responseFile.url;
            }
            // Ensure uid is set from response if not already, for handleRemove
            if (responseFile && responseFile.id && !currentFile.uid) {
              currentFile.uid = responseFile.id;
            }
          } else if (currentFile.response.url) {
            // Fallback if response itself has a URL
            currentFile.url = currentFile.response.url;
          }
        }
        return currentFile;
      });
      setFileList(newFileList);
    };

    const handleRemove = async (file: CustomUploadFile) => {
      try {
        const fileIdToDelete = file.isExisting
          ? file.uid // For existing files, uid should be the ID
          : file.response?.data?.[0]?.id || file.uid; // For new files, ID from response or pre-upload uid

        if (fileIdToDelete) {
          setUploadedData((prev) => prev.filter((id) => id !== fileIdToDelete));
          if (file.status === "done" || file.isExisting) {
            try {
              // Only call delete service if it's a known file (either existing or successfully uploaded)
              if (file.isExisting || file.response?.data?.[0]?.id) {
                await uploadFileService.deleteFile([fileIdToDelete]);
              }
            } catch (err) {
              console.error("Failed to delete file from server", err);
            }
          }
        }
        setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
      } catch (error) {
        console.error("Error in handleRemove:", error);
      }
    };

    const customRequest: UploadProps["customRequest"] = async ({
      file,
      onSuccess,
      onError,
    }) => {
      const formData = new FormData();
      formData.append("Files", file as Blob);
      formData.append("FileType", type ?? "");
      try {
        const result = await uploadFileService.upload(formData);
        if (
          result.message === "Success" &&
          result.data != null &&
          result.data.length > 0
        ) {
          setUploadedData((prev) => {
            const newFileIds = result.data.map((f: any) => f.id);
            // Ensure prev is always string[] as per prop type
            const currentIds = Array.isArray(prev) ? prev : [];
            const uniqueNewIds = newFileIds.filter(
              (id: string) => !currentIds.includes(id)
            );
            return [...currentIds, ...uniqueNewIds];
          });
          onSuccess?.(result);
          if (handleSuccess) {
            handleSuccess(result.data);
          }
        } else {
          onError?.(
            new Error(result.message || "Upload failed to return data")
          );
        }
      } catch (error: any) {
        onError?.(error);
      }
    };

    const props: UploadProps<CustomUploadFile> = {
      listType: listType,
      fileList: fileList,
      customRequest: customRequest,
      onPreview: handlePreview,
      onChange: handleChange,
      multiple: true,
      onRemove: handleRemove,
      itemRender: (
        originNode: React.ReactNode,
        file: CustomUploadFile,
        currentFileList: CustomUploadFile[],
        actions: {
          download: () => void;
          preview: () => void;
          remove: () => void;
        }
      ) => {
        const isError = file.status === "error";
        const isExistingFile = file.isExisting === true;
        const isUploading = file.status === "uploading";
        const isNewlyUploadedDone =
          !isExistingFile && file.status === "done" && !isUploading;

        return (
          <div
            className={`custom-upload-list-item ${isError ? "item-error" : ""}`}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "5px 0",
              gap: "4px",
            }}
          >
            <div
              className="custom-upload-list-item-row"
              style={{
                display: "flex",
                alignItems: "center", // Ensures vertical alignment of items in the row
                gap: "8px",
                width: "100%",
              }}
            >
              {/* 1. Custom Status Icons */}
              <Space className="file-status-icons">
                {isExistingFile && !isError && (
                  <Tooltip title="Tệp tin đã có trên hệ thống">
                    <FileDoneOutlined style={{ color: "green" }} />
                  </Tooltip>
                )}
                {isNewlyUploadedDone && !isError && (
                  <Tooltip title="Tệp tin vừa tải lên">
                    <UploadOutlined style={{ color: "blue" }} />
                  </Tooltip>
                )}
                {isUploading && (
                  <Tooltip title="Đang tải lên...">
                    <PaperClipOutlined spin />
                  </Tooltip>
                )}
                {isError && (
                  <Tooltip title={file.error || "Lỗi"}>
                    <PaperClipOutlined style={{ color: "red" }} />{" "}
                    {/* Or a more specific error icon */}
                  </Tooltip>
                )}
              </Space>

              {/* 2. File Name - Centered and takes available space */}
              {file.url ? (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="custom-file-name"
                  title={`Xem ${file.name}`} // Updated title for clarity
                  style={{
                    flexGrow: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    padding: "0 4px",
                    color: "#1890ff", // Link color
                    textDecoration: "none", // Optional: remove underline if desired
                  }}
                >
                  {file.name}
                </a>
              ) : (
                <span
                  className="custom-file-name"
                  title={file.name}
                  style={{
                    flexGrow: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    padding: "0 4px",
                    color: "#1890ff", // Keep color consistent
                  }}
                >
                  {file.name}
                </span>
              )}

              {/* 3. Action Buttons (Download, Remove) - Grouped and pushed to the right */}
              <Space
                className="file-action-buttons"
                style={{ marginLeft: "auto" }}
              >
                {(isExistingFile || isNewlyUploadedDone) &&
                  file.url &&
                  !isError && (
                    <Tooltip
                      title={`Tải xuống ${
                        isExistingFile
                          ? "Tệp tin có sẵn"
                          : "Tệp tin vừa tải lên"
                      }`}
                    >
                      <Button
                        type="text"
                        icon={<DownloadOutlined />}
                        size="small"
                        onClick={async () => {
                          if (!file.url) return;
                          try {
                            const response = await fetch(file.url);
                            if (!response.ok) {
                              console.error(
                                "Failed to fetch file for download:",
                                response.statusText
                              );
                              // Optionally, notify the user of the error
                              return;
                            }
                            const blob = await response.blob();
                            const objectUrl = URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = objectUrl;

                            let filename = file.name;
                            // Fallback for filename if file.name is not available
                            if (!filename) {
                              const urlParts = file.url.split("/");
                              filename =
                                urlParts[urlParts.length - 1].split("?")[0]; // Remove query params
                              if (!filename || filename.length === 0) {
                                // Basic check for empty string
                                const typeExtension = blob.type.split("/")[1];
                                filename = `download.${typeExtension || "bin"}`;
                              }
                            }
                            link.download = filename;

                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(objectUrl);
                          } catch (err) {
                            console.error("Download failed:", err);
                            // Optionally, notify the user of the download failure
                          }
                        }}
                      />
                    </Tooltip>
                  )}
                <Tooltip title="Gỡ bỏ tập tin">
                  <Button
                    type="text"
                    danger // Makes icon red
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => actions.remove()} // Use the remove action from Ant Design
                  />
                </Tooltip>
              </Space>
            </div>
            {isError && (
              <span
                className="custom-upload-error-text"
                style={{
                  color: "red",
                  fontSize: "12px",
                  paddingLeft:
                    "32px" /* Adjust as needed based on status icons width */,
                }}
              >
                {file.error || "Tệp tin tải lên không hợp lệ"}
              </span>
            )}
          </div>
        );
      },
    };

    const uploadButtonContent =
      listType === "text" || listType === "picture" ? (
        <Button
          icon={<UploadOutlined />}
          disabled={fileList.length >= maxFiles}
        >
          Chọn tệp tin
        </Button>
      ) : (
        <div>
          <PlusOutlined />
          <div className="ant-upload-text">Upload</div>
        </div>
      );

    return (
      <>
        {uploadType === "drag" ? (
          <Upload.Dragger
            {...props}
            name="files"
            disabled={fileList.length >= maxFiles}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Nhấn hoặc kéo thả file vào đây để tải lên
            </p>
            <p className="ant-upload-hint">
              Hỗ trợ tải lên nhiều file. Số lượng tối đa: {maxFiles}.
            </p>
          </Upload.Dragger>
        ) : (
          <Upload {...props}>
            {fileList.length >= maxFiles ? null : uploadButtonContent}
          </Upload>
        )}

        {listType !== "text" && listType !== "picture-card" && (
          <Modal open={previewVisible} footer={null} onCancel={handleCancel}>
            <img alt="preview" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        )}
      </>
    );
  }
);

UploadFiler.displayName = "UploadFiler";
export default UploadFiler;

import { useRef, useState, KeyboardEvent, ChangeEvent, DragEvent, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import UploadItem from "./UploadItem";
import { useFileNavigation } from "@/contexts/FileNavigationContext";
import { useFiles } from "@/contexts/FilesContext";
import { getFileExtension } from "@/utils/fileManagerUtils/getFileExtension";
import { getDataSize } from "@/utils/fileManagerUtils/getDataSize";
import Button from "@/components/fileManager-components/Button/Button";
import { FileDataType, FileManagerThongTinVanBanType, FileManagerType } from "@/types/fileManager/fileManager";
import { DatePicker, Form, Input, message, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { DropdownOption } from "@/types/general";
import { FileManagerService } from "@/services/fileManager/fileManager.service";
import { removeAccents } from "@/libs/CommonFunction";
import { useTriggerAction } from "@/hooks/useTriggerAction";
import { toast } from "react-toastify";
import { useSelection } from "@/contexts/SelectionContext";


// Types
type UploadFileActionProps = {
  fileUploadConfig: any;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  onFileUploading: (file: File, currentFolder: FileManagerType) => any;
  onFileUploaded: (response: any) => void;
  triggerAction: ReturnType<typeof useTriggerAction>;
};

const UploadFileAction = ({
  fileUploadConfig,
  maxFileSize,
  acceptedFileTypes,
  onFileUploading,
  onFileUploaded,
  triggerAction
}: UploadFileActionProps) => {
  const [files, setFiles] = useState<FileDataType[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const { currentFolder, currentPathFiles } = useFileNavigation();
  const { onError } = useFiles();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [dropdownLVB, setDropdownLVB] = useState<DropdownOption[]>([]);
  const [thongTinVanBan, setThongTinVanBan] = useState<FileManagerThongTinVanBanType>();

  const handleGetDropdown = async () => {
    const rs = await FileManagerService.GetDropdownOption();
    if (rs.status) {
      setDropdownLVB(rs.data.dropdownLVB);
    }
  }

  const handleChooseFileKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  const checkFileError = (file: File): string | undefined => {
    if (acceptedFileTypes) {
      const extError = !acceptedFileTypes.includes(getFileExtension(file.name));
      if (extError) return "Định dạng tài liệu không được cho phép.";
    }

    const fileExists = currentPathFiles.some(
      (item: any) => item.name.toLowerCase() === file.name.toLowerCase() && !item.isDirectory
    );
    if (fileExists) return "Tài liệu đã tồn tại.";

    const sizeError = maxFileSize && file.size > maxFileSize;
    if (sizeError) return `Kích thước tối đa cho phép là ${getDataSize(maxFileSize, 0)}.`;
  };

  const setSelectedFiles = (selectedFiles: File[]) => {
    selectedFiles = selectedFiles.filter(
      (item) =>
        !files.some((fileData) => fileData.file.name.toLowerCase() === item.name.toLowerCase())
    );

    if (selectedFiles.length > 0) {
      const newFiles: FileDataType[] = selectedFiles.map((file) => {
        const appendData = onFileUploading(file, currentFolder);
        const error = checkFileError(file);
        if (error) {
          // onError({ type: "upload", message: error }, file);
          onError({ type: "upload", message: error });
        }
        return {
          file,
          appendData,
          ...(error && { error }),
        };
      });

      // Chỉ cho up 1 file
      if (newFiles.length == 1) {
        setFiles(newFiles);
      }
      // setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setSelectedFiles(droppedFiles);
  };

  const handleChooseFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const choosenFiles = Array.from(e.target.files);
      setSelectedFiles(choosenFiles);
    }
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => {
      const newFiles = prev.map((file, i) => {
        if (index === i) {
          return {
            ...file,
            removed: true,
          };
        }
        return file;
      });

      if (newFiles.every((file) => !!file.removed)) return [];

      return newFiles;
    });
  };

  const handleOnFinish = async (values: any) => {
    const thongTinVanBan: FileManagerThongTinVanBanType = values;
    setThongTinVanBan(thongTinVanBan);
    if (files.length > 0) {
      setIsSubmit(true)
      triggerAction.close();
    } else {
      toast.error("Vui lòng chọn tệp đính kèm")
    }
  }

  useEffect(() => {
    handleGetDropdown();
  }, [])


  return (
    <div>
      <Form
        onFinish={handleOnFinish}
        layout="vertical"
        className="p-4">

        <Form.Item
          label="Loại văn bản"
          name="loaiVanBan"
          rules={[{ required: true, message: "Vui lòng chọn loại văn bản" }]}
        >
          <Select
            placeholder="Chọn loại văn bản"
            options={dropdownLVB}
            allowClear
            showSearch
            getPopupContainer={(trigger) => trigger.parentElement}
            filterOption={(input, option) => {
              return removeAccents(option?.label ?? "")
                .toLowerCase()
                .includes(removeAccents(input).toLowerCase());
            }}
          />
        </Form.Item>

        <Form.Item
          label="Số ký hiệu"
          name="soKyHieu"
          rules={[{ required: true, message: "Vui lòng nhập số ký hiệu" }]}
        >
          <Input
            placeholder="Nhập số ký hiệu"
          />
        </Form.Item>

        <Form.Item
          label="Ngày ban hành"
          name="ngayBanHanh"
          rules={[{ required: true, message: "Vui lòng nhập ngày ban hành" }]}
        >
          <DatePicker
            format="DD/MM/YYYY"
            className="w-100"
            placeholder="Nhập ngày ban hành"
            getPopupContainer={(trigger: HTMLElement) => trigger.parentElement as HTMLElement}
          />
        </Form.Item>

        <Form.Item
          label="Trích yếu"
          name="trichYeu"
        >
          <TextArea placeholder="Nhập trích yếu" />
        </Form.Item>

        <Form.Item
          label="Tài liệu đính kèm"
          name="files"
          rules={[
            {
              validator: (_, value) => {
                if (files.length === 0) {
                  return Promise.reject("Vui lòng chọn tệp đính kèm");
                }
                return Promise.resolve();
              }
            }, {
              required: true, message: ''
            }

          ]}
        >
          <div
            style={{ padding: "unset" }}
            className={`fm-upload-file ${files.length > 0 ? "file-selcted" : ""}`}>
            <div className="select-files">
              <div
                className={`draggable-file-input ${isDragging ? "dragging" : ""}`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: "pointer" }}
              >
                <div className="input-text">
                  <AiOutlineCloudUpload size={30} />
                  <span className="text-center">Kéo và thả tài liệu vào đây để tải lên hoặc bấm vào đây để chọn tài liệu</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="chooseFile"
                  className="choose-file-input"
                  onChange={handleChooseFile}
                  // multiple
                  accept={acceptedFileTypes?.join(",")}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {
              files.length > 0 && (
                <div className="files-progress">
                  <ul>
                    {files.map((fileData, index) => (
                      <UploadItem
                        index={index}
                        key={index}
                        fileData={fileData}
                        setFiles={setFiles}
                        fileUploadConfig={fileUploadConfig}
                        setIsUploading={setIsUploading}
                        onFileUploaded={onFileUploaded}
                        handleFileRemove={handleFileRemove}
                        isSubmit={isSubmit}
                        thongTinVanBan={thongTinVanBan}
                      />
                    ))}
                  </ul>
                </div>
              )
            }
          </div >

        </Form.Item>

        <div className="btn-choose-file" style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button padding="5px 20px" isSubmit={true} >
            <label>Lưu</label>
          </Button>
        </div>
      </Form >
    </div >
  );
};

export default UploadFileAction;

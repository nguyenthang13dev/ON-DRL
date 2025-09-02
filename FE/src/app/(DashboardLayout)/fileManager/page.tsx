"use client";
import { useEffect, useRef, useState } from "react";
// import "@cubone/react-file-manager/dist/react-file-manager.css";
import { FileManagerService } from "@/services/fileManager/fileManager.service";
import {
  FileManagerCreateOrUpdateType,
  FileManagerSearchType,
  FileManagerType,
  FileSecurityType,
} from "@/types/fileManager/fileManager";
import { deleteFileAndChildren } from "@/utils/fileManagerUtils/deleteFileorFolder";
import { toast } from "react-toastify";
import FileManager from "./FileManager";
import withAuthorization from "@/libs/authentication";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";

type FileUploadConfig = {
  url: string;
  method: "POST" | "PUT";
  headers?: {};
};

function AppFileManager() {
  const token = localStorage.getItem("AccessToken");
  const fileUploadConfig: FileUploadConfig = {
    url: process.env.NEXT_PUBLIC_API_URL + "/api/fileManager/uploadFile",
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };

  const [isLoading, setIsLoading] = useState(false);
  const isMountRef = useRef(false);
  const [files, setFiles] = useState<FileManagerType[]>([]);
  const [modelSearch, setModelSearch] = useState<FileManagerSearchType>();

  // Get Files
  const handleGetFiles = async (searchModel?: FileManagerSearchType) => {
    setIsLoading(true);
    let searchModelTrue: FileManagerSearchType = {};
    if (searchModel != null) {
      searchModelTrue = searchModel;
    }
    const response = await FileManagerService.getData(searchModelTrue);
    if (response.status) {
      setFiles((prevFiles) => {
        const fileMap = new Map(prevFiles.map((f) => [f.id, f]));

        for (const file of response.data) {
          fileMap.set(file.id, file); // nếu đã có thì ghi đè, chưa có thì thêm mới
        }

        return Array.from(fileMap.values());
      });
    } else {
      toast.error("Đã xảy ra lỗi");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isMountRef.current) return;
    isMountRef.current = true;
    handleGetFiles();
  }, []);

  // Create Folder
  const handleCreateFolder = async (folder: FileManagerCreateOrUpdateType) => {
    setIsLoading(true);
    try {
      const response = await FileManagerService.Create(folder);
      if (response.status) {
        setFiles((prev) => [...prev, response.data]);
        toast.success("Tạo thành công");
      } else {
        toast.error(response.message ?? "Đã có lỗi xảy ra khi tạo file");
      }
    } catch {
      toast.error("Đã có lỗi xảy ra khi tạo file");
    } finally {
      setIsLoading(false);
    }
  };
  //

  // File Upload Handlers
  ////    chuẩn bị dữ liệu trước khi gửi
  const handleFileUploading = (file: any, parentFolder: any) => {
    return { parentId: parentFolder?.id };
  };
  ////    Hàm được chạy sau khi upload xong
  const handleFileUploaded = (response: any) => {
    const parsed = JSON.parse(response);
    if (parsed.status) {
      const uploadedFile = parsed.data;
      setFiles((prev) => [...prev, uploadedFile]);
    }
  };

  // Rename File/Folder
  const handleRename = async (file: FileManagerType, newName: string) => {
    setIsLoading(true);
    const response = await FileManagerService.Rename(file.id, newName);
    if (response.status) {
      await handleGetFiles(modelSearch);
      toast.success("Đổi tên thành công");
    } else {
      toast.error(response.message ?? "Đổi tên không thành công");
    }
    setIsLoading(false);
  };

  // Delete File/Folder
  const handleDelete = async (fileDeletes: FileManagerType[]) => {
    setIsLoading(true);
    const idsToDelete = fileDeletes
      .map((file) => file.id)
      .filter((id): id is string => typeof id === "string");
    const response = await FileManagerService.Delete(idsToDelete);
    if (response.status) {
      if (idsToDelete.length > 0) {
        setFiles((prev) => {
          let updatedFiles = [...prev];
          for (const item of idsToDelete) {
            updatedFiles = deleteFileAndChildren(item, updatedFiles);
          }
          return updatedFiles;
        });
      }

      toast.success("Xóa thành công");
    } else {
      toast.error(response.message ?? "Đổi tên không thành công");
      setIsLoading(false);
    }
  };

  // Paste File/Folder
  const handlePaste = async (
    copiedItems: FileManagerType[],
    destinationFolder: FileManagerType,
    operationType: string
  ) => {
    setIsLoading(true);
    let response;
    if (operationType === "copy") {
      response = await FileManagerService.Copy(copiedItems, destinationFolder);
    } else {
      response = await FileManagerService.Move(copiedItems, destinationFolder);
    }
    if (response && response.status) {
      toast.success(response.message);
      await handleGetFiles(modelSearch);
    } else {
      toast.error(response.message);
    }
  };

  const handleShare = async (
    fileSecurites: FileSecurityType[],
    fileID: string
  ) => {
    setIsLoading(true);
    const sendFiles = fileSecurites.filter((x) => x.permission);
    const res = await FileManagerService.SaveSecurity(sendFiles, fileID);
    if (res.status) {
      toast.success("Lưu thành công");
    } else {
      toast.error("Lưu thất bại");
    }
    setIsLoading(false);
  };

  // Refresh Files
  const handleRefresh = async () => {
    await handleGetFiles(modelSearch);
  };

  const handleSeacrh = async (searchContent: string) => {
    setIsLoading(true);
    const searchModel = { ...modelSearch, name: searchContent?.trim() };
    const response = await FileManagerService.searchData(searchModel);

    if (response.status) {
      // setFiles((prevFiles) => {
      //   const fileMap = new Map(prevFiles.map((f) => [f.id, f]));
      //   for (const file of response.data) {
      //     fileMap.set(file.id, file);
      //   }
      //   return Array.from(fileMap.values());
      // });
      setIsLoading(false);
      return response.data;
    } else {
      toast.error("Đã xảy ra lỗi");
      setIsLoading(false);
      return [];
    }
  };

  const handleFileOpen = async (file: FileManagerType) => {
    setIsLoading(true);

    const searchModel: FileManagerSearchType = {
      parentId: file.id,
    };

    const response = await FileManagerService.getData(searchModel);
    if (response.status) {
      setFiles((prevFiles) => {
        const fileMap = new Map(prevFiles.map((f) => [f.id, f]));

        for (const currentFile of response.data) {
          // Renamed 'file' to 'currentFile' to avoid conflict
          fileMap.set(currentFile.id, currentFile);
        }

        return Array.from(fileMap.values());
      });
    } else {
      toast.error("Đã có lỗi xảy ra");
    }
    setIsLoading(false);
  };

  const handleDownload = async (files: FileManagerType[]) => {
    const fileIDs = files.map((f) => f.id);
    const rs = await FileManagerService.Download(fileIDs);
    if (rs.status) {
      const link = document.createElement("a");
      link.href = rs.data;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error("Đã xảy ra lỗi khi tải tài liệu");
    }
  };

  const handleUpdateSearchModel = async (parentID: string) => {
    setModelSearch((prev) => {
      const updated = { ...prev, parentId: parentID };
      return updated;
    });
  };

  // const handleLayoutChange = (layout) => {
  //     console.log(layout);
  // };

  // const handleError = (error, file) => {
  //     console.error(error);
  // };

  // const handleCut = (files) => {
  //     console.log("Moving Files", files);
  // };

  // const handleCopy = (files) => {
  //     console.log("Copied Files", files);
  // };

  // const handleSelect = (files) => {
  //     console.log("Selected Files", files);
  // };

  return (
    <>
      <AutoBreadcrumb />

      <FileManager
        files={files}
        layout="grid"
        onCreateFolder={handleCreateFolder}
        onDelete={handleDelete}
        onRename={handleRename}
        onShare={handleShare}
        onDownload={handleDownload}
        onFileOpen={handleFileOpen}
        onFileUploading={handleFileUploading}
        onFileUploaded={handleFileUploaded}
        fileUploadConfig={fileUploadConfig}
        filePreviewPath={process.env.NEXT_PUBLIC_STATIC_FILEMANAGER_BASE_URL}
        onPaste={handlePaste}
        onRefresh={handleRefresh}
        onSearch={handleSeacrh}
        onUpdateSeachModel={handleUpdateSearchModel}
        enableFilePreview
        maxFileSize={10485760}
        height="100%"
        width="100%"
        initialPath=""
      />
    </>
  );
}

export default withAuthorization(AppFileManager, "");

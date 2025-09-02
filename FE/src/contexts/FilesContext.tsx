import { FileManagerType } from "@/types/fileManager/fileManager";
import React, { createContext, useContext, useEffect, useState } from "react";

// Định nghĩa kiểu dữ liệu cho context
interface FilesContextType {
  files: FileManagerType[];
  setFiles: React.Dispatch<React.SetStateAction<FileManagerType[]>>;
  getChildren: (file: FileManagerType) => FileManagerType[];
  onError: (error: any, file?: any) => void;
}

// Tạo context với kiểu dữ liệu đã định nghĩa
const FilesContext = createContext<FilesContextType | undefined>(undefined);

interface FilesProviderProps {
  children: React.ReactNode;
  filesData: FileManagerType[];
  onError: (error: any) => void;
}

export const FilesProvider: React.FC<FilesProviderProps> = ({
  children,
  filesData,
  onError,
}) => {
  const [files, setFiles] = useState<FileManagerType[]>([]);

  useEffect(() => {
    setFiles(filesData);
  }, [filesData]);

  const getChildren = (file: FileManagerType) => {
    if (!file.isDirectory) return [];
    return files.filter((child) => child.path === `${file.path}/${child.name}`);
  };

  return (
    <FilesContext.Provider value={{ files, setFiles, getChildren, onError }}>
      {children}
    </FilesContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng context
export const useFiles = (): FilesContextType => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
};

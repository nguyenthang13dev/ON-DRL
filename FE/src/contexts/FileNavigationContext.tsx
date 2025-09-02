import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useFiles } from "./FilesContext";
import sortFiles from "../utils/fileManagerUtils/sortFiles";

// Định nghĩa kiểu dữ liệu cho context
interface FileNavigationContextType {
  currentPath: string;
  setCurrentPath: React.Dispatch<React.SetStateAction<string>>;
  currentFolder: any | null;
  setCurrentFolder: React.Dispatch<React.SetStateAction<any | null>>;
  currentPathFiles: any[];
  setCurrentPathFiles: React.Dispatch<React.SetStateAction<any[]>>;
  onUpdateSeachModel: (parentID: string) => void;
}

// Tạo context với kiểu dữ liệu đã định nghĩa
const FileNavigationContext = createContext<FileNavigationContextType | undefined>(undefined);

interface FileNavigationProviderProps {
  children: React.ReactNode;
  initialPath: string;
  onUpdateSeachModel: (parentID: string) => void;
}

export const FileNavigationProvider: React.FC<FileNavigationProviderProps> = ({ children, initialPath, onUpdateSeachModel }) => {
  const { files } = useFiles();
  const isMountRef = useRef(false);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [currentFolder, setCurrentFolder] = useState<any | null>(null);
  const [currentPathFiles, setCurrentPathFiles] = useState<any[]>([]);
  useEffect(() => {
    if (Array.isArray(files) && files.length > 0) {
      setCurrentPathFiles(() => {
        const currPathFiles = files.filter((file) => file.path === `${currentPath}/${file.name}`);
        return sortFiles(currPathFiles);
      });

      setCurrentFolder(() => {
        return files.find((file) => file.path === currentPath) ?? null;
      });
    }
  }, [files, currentPath]);

  useEffect(() => {
    if (!isMountRef.current && Array.isArray(files) && files.length > 0) {
      setCurrentPath(files.some((file) => file.path === initialPath) ? initialPath : "");
      isMountRef.current = true;
    }
  }, [initialPath, files]);

  // currFolder ở component to nhất để call api
  useEffect(() => {
    onUpdateSeachModel(currentFolder?.id ?? null);
  }, [currentFolder])

  return (
    <FileNavigationContext.Provider
      value={{
        currentPath,
        setCurrentPath,
        currentFolder,
        setCurrentFolder,
        currentPathFiles,
        setCurrentPathFiles,
        onUpdateSeachModel,
      }}
    >
      {children}
    </FileNavigationContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng context
export const useFileNavigation = (): FileNavigationContextType => {
  const context = useContext(FileNavigationContext);
  if (!context) {
    throw new Error("useFileNavigation must be used within a FileNavigationProvider");
  }
  return context;
};

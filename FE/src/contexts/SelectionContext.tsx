import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { validateApiCallback } from "../utils/fileManagerUtils/validateApiCallback";
import { FileManagerType } from "@/types/fileManager/fileManager";

// Định nghĩa kiểu cho context
interface SelectionContextType {
  selectedFiles: FileManagerType[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<FileManagerType[]>>;
  handleDownload: () => void;
}

// Tạo context với kiểu dữ liệu đã định nghĩa
const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

interface SelectionProviderProps {
  children: ReactNode;
  onDownload: (files: FileManagerType[]) => void;
  onSelect: (files: FileManagerType[]) => void;
}

export const SelectionProvider: React.FC<SelectionProviderProps> = ({ children, onDownload, onSelect }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileManagerType[]>([]);

  useEffect(() => {
    if (selectedFiles.length && onSelect) {
      onSelect(selectedFiles);
    }
  }, [selectedFiles, onSelect]);

  const handleDownload = () => {
    validateApiCallback(onDownload, "onDownload", selectedFiles);
  };

  return (
    <SelectionContext.Provider value={{ selectedFiles, setSelectedFiles, handleDownload }}>
      {children}
    </SelectionContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng context
export const useSelection = (): SelectionContextType => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};

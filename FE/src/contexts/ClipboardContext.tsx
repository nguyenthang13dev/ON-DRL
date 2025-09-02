import React, { createContext, useContext, useState } from "react";
import { useSelection } from "./SelectionContext";
import { validateApiCallback } from "../utils/fileManagerUtils/validateApiCallback";
import { FileManagerType } from "@/types/fileManager/fileManager";

type ClipBoardContextType = {
  clipBoard: { files: any[]; isMoving: boolean } | null;
  setClipBoard: React.Dispatch<React.SetStateAction<any>>;
  handleCutCopy: (isMoving: boolean) => void;
  handlePasting: (destinationFolder: any) => void;
};

const ClipBoardContext = createContext<ClipBoardContextType | undefined>(undefined);

interface ClipBoardProviderProps {
  children: React.ReactNode;
  onPaste?: (copiedItems: FileManagerType[], destinationFolder: FileManagerType, operationType: string) => void;
  onCut?: (files: any[]) => void;
  onCopy?: (files: any[]) => void;
}

export const ClipBoardProvider: React.FC<ClipBoardProviderProps> = ({
  children,
  onPaste,
  onCut,
  onCopy,
}) => {
  const [clipBoard, setClipBoard] = useState<{ files: any[]; isMoving: boolean } | null>(null);
  const { selectedFiles, setSelectedFiles } = useSelection();

  const handleCutCopy = (isMoving: boolean) => {
    setClipBoard({
      files: selectedFiles,
      isMoving: isMoving,
    });

    if (isMoving && onCut) {
      onCut(selectedFiles);
    } else if (onCopy) {
      onCopy(selectedFiles);
    }
  };

  const handlePasting = (destinationFolder: any) => {
    if (destinationFolder && !destinationFolder.isDirectory) return;

    const copiedFiles = clipBoard?.files || [];
    const operationType = clipBoard?.isMoving ? "move" : "copy";

    if (onPaste) {
      validateApiCallback(onPaste, "onPaste", copiedFiles, destinationFolder, operationType);
    }

    if (clipBoard?.isMoving) {
      setClipBoard(null);
    }
    setSelectedFiles([]);
  };

  return (
    <ClipBoardContext.Provider value={{ clipBoard, setClipBoard, handleCutCopy, handlePasting }}>
      {children}
    </ClipBoardContext.Provider>
  );
};

export const useClipBoard = (): ClipBoardContextType => {
  const context = useContext(ClipBoardContext);
  if (!context) {
    throw new Error("useClipBoard must be used within a ClipBoardProvider");
  }
  return context;
};

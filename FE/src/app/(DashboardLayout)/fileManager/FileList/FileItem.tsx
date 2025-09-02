import React, { useEffect, useRef, useState, MouseEvent, KeyboardEvent, DragEvent, ChangeEvent } from "react";
import { FaRegFile, FaRegFolderOpen } from "react-icons/fa6";
import CreateFolderAction from "../Actions/CreateFolder/CreateFolder.action";
import RenameAction from "../Actions/Rename/Rename.action";
import { useLayout } from "@/contexts/LayoutContext";
import { useFileIcons } from "@/hooks/useFileIcons";
import { useFileNavigation } from "@/contexts/FileNavigationContext";
import { useSelection } from "@/contexts/SelectionContext";
import Checkbox from "@/components/fileManager-components/Checkbox/Checkbox";
import formatDate from "@/utils/formatDate";
import { getDataSize } from "@/utils/fileManagerUtils/getDataSize";
import { useClipBoard } from "@/contexts/ClipboardContext";
import { useTriggerAction } from "@/hooks/useTriggerAction";
import { FileManagerCreateOrUpdateType, FileManagerType } from "@/types/fileManager/fileManager";

const dragIconSize = 50;


export interface FileItemProps {
  index: number;
  file: FileManagerType;
  onCreateFolder: (file: FileManagerCreateOrUpdateType) => void;
  onRename?: (file: FileManagerType, newName: string) => void;
  enableFilePreview: boolean;
  onFileOpen: (file: FileManagerType) => void;
  filesViewRef: React.RefObject<any>;
  selectedFileIndexes: number[];
  triggerAction: ReturnType<typeof useTriggerAction>;
  handleContextMenu: (e: MouseEvent<HTMLDivElement>, isContextMenuOpen: boolean) => void;
  setLastSelectedFile: (file: FileManagerType) => void;
}

const FileItem = ({
  index,
  file,
  onCreateFolder,
  onRename,
  enableFilePreview,
  onFileOpen,
  filesViewRef,
  selectedFileIndexes,
  triggerAction,
  handleContextMenu,
  setLastSelectedFile,
}: FileItemProps) => {
  const [fileSelected, setFileSelected] = useState<boolean>(false);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [checkboxClassName, setCheckboxClassName] = useState<string>("hidden");
  const [dropZoneClass, setDropZoneClass] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const { activeLayout } = useLayout();
  const iconSize = activeLayout === "grid" ? 48 : 20;
  const fileIcons = useFileIcons(iconSize);
  const { setCurrentPath, currentPathFiles } = useFileNavigation();
  const { setSelectedFiles } = useSelection();
  const { clipBoard, handleCutCopy, setClipBoard, handlePasting } = useClipBoard();
  const dragIconRef = useRef<HTMLDivElement | null>(null);
  const dragIcons = useFileIcons(dragIconSize);

  const isFileMoving =
    clipBoard?.isMoving &&
    clipBoard.files.find((f: FileManagerType) => f.name === file.name && f.path === file.path);

  const handleFileAccess = () => {
    // Nếu file là thư mục, chuyển path và xóa danh sách chọn; nếu không và preview cho phép, mở file
    if (file.isDirectory) {
      setCurrentPath(file?.path ?? "");
      setSelectedFiles([]);
      // mới viết thêm để test dòng này
      onFileOpen(file);

    } else if (enableFilePreview) {
      onFileOpen(file);
    }
  };

  const handleFileRangeSelection = (shiftKey: boolean, ctrlKey: boolean) => {
    if (selectedFileIndexes.length > 0 && shiftKey) {
      let reverseSelection = false;
      let startRange = selectedFileIndexes[0];
      let endRange = index;

      if (startRange >= endRange) {
        const temp = startRange;
        startRange = endRange;
        endRange = temp;
        reverseSelection = true;
      }

      const filesRange = currentPathFiles.slice(startRange, endRange + 1);
      setSelectedFiles(reverseSelection ? filesRange.reverse() : filesRange);
    } else if (selectedFileIndexes.length > 0 && ctrlKey) {
      setSelectedFiles((prev) => {
        const filteredFiles = prev.filter((f) => f.path !== file.path);
        if (prev.length === filteredFiles.length) {
          return [...prev, file];
        }
        return filteredFiles;
      });
    } else {
      setSelectedFiles([file]);
    }
  };

  const handleFileSelection = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (file.isEditing) return;

    handleFileRangeSelection(e.shiftKey, e.ctrlKey);

    const currentTime = new Date().getTime();
    if (currentTime - lastClickTime < 300) {
      handleFileAccess();
      return;
    }
    setLastClickTime(currentTime);
  };

  const handleOnKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation();
      setSelectedFiles([file]);
      handleFileAccess();
    }
  };

  const handleItemContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (file.isEditing) return;
    if (!fileSelected) {
      setSelectedFiles([file]);
    }
    setLastSelectedFile(file);
    handleContextMenu(e, true);
  };

  const handleMouseOver = () => {
    setCheckboxClassName("visible");
  };

  const handleMouseLeave = () => {
    if (!fileSelected) {
      setCheckboxClassName("hidden");
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedFiles((prev) => [...prev, file]);
    } else {
      setSelectedFiles((prev) =>
        prev.filter((f) => f.name !== file.name || f.path !== file.path)
      );
    }
    setFileSelected(checked);
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    if (dragIconRef.current) {
      e.dataTransfer.setDragImage(dragIconRef.current, 30, 50);
    }
    e.dataTransfer.effectAllowed = "copy";
    handleCutCopy(true);
  };

  const handleDragEnd = () => setClipBoard(null);

  const handleDragEnterOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (fileSelected || !file.isDirectory) {
      e.dataTransfer.dropEffect = "none";
    } else {
      setTooltipPosition({ x: e.clientX, y: e.clientY + 12 });
      e.dataTransfer.dropEffect = "copy";
      setDropZoneClass("file-drop-zone");
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropZoneClass("");
      setTooltipPosition(null);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (fileSelected || !file.isDirectory) return;
    handlePasting(file);
    setDropZoneClass("");
    setTooltipPosition(null);
  };

  useEffect(() => {
    setFileSelected(selectedFileIndexes.includes(index));
    setCheckboxClassName(selectedFileIndexes.includes(index) ? "visible" : "hidden");
  }, [selectedFileIndexes, index]);

  return (
    <div
      className={`file-item-container ${dropZoneClass} ${fileSelected || file.isEditing ? "file-selected" : ""
        } ${isFileMoving ? "file-moving" : ""}`}
      tabIndex={0}
      title={file.name}
      onClick={handleFileSelection}
      onKeyDown={handleOnKeyDown}
      onContextMenu={handleItemContextMenu}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      draggable={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragEnter={handleDragEnterOver}
      onDragOver={handleDragEnterOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="file-item">
        {!file.isEditing && (
          <Checkbox
            name={file.name}
            id={file.name}
            checked={fileSelected}
            className={`selection-checkbox ${checkboxClassName}`}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {file.isDirectory ? (
          <FaRegFolderOpen size={iconSize} />
        ) : (
          <>
            {
              (() => {
                const ext = file.name.split(".").pop()?.toLowerCase();
                return fileIcons[ext as keyof typeof fileIcons] ?? <FaRegFile size={iconSize} />;
              })()
            }
          </>
        )}

        {file.isEditing ? (
          <div className={`rename-file-container ${activeLayout}`}>
            {triggerAction.actionType === "createFolder" ? (
              <CreateFolderAction
                filesViewRef={filesViewRef}
                file={file}
                onCreateFolder={onCreateFolder}
                triggerAction={triggerAction}
              />
            ) : (
              <RenameAction
                filesViewRef={filesViewRef}
                file={file}
                onRename={onRename}
                triggerAction={triggerAction}
              />
            )}
          </div>
        ) : (
          <span className="text-truncate file-name">{file.name}</span>
        )}
      </div>

      {activeLayout === "list" && (
        <>
          <div style={{ width: "100px", display: "flex", alignItems: "center" }}>{file.size && file.size > 0 ? getDataSize(file.size) : ""}</div>
          <div style={{ width: "250px", display: "flex", alignItems: "center" }}>{file.tenLoaiVanBan ? file.tenLoaiVanBan : ""}</div>
          <div style={{ width: "100px", display: "flex", alignItems: "center" }}>{file.soKyHieu ? file.soKyHieu : ""}</div>
          <div style={{ width: "150", display: "flex", alignItems: "center" }}>{file.ngayBanHanh ? formatDate(new Date(file.ngayBanHanh), true) : ""}</div>
        </>
      )}

      {tooltipPosition && (
        <div
          style={{ top: `${tooltipPosition.y}px`, left: `${tooltipPosition.x}px` }}
          className="drag-move-tooltip"
        >
          Di chuyển tới <span className="drop-zone-file-name">{file.name}</span>
        </div>
      )}

      <div ref={dragIconRef} className="drag-icon">
        {file.isDirectory ? (
          <FaRegFolderOpen size={dragIconSize} />
        ) : (
          <>
            {(() => {
              const ext = file.name.split(".").pop()?.toLowerCase();
              return dragIcons[ext as keyof typeof dragIcons] ?? <FaRegFile size={dragIconSize} />;
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default FileItem;

import React, { useRef } from "react";
import FileItem from "./FileItem";
import useFileList from "./useFileList";
import FilesHeader from "./FilesHeader";
import "./FileList.scss";
import { useFileNavigation } from "@/contexts/FileNavigationContext";
import { useLayout } from "@/contexts/LayoutContext";
import { useDetectOutsideClickMenu } from "@/hooks/useDetectOutsideClick";
import { useTriggerAction } from "@/hooks/useTriggerAction";
import { FileManagerCreateOrUpdateType, FileManagerType } from "@/types/fileManager/fileManager";
import ContextMenu from "@/components/fileManager-components/ContextMenu/ContextMenu";

interface FileListProps {
  onCreateFolder: (file: FileManagerCreateOrUpdateType) => void;
  onRename?: (file: FileManagerType, newName: string) => void;
  onFileOpen: (file: FileManagerType) => void;
  onRefresh: () => void;
  enableFilePreview: boolean;
  triggerAction: ReturnType<typeof useTriggerAction>;
}

const FileList: React.FC<FileListProps> = ({
  onCreateFolder,
  onRename,
  onFileOpen,
  onRefresh,
  enableFilePreview,
  triggerAction
}) => {
  const { currentPathFiles } = useFileNavigation();
  const filesViewRef = useRef<HTMLDivElement | null>(null);
  const { activeLayout } = useLayout();
  const {
    emptySelecCtxItems,
    selecCtxItems,
    handleContextMenu,
    unselectFiles,
    visible,
    setVisible,
    setLastSelectedFile,
    selectedFileIndexes,
    clickPosition,
    isSelectionCtx,
  } = useFileList(onRefresh, enableFilePreview, triggerAction);

  const contextMenuRef = useDetectOutsideClickMenu(() => setVisible(false));

  return (
    <div
      ref={filesViewRef}
      className={`files ${activeLayout}`}
      onContextMenu={handleContextMenu}
      onClick={unselectFiles}
    >
      {activeLayout === "list" && <FilesHeader unselectFiles={unselectFiles} />}

      {currentPathFiles?.length > 0 ? (
        <>
          {currentPathFiles.map((file, index) => (
            <FileItem
              key={index}
              index={index}
              file={file}
              onCreateFolder={onCreateFolder}
              onRename={onRename}
              onFileOpen={onFileOpen}
              enableFilePreview={enableFilePreview}
              triggerAction={triggerAction}
              filesViewRef={filesViewRef}
              selectedFileIndexes={selectedFileIndexes}
              handleContextMenu={handleContextMenu}
              // setVisible={setVisible}
              setLastSelectedFile={setLastSelectedFile}
            />
          ))}
        </>
      ) : (
        <div className="empty-folder">Thư mục rỗng.</div>
      )}

      <ContextMenu
        filesViewRef={filesViewRef}
        contextMenuRef={contextMenuRef.ref}
        menuItems={isSelectionCtx ? selecCtxItems : emptySelecCtxItems}
        visible={visible}
        // setVisible={setVisible}
        clickPosition={clickPosition}
      />
    </div>
  );
};

FileList.displayName = "FileList";

export default FileList;

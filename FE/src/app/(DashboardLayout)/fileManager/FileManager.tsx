import React from "react";
import Toolbar from "./Toolbar/Toolbar";
import NavigationPane from "./NavigationPane/NavigationPane";
import BreadCrumb from "./BreadCrumb/BreadCrumb";
import FileList from "./FileList/FileList";
import Actions from "./Actions/Actions";
import Loader from "@/components/fileManager-components/Loader/Loader";
import { FilesProvider } from "@/contexts/FilesContext";
import { FileNavigationProvider } from "@/contexts/FileNavigationContext";
import { SelectionProvider } from "@/contexts/SelectionContext";
import { ClipBoardProvider } from "@/contexts/ClipboardContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { useTriggerAction } from "@/hooks/useTriggerAction";
import { useColumnResize } from "@/hooks/useColumnResize";
import "./FileManager.scss";
import { FileManagerCreateOrUpdateType, FileManagerSearchType, FileManagerType, FileSecurityType } from "@/types/fileManager/fileManager";

type FileUploadConfig = {
  url: string;
  headers?: Record<string, string>;
  method: "POST" | "PUT";
};

type FileManagerProps = {
  files: FileManagerType[];
  fileUploadConfig?: FileUploadConfig;
  isLoading?: boolean;
  onCreateFolder?: (folder: FileManagerCreateOrUpdateType) => void;
  onFileUploading: (file: File, parentFolder: FileManagerType) => void;
  onFileUploaded: (response: any) => void;
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: (copiedItems: FileManagerType[], destinationFolder: FileManagerType, operationType: string) => void;
  onRename?: (file: FileManagerType, newName: string) => void;
  onDownload?: (files: FileManagerType[]) => void;
  onDelete?: (item: FileManagerType[]) => void;
  onShare: (fileSecutites: FileSecurityType[], fileID: string) => void;
  onLayoutChange?: () => void;
  onRefresh?: () => void;
  onSearch: (searchContent: string) => Promise<FileManagerType[]>;
  onFileOpen?: (file: FileManagerType) => void;
  onSelect?: () => void;
  onError?: () => void;
  onUpdateSeachModel?: (parentID: string) => void;
  layout?: "grid" | "list";
  maxFileSize?: number;
  enableFilePreview?: boolean;
  filePreviewPath?: string;
  acceptedFileTypes?: string[];
  height?: string | number;
  width?: string | number;
  initialPath?: string;
  filePreviewComponent?: React.FC<any>;
  primaryColor?: string;
  fontFamily?: string;
};

const FileManager: React.FC<FileManagerProps> = ({
  files,
  fileUploadConfig,
  isLoading = false,
  onCreateFolder,
  onFileUploading,
  onFileUploaded,
  onCut,
  onCopy,
  onPaste,
  onRename,
  onShare,
  onDownload,
  onDelete = () => null,
  onLayoutChange = () => { },
  onRefresh,
  onSearch,
  onFileOpen,
  onSelect,
  onError = () => { },
  onUpdateSeachModel,
  layout = "grid",
  enableFilePreview = true,
  maxFileSize,
  filePreviewPath,
  acceptedFileTypes,
  height = "600px",
  width = "100%",
  initialPath = "",
  filePreviewComponent,
  primaryColor = "#6155b4",
  fontFamily = "Nunito Sans, sans-serif",
}) => {
  const triggerAction = useTriggerAction();
  const {
    containerRef,
    colSizes,
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleMouseDown,
  } = useColumnResize(20, 80);

  const customStyles: React.CSSProperties = {
    height,
    width,
    ["--file-manager-font-family" as any]: fontFamily,
    ["--file-manager-primary-color" as any]: primaryColor,
  };

  return (
    <main className="file-explorer" onContextMenu={(e) => e.preventDefault()} style={customStyles}>
      <Loader loading={isLoading} />
      <FilesProvider filesData={files} onError={onError}>
        <FileNavigationProvider initialPath={initialPath} onUpdateSeachModel={onUpdateSeachModel ?? (() => { })} >
          <SelectionProvider onDownload={onDownload ?? (() => { })} onSelect={onSelect ?? (() => { })}>
            <ClipBoardProvider onPaste={onPaste} onCut={onCut} onCopy={onCopy}>
              <LayoutProvider layout={layout}>
                <Toolbar
                  allowCreateFolder
                  allowUploadFile
                  onLayoutChange={onLayoutChange}
                  onRefresh={onRefresh ?? (() => { })}
                  triggerAction={triggerAction}
                />
                <section
                  ref={containerRef}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  className="files-container"
                >
                  <div className="navigation-pane" style={{ width: colSizes.col1 + "%" }}>
                    <NavigationPane onFileOpen={onFileOpen ?? (() => { })} />
                    <div
                      className={`sidebar-resize ${isDragging ? "sidebar-dragging" : ""}`}
                      onMouseDown={handleMouseDown}
                    />
                  </div>

                  <div className="folders-preview" style={{ width: colSizes.col2 + "%" }}>
                    <BreadCrumb onSearch={onSearch} />
                    <FileList
                      onCreateFolder={onCreateFolder ?? (() => { })}
                      onRename={onRename ?? (() => { })}
                      onFileOpen={onFileOpen ?? (() => { })}
                      onRefresh={onRefresh ?? (() => { })}
                      enableFilePreview={enableFilePreview}
                      triggerAction={triggerAction}
                    />
                  </div>
                </section>

                <Actions
                  fileUploadConfig={fileUploadConfig}
                  onFileUploading={onFileUploading}
                  onFileUploaded={onFileUploaded}
                  onDelete={onDelete}
                  onRefresh={onRefresh}
                  onShare={onShare}
                  maxFileSize={maxFileSize}
                  filePreviewPath={filePreviewPath}
                  filePreviewComponent={filePreviewComponent}
                  acceptedFileTypes={acceptedFileTypes}
                  triggerAction={triggerAction}
                />
              </LayoutProvider>
            </ClipBoardProvider>
          </SelectionProvider>
        </FileNavigationProvider>
      </FilesProvider>
    </main >
  );
};

export default FileManager;

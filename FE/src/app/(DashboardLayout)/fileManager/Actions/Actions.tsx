import { useEffect, useState } from "react";
import DeleteAction from "./Delete/Delete.action";
import UploadFileAction from "./UploadFile/UploadFile.action";
import PreviewFileAction from "./PreviewFile/PreviewFile.action";
import { useSelection } from "@/contexts/SelectionContext";
import Modal from "@/components/fileManager-components/Modal/Modal";
import { FileManagerType, FileSecurityType } from "@/types/fileManager/fileManager";
import { useTriggerAction } from "@/hooks/useTriggerAction";
import { useShortcutHandler } from "../../../../hooks/useShortcutHandler";
import ShareAction from "./Share/Share.action";

interface FileUploadConfig {
  url: string;
  headers?: Record<string, string>;
  method?: "POST" | "PUT";
}

interface ActionsProps {
  fileUploadConfig?: FileUploadConfig;
  onFileUploading: (file: File, currentFolder: FileManagerType) => void;
  onFileUploaded: (response: any) => void;
  onDelete: (files: FileManagerType[]) => void;
  onRefresh?: () => void;
  onShare: (filesecutites: FileSecurityType[], fileID: string) => void;
  maxFileSize?: number;
  filePreviewPath?: string;
  filePreviewComponent?: React.FC<any>;
  acceptedFileTypes?: string[];
  triggerAction: ReturnType<typeof useTriggerAction>;
}

interface ActionModalData {
  title: string;
  component: JSX.Element;
  width: string;
}

const Actions: React.FC<ActionsProps> = ({
  fileUploadConfig,
  onFileUploading,
  onFileUploaded,
  onDelete,
  onRefresh,
  onShare,
  maxFileSize,
  filePreviewPath,
  filePreviewComponent,
  acceptedFileTypes,
  triggerAction,
}) => {
  const [activeAction, setActiveAction] = useState<ActionModalData | null>(null);
  const { selectedFiles } = useSelection();

  // Xử lý phím tắt (nếu cần)
  useShortcutHandler(triggerAction, onRefresh);

  const actionTypes: Record<string, ActionModalData> = {
    uploadFile: {
      title: "Thông tin văn bản",
      component: (
        <UploadFileAction
          fileUploadConfig={fileUploadConfig}
          maxFileSize={maxFileSize}
          acceptedFileTypes={acceptedFileTypes}
          onFileUploading={onFileUploading}
          onFileUploaded={onFileUploaded}
          triggerAction={triggerAction}
        />
      ),
      width: "45%",
    },
    delete: {
      title: "Xóa",
      component: <DeleteAction triggerAction={triggerAction} onDelete={onDelete} />,
      width: "25%",
    },
    share: {
      title: "Phân quyền/ Chia sẻ tệp " + (selectedFiles.length === 1 ? selectedFiles[0]?.name : ""),
      component: <ShareAction triggerAction={triggerAction} onShare={onShare} />,
      width: "40%",
    },
    previewFile: {
      title: selectedFiles.length === 1 ? selectedFiles[0].name : "Xem trước",
      component: (
        <PreviewFileAction
          filePreviewPath={filePreviewPath}
          filePreviewComponent={filePreviewComponent}
        />
      ),
      width: "60%",
    },

  };

  useEffect(() => {
    if (triggerAction.isActive) {
      const actionType = triggerAction.actionType;
      if (actionType === "previewFile") {
        // actionTypes[actionType].title = selectedFiles[0]?.name ?? "Xem trước";
        actionTypes[actionType].title = "Chi tiết thông tin văn bản";
      }
      setActiveAction(actionTypes[actionType ?? ""]);
    } else {
      setActiveAction(null);
    }
  }, [triggerAction.isActive]);


  if (activeAction) {
    return (
      <Modal
        heading={activeAction.title}
        show={triggerAction.isActive}
        setShow={triggerAction.close}
        dialogWidth={activeAction.width}
      >
        {activeAction?.component}
      </Modal>
    );
  }
};

export default Actions;

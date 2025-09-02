import React, { useEffect, useState } from "react";
import "./Delete.action.scss";
import { useSelection } from "@/contexts/SelectionContext";
import Button from "@/components/fileManager-components/Button/Button";
import { FileManagerType } from "@/types/fileManager/fileManager";
import { useTriggerAction } from "@/hooks/useTriggerAction";

interface DeleteActionProps {
  triggerAction: ReturnType<typeof useTriggerAction>;
  onDelete: (files: FileManagerType[]) => void;
}

const DeleteAction: React.FC<DeleteActionProps> = ({ triggerAction, onDelete }) => {
  const [deleteMsg, setDeleteMsg] = useState<string>("");
  const { selectedFiles, setSelectedFiles } = useSelection();

  useEffect(() => {
    if (selectedFiles.length === 1) {
      setDeleteMsg(`Bạn có chắc chắn muốn xóa "${selectedFiles[0].name}"?`);
    } else if (selectedFiles.length > 1) {
      setDeleteMsg(`Bạn có chắc chắn muốn xóa ${selectedFiles.length} tệp tin?`);
    } else {
      setDeleteMsg("Chưa có tệp tin nào được chọn.");
    }
  }, [selectedFiles]);

  const handleDeleting = () => {
    onDelete(selectedFiles);
    setSelectedFiles([]);
    triggerAction.close();
  };

  return (
    <div className="file-delete-confirm">
      <p className="file-delete-confirm-text">{deleteMsg}</p>
      <div className="file-delete-confirm-actions">
        <Button type="secondary" onClick={() => triggerAction.close()}>
          Hủy
        </Button>
        <Button type="danger" onClick={handleDeleting}>
          Xóa
        </Button>
      </div>
    </div>
  );
};

export default DeleteAction;

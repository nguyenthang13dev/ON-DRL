import Checkbox from "@/components/fileManager-components/Checkbox/Checkbox";
import { useFileNavigation } from "@/contexts/FileNavigationContext";
import { useSelection } from "@/contexts/SelectionContext";
import { useMemo, useState } from "react";

interface FilesHeaderProps {
  unselectFiles: () => void;
}

const FilesHeader: React.FC<FilesHeaderProps> = ({ unselectFiles }) => {
  const [showSelectAll, setShowSelectAll] = useState<boolean>(false);

  const { selectedFiles, setSelectedFiles } = useSelection();
  const { currentPathFiles } = useFileNavigation();

  const allFilesSelected = useMemo<boolean>(() => {
    return currentPathFiles.length > 0 && selectedFiles.length === currentPathFiles.length;
  }, [selectedFiles, currentPathFiles]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedFiles(currentPathFiles);
      setShowSelectAll(true);
    } else {
      unselectFiles();
    }
  };

  return (
    <div
      className="files-header"
      onMouseOver={() => setShowSelectAll(true)}
      onMouseLeave={() => setShowSelectAll(false)}
    >
      <div className="file-select-all">
        {(showSelectAll || allFilesSelected) && (
          <Checkbox checked={allFilesSelected} onChange={handleSelectAll} title="Select all" disabled={currentPathFiles.length === 0} />
        )}
      </div>
      <div className="" style={{ width: "300px" }}>Tên</div>
      <div className="" style={{ width: "100px" }}>Kích thước</div>
      <div className="" style={{ width: "240px" }}>Loại văn bản</div>
      <div className="" style={{ width: "100px" }}>Số ký hiệu</div>
      <div className="" style={{ width: "150px" }}>Ngày ban hành</div>
    </div>
  );
};

export default FilesHeader;

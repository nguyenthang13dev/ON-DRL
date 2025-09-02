import React, { useEffect, useState } from "react";
import FolderTree from "./FolderTree";
import "./NavigationPane.scss";
import { useFiles } from "@/contexts/FilesContext";
import { getParentPath } from "../../../../utils/fileManagerUtils/getParentPath";
import { FileManagerType } from "@/types/fileManager/fileManager";


// Props cho NavigationPane
interface NavigationPaneProps {
  onFileOpen: (folder: FileManagerType) => void;
}

const NavigationPane: React.FC<NavigationPaneProps> = ({ onFileOpen }) => {
  const [foldersTree, setFoldersTree] = useState<FileManagerType[]>([]);
  const { files } = useFiles();

  const createChildRecursive = (
    path: string,
    foldersStruct: Record<string, FileManagerType[]>,
    visitedPaths: Set<string> = new Set()
  ): FileManagerType[] => {
    if (!foldersStruct[path]) return [];

    if (visitedPaths.has(path)) return [];

    visitedPaths.add(path);

    return foldersStruct[path].map((folder) => ({
      ...folder,
      subDirectories: createChildRecursive(folder.path || "", foldersStruct, new Set(visitedPaths)),
    }));
  };


  useEffect(() => {
    if (Array.isArray(files)) {
      const folders = files.filter((file) => file.isDirectory);
      const foldersStruct: Record<string, FileManagerType[]> = folders.reduce(
        (acc, folder) => {
          const parentPath = getParentPath(folder.path || "");
          if (!acc[parentPath]) acc[parentPath] = [];
          acc[parentPath].push(folder);
          return acc;
        },
        {} as Record<string, FileManagerType[]>
      );

      setFoldersTree(() => {
        const rootPath = ""; // hoặc "/" nếu cấu trúc path của bạn dùng vậy
        return createChildRecursive(rootPath, foldersStruct);
      });
    }
  }, [files]);

  return (
    <div className="sb-folders-list">
      {foldersTree.length > 0 ? (
        foldersTree.map((folder, index) => (
          <FolderTree key={index} folder={folder} onFileOpen={onFileOpen} />
        ))
      ) : (
        <div className="empty-nav-pane">Chưa có thư mục nào</div>
      )}
    </div>
  );
};

NavigationPane.displayName = "NavigationPane";

export default NavigationPane;

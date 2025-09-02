import { useEffect, useRef, useState } from "react";
import { MdHome, MdMoreHoriz, MdOutlineNavigateNext } from "react-icons/md";
import "./BreadCrumb.scss";
import { useFileNavigation } from "@/contexts/FileNavigationContext";
import { useDetectOutsideClickLayout } from "@/hooks/useDetectOutsideClick";
import SearchInput from "./Search";
import { FileManagerType } from "@/types/fileManager/fileManager";

interface Folder {
  name: string;
  path: string;
}

interface BreadCrumbProps {
  onSearch: (searchContent: string) => Promise<FileManagerType[]>;
}

const BreadCrumb = (props: BreadCrumbProps) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [hiddenFolders, setHiddenFolders] = useState<Folder[]>([]);
  const [hiddenFoldersWidth, setHiddenFoldersWidth] = useState<number[]>([]);
  const [showHiddenFolders, setShowHiddenFolders] = useState<boolean>(false);

  const { currentPath, setCurrentPath } = useFileNavigation();

  const breadCrumbRef = useRef<HTMLDivElement | null>(null);
  const foldersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const moreBtnRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useDetectOutsideClickLayout(() => {
    setShowHiddenFolders(false);
  });

  useEffect(() => {
    setFolders(() => {
      let path = "";
      return currentPath?.split("/").map((item) => {
        return {
          name: item || "Thư mục gốc",
          path: item === "" ? item : (path += `/${item}`),
        };
      }) || [];
    });
    setHiddenFolders([]);
    setHiddenFoldersWidth([]);
  }, [currentPath]);

  // Đồng bộ foldersRef với số lượng folder
  useEffect(() => {
    foldersRef.current = new Array(folders.length).fill(null);
  }, [folders.length]);

  const switchPath = (path: string) => {
    setCurrentPath(path);
  };

  const getBreadCrumbWidth = () => {
    if (!breadCrumbRef.current) return 0;
    const containerWidth = breadCrumbRef.current.clientWidth;
    const containerStyles = getComputedStyle(breadCrumbRef.current);
    const paddingLeft = parseFloat(containerStyles.paddingLeft);
    const moreBtnGap = hiddenFolders.length > 0 ? 1 : 0;
    const flexGap = parseFloat(containerStyles.gap) * (folders.length + moreBtnGap);
    return containerWidth - (paddingLeft + flexGap);
  };

  const checkAvailableSpace = () => {
    const availableSpace = getBreadCrumbWidth();
    const remainingFoldersWidth = foldersRef.current.reduce((prev, curr) => {
      if (!curr) return prev;
      return prev + curr.clientWidth;
    }, 0);
    const moreBtnWidth = moreBtnRef.current?.clientWidth || 0;
    return availableSpace - (remainingFoldersWidth + moreBtnWidth);
  };

  const isBreadCrumbOverflowing = () => {
    return (
      breadCrumbRef.current?.scrollWidth &&
      breadCrumbRef.current?.clientWidth &&
      breadCrumbRef.current.scrollWidth > breadCrumbRef.current.clientWidth
    );
  };

  useEffect(() => {
    if (isBreadCrumbOverflowing()) {
      const hiddenFolder = folders[1];
      const hiddenFolderWidth = foldersRef.current[1]?.clientWidth ?? 0;
      setHiddenFoldersWidth((prev) => [...prev, hiddenFolderWidth]);
      setHiddenFolders((prev) => [...prev, hiddenFolder]);
      setFolders((prev) => prev.filter((_, index) => index !== 1));
    } else if (
      hiddenFolders.length > 0 &&
      checkAvailableSpace() > (hiddenFoldersWidth.at(-1) ?? 0)
    ) {
      const newFolders = [folders[0], hiddenFolders.at(-1)!, ...folders.slice(1)];
      setFolders(newFolders);
      setHiddenFolders((prev) => prev.slice(0, -1));
      setHiddenFoldersWidth((prev) => prev.slice(0, -1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folders]);

  return (
    <div className="bread-crumb-container">
      <div className="breadcrumb" ref={breadCrumbRef}>
        {folders.map((folder, index) => (
          <div key={index} style={{ display: "contents" }}>
            <span
              className="folder-name"
              onClick={() => switchPath(folder.path)}
              ref={(el) => {
                foldersRef.current[index] = el;
              }}
            >
              {index === 0 ? <MdHome /> : <MdOutlineNavigateNext />}
              {folder.name}
            </span>
            {hiddenFolders?.length > 0 && index === 0 && (
              <button
                className="folder-name folder-name-btn"
                onClick={() => setShowHiddenFolders(true)}
                ref={moreBtnRef}
                title="Show more folders"
              >
                <MdMoreHoriz size={22} className="hidden-folders" />
              </button>
            )}
          </div>
        ))}
      </div>

      {showHiddenFolders && (
        <ul ref={popoverRef.ref} className="hidden-folders-container">
          {hiddenFolders.map((folder, index) => (
            <li
              key={index}
              onClick={() => {
                switchPath(folder.path);
                setShowHiddenFolders(false);
              }}
            >
              {folder.name}
            </li>
          ))}
        </ul>
      )}

      <SearchInput onSearch={props.onSearch} />

    </div>



  );
};

BreadCrumb.displayName = "BreadCrumb";

export default BreadCrumb;

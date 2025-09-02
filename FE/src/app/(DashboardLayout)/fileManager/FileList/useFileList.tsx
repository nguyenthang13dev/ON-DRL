import { useClipBoard } from "@/contexts/ClipboardContext";
import { useFileNavigation } from "@/contexts/FileNavigationContext";
import { useLayout } from "@/contexts/LayoutContext";
import { useSelection } from "@/contexts/SelectionContext";
import { validateApiCallback } from "@/utils/fileManagerUtils/validateApiCallback";
import { duplicateNameHandler } from "@/utils/fileManagerUtils/duplicateNameHandler";
import { useEffect, useState } from "react";
import { BiRename, BiSelectMultiple } from "react-icons/bi";
import { BsCopy, BsFolderPlus, BsGrid, BsScissors } from "react-icons/bs";
import { FaListUl, FaRegFile, FaRegPaste } from "react-icons/fa6";
import { FiRefreshCw } from "react-icons/fi";
import { MdAdminPanelSettings, MdOutlineDelete, MdOutlineFileDownload, MdOutlineFileUpload } from "react-icons/md";
import { PiFolderOpen } from "react-icons/pi";
import { useTriggerAction } from "@/hooks/useTriggerAction";
import { FileManagerType } from "@/types/fileManager/fileManager";
import { Modal } from "antd";


const useFileList = (
  onRefresh: () => void,
  enableFilePreview: boolean,
  triggerAction: ReturnType<typeof useTriggerAction>
) => {
  const [selectedFileIndexes, setSelectedFileIndexes] = useState<number[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [isSelectionCtx, setIsSelectionCtx] = useState<boolean>(false);
  const [clickPosition, setClickPosition] = useState<{ clickX: number; clickY: number }>({
    clickX: 0,
    clickY: 0,
  });
  const [lastSelectedFile, setLastSelectedFile] = useState<FileManagerType | null>(null);
  const { clipBoard, setClipBoard, handleCutCopy, handlePasting } = useClipBoard();
  const { selectedFiles, setSelectedFiles, handleDownload } = useSelection();
  const { currentPath, setCurrentPath, currentPathFiles, setCurrentPathFiles, currentFolder } = useFileNavigation();
  const { activeLayout, setActiveLayout } = useLayout();

  // Context Menu Handlers
  const handleFileOpen = () => {
    if (lastSelectedFile?.isDirectory) {
      setCurrentPath(lastSelectedFile?.path ?? "");
      setSelectedFileIndexes([]);
      setSelectedFiles([]);
    } else {
      enableFilePreview && triggerAction.show("previewFile");
    }
    setVisible(false);
  };

  const handleMoveOrCopyItems = (isMoving: boolean) => {
    handleCutCopy(isMoving);
    setVisible(false);
  };

  const handleFilePasting = () => {
    handlePasting(lastSelectedFile);
    setVisible(false);
  };

  const handleRenaming = () => {
    setVisible(false);
    triggerAction.show("rename");
  };

  const handleDownloadItems = () => {
    handleDownload();
    setVisible(false);
  };

  const handleShare = () => {
    setVisible(false);
    triggerAction.show("share");
  }

  const handleDelete = () => {
    setVisible(false);
    triggerAction.show("delete");
  };

  const handleRefresh = () => {
    setVisible(false);
    validateApiCallback(onRefresh, "onRefresh");
    setClipBoard(null);
  };

  const handleCreateNewFolder = () => {
    triggerAction.show("createFolder");
    setVisible(false);
  };

  const handleUpload = () => {
    setVisible(false);
    triggerAction.show("uploadFile");
  };

  const handleselectAllFiles = () => {
    setSelectedFiles(currentPathFiles);
    setVisible(false);
  };

  // Context Menu Items
  const emptySelecCtxItems = [
    {
      title: "Xem",
      icon: activeLayout === "grid" ? <BsGrid size={18} /> : <FaListUl size={18} />,
      onClick: () => { },
      children: [
        {
          title: "Lưới",
          icon: <BsGrid size={18} />,
          selected: activeLayout === "grid",
          onClick: () => {
            setActiveLayout("grid");
            setVisible(false);
          },
        },
        {
          title: "Danh sách",
          icon: <FaListUl size={18} />,
          selected: activeLayout === "list",
          onClick: () => {
            setActiveLayout("list");
            setVisible(false);
          },
        },
      ],
    },
    {
      title: "Làm mới",
      icon: <FiRefreshCw size={18} />,
      onClick: handleRefresh,
      divider: true,
    },
    {
      title: "Thư mục mới",
      icon: <BsFolderPlus size={18} />,
      onClick: handleCreateNewFolder,
      hidden: currentFolder ? !currentFolder?.permission?.create : false
    },
    {
      title: "Tải lên",
      icon: <MdOutlineFileUpload size={18} />,
      onClick: handleUpload,
      divider: true,
      hidden: currentFolder ? !currentFolder?.permission?.upload : false
    },
    {
      title: "Chọn tất cả",
      icon: <BiSelectMultiple size={18} />,
      onClick: handleselectAllFiles,
    },

  ];

  const selecCtxItems = [
    {
      title: "Mở",
      icon: lastSelectedFile?.isDirectory ? <PiFolderOpen size={20} /> : <FaRegFile size={16} />,
      onClick: handleFileOpen,
    },
    {
      title: "Di chuyển",
      icon: <BsScissors size={19} />,
      onClick: () => {
        Modal.confirm({
          title: "Xác nhận di chuyển",
          content: "Nếu bạn di chuyển, thông tin phân quyền sẽ bị mất. Bạn có đồng ý không?",
          okText: "Đồng ý",
          cancelText: "Hủy",
          onOk: () => handleMoveOrCopyItems(true),
        });
      },
      hidden: !selectedFiles.every(file => file.permission?.move)
    },
    {
      title: "Sao chép",
      icon: <BsCopy strokeWidth={0.1} size={17} />,
      onClick: () => handleMoveOrCopyItems(false),
      divider: !lastSelectedFile?.isDirectory,
      hidden: !selectedFiles.every(file => file.permission?.copy)
    },
    {
      title: "Dán",
      icon: <FaRegPaste size={18} />,
      onClick: handleFilePasting,
      className: `${clipBoard ? "" : "disable-paste"}`,
      hidden: !lastSelectedFile?.isDirectory ||
        (!selectedFiles.every(file => file.permission?.copy
          && !selectedFiles.every(file => file.permission?.move))),
      divider: true,
    },
    {
      title: "Đổi tên",
      icon: <BiRename size={19} />,
      onClick: handleRenaming,
      hidden: selectedFiles.length > 1 || !selectedFiles[0]?.permission?.rename,
    },
    {
      title: "Tải xuống",
      icon: <MdOutlineFileDownload size={18} />,
      onClick: handleDownloadItems,
      hidden: !selectedFiles.every(file => file.permission?.download),
    },
    {
      title: "Phân quyền/ chia sẻ",
      icon: <MdAdminPanelSettings size={18} />,
      onClick: handleShare,
      hidden: selectedFiles.length == 1 && !selectedFiles[0].permission?.share,
    },
    {
      title: "Xóa",
      icon: <MdOutlineDelete size={19} />,
      onClick: handleDelete,
      hidden: !selectedFiles.every(file => file.permission?.delete)
    },
  ];

  // Folder & File Actions
  const handleFolderCreating = () => {
    setCurrentPathFiles((prev) => [
      ...prev,
      {
        name: duplicateNameHandler("New Folder", true, prev),
        isDirectory: true,
        path: currentPath,
        isEditing: true,
        key: new Date().valueOf(),
      },
    ]);
  };

  const handleItemRenaming = () => {
    setCurrentPathFiles((prev: FileManagerType[]) => {
      const lastSelectedIndex = selectedFileIndexes.at(-1); // Lấy chỉ số cuối cùng
      if (lastSelectedIndex !== undefined && prev[lastSelectedIndex]) {
        prev[lastSelectedIndex].isEditing = true; // Đánh dấu file là đang chỉnh sửa
      }
      return [...prev]; // Trả về bản sao mới của mảng để cập nhật state (không thay đổi trực tiếp prev)
    });

    setSelectedFileIndexes([]);
    setSelectedFiles([]);
  };

  const unselectFiles = () => {
    setSelectedFileIndexes([]);
    setSelectedFiles((prev) => (prev.length > 0 ? [] : prev));
  };

  // Context Menu Handler
  const handleContextMenu = (e: React.MouseEvent, isSelection = false) => {
    e.preventDefault();
    setClickPosition({ clickX: e.clientX, clickY: e.clientY });
    setIsSelectionCtx(isSelection);
    !isSelection && unselectFiles();
    setVisible(true);
  };

  useEffect(() => {
    if (triggerAction.isActive) {
      if (triggerAction.actionType === "createFolder") {
        handleFolderCreating();
      } else if (triggerAction.actionType === "rename") {
        handleItemRenaming();
      }
    }
  }, [triggerAction.isActive]);

  useEffect(() => {
    setSelectedFileIndexes([]);
    setSelectedFiles([]);
  }, [currentPath]);

  useEffect(() => {
    if (selectedFiles.length > 0) {
      setSelectedFileIndexes(() => {
        return selectedFiles.map((selectedFile) => {
          return currentPathFiles.findIndex((f) => f.path === selectedFile.path);
        });
      });
    } else {
      setSelectedFileIndexes([]);
    }
  }, [selectedFiles, currentPathFiles]);

  return {
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
  };
};

export default useFileList;

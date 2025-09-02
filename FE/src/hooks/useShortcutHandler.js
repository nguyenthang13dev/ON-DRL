import { useKeyPress } from "./useKeyPress";
import { shortcuts } from "../utils/fileManagerUtils/shortcuts";
import { useClipBoard } from "../contexts/ClipboardContext";
import { useFileNavigation } from "../contexts/FileNavigationContext";
import { useSelection } from "../contexts/SelectionContext";
import { useLayout } from "../contexts/LayoutContext";
import { validateApiCallback } from "../utils/fileManagerUtils/validateApiCallback";

export const useShortcutHandler = (triggerAction, onRefresh) => {
  const { setClipBoard, handleCutCopy, handlePasting } = useClipBoard();
  const { currentFolder, currentPathFiles } = useFileNavigation();
  const { setSelectedFiles, handleDownload } = useSelection();
  const { setActiveLayout } = useLayout();

  const perrmisson = currentFolder?.permission ?? {
    copy: true,
    create: true,
    delete: true,
    download: true,
    move: true,
    rename: true,
    upload: true,
    share: true
  }


  const triggerCreateFolder = () => {
    perrmisson.create && triggerAction.show("createFolder");
  };

  const triggerUploadFiles = () => {
    perrmisson.upload && triggerAction.show("uploadFile");
  };

  const triggerCutItems = () => {
    perrmisson.move && handleCutCopy(true);
  };

  const triggerCopyItems = () => {
    perrmisson.copy && handleCutCopy(false);
  };

  const triggerPasteItems = () => {
    handlePasting(currentFolder);
  };

  const triggerRename = () => {
    perrmisson.rename && triggerAction.show("rename");
  };

  const triggerDownload = () => {
    perrmisson.download && handleDownload();
  };

  const triggerDelete = () => {
    perrmisson.delete && triggerAction.show("delete");
  };

  const triggerSelectFirst = () => {
    if (currentPathFiles.length > 0) {
      setSelectedFiles([currentPathFiles[0]]);
    }
  };

  const triggerSelectLast = () => {
    if (currentPathFiles.length > 0) {
      setSelectedFiles([currentPathFiles.at(-1)]);
    }
  };

  const triggerSelectAll = () => {
    setSelectedFiles(currentPathFiles);
  };

  const triggerClearSelection = () => {
    setSelectedFiles((prev) => (prev.length > 0 ? [] : prev));
  };

  const triggerRefresh = () => {
    validateApiCallback(onRefresh, "onRefresh");
    setClipBoard(null);
  };

  const triggerGridLayout = () => {
    setActiveLayout("grid");
  };
  const triggerListLayout = () => {
    setActiveLayout("list");
  };

  // Keypress detection will be disbaled when some Action is in active state.
  useKeyPress(shortcuts.createFolder, triggerCreateFolder, triggerAction.isActive);
  useKeyPress(shortcuts.uploadFiles, triggerUploadFiles, triggerAction.isActive);
  useKeyPress(shortcuts.cut, triggerCutItems, triggerAction.isActive);
  useKeyPress(shortcuts.copy, triggerCopyItems, triggerAction.isActive);
  useKeyPress(shortcuts.paste, triggerPasteItems, triggerAction.isActive);
  useKeyPress(shortcuts.rename, triggerRename, triggerAction.isActive);
  useKeyPress(shortcuts.download, triggerDownload, triggerAction.isActive);
  useKeyPress(shortcuts.delete, triggerDelete, triggerAction.isActive);
  useKeyPress(shortcuts.jumpToFirst, triggerSelectFirst, triggerAction.isActive);
  useKeyPress(shortcuts.jumpToLast, triggerSelectLast, triggerAction.isActive);
  useKeyPress(shortcuts.selectAll, triggerSelectAll, triggerAction.isActive);
  useKeyPress(shortcuts.clearSelection, triggerClearSelection, triggerAction.isActive);
  useKeyPress(shortcuts.refresh, triggerRefresh, triggerAction.isActive);
  useKeyPress(shortcuts.gridLayout, triggerGridLayout, triggerAction.isActive);
  useKeyPress(shortcuts.listLayout, triggerListLayout, triggerAction.isActive);
};

import ErrorTooltip from "@/components/fileManager-components/ErrorTooltip/ErrorTooltip";
import NameInput from "@/components/fileManager-components/NameInput/NameInput";
import { useFileNavigation } from "@/contexts/FileNavigationContext";
import { useLayout } from "@/contexts/LayoutContext";
import { useDetectOutsideClick } from "@/hooks/useDetectOutsideClick";
import { useTriggerAction } from "@/hooks/useTriggerAction";
import { FileManagerCreateOrUpdateType } from "@/types/fileManager/fileManager";
import { duplicateNameHandler } from "@/utils/fileManagerUtils/duplicateNameHandler";
import { validateApiCallBackCreate } from "@/utils/fileManagerUtils/validateApiCallBackCreate";
import { useEffect, useState, KeyboardEvent, ChangeEvent, MutableRefObject } from "react";

type CreateFolderActionProps = {
  filesViewRef: MutableRefObject<HTMLElement | null>;
  file: FileManagerCreateOrUpdateType;
  onCreateFolder: (file: FileManagerCreateOrUpdateType) => void;
  triggerAction: ReturnType<typeof useTriggerAction>
};

const maxNameLength = 220;

const CreateFolderAction = ({ filesViewRef, file, onCreateFolder, triggerAction }: CreateFolderActionProps) => {
  const [folderName, setFolderName] = useState<string>(file.name);
  const [folderNameError, setFolderNameError] = useState<boolean>(false);
  const [folderErrorMessage, setFolderErrorMessage] = useState<string>("");
  const [errorXPlacement, setErrorXPlacement] = useState<"right" | "left">("right");
  const [errorYPlacement, setErrorYPlacement] = useState<"top" | "bottom">("bottom");

  const outsideClick = useDetectOutsideClick((e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  });

  const { currentFolder, currentPathFiles, setCurrentPathFiles } = useFileNavigation();
  const { activeLayout } = useLayout();

  const handleFolderNameChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFolderName(e.target.value);
    setFolderNameError(false);
  };

  const handleValidateFolderName = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();

    if (e.key === "Enter") {
      e.preventDefault();
      handleFolderCreating();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      triggerAction.close();
      setCurrentPathFiles((prev) => prev.filter((f) => f.id !== file.id));
      return;
    }

    const invalidCharsRegex = /[\\/:*?"<>|]/;
    if (invalidCharsRegex.test(e.key)) {
      e.preventDefault();
      setFolderErrorMessage("Tên file không được chứa các ký tự đặc biệt như: \\ / : * ? \" < > |");
      setFolderNameError(true);
    } else {
      setFolderNameError(false);
      setFolderErrorMessage("");
    }
  };

  useEffect(() => {
    if (folderNameError) {
      const autoHideError = setTimeout(() => {
        setFolderNameError(false);
        setFolderErrorMessage("");
      }, 7000);

      return () => clearTimeout(autoHideError);
    }
  }, [folderNameError]);

  function handleFolderCreating() {
    let newFolderName = folderName.trim();
    const syncedCurrPathFiles = currentPathFiles.filter((f) => !(!!f.id && f.id === file.id) && !!f.id);

    const alreadyExists = syncedCurrPathFiles.find((f) => {
      return f.name.toLowerCase() === newFolderName.toLowerCase();
    });

    if (alreadyExists) {
      setFolderErrorMessage(`Đã tồn tại tên file là: '${newFolderName}'.`);
      setFolderNameError(true);
      outsideClick.ref.current?.focus();
      outsideClick.ref.current?.select();
      outsideClick.setIsClicked(false);
      return;
    }

    if (newFolderName === "") {
      newFolderName = duplicateNameHandler("New Folder", true, syncedCurrPathFiles);
    }

    validateApiCallBackCreate(onCreateFolder, "onCreateFolder", newFolderName, currentFolder);
    setCurrentPathFiles((prev) => prev.filter((f) => f.id !== file.id));
    triggerAction.close();
  }

  useEffect(() => {
    outsideClick.ref.current?.focus();
    outsideClick.ref.current?.select();

    if (outsideClick.ref?.current && filesViewRef.current) {
      const errorMessageWidth = 292 + 8 + 8 + 5;
      const errorMessageHeight = 56 + 20 + 10 + 2;
      const filesContainerRect = filesViewRef.current.getBoundingClientRect();
      const nameInputContainerRect = outsideClick.ref.current.getBoundingClientRect();

      const rightAvailableSpace = filesContainerRect.right - nameInputContainerRect.left;
      rightAvailableSpace > errorMessageWidth
        ? setErrorXPlacement("right")
        : setErrorXPlacement("left");

      const bottomAvailableSpace =
        filesContainerRect.bottom - (nameInputContainerRect.top + outsideClick.ref.current.clientHeight);
      bottomAvailableSpace > errorMessageHeight
        ? setErrorYPlacement("bottom")
        : setErrorYPlacement("top");
    }
  }, []);

  useEffect(() => {
    if (outsideClick.isClicked) {
      handleFolderCreating();
    }
  }, [outsideClick.isClicked]);

  return (
    <>
      <NameInput
        nameInputRef={outsideClick.ref}
        maxLength={maxNameLength}
        value={folderName}
        onChange={handleFolderNameChange}
        onKeyDown={handleValidateFolderName}
        onClick={(e) => e.stopPropagation()}
        {...(activeLayout === "list" && { rows: 1 })}
      />
      {folderNameError && (
        <ErrorTooltip
          message={folderErrorMessage}
          xPlacement={errorXPlacement}
          yPlacement={errorYPlacement}
        />
      )}
    </>
  );
};

export default CreateFolderAction;
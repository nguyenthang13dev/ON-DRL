import React, { useEffect, useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import Button from "@/components/fileManager-components/Button/Button";
import Modal from "@/components/fileManager-components/Modal/Modal";
import { getFileExtension } from "@/utils/fileManagerUtils/getFileExtension";
import NameInput from "@/components/fileManager-components/NameInput/NameInput";
import ErrorTooltip from "@/components/fileManager-components/ErrorTooltip/ErrorTooltip";
import { useFileNavigation } from "@/contexts/FileNavigationContext";
import { useLayout } from "@/contexts/LayoutContext";
import { validateApiCallback } from "@/utils/fileManagerUtils/validateApiCallback";
import { useDetectOutsideClick } from "@/hooks/useDetectOutsideClick";
import { FileManagerType } from "@/types/fileManager/fileManager";
import { useTriggerAction } from "@/hooks/useTriggerAction";

// Định nghĩa kiểu dữ liệu cho props và state
interface RenameActionProps {
  filesViewRef: React.RefObject<HTMLElement>;
  file: FileManagerType;
  onRename?: (file: FileManagerType, newName: string) => void;
  triggerAction: ReturnType<typeof useTriggerAction>
}

const maxNameLength = 220;

const RenameAction: React.FC<RenameActionProps> = ({
  filesViewRef,
  file,
  onRename,
  triggerAction,
}) => {
  const [renameFile, setRenameFile] = useState<string>(file?.name);
  const [renameFileWarning, setRenameFileWarning] = useState<boolean>(false);
  const [fileRenameError, setFileRenameError] = useState<boolean>(false);
  const [renameErrorMessage, setRenameErrorMessage] = useState<string>("");
  const [errorXPlacement, setErrorXPlacement] = useState<"left" | "right">("right");
  const [errorYPlacement, setErrorYPlacement] = useState<"top" | "bottom">("bottom");
  const { currentPathFiles, setCurrentPathFiles } = useFileNavigation();
  const { activeLayout } = useLayout();

  const { ref: outsideClickRef, isClicked, setIsClicked } = useDetectOutsideClick(
    (e, ref) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsClicked(true);
      }
    }
  ) as { ref: React.RefObject<HTMLTextAreaElement>; isClicked: boolean; setIsClicked: React.Dispatch<React.SetStateAction<boolean>> };

  const handleValidateFolderRename = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.preventDefault();
      setIsClicked(true);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setCurrentPathFiles((prev) =>
        prev.map((f) => {
          if (f.id === file.id) {
            f.isEditing = false;
          }
          return f;
        })
      );
      triggerAction.close();
      return;
    }

    const invalidCharsRegex = /[\\/:*?"<>|]/;
    if (invalidCharsRegex.test(e.key)) {
      e.preventDefault();
      setRenameErrorMessage(
        "Tên tệp tin không được chứa những kí tự sau: \\ / : * ? \" < > |"
      );
      setFileRenameError(true);
    } else {
      setFileRenameError(false);
    }
  };

  // Auto hide error message after 7 seconds
  useEffect(() => {
    if (fileRenameError) {
      const autoHideError = setTimeout(() => {
        setFileRenameError(false);
        setRenameErrorMessage("");
      }, 7000);

      return () => clearTimeout(autoHideError);
    }
  }, [fileRenameError]);

  function handleFileRenaming(isConfirmed: boolean) {
    if (renameFile === "" || renameFile === file.name) {
      setCurrentPathFiles((prev) =>
        prev.map((f) => {
          if (f.id === file.id) {
            f.isEditing = false;
          }
          return f;
        })
      );
      triggerAction.close();
      return;
    } else if (currentPathFiles.some((f) => f.name === renameFile)) {
      setFileRenameError(true);
      setRenameErrorMessage(`Đã tồn tại tên tệp tin là '${renameFile}'.`);
      setIsClicked(false);
      return;
    } else if (!file.isDirectory && !isConfirmed) {
      const fileExtension = getFileExtension(file.name);
      const renameFileExtension = getFileExtension(renameFile);
      if (fileExtension !== renameFileExtension) {
        setRenameFileWarning(true);
        return;
      }
    }
    setFileRenameError(false);
    validateApiCallback(onRename, "onRename", file, renameFile);
    setCurrentPathFiles((prev) => prev.filter((f) => f.id !== file.id)); // Todo: Should only filter on success API call
    triggerAction.close();
  }

  const focusName = () => {
    const inputElement = outsideClickRef?.current as HTMLTextAreaElement;

    inputElement?.focus();

    if (file.isDirectory) {
      inputElement?.select();
    } else {
      const fileExtension = getFileExtension(file.name);
      const fileNameLength = file.name.length - fileExtension.length - 1;
      inputElement?.setSelectionRange(0, fileNameLength);
    }
  };

  useEffect(() => {
    focusName();

    // Dynamic Error Message Placement based on available space
    if (outsideClickRef?.current) {
      const errorMessageWidth = 292 + 8 + 8 + 5; // 8px padding on left and right + additional 5px for gap
      const errorMessageHeight = 56 + 20 + 10 + 2; // 20px :before height
      const filesContainer = filesViewRef.current;
      const filesContainerRect = filesContainer?.getBoundingClientRect();
      const renameInputContainer = outsideClickRef.current;
      const renameInputContainerRect = renameInputContainer.getBoundingClientRect();

      const rightAvailableSpace = filesContainerRect!.right - renameInputContainerRect.left;
      rightAvailableSpace > errorMessageWidth
        ? setErrorXPlacement("right")
        : setErrorXPlacement("left");

      const bottomAvailableSpace =
        filesContainerRect!.bottom - (renameInputContainerRect.top + renameInputContainer.clientHeight);
      bottomAvailableSpace > errorMessageHeight
        ? setErrorYPlacement("bottom")
        : setErrorYPlacement("top");
    }
  }, []);

  useEffect(() => {
    if (isClicked) {
      handleFileRenaming(false);
    }
    focusName();
  }, [isClicked]);

  return (
    <>
      <NameInput
        nameInputRef={outsideClickRef}
        maxLength={maxNameLength}
        value={renameFile}
        onChange={(e) => {
          setRenameFile(e.target.value);
          setFileRenameError(false);
        }}
        onKeyDown={handleValidateFolderRename}
        onClick={(e) => e.stopPropagation()}
        {...(activeLayout === "list" && { rows: 1 })}
      />
      {fileRenameError && (
        <ErrorTooltip
          message={renameErrorMessage}
          xPlacement={errorXPlacement}
          yPlacement={errorYPlacement}
        />
      )}

      <Modal
        heading={"Rename"}
        show={renameFileWarning}
        setShow={setRenameFileWarning}
        dialogWidth={"25vw"}
        closeButton={false}
      >
        <div className="fm-rename-folder-container">
          <div className="fm-rename-folder-input">
            <div className="fm-rename-warning">
              <IoWarningOutline size={70} color="orange" />
              <div>
                Nếu bạn thay đổi đuôi tệp tin thì có thể tệp tin sẽ không sử dụng được. Bạn có chắc muốn thay đổi không?
              </div>
            </div>
          </div>
          <div className="fm-rename-folder-action">
            <Button
              type="secondary"
              onClick={() => {
                setCurrentPathFiles((prev) =>
                  prev.map((f) => {
                    if (f.id === file.id) {
                      f.isEditing = false;
                    }
                    return f;
                  })
                );
                setRenameFileWarning(false);
                triggerAction.close();
              }}
            >
              Không
            </Button>
            <Button
              type="danger"
              onClick={() => {
                setRenameFileWarning(false);
                handleFileRenaming(true);
              }}
            >
              Đồng ý
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RenameAction;

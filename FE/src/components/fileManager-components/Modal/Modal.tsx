import React, { useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import "./Modal.scss";

type ModalProps = {
  children: React.ReactNode;
  show: boolean;
  setShow: (show: boolean) => void;
  heading: string;
  dialogWidth?: string;
  contentClassName?: string;
  closeButton?: boolean;
};

const Modal: React.FC<ModalProps> = ({
  children,
  show,
  setShow,
  heading,
  dialogWidth = "25%",
  contentClassName = "",
  closeButton = true,
}) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  // Chỉnh sửa kiểu sự kiện thành KeyboardEvent
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") {
      setShow(false);
    }
  };

  useEffect(() => {
    if (show && modalRef.current) {
      modalRef.current.showModal();
    } else if (modalRef.current) {
      modalRef.current.close();
    }
  }, [show]);

  return (
    <dialog
      ref={modalRef}
      className={`fm-modal dialog ${contentClassName}`}
      style={{ width: dialogWidth }}
      onKeyDown={handleKeyDown}
    >
      <div className="fm-modal-header">
        <span className="fm-modal-heading">{heading}</span>
        {closeButton && (
          <MdClose size={30} onClick={() => setShow(false)} className="close-icon" title="Close" />
        )}
      </div>
      <div style={{ overflow: "auto" }}>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;

import React, { useEffect, useState } from "react";
import { useSelection } from "@/contexts/SelectionContext";
import Button from "@/components/fileManager-components/Button/Button";
import { FileManagerType, FileSecurityType } from "@/types/fileManager/fileManager";
import Modal from "@/components/fileManager-components/Modal/Modal";

interface DeleteModalProps {
    show: boolean,
    setShow: (show: boolean) => void,
    onDelete: (fileSecurityTarget?: FileSecurityType) => void,
    fileSecurityTarget?: FileSecurityType
}

const DeleteModal: React.FC<DeleteModalProps> = ({ show, setShow, onDelete, fileSecurityTarget }) => {

    const handleDeleting = () => {
        setShow(false);
        onDelete(fileSecurityTarget);
    };

    return (
        <Modal
            heading="Xóa"
            show={show}
            setShow={setShow}
            dialogWidth="40vw"
            closeButton={true}
        >
            <div className="p-3">Bạn có chắc chắn muốn xóa {fileSecurityTarget?.sharedToName} ? </div>

            <div className="flex justify-content-end gap-2 p-3">
                <Button type="secondary" onClick={() => { setShow(false) }}>
                    Hủy
                </Button>
                <Button type="danger" onClick={() => { handleDeleting() }}>
                    Xóa
                </Button>
            </div>


        </Modal >
    );
};

export default DeleteModal;

import Button from "@/components/fileManager-components/Button/Button";
import { useSelection } from "@/contexts/SelectionContext";
import { useTriggerAction } from "@/hooks/useTriggerAction";
import { useEffect, useState } from "react";
import "./Share.action.scss";
import { FileSecurityType } from "@/types/fileManager/fileManager";
import { FaUser, FaUsers } from "react-icons/fa6";
import FileManagerShareTypeConstant from "@/constants/FileManagerShareTypeConstant";
import { FileManagerService } from "@/services/fileManager/fileManager.service";
import { toast } from "react-toastify";
import CreateModal from "./CreateModal";
import { DropdownOption } from "@/types/general";
import DeleteModal from "./DeleteModal";
import { Select } from "antd";

interface ShareProps {
    triggerAction: ReturnType<typeof useTriggerAction>;
    onShare: (fileSecuties: FileSecurityType[], fileID: string) => void;
}

interface DropdownUpgrade extends DropdownOption {
    sharedToType: string;
}

const ShareAction: React.FC<ShareProps> = ({ triggerAction, onShare }) => {
    const { selectedFiles, setSelectedFiles, } = useSelection();
    const [shareTargets, setShareTargets] = useState<FileSecurityType[]>([]);
    const [selectedShareTarget, setSelectedShareTarget] = useState<FileSecurityType>();
    const [isOpenCreatModal, setIsOpenCreatModal] = useState(false);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const [dropdownPermission, setDropdownPermission] = useState<DropdownOption[]>([]);

    const fileID = selectedFiles?.[0]?.id;

    const handleSave = () => {
        onShare(shareTargets, fileID);
        setTimeout(() => {
            setSelectedFiles([]);
        }, 500);
        triggerAction.close();
    }

    const syncShareTarget = (updatedTarget: FileSecurityType) => {
        setShareTargets((prevTargets) =>
            prevTargets.map((target) =>
                target.sharedToID === updatedTarget.sharedToID && target.sharedToType === updatedTarget.sharedToType ? updatedTarget : target
            )
        );
    };

    const loadShareTargets = async () => {
        if (!fileID) return;
        try {
            const rs = await FileManagerService.GetSecurity(fileID);
            if (rs.status) {
                setShareTargets(rs.data);
                console.log("Share targets loaded successfully:", rs.data);
            } else {
                toast.error("Đã xảy ra lỗi khi lấy thông tin")
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi khi lấy thông tin")
        }
    };

    const handleCreate = (selectedItems: DropdownUpgrade[]) => {
        const existingKeys = new Set(
            shareTargets.map(item => `${item.sharedToID}-${item.sharedToType}`)
        );
        const newTargets: FileSecurityType[] = selectedItems
            .filter(item => !existingKeys.has(`${item.value}-${item.sharedToType}`))
            .map(item => ({
                fileID: fileID,
                sharedToID: item.value,
                sharedToName: item.label,
                sharedToType: item.sharedToType,
            }));

        if (newTargets.length > 0) {
            setShareTargets(prev => [...prev, ...newTargets]);
            toast.success(`Đã thêm ${newTargets.length} đối tượng mới`);
        } else {
            toast.info("Tất cả đối tượng đã tồn tại");
        }

    }

    const handleDelete = (fileSharedTarget?: FileSecurityType) => {
        if (!fileSharedTarget) {
            toast.warning("Chưa chọn đối tượng");
        }
        setShareTargets(prev =>
            prev.filter(
                item =>
                    !(item.sharedToID === fileSharedTarget?.sharedToID &&
                        item.sharedToType === fileSharedTarget?.sharedToType)
            )
        );

        // Nếu đối tượng bị xóa đang được chọn, thì bỏ chọn
        if (
            selectedShareTarget?.sharedToID === fileSharedTarget?.sharedToID &&
            selectedShareTarget?.sharedToType === fileSharedTarget?.sharedToType
        ) {
            setSelectedShareTarget(undefined);
        }

        toast.success("Đã xóa đối tượng khỏi danh sách");
    };

    const handleOpenModalDelete = () => {
        if (!selectedShareTarget) {
            toast.warning("Chưa có đối tượng nào được chọn")
            setIsOpenDeleteModal(false);
        } else {
            setIsOpenDeleteModal(true);
        }
    }

    useEffect(() => {
        loadShareTargets();

        const dropdownP: DropdownOption[] = [
            { value: "NguoiChinhSua", label: "Quyền chỉnh sửa" },
            { value: "NguoiXem", label: "Quyền xem" }]
        setDropdownPermission(dropdownP);
    }, [])

    return (
        <div className="file-share">
            <div className="border p-2 bg-white mt-2 mb-1">
                <div className="font-semibold mb-1">Những đối tượng được phân quyền/ chia sẻ</div>
                <div className="max-h-60 overflow-y-auto border border-gray-300 min-h-[80px]">
                    {shareTargets.length >= 1 ? (
                        shareTargets.map((target) => (
                            <div
                                key={target.sharedToID + target.sharedToType}
                                className={`flex items-center p-2 cursor-pointer hover:bg-blue-100 ${selectedShareTarget?.sharedToID === target.sharedToID
                                    && selectedShareTarget.sharedToType === target.sharedToType ? "bg-blue-200" : ""
                                    }`}
                                onClick={() => setSelectedShareTarget(target)}
                            >
                                {target.sharedToType === FileManagerShareTypeConstant.USER ? (
                                    <FaUser className="w-4 h-4 text-gray-600 mr-2" />
                                ) : (
                                    <FaUsers className="w-4 h-4 text-gray-600 mr-2" />
                                )}
                                <span className="text-sm text-gray-800">{target.sharedToName}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-400 text-sm p-2">Chưa có đối tượng nào</div>
                    )}
                </div>
            </div>
            <div className="flex justify-content-end mb-4 gap-2">
                <Button type="danger" onClick={() => { handleOpenModalDelete() }}>
                    Xóa
                </Button>
                <Button type="primary" onClick={() => { setIsOpenCreatModal(true) }}>
                    Thêm
                </Button>
            </div>


            <div className="border p-2 bg-white mt-2 mb-4">
                <div className="font-semibold mb-1">Phân quyền/ chia sẻ cho: {selectedShareTarget?.sharedToName}</div>
                {shareTargets.length >= 1 && (
                    <div className="">
                        <Select
                            value={selectedShareTarget?.permission}
                            placeholder="Chọn quyền"
                            options={dropdownPermission}
                            allowClear={true}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            className="w-full"
                            dropdownStyle={{ maxHeight: 300, overflow: "auto" }}
                            onChange={(value) =>
                                setSelectedShareTarget((prev) => {
                                    if (!prev) return prev;
                                    const updatedTarget: FileSecurityType = {
                                        ...prev,
                                        permission: value,
                                    };
                                    syncShareTarget(updatedTarget);
                                    return updatedTarget;
                                })
                            }
                        >
                        </Select>
                    </div>
                )}
            </div>



            <div className="file-share-actions">
                <Button type="secondary" onClick={() => triggerAction.close()}>
                    Hủy
                </Button>
                <Button type="primary" onClick={handleSave}>Áp dụng</Button>
            </div>

            <CreateModal
                show={isOpenCreatModal}
                setShow={setIsOpenCreatModal}
                onComplete={handleCreate} />

            <DeleteModal
                show={isOpenDeleteModal}
                setShow={setIsOpenDeleteModal}
                onDelete={handleDelete}
                fileSecurityTarget={selectedShareTarget} />

        </div >

    );
};

export default ShareAction;

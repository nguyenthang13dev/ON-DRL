import Button from "@/components/fileManager-components/Button/Button";
import Modal from "@/components/fileManager-components/Modal/Modal";
import FileManagerShareTypeConstant from "@/constants/FileManagerShareTypeConstant";
import { removeAccents } from "@/libs/CommonFunction";
import { FileManagerService } from "@/services/fileManager/fileManager.service";
import { DropdownOption } from "@/types/general";
import { Select } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";


interface DropdownUpgrade extends DropdownOption {
    sharedToType: string;
}

interface CreateModalProps {
    show: boolean,
    setShow: (show: boolean) => void,
    onComplete: (selectedItems: DropdownUpgrade[]) => void;
}


const CreateModal: React.FC<CreateModalProps> = ({ show, setShow, onComplete }) => {

    const [dropdownUser, setDropdownUser] = useState<DropdownOption[]>([]);
    const [dropdownRole, setDropdownRole] = useState<DropdownOption[]>([]);
    const [dropdownDepartment, setDropdownDepartment] = useState<DropdownOption[]>([]);
    const [selectedItems, setSelectedItems] = useState<DropdownUpgrade[]>([]);

    const getDropownObject = async () => {
        try {
            const rs = await FileManagerService.GetDropdownObject();
            if (rs.status) {
                setDropdownUser(rs.data.dropdownUser.result);
                setDropdownRole(rs.data.dropdownRole.result);
                setDropdownDepartment(rs.data.dropdownDepartment.result);
            } else {
                toast.error("Đã xảy ra lỗi khi lấy dữ liệu")
            }
        } catch {
            toast.error("Đã xảy ra lỗi khi lấy dữ liệu")
        }
    }

    const handleChooseObject: (type: string, value: string, option?: any) => Promise<void> = async (type, value, option) => {
        if (!type || !value) return;

        const selectedItem = {
            value,
            label: option?.label || value,
            sharedToType: type
        };

        if (option) {
            if (!selectedItems.some(item => item.value === value && item.sharedToType === type)) {

                setSelectedItems(prevItems => [...prevItems, selectedItem]);
            }
        } else {
            setSelectedItems(prevItems => prevItems.filter(item => item.value !== value || item.sharedToType !== type));
        }
    }

    const handleComplete = () => {
        onComplete(selectedItems);
        setSelectedItems([]);
        setShow(false);
    };


    useEffect(() => {
        getDropownObject();
    }, [])


    return (
        <Modal
            heading="Thêm đối tượng được phân quyền/ chia sẻ tệp tin"
            show={show}
            setShow={setShow}
            dialogWidth="40vw"
            closeButton={true}
        >
            <div className="space-y-4 p-3"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700">Chọn người dùng</label>
                    <Select
                        mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        options={dropdownUser}
                        placeholder="Chọn người dùng"
                        allowClear
                        value={selectedItems
                            .filter(i => i.sharedToType === FileManagerShareTypeConstant.USER)
                            .map(i => i.value)}
                        dropdownStyle={{ maxHeight: 300, overflow: "auto" }}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                        onSelect={(value, option) => { handleChooseObject(FileManagerShareTypeConstant.USER, value, option,) }}
                        onDeselect={(value) => { handleChooseObject(FileManagerShareTypeConstant.USER, value) }}
                        filterOption={(input, option) => {
                            return removeAccents(option?.label ?? "")
                                .toLowerCase()
                                .includes(removeAccents(input).toLowerCase());
                        }}
                        listHeight={120}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Chọn nhóm quyền</label>
                    <Select
                        mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        options={dropdownRole}
                        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                        placeholder="Chọn nhóm quyền"
                        allowClear
                        value={selectedItems
                            .filter(i => i.sharedToType === FileManagerShareTypeConstant.ROLE)
                            .map(i => i.value)}
                        getPopupContainer={(trigger) => trigger.parentElement}
                        onSelect={(value, option) => { handleChooseObject(FileManagerShareTypeConstant.ROLE, value, option,) }}
                        onDeselect={(value) => { handleChooseObject(FileManagerShareTypeConstant.ROLE, value) }}
                        filterOption={(input, option) => {
                            return removeAccents(option?.label ?? "")
                                .toLowerCase()
                                .includes(removeAccents(input).toLowerCase());
                        }}
                        listHeight={120}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Chọn phòng ban/ đơn vị</label>
                    <Select
                        mode="multiple"
                        showSearch
                        style={{ width: "100%" }}
                        options={dropdownDepartment}
                        placeholder="Chọn phòng ban/ đơn vị"
                        allowClear
                        value={selectedItems
                            .filter(i => i.sharedToType === FileManagerShareTypeConstant.DEPARTMENT)
                            .map(i => i.value)}
                        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                        getPopupContainer={(trigger) => trigger.parentElement}
                        onSelect={(value, option) => { handleChooseObject(FileManagerShareTypeConstant.DEPARTMENT, value, option,) }}
                        onDeselect={(value) => { handleChooseObject(FileManagerShareTypeConstant.DEPARTMENT, value) }}
                        filterOption={(input, option) => {
                            return removeAccents(option?.label ?? "")
                                .toLowerCase()
                                .includes(removeAccents(input).toLowerCase());
                        }}
                        listHeight={120}
                    />
                </div>
            </div>

            <div className="flex justify-end p-3">
                <Button type="primary" onClick={() => { handleComplete() }}>Hoàn tất</Button>
            </div>

        </Modal >
    );
}

export default CreateModal;




import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Form, Input, InputNumber, Modal, Select} from 'antd';
import {SaveOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import arcTransferService from '@/services/arcTransfer/arcTransferService';
import {ArcTransferType, FilePathDto} from '@/types/arcTransfer/arcTransfer';
import {DropdownOption} from '@/types/general';
import {userService} from '@/services/user/user.service';
import {departmentService} from '@/services/department/department.service';
import {toast} from 'react-toastify';
import type {UploadFile} from 'antd/es/upload';
import UploadFiler from "@/libs/UploadFilter";

interface ArcTransferModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    initialValues?: Partial<ArcTransferType>;
    isEdit?: boolean;
}

const ArcTransferModal: React.FC<ArcTransferModalProps> = ({
                                                               visible,
                                                               onCancel,
                                                               onSuccess,
                                                               initialValues = {},
                                                               isEdit = false,
                                                           }) => {
    const [form] = Form.useForm<ArcTransferType>();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<DropdownOption[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [departments, setDepartments] = useState<DropdownOption[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
    const [allUploadedFileDtos, setAllUploadedFileDtos] = useState<FilePathDto[]>([]);

    useEffect(() => {
        if (visible) {
            form.resetFields();
            setFileList([]);
            setUploadedFileIds([]);
            setAllUploadedFileDtos([]);

            if (initialValues && Object.keys(initialValues).length > 0) {
                const {bienBanDinhKem, taiLieuDinhKem, ...restOfInitialValues} = initialValues;

                form.setFieldsValue({
                    ...restOfInitialValues,
                    ngayGiaoNhan: initialValues.ngayGiaoNhan ? dayjs(initialValues.ngayGiaoNhan) : null,
                });

                if (bienBanDinhKem?.length) {
                    const initialDtos = bienBanDinhKem as FilePathDto[];
                    setAllUploadedFileDtos(initialDtos);
                    setUploadedFileIds(initialDtos.map(f => f.id));

                    const initialUiFileList = initialDtos.map(file => ({
                        uid: file.id,
                        name: file.tenTaiLieu || 'File',
                        status: 'done',
                        url: file.duongDanFile,
                        response: {data: [file]}, // Store the full FilePathDto
                    } as UploadFile));
                    setFileList(initialUiFileList);
                }
            }
        } else {
            // Clear states when modal is not visible
            form.resetFields();
            setFileList([]);
            setUploadedFileIds([]);
            setAllUploadedFileDtos([]);
        }
    }, [visible, initialValues, form]);

    // Effect to sync uploadedFileIds (IDs) to the form field `taiLieuDinhKem`
    useEffect(() => {
        form.setFieldsValue({taiLieuDinhKem: uploadedFileIds});
    }, [uploadedFileIds, form]);


    // Fetch dropdown data when the modal opens
    useEffect(() => {
        if (!visible) return;
        const fetchInitialData = async () => {
            setLoadingDepartments(true);
            setLoadingUsers(true);
            try {
                const [depts, usersResp] = await Promise.all([
                    departmentService.getDropDown(''),
                    userService.getDropdown(),
                ]);
                if (depts?.status && depts.data) setDepartments(depts.data);
                if (usersResp?.status && usersResp.data) setUsers(usersResp.data);
            } catch (e) {
                console.error('Failed to load dropdowns', e);
            } finally {
                setLoadingDepartments(false);
                setLoadingUsers(false);
            }
        };
        fetchInitialData();
    }, [visible]);

    const handleSuccessFromUploader = (newlyUploadedDtos: FilePathDto[]) => {
        if (newlyUploadedDtos && newlyUploadedDtos.length > 0) {
            setAllUploadedFileDtos(prevDtos => {
                const dtosToAdd = newlyUploadedDtos.filter(ndto => !prevDtos.some(pdto => pdto.id === ndto.id));
                return [...prevDtos, ...dtosToAdd];
            });
            setUploadedFileIds(prevIds => {
                const newIds = newlyUploadedDtos.map(dto => dto.id);
                const uniqueNewIds = newIds.filter(id => !prevIds.includes(id));
                return [...prevIds, ...uniqueNewIds];
            });
        }
    };

    const handleSubmit = async () => {
        try {
            await form.validateFields();
            setLoading(true);

            const formValues = form.getFieldsValue(true);
            const filesToSubmit = allUploadedFileDtos.filter(dto => uploadedFileIds.includes(dto.id));

            const submitData: ArcTransferType = {
                ...formValues,
                taiLieuDinhKem: filesToSubmit.map(dto => dto.id),
            };

            const response = isEdit && initialValues.id
                ? await arcTransferService.updateArcTransfer(initialValues.id, submitData)
                : await arcTransferService.createArcTransfer(submitData);

            if (response?.status) {
                toast.success(isEdit ? 'Cập nhật thành công' : 'Tạo mới thành công');
                onSuccess();
                onCancel();
            }
        } catch (errorInfo: any) {
            toast.error('Kiểm tra lại thông tin nhập'); // Show toast immediately
            if (errorInfo && errorInfo.errorFields && errorInfo.errorFields.length > 0) {
                const fieldNamePath = errorInfo.errorFields[0].name;
                const fieldId = Array.isArray(fieldNamePath) ? fieldNamePath.join('_') : String(fieldNamePath);
                const inputElement = document.getElementById(fieldId);

                let elementToScroll: HTMLElement | null = null;

                if (inputElement) {
                    const formItemElement = inputElement.closest<HTMLElement>('.ant-form-item');
                    if (formItemElement) {
                        elementToScroll = formItemElement;

                        const formSectionElement = formItemElement.closest<HTMLElement>('.form-section');
                        if (formSectionElement) {
                            const sectionTitleElement = formSectionElement.querySelector<HTMLElement>('.section-title');
                            if (sectionTitleElement) {
                                const position = sectionTitleElement.compareDocumentPosition(formItemElement);
                                if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
                                    elementToScroll = sectionTitleElement;
                                }
                            }
                        }
                    } else {
                        elementToScroll = inputElement;
                    }
                }

                if (elementToScroll) {
                    elementToScroll.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                } else {
                    form.scrollToField(fieldNamePath, {
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            }
        } finally {

            if (form.getFieldsError().length === 0) {
                setLoading(false);
            } else {
                setLoading(false);
            }
        }
    };

    return (
        <Modal
            title={
                <div className="modal-title">
                    <span className="text-xl font-semibold text-primary block text-center w-full">
                        {isEdit ? 'Chỉnh sửa biên bản bàn giao' : 'Thêm mới biên bản bàn giao'}
                    </span>
                </div>
            }
            open={visible}
            width={800}
            onCancel={onCancel}
            className="arc-transfer-modal"
            footer={[
                <Button key="back" onClick={onCancel} className="px-5">Hủy</Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    icon={<SaveOutlined/>}
                    onClick={handleSubmit}
                    className="px-5 ml-3"
                >
                    {isEdit ? 'Cập nhật' : 'Tạo mới'}
                </Button>,
            ]}
            styles={{
                header: {
                    padding: '16px 24px',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: '#fafafa',
                    borderRadius: '8px 8px 0 0'
                },
                body: {
                    padding: '24px',
                },
                footer: {
                    borderTop: '1px solid #f0f0f0',
                    padding: '12px 24px',
                    backgroundColor: '#fafafa',
                    borderRadius: '0 0 8px 8px'
                }
            }}
        >
            <Form
                form={form}
                layout="vertical"
                className="form-container"
            >
                <Form.Item name="id" hidden={true}>
                    <Input type="hidden"/>
                </Form.Item>

                <Form.Item name="bienBanDinhKem" hidden={true}>
                    <Input type="hidden"/>
                </Form.Item>

                <div className="form-section">
                    <div className="section-title">Thông tin cơ bản</div>
                    <Form.Item
                        name="tenKhoiTaiLieu"
                        label="Tên khối tài liệu"
                        rules={[
                            {required: true, message: 'Vui lòng nhập tên khối tài liệu'},
                            {max: 200, message: 'Tên khối tài liệu không được vượt quá 200 ký tự'}
                        ]}
                    >
                        <Input className="rounded-md"/>
                    </Form.Item>

                    <Form.Item
                        name="canCu"
                        label="Căn cứ"
                        rules={[
                            {required: true, message: 'Vui lòng nhập căn cứ'},
                            {max: 1000, message: 'Căn cứ không được vượt quá 1000 ký tự'}
                        ]}
                    >
                        <Input.TextArea rows={3} className="rounded-md"/>
                    </Form.Item>
                </div>

                <div className="form-section">
                    <div className="section-title">Thông tin người giao/nhận</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="userIDGiao"
                            label="Người giao"
                            rules={[{required: true, message: 'Vui lòng chọn người giao'}]}
                        >
                            <Select
                                placeholder="Chọn người giao"
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                                }
                                optionFilterProp="label"
                                loading={loadingUsers}
                                options={users.map(user => ({
                                    label: user.label,
                                    value: user.value,
                                }))}
                                className="rounded-md"
                            />
                        </Form.Item>

                        <Form.Item
                            name="chucVuGiao"
                            label="Chức vụ người giao"
                            rules={[
                                {required: true, message: 'Vui lòng nhập chức vụ người giao'},
                                {max: 100, message: 'Chức vụ không được vượt quá 100 ký tự'}
                            ]}
                        >
                            <Input className="rounded-md"/>
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="userIDNhan"
                            label="Người nhận"
                            rules={[{required: true, message: 'Vui lòng chọn người nhận'}]}
                        >
                            <Select
                                placeholder="Chọn người nhận"
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                                }
                                optionFilterProp="label"
                                loading={loadingUsers}
                                options={users.map(user => ({
                                    label: user.label,
                                    value: user.value,
                                }))}
                                className="rounded-md"
                            />
                        </Form.Item>

                        <Form.Item
                            name="chucVuNhan"
                            label="Chức vụ người nhận"
                            rules={[
                                {required: true, message: 'Vui lòng nhập chức vụ người nhận'},
                                {max: 100, message: 'Chức vụ không được vượt quá 100 ký tự'}
                            ]}
                        >
                            <Input className="rounded-md"/>
                        </Form.Item>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-title">Thông tin hồ sơ</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="tongSoHop"
                            label="Tổng số hộp"
                            rules={[
                                {required: true, message: 'Vui lòng nhập tổng số hộp'},
                                {type: 'number', max: 99999, message: 'Tổng số hộp không được vượt quá 99999'}
                            ]}
                        >
                            <InputNumber style={{width: '100%'}} min={0} max={99999} className="rounded-md"/>
                        </Form.Item>

                        <Form.Item
                            name="tongSoHoSo"
                            label="Tổng số hồ sơ"
                            rules={[
                                {required: true, message: 'Vui lòng nhập tổng số hồ sơ'},
                                {type: 'number', max: 99999, message: 'Tổng số hồ sơ không được vượt quá 99999'}
                            ]}
                        >
                            <InputNumber style={{width: '100%'}} min={0} max={99999} className="rounded-md"/>
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="soMetHoSo"
                            label="Số mét hồ sơ"
                            rules={[
                                {required: true, message: 'Vui lòng nhập số mét hồ sơ'},
                                {type: 'number', message: 'Vui lòng nhập số hợp lệ'}
                            ]}
                        >
                            <InputNumber
                                style={{width: '100%'}}
                                min={0}
                                step={0.01}
                                precision={2}
                                className="rounded-md"
                            />
                        </Form.Item>

                        <Form.Item
                            name="thoiGianHoSo"
                            label="Thời gian hồ sơ"
                            rules={[
                                {required: true, message: 'Vui lòng nhập thời gian hồ sơ'},
                                {max: 200, message: 'Thời gian hồ sơ không được vượt quá 200 ký tự'}
                            ]}
                        >
                            <Input className="rounded-md"/>
                        </Form.Item>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-title">Thông tin hồ sơ điện tử</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="tongSoHoSoDienTu"
                            label="Tổng số hồ sơ điện tử"
                            rules={[
                                {required: true, message: 'Vui lòng nhập tổng số hồ sơ điện tử'},
                                {type: 'number', max: 99999, message: 'Tổng số hồ sơ điện tử không được vượt quá 99999'}
                            ]}
                        >
                            <InputNumber style={{width: '100%'}} min={0} max={99999} className="rounded-md"/>
                        </Form.Item>

                        <Form.Item
                            name="tongSoTepTin"
                            label="Tổng số tệp tin"
                            rules={[
                                {required: true, message: 'Vui lòng nhập tổng số tệp tin'},
                                {type: 'number', max: 99999, message: 'Tổng số tệp tin không được vượt quá 99999'}
                            ]}
                        >
                            <InputNumber style={{width: '100%'}} min={0} max={99999} className="rounded-md"/>
                        </Form.Item>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-title">Thông tin giao nhận</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            name="ngayGiaoNhan"
                            label="Ngày giao nhận"
                            rules={[{required: true, message: 'Vui lòng chọn ngày giao nhận'}]}
                        >
                            <DatePicker style={{width: '100%'}} format="DD/MM/YYYY" className="rounded-md"/>
                        </Form.Item>

                        <Form.Item
                            name="nguonGiaoNhan"
                            label="Nguồn giao nhận"
                            rules={[{required: true, message: 'Vui lòng chọn nguồn giao nhận'}]}
                        >
                            <Select
                                placeholder="Chọn nguồn giao nhận"
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    (option?.label?.toString().toLowerCase() ?? '').includes(input.toLowerCase())
                                }
                                optionFilterProp="label"
                                loading={loadingDepartments}
                                options={departments.map(dept => ({
                                    label: dept.label,
                                    value: dept.value,
                                }))}
                                className="rounded-md"
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="tinhTrangTaiLieu"
                        label="Tình trạng tài liệu"
                        rules={[{required: true, message: 'Vui lòng nhập tình trạng tài liệu'}]}
                    >
                        <Input.TextArea rows={3} className="rounded-md"/>
                    </Form.Item>
                    <Form.Item name="taiLieuDinhKem" label="Tệp đính kèm">
                        <UploadFiler
                            maxFiles={10}
                            uploadType="drag"
                            listType="text"
                            type="ArcTransferFiles" // Make sure this type is handled by your upload service
                            allowedFileTypes={[
                                'application/pdf',
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                'application/msword',
                                'image/jpeg',
                                'image/png',
                            ]}
                            fileList={fileList}
                            setFileList={setFileList} // Direct state setter
                            setUploadedData={setUploadedFileIds} // Direct state setter for string[]
                            handleSuccess={handleSuccessFromUploader} // Callback to get full DTOs
                        />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default ArcTransferModal;
import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Tooltip, Tag, Space, message, Input, DatePicker, Form } from "antd";
import { WarningOutlined, SaveOutlined, CloseCircleOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import { DA_NhatKyTrienKhaiType, DA_NhatKyTrienKhaiTypeVM } from "@/types/dA_DuAn/dA_NhatKyTrienKhai";
import styles from "./NhatKyTrienKhai.module.css";
import dayjs from "dayjs";
import dA_NhatKyTrienKhaiService from "@/services/dA_DuAn/dA_NhatKyTrienKhaiService";
import TextArea from "antd/lib/input/TextArea";
import dA_KeHoachThucHienService from "@/services/dA_KeHoachThucHien/dA_KeHoachThucHienService";
import { DA_KeHoachThucHienCreateOrUpdateType } from "@/types/dA_DuAn/dA_KeHoachThucHien";

// Define a generic type for the data
type ImportDataType = DA_NhatKyTrienKhaiTypeVM | DA_KeHoachThucHienCreateOrUpdateType;

interface NhatKyTrienKhaiModalProps<T extends ImportDataType> {
    open: boolean;
    onClose: () => void;
    importedData: T[];
    duAnId?: string | null;
    onSaveSuccess: () => void;
    dataType?: 'nhatKy' | 'keHoach';
    isKeHoachNoiBo?: boolean;
}

// Custom component to display multi-line text
const MultiLineText = ({ text }: { text: string | null | undefined }) => {
    if (!text) return <span>-</span>;
    
    return (
        <div className={styles.multilineText}>
            {text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                    {line || ' '}
                    {i < text.split('\n').length - 1 && <br />}
                </React.Fragment>
            ))}
        </div>
    );
};

// Define the EditableCell component
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}: any) => {
    const inputNode = inputType === 'date' ? (
        <DatePicker 
            format="DD/MM/YYYY" 
            style={{ width: '100%' }} 
            placeholder={`Nhập ${title}`}
        />
    ) : inputType === 'textarea' ? (
        <TextArea rows={3} placeholder={`Nhập ${title}`} />
    ) : (
        <Input placeholder={`Nhập ${title}`} />
    );

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={title && typeof title === 'string' && title.startsWith('*') ? [
                        { required: true, message: `${title.replace('*', '')} là bắt buộc!` }
                    ] : []}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

function NhatKyTrienKhaiModal<T extends ImportDataType>({
    open,
    onClose,
    importedData,
    duAnId,
    onSaveSuccess,
    dataType = 'nhatKy',
    isKeHoachNoiBo = false
}: NhatKyTrienKhaiModalProps<T>) {
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [saveLoading, setSaveLoading] = useState(false);
    const [data, setData] = useState<T[]>([]);
    const [editingKey, setEditingKey] = useState<string>('');

    const isEditing = (record: T) => record.id === editingKey;

    // Update data when importedData changes or modal opens
    useEffect(() => {
        if (importedData.length > 0) {
            setData(importedData);
            
            // Auto-select valid items
            const validItemIds = importedData
                .filter(item => (item as any).isValid !== false)
                .map(item => (item as any).id as string);
            
            setSelectedRowKeys(validItemIds);
        }
    }, [importedData, open]);

    // Reset selected rows when modal closes
    useEffect(() => {
        if (!open) {
            setSelectedRowKeys([]);
            setEditingKey('');
        }
    }, [open]);

    const handleSave = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning("Vui lòng chọn ít nhất một mục để lưu");
            return;
        }

        setSaveLoading(true);
        try {
            // Filter selected items
            const selectedItems = data.filter(item => 
                selectedRowKeys.includes(item.id as string)
            );
            
            let response;
            
            if (dataType === 'nhatKy') {
                // Use NhatKyTrienKhai service
                response = await dA_NhatKyTrienKhaiService.saveImportedData(selectedItems as DA_NhatKyTrienKhaiTypeVM[]);
            } else {
                // Use KeHoachThucHien service
                if (!duAnId) {
                    throw new Error("DuAnId is required for saving KeHoachThucHien data");
                }

                console.log("selectedItems dataaaa", selectedItems);
                
                // Create a clean copy of the data without any extra properties
                const cleanItems = selectedItems.map(item => {
                    const cleanItem: DA_KeHoachThucHienCreateOrUpdateType = {
                        id: item.id as string,
                        duAnId: duAnId,
                        noiDungCongViec: (item as any).noiDungCongViec,
                        phanCong: item.phanCong,
                        noiDungCongViecCon: (item as any).noiDungCongViecCon,
                        ngayBatDau: item.ngayBatDau,
                        ngayKetThuc: item.ngayKetThuc,
                        isCanhBao: (item as any).isCanhBao || false,
                        isKeHoachNoiBo: isKeHoachNoiBo
                    };
                    return cleanItem;
                });

             
                
                response = await dA_KeHoachThucHienService.SaveImportExcel(
                    duAnId, 
                    isKeHoachNoiBo, 
                    cleanItems
                );
            }
            
            if (response.success || response.status) {
                onSaveSuccess();
            } else {
                message.error(response.message || "Lưu dữ liệu thất bại");
            }
        } catch (error) {
            console.error("Error saving data:", error);
            message.error("Đã xảy ra lỗi khi lưu dữ liệu");
        } finally {
            setSaveLoading(false);
        }
    };

    const edit = (record: T) => {
        const formValues: any = {};
        
        if (dataType === 'nhatKy') {
            const nkRecord = record as DA_NhatKyTrienKhaiTypeVM;
            formValues.hangMucCongViec = nkRecord.hangMucCongViec;
            formValues.noiDungThucHien = nkRecord.noiDungThucHien;
            formValues.phanCong = nkRecord.phanCong;
            formValues.ngayBatDau = nkRecord.ngayBatDau ? dayjs(nkRecord.ngayBatDau) : null;
            formValues.ngayKetThuc = nkRecord.ngayKetThuc ? dayjs(nkRecord.ngayKetThuc) : null;
        } else {
            const khRecord = record as DA_KeHoachThucHienCreateOrUpdateType;
            formValues.noiDungCongViec = khRecord.noiDungCongViec;
            formValues.noiDungCongViecCon = khRecord.noiDungCongViecCon;
            formValues.phanCong = khRecord.phanCong;
            formValues.ngayBatDau = khRecord.ngayBatDau ? dayjs(khRecord.ngayBatDau) : null;
            formValues.ngayKetThuc = khRecord.ngayKetThuc ? dayjs(khRecord.ngayKetThuc) : null;
            formValues.isCanhBao = khRecord.isCanhBao;
        }
        
        form.setFieldsValue(formValues);
        setEditingKey(record.id as string);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const validateRow = (record: T): { isValid: boolean, errors: string[] } => {
        const errors: string[] = [];
        
        if (dataType === 'nhatKy') {
            const nkRecord = record as unknown as DA_NhatKyTrienKhaiType;
            if (!nkRecord.hangMucCongViec) {
                errors.push("Thiếu Hạng mục công việc");
            }
            
            if (!nkRecord.noiDungThucHien) {
                errors.push("Thiếu Nội dung thực hiện");
            }
        } else {
            const khRecord = record as DA_KeHoachThucHienCreateOrUpdateType;
            if (!khRecord.noiDungCongViec) {
                errors.push("Thiếu Nội dung công việc");
            }
        }
        
        if (!record.ngayBatDau || !record.ngayKetThuc) {
            errors.push("Thiếu ngày bắt đầu hoặc ngày kết thúc");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    };

    const save = async (key: string) => {
        try {
            const row = await form.validateFields();
            
            // Format dates if they exist
            if (row.ngayBatDau) {
                row.ngayBatDau = row.ngayBatDau.format('YYYY-MM-DDT00:00:00');
            }
            
            if (row.ngayKetThuc) {
                row.ngayKetThuc = row.ngayKetThuc.format('YYYY-MM-DDT00:00:00');
            }
            
            const newData = [...data];
            const index = newData.findIndex(item => key === item.id);
            
            if (index > -1) {
                const item = newData[index];
                const updatedItem = {
                    ...item,
                    ...row,
                };
                
                // Validate the updated row
                const validation = validateRow(updatedItem as T);
                (updatedItem as any).isValid = validation.isValid;
                (updatedItem as any).errors = validation.errors;
                
                newData.splice(index, 1, updatedItem as T);
                setData(newData);
                setEditingKey('');
                
                // Update selected rows if validation changed
                if (validation.isValid && !selectedRowKeys.includes(key)) {
                    setSelectedRowKeys([...selectedRowKeys, key]);
                } else if (!validation.isValid && selectedRowKeys.includes(key)) {
                    setSelectedRowKeys(selectedRowKeys.filter(k => k !== key));
                }
                
                message.success('Dữ liệu đã được cập nhật');
            } else {
                setEditingKey('');
            }
        } catch (errInfo) {
            console.error('Validate Failed:', errInfo);
            message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        }
    };

    // Define columns based on data type
    const getNhatKyColumns = (): any[] => [
        {
            title: 'STT',
            key: 'index',
            width: "5%",
            render: (_: any, __: any, index: number) => {
                const item = data[index];
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {(item as any).isValid === false && (
                            <Tooltip 
                                title={
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                            Lỗi dữ liệu:
                                        </div>
                                        <ul className={styles.errorList}>
                                            {(item as any).errors?.map((error: string, idx: number) => (
                                                <li key={idx}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                            >
                                <WarningOutlined className={styles.errorIcon} />
                            </Tooltip>
                        )}
                        {index + 1}
                    </div>
                );
            },
            editable: false,
        },
        {
            title: '*Hạng mục công việc',
            dataIndex: 'hangMucCongViec',
            key: 'hangMucCongViec',
            render: (text: string) => text || '-',
            width: "15%",
            editable: true,
        },
        {
            title: '*Nội dung thực hiện',
            dataIndex: 'noiDungThucHien',
            key: 'noiDungThucHien',
            render: (text: string) => <MultiLineText text={text} />,
            width: "25%",
            editable: true,
        },
        {
            title: 'Phân công',
            dataIndex: 'phanCong',
            key: 'phanCong',
            render: (text: string) => <MultiLineText text={text} />,
            width: "20%",
            editable: true,
        },
        {
            title: '*Ngày bắt đầu',
            dataIndex: 'ngayBatDau',
            key: 'ngayBatDau',
            render: (text: string) => text ? dayjs(text).format('DD/MM/YYYY') : '-',
            width: "8%",
            editable: true,
        },
        {
            title: '*Ngày kết thúc',
            dataIndex: 'ngayKetThuc',
            key: 'ngayKetThuc',
            render: (text: string) => text ? dayjs(text).format('DD/MM/YYYY') : '-',
            width: "8%",
            editable: true,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_: any, record: T) => (
                <Tag color={(record as any).isValid === false ? 'error' : 'success'}>
                    {(record as any).isValid === false ? 'Không hợp lệ' : 'Hợp lệ'}
                </Tag>
            ),
            width: "8%",
            editable: false,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            width: "8%",
            render: (_: any, record: T) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button
                            type="link"
                            icon={<CheckOutlined />}
                            onClick={() => save(record.id as string)}
                            style={{ marginRight: 8 }}
                        >
                            Lưu
                        </Button>
                        <Button type="link" onClick={cancel}>
                            Hủy
                        </Button>
                    </span>
                ) : (
                    <Button 
                        disabled={editingKey !== ''} 
                        type="link" 
                        icon={<EditOutlined />}
                        onClick={() => edit(record)}
                    >
                        Sửa
                    </Button>
                );
            },
        },
    ];

    const getKeHoachColumns = (): any[] => [
        {
            title: 'STT',
            key: 'index',
            width: "5%",
            render: (_: any, __: any, index: number) => {
                const item = data[index];
                return (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {(item as any).isValid === false && (
                            <Tooltip 
                                title={
                                    <div>
                                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                            Lỗi dữ liệu:
                                        </div>
                                        <ul className={styles.errorList}>
                                            {(item as any).errors?.map((error: string, idx: number) => (
                                                <li key={idx}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                }
                            >
                                <WarningOutlined className={styles.errorIcon} />
                            </Tooltip>
                        )}
                        {index + 1}
                    </div>
                );
            },
            editable: false,
        },
        {
            title: '*Nội dung công việc',
            dataIndex: 'noiDungCongViec',
            key: 'noiDungCongViec',
            render: (text: string) => text || '-',
            width: "25%",
            editable: true,
        },
        {
            title: '*Nội dung thực hiện',
            dataIndex: 'noiDungCongViecCon',
            key: 'noiDungCongViecCon',
            render: (text: string) => <MultiLineText text={text} />,
            width: "25%",
            editable: true,
        },
        {
            title: 'Phân công',
            dataIndex: 'phanCong',
            key: 'phanCong',
            render: (text: string) => <MultiLineText text={text} />,
            width: "20%",
            editable: true,
        },
        {
            title: '*Ngày bắt đầu',
            dataIndex: 'ngayBatDau',
            key: 'ngayBatDau',
            render: (text: string) => text ? dayjs(text).format('DD/MM/YYYY') : '-',
            width: "10%",
            editable: true,
        },
        {
            title: '*Ngày kết thúc',
            dataIndex: 'ngayKetThuc',
            key: 'ngayKetThuc',
            render: (text: string) => text ? dayjs(text).format('DD/MM/YYYY') : '-',
            width: "10%",
            editable: true,
        },
        {
            title: 'Cảnh báo',
            dataIndex: 'isCanhBao',
            key: 'isCanhBao',
            render: (value: boolean) => value ? 'Có' : 'Không',
            width: "8%",
            editable: true,
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_: any, record: T) => (
                <Tag color={(record as any).isValid === false ? 'error' : 'success'}>
                    {(record as any).isValid === false ? 'Không hợp lệ' : 'Hợp lệ'}
                </Tag>
            ),
            width: "8%",
            editable: false,
        },
        {
            title: 'Thao tác',
            key: 'operation',
            fixed: 'right',
            width: "8%",
            render: (_: any, record: T) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button
                            type="link"
                            icon={<CheckOutlined />}
                            onClick={() => save(record.id as string)}
                            style={{ marginRight: 8 }}
                        >
                            Lưu
                        </Button>
                        <Button type="link" onClick={cancel}>
                            Hủy
                        </Button>
                    </span>
                ) : (
                    <Button 
                        disabled={editingKey !== ''} 
                        type="link" 
                        icon={<EditOutlined />}
                        onClick={() => edit(record)}
                    >
                        Sửa
                    </Button>
                );
            },
        },
    ];

    const columns = dataType === 'nhatKy' ? getNhatKyColumns() : getKeHoachColumns();

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: T) => ({
                record,
                inputType: col.dataIndex === 'ngayBatDau' || col.dataIndex === 'ngayKetThuc' 
                    ? 'date' 
                    : col.dataIndex === 'noiDungThucHien' || col.dataIndex === 'phanCong' || col.dataIndex === 'noiDungCongViecCon'
                    ? 'textarea'
                    : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            setSelectedRowKeys(selectedKeys);
        },
        getCheckboxProps: (record: T) => ({
            disabled: (record as any).isValid === false,
            name: record.id as string,
        }),
    };

    const validCount = data.filter(item => (item as any).isValid !== false).length;
    const invalidCount = data.filter(item => (item as any).isValid === false).length;

    // Nếu không có dữ liệu, không hiển thị Modal
    if (importedData.length === 0) {
        return null;
    }

    return (
        <Modal
            title="Dữ liệu nhập từ Excel"
            open={open}
            onCancel={onClose}
            width="90%"
            destroyOnClose={false}
            maskClosable={false}
            zIndex={1050}
            centered
            keyboard={false}
            closable={true}
            footer={[
                <Button key="cancel" onClick={onClose} icon={<CloseCircleOutlined />}>
                    Đóng
                </Button>,
                <Button
                    key="save"
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={saveLoading}
                    onClick={handleSave}
                    disabled={selectedRowKeys.length === 0}
                >
                    Lưu dữ liệu đã chọn ({selectedRowKeys.length})
                </Button>
            ]}
        >
            <div style={{ marginBottom: 16 }}>
                <Space>
                    <Tag color="success">Hợp lệ: {validCount}</Tag>
                    <Tag color="error">Không hợp lệ: {invalidCount}</Tag>
                    <Tag color="processing">Đã chọn: {selectedRowKeys.length}</Tag>
                </Space>
                <div style={{ marginTop: 8, color: '#666' }}>
                    * Chỉ có thể chọn những dòng dữ liệu hợp lệ để lưu
                </div>
                <div style={{ marginTop: 4, color: '#666' }}>
                    * Các trường đánh dấu (*) không  thể để trống
                </div>
            </div>
            
            <Form form={form} component={false}>
                <Table
                   className={styles.customTable}
                    rowSelection={rowSelection}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    columns={mergedColumns}
                    dataSource={data}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1500 }}
                    size="middle"
                    bordered
                />
            </Form>
        </Modal>
        
    );
};

export default NhatKyTrienKhaiModal;
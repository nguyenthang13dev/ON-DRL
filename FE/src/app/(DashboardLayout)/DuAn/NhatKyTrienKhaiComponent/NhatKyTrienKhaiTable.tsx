import React, { useState, useEffect } from "react";
import { Button, Tooltip, Modal, Pagination, Form, Input, DatePicker, Space, message } from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "./NhatKyTrienKhai.module.css";
import dayjs from "dayjs";
import { DA_NhatKyTrienKhaiTypeVM, DA_NhatKyTrienKhaiSearchType } from "@/types/dA_DuAn/dA_NhatKyTrienKhai";
import dA_NhatKyTrienKhaiService from "@/services/dA_DuAn/dA_NhatKyTrienKhaiService";
import TextArea from "antd/lib/input/TextArea";
import { toast } from "react-toastify";

interface Props {
    duAnId?: string | null;
    onRefresh?: () => void;
    searchParams?: DA_NhatKyTrienKhaiSearchType;
    onPageChange?: (page: number, size?: number) => void;
    pageIndex?: number;
    pageSize?: number;
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

const NhatKyTrienKhaiTable: React.FC<Props> = ({ 
    duAnId, 
    onRefresh, 
    searchParams, 
    onPageChange,
    pageIndex = 1,
    pageSize = 10
}) => {
    const [form] = Form.useForm();
    const [data, setData] = useState<DA_NhatKyTrienKhaiTypeVM[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [editingKey, setEditingKey] = useState<string>('');
    const [totalCount, setTotalCount] = useState<number>(0);

    const isEditing = (record: DA_NhatKyTrienKhaiTypeVM) => record.id === editingKey;

    // Fetch data when component mounts or when key props change
    useEffect(() => {
        if (duAnId) {
            fetchData();
        }
    }, [duAnId, searchParams]);

    const fetchData = async () => {
        if (!duAnId) return;

        setLoading(true);
        try {
            const params: DA_NhatKyTrienKhaiSearchType = searchParams || {
                duAnId: duAnId,
                pageIndex: pageIndex,
                pageSize: pageSize
            };

            const response = await dA_NhatKyTrienKhaiService.getData(params);
            if (response.success || response.status) {
                setData(response.data.items || []);
                setTotalCount(response.data.totalCount || 0);
            } else {
                message.error(response.message || "Không thể tải dữ liệu");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            message.error("Đã xảy ra lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChangeInternal = (page: number, size?: number) => {
        if (onPageChange) {
            onPageChange(page, size);
        } else {
            // If no external page change handler is provided, handle internally
            fetchData();
        }
    };

    const showDeleteConfirm = (id: string) => {
        setItemToDelete(id);
        setConfirmModalVisible(true);
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        
        setDeleteLoading(itemToDelete);
        try {
            const response = await dA_NhatKyTrienKhaiService.delete(itemToDelete);
            if (response.success || response.status) {
                toast.success("Xóa dữ liệu thành công");
                fetchData(); // Refresh data after deletion
                if (onRefresh) {
                    onRefresh();
                }
            } else {
                message.error(response.message || "Xóa dữ liệu thất bại");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
            message.error("Đã xảy ra lỗi khi xóa dữ liệu");
        } finally {
            setDeleteLoading(null);
            setConfirmModalVisible(false);
            setItemToDelete(null);
        }
    };

    const edit = (record: DA_NhatKyTrienKhaiTypeVM) => {
        form.setFieldsValue({
            hangMucCongViec: record.hangMucCongViec,
            noiDungThucHien: record.noiDungThucHien,
            phanCong: record.phanCong,
            ngayBatDau: record.ngayBatDau ? dayjs(record.ngayBatDau) : null,
            ngayKetThuc: record.ngayKetThuc ? dayjs(record.ngayKetThuc) : null,
            
        });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey('');
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
            
            const updatedItem = {
                id: key,
                duAnId: duAnId,
                ...row
            };
            
            const response = await dA_NhatKyTrienKhaiService.update(updatedItem);
            
            if (response.success || response.status) {
                toast.success("Cập nhật thành công");
                setEditingKey('');
                
                // Update the item in the current data array to avoid a full refresh
                const updatedData = [...data];
                const index = updatedData.findIndex(item => item.id === key);
                if (index > -1) {
                    updatedData[index] = { ...updatedData[index], ...updatedItem };
                    setData(updatedData);
                } else {
                    // If we can't find the item, do a full refresh
                    fetchData();
                }
                
                if (onRefresh) {
                    onRefresh();
                }
            } else {
                message.error(response.message || "Cập nhật thất bại");
            }
        } catch (errInfo) {
            console.error('Validate Failed:', errInfo);
            message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        }
    };

    return (
        <div className={styles.nhatKyContainer}>
            <div className={styles.tableWrapper}>
                <Form form={form} component={false}>
                    <table className={styles.customTable}>
                        <thead>
                            <tr>
                                <th style={{ width: "5%" }}>STT</th>
                                <th style={{ width: "10%" }}>Hạng mục công việc</th>
                                <th style={{ width: "20%" }}>Nội dung thực hiện</th>
                                <th style={{ width: "5%" }}>Ngày bắt đầu</th>
                                <th style={{ width: "5%" }}>Ngày kết thúc</th>
                                <th style={{ width: "18%" }}>Phân công</th>
                                <th style={{ width: "8%" }}>Hành động</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : data.length > 0 ? (
                                data.map((item, index) => {
                                    const isEditable = isEditing(item);
                                    return (
                                        <tr key={item.id}>
                                            <EditableCell
                                                editing={isEditable}
                                                dataIndex="index"
                                                title=""
                                                inputType="text"
                                                record={item}
                                                index={index}
                                            >
                                                <td style={{ textAlign: "center" }}>{(pageIndex - 1) * pageSize + index + 1}</td>
                                            </EditableCell>
                                            <EditableCell
                                                editing={isEditable}
                                                dataIndex="hangMucCongViec"
                                                title="*Hạng mục công việc"
                                                inputType="text"
                                                record={item}
                                                index={index}
                                            >
                                                <td>{item.hangMucCongViec || '-'}</td>
                                            </EditableCell>
                                            <EditableCell
                                                editing={isEditable}
                                                dataIndex="noiDungThucHien"
                                                title="*Nội dung thực hiện"
                                                inputType="textarea"
                                                record={item}
                                                index={index}
                                            >
                                                <td><MultiLineText text={item.noiDungThucHien} /></td>
                                            </EditableCell>
                                            <EditableCell
                                                editing={isEditable}
                                                dataIndex="ngayBatDau"
                                                title="*Ngày bắt đầu"
                                                inputType="date"
                                                record={item}
                                                index={index}
                                            >
                                                <td>
                                                    {item.ngayBatDau ? dayjs(item.ngayBatDau).format("DD/MM/YYYY") : '-'}
                                                </td>
                                            </EditableCell>
                                            <EditableCell
                                                editing={isEditable}
                                                dataIndex="ngayKetThuc"
                                                title="*Ngày kết thúc"
                                                inputType="date"
                                                record={item}
                                                index={index}
                                            >
                                                <td>
                                                    {item.ngayKetThuc ? dayjs(item.ngayKetThuc).format("DD/MM/YYYY") : '-'}
                                                </td>
                                            </EditableCell>
                                            <EditableCell
                                                editing={isEditable}
                                                dataIndex="phanCong"
                                                title="Phân công"
                                                inputType="textarea"
                                                record={item}
                                                index={index}
                                            >
                                                <td><MultiLineText text={item.phanCong} /></td>
                                            </EditableCell>
                                            <td style={{ textAlign: "center" }}>
                                                {isEditable ? (
                                                    <Space>
                                                        <Button
                                                            icon={<CheckOutlined />}
                                                            type="primary"
                                                            size="small"
                                                            onClick={() => save(item.id)}
                                                            style={{ marginRight: 8 }}
                                                        >
                                                            Lưu
                                                        </Button>
                                                        <Button 
                                                        icon={<CloseOutlined />}
                                                            size="small" 
                                                            onClick={cancel}
                                                        >
                                                            Hủy
                                                        </Button>
                                                    </Space>
                                                ) : (
                                                    <Space>
                                                        <Tooltip title="Chỉnh sửa">
                                                            <Button
                                                                icon={<EditOutlined />}
                                                                type="link"
                                                                disabled={editingKey !== ''}
                                                                onClick={() => edit(item)}
                                                                style={{ padding: 0, marginRight: 8 }}
                                                            />
                                                        </Tooltip>
                                                        <Tooltip title="Xóa">
                                                            <Button
                                                                icon={<DeleteOutlined />}
                                                                type="link"
                                                                danger
                                                                disabled={editingKey !== ''}
                                                                onClick={() => showDeleteConfirm(item.id)}
                                                                loading={deleteLoading === item.id}
                                                                style={{ padding: 0 }}
                                                            />
                                                        </Tooltip>
                                                    </Space>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: "center", padding: "20px" }}>
                                        Không có dữ liệu
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Form>
            </div>

            {totalCount > 0 && (
                <div className={styles.paginationContainer}>
                    <Pagination
                        current={pageIndex}
                        pageSize={pageSize}
                        total={totalCount}
                        onChange={handlePageChangeInternal}
                        showSizeChanger
                        showTotal={(total) => `Tổng số ${total} bản ghi`}
                    />
                </div>
            )}

            <Modal
                title="Xác nhận xóa"
                open={confirmModalVisible}
                onOk={handleDelete}
                onCancel={() => setConfirmModalVisible(false)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true, loading: !!deleteLoading }}
            >
                <p>Bạn có chắc chắn muốn xóa mục này?</p>
            </Modal>
        </div>
    );
};

export default NhatKyTrienKhaiTable;
import React, { useState } from "react";
import {
    Modal,
    Form,
    Input,
    Button,
    Space,
    Typography,
    Switch,
    Upload,
    message,
    Card,
    Progress,
    Tag,
} from "antd";
import {
    SaveOutlined,
    UploadOutlined,
    FileOutlined,
    InboxOutlined,
    DeleteOutlined,
    FileTextOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ConfigFormCreateVM {
    name: string;
    description: string;
    isActive: boolean;
    fileDinhKems?: string; // GUID as string for file reference
}

interface ConfigFormProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: ConfigFormCreateVM) => void;
    initialData?: Partial<ConfigFormCreateVM>;
    title?: string;
}

const ConfigForm: React.FC<ConfigFormProps> = ({
    visible,
    onClose,
    onSave,
    initialData,
    title = "Tạo cấu hình mới",
}) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const formData: ConfigFormCreateVM = {
                name: values.name,
                description: values.description,
                isActive: values.isActive || false,
                fileDinhKems: fileList.length > 0 ? fileList[0].uid : undefined,
            };

            onSave(formData);
            message.success("Đã lưu cấu hình thành công");
            handleClose();
        } catch (error) {
            console.error("Validation failed:", error);
            message.error("Vui lòng kiểm tra lại thông tin");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setFileList([]);
        onClose();
    };

    const handleFileChange = (info: any) => {
        let newFileList = [...info.fileList];

        // Chỉ giữ lại file cuối cùng
        newFileList = newFileList.slice(-1);

        // Cập nhật trạng thái file
        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            return file;
        });

        setFileList(newFileList);

        if (info.file.status === "done") {
            message.success(`${info.file.name} đã tải lên thành công`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} tải lên thất bại`);
        }
    };

    const handleRemoveFile = () => {
        setFileList([]);
        message.info("Đã xóa file");
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const uploadProps = {
        name: "file",
        action: "/api/upload", // Thay đổi URL upload theo API của bạn
        headers: {
            authorization: "authorization-text",
        },
        fileList,
        onChange: handleFileChange,
        onRemove: handleRemoveFile,
        beforeUpload: (file: any) => {
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                message.error("File phải nhỏ hơn 10MB!");
            }
            return isLt10M;
        },
        showUploadList: false, // Tắt danh sách file mặc định
    };

    return (
        <Modal
            title={
                <Space>
                    <FileOutlined />
                    <span>{title}</span>
                </Space>
            }
            open={visible}
            onCancel={handleClose}
            width={600}
            footer={[
                <Button key="cancel" onClick={handleClose}>
                    Hủy
                </Button>,
                <Button
                    key="save"
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                    loading={loading}
                >
                    Lưu
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    isActive: true,
                    ...initialData,
                }}
            >
                <Form.Item
                    name="name"
                    label="Tên cấu hình"
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng nhập tên cấu hình",
                        },
                        {
                            min: 2,
                            message: "Tên cấu hình phải có ít nhất 2 ký tự",
                        },
                        {
                            max: 100,
                            message: "Tên cấu hình không được quá 100 ký tự",
                        },
                    ]}
                >
                    <Input
                        placeholder="Nhập tên cấu hình"
                        maxLength={100}
                        showCount
                    />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[
                        { max: 500, message: "Mô tả không được quá 500 ký tự" },
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Nhập mô tả chi tiết về cấu hình"
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <Form.Item
                    name="isActive"
                    label="Trạng thái hoạt động"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren="Hoạt động"
                        unCheckedChildren="Không hoạt động"
                    />
                </Form.Item>

                <Form.Item label="File đính kèm">
                    <Card
                        size="small"
                        style={{
                            border: "2px dashed #d9d9d9",
                            borderRadius: "8px",
                            backgroundColor: "#fafafa",
                            transition: "all 0.3s ease",
                        }}
                    >
                        {fileList.length === 0 ? (
                            <Upload.Dragger
                                {...uploadProps}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                }}
                            >
                                <div style={{ padding: "20px 0" }}>
                                    <InboxOutlined
                                        style={{
                                            fontSize: "48px",
                                            color: "#1890ff",
                                            marginBottom: "16px",
                                        }}
                                    />
                                    <p
                                        style={{
                                            fontSize: "16px",
                                            margin: "0 0 8px 0",
                                            color: "#262626",
                                        }}
                                    >
                                        Kéo thả file vào đây hoặc
                                    </p>
                                    <Button
                                        type="primary"
                                        icon={<UploadOutlined />}
                                        size="large"
                                    >
                                        Chọn file
                                    </Button>
                                    <p
                                        style={{
                                            fontSize: "12px",
                                            color: "#8c8c8c",
                                            margin: "8px 0 0 0",
                                        }}
                                    >
                                        Hỗ trợ tất cả định dạng file, tối đa
                                        10MB
                                    </p>
                                </div>
                            </Upload.Dragger>
                        ) : (
                            <div style={{ padding: "16px" }}>
                                {fileList.map((file, index) => (
                                    <Card
                                        key={index}
                                        size="small"
                                        style={{
                                            marginBottom: "8px",
                                            border: "1px solid #e8e8e8",
                                            borderRadius: "6px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    flex: 1,
                                                }}
                                            >
                                                <FileTextOutlined
                                                    style={{
                                                        fontSize: "24px",
                                                        color: "#1890ff",
                                                        marginRight: "12px",
                                                    }}
                                                />
                                                <div style={{ flex: 1 }}>
                                                    <div
                                                        style={{
                                                            fontWeight: "500",
                                                            color: "#262626",
                                                            marginBottom: "4px",
                                                        }}
                                                    >
                                                        {file.name}
                                                    </div>
                                                    <div
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#8c8c8c",
                                                        }}
                                                    >
                                                        {formatFileSize(
                                                            file.size || 0,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                }}
                                            >
                                                {file.status === "done" && (
                                                    <Tag
                                                        color="success"
                                                        icon={
                                                            <CheckCircleOutlined />
                                                        }
                                                    >
                                                        Thành công
                                                    </Tag>
                                                )}
                                                {file.status ===
                                                    "uploading" && (
                                                    <div
                                                        style={{
                                                            width: "80px",
                                                        }}
                                                    >
                                                        <Progress
                                                            percent={
                                                                file.percent
                                                            }
                                                            size="small"
                                                            showInfo={false}
                                                        />
                                                    </div>
                                                )}
                                                {file.status === "error" && (
                                                    <Tag color="error">Lỗi</Tag>
                                                )}
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                    onClick={handleRemoveFile}
                                                />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </Card>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ConfigForm;

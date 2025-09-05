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
} from "antd";
import { SaveOutlined, UploadOutlined, FileOutlined } from "@ant-design/icons";

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
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const uploadProps = {
        name: "file",
        action: "/api/upload", // Thay đổi URL upload theo API của bạn
        headers: {
            authorization: "authorization-text",
        },
        fileList,
        onChange: handleFileChange,
        beforeUpload: (file: any) => {
            const isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                message.error("File phải nhỏ hơn 10MB!");
            }
            return isLt10M;
        },
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

                <Form.Item
                    label="File đính kèm"
                    help="Chọn file đính kèm (tối đa 10MB)"
                >
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Chọn file</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ConfigForm;

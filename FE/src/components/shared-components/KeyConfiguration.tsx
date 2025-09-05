import React, { useState, useEffect } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Space,
    Typography,
    Card,
    Table,
    Tag,
    message,
    Popconfirm,
    Switch,
    InputNumber,
} from "antd";
import {
    SettingOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SaveOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface KeyConfig {
    id: string;
    key: string;
    label: string;
    type: "text" | "number" | "select";
    required: boolean;
    placeholder?: string;
    options?: string[];
    defaultValue?: any;
}

interface KeyConfigurationProps {
    visible: boolean;
    keys: string[];
    selectedKey: string | null;
    onClose: () => void;
    onSave: (configs: KeyConfig[]) => void;
    existingConfigs?: KeyConfig[];
}

const KeyConfiguration: React.FC<KeyConfigurationProps> = ({
    visible,
    keys,
    selectedKey,
    onClose,
    onSave,
    existingConfigs = [],
}) => {
    const [form] = Form.useForm();
    const [configs, setConfigs] = useState<KeyConfig[]>(existingConfigs);
    const [editingConfig, setEditingConfig] = useState<KeyConfig | null>(null);
    const [showConfigForm, setShowConfigForm] = useState(false);

    useEffect(() => {
        if (visible) {
            // Initialize configs for keys that don't have config yet
            const newConfigs = keys.map((key) => {
                const existing = existingConfigs.find((c) => c.key === key);
                return (
                    existing || {
                        id: `config_${key}_${Date.now()}`,
                        key,
                        label: key,
                        type: "text" as const,
                        required: false,
                        placeholder: `Nhập ${key}`,
                        options: [],
                        defaultValue: "",
                    }
                );
            });
            setConfigs(newConfigs);
        }
    }, [visible, keys, existingConfigs]);

    const handleAddConfig = () => {
        setEditingConfig(null);
        setShowConfigForm(true);
        form.resetFields();
    };

    const handleEditConfig = (config: KeyConfig) => {
        setEditingConfig(config);
        setShowConfigForm(true);
        form.setFieldsValue({
            ...config,
            options: config.options?.join(", ") || "",
        });
    };

    const handleDeleteConfig = (configId: string) => {
        setConfigs((prev) => prev.filter((c) => c.id !== configId));
        message.success("Đã xóa cấu hình");
    };

    const handleSaveConfig = async () => {
        try {
            const values = await form.validateFields();

            const newConfig: KeyConfig = {
                id: editingConfig?.id || `config_${Date.now()}`,
                key: values.key,
                label: values.label,
                type: values.type,
                required: values.required || false,
                placeholder: values.placeholder,
                options: values.options
                    ? values.options.split(",").map((opt: string) => opt.trim())
                    : [],
                defaultValue: values.defaultValue,
            };

            if (editingConfig) {
                setConfigs((prev) =>
                    prev.map((c) =>
                        c.id === editingConfig.id ? newConfig : c,
                    ),
                );
            } else {
                setConfigs((prev) => [...prev, newConfig]);
            }

            setShowConfigForm(false);
            setEditingConfig(null);
            form.resetFields();
            message.success("Đã lưu cấu hình");
        } catch (error) {
            console.error("Validation failed:", error);
        }
    };

    const handleSaveAll = () => {
        onSave(configs);
        message.success("Đã lưu tất cả cấu hình");
        onClose();
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            text: "blue",
            number: "cyan",
            select: "orange",
        };
        return colors[type] || "default";
    };

    const columns = [
        {
            title: "Key",
            dataIndex: "key",
            key: "key",
            render: (key: string) => <Tag color="blue">[{key}]</Tag>,
        },
        {
            title: "Label",
            dataIndex: "label",
            key: "label",
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
            render: (type: string) => (
                <Tag color={getTypeColor(type)}>{type}</Tag>
            ),
        },
        {
            title: "Bắt buộc",
            dataIndex: "required",
            key: "required",
            render: (required: boolean) => (
                <Tag color={required ? "red" : "default"}>
                    {required ? "Có" : "Không"}
                </Tag>
            ),
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_: any, record: KeyConfig) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditConfig(record)}
                        size="small"
                    />
                    <Popconfirm
                        title="Bạn có chắc muốn xóa cấu hình này?"
                        onConfirm={() => handleDeleteConfig(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Modal
                title={
                    <Space>
                        <SettingOutlined />
                        <span>Cấu hình Key</span>
                    </Space>
                }
                open={visible}
                onCancel={onClose}
                width={1000}
                footer={[
                    <Button key="cancel" onClick={onClose}>
                        Hủy
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={handleSaveAll}
                    >
                        Lưu tất cả
                    </Button>,
                ]}
            >
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">
                        Cấu hình các key được tìm thấy trong file Word.
                        {selectedKey && (
                            <span>
                                {" "}
                                Đang cấu hình key:{" "}
                                <Tag color="blue">[{selectedKey}]</Tag>
                            </span>
                        )}
                    </Text>
                </div>

                <Card
                    title="Danh sách cấu hình"
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddConfig}
                            size="small"
                        >
                            Thêm cấu hình
                        </Button>
                    }
                    size="small"
                >
                    <Table
                        columns={columns}
                        dataSource={configs}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        scroll={{ y: 300 }}
                    />
                </Card>
            </Modal>

            {/* Modal cấu hình chi tiết */}
            <Modal
                title={
                    editingConfig ? "Chỉnh sửa cấu hình" : "Thêm cấu hình mới"
                }
                open={showConfigForm}
                onCancel={() => setShowConfigForm(false)}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => setShowConfigForm(false)}
                    >
                        Hủy
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        onClick={handleSaveConfig}
                    >
                        Lưu
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        type: "text",
                        required: false,
                    }}
                >
                    <Form.Item
                        name="key"
                        label="Key"
                        rules={[
                            { required: true, message: "Vui lòng nhập key" },
                        ]}
                    >
                        <Select placeholder="Chọn key">
                            {keys.map((key) => (
                                <Option key={key} value={key}>
                                    [{key}]
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="label"
                        label="Label hiển thị"
                        rules={[
                            { required: true, message: "Vui lòng nhập label" },
                        ]}
                    >
                        <Input placeholder="Nhập label hiển thị" />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Loại field"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng chọn loại field",
                            },
                        ]}
                    >
                        <Select>
                            <Option value="text">Text</Option>
                            <Option value="number">Number</Option>
                            <Option value="select">Select</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="required"
                        label="Bắt buộc"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item name="placeholder" label="Placeholder">
                        <Input placeholder="Nhập placeholder" />
                    </Form.Item>

                    <Form.Item name="defaultValue" label="Giá trị mặc định">
                        <Input placeholder="Nhập giá trị mặc định" />
                    </Form.Item>

                    <Form.Item
                        name="options"
                        label="Options (cách nhau bằng dấu phẩy)"
                        dependencies={["type"]}
                    >
                        {({ getFieldValue }) => {
                            const type = getFieldValue("type");
                            if (type === "select") {
                                return (
                                    <TextArea
                                        rows={3}
                                        placeholder="Option 1, Option 2, Option 3"
                                    />
                                );
                            }
                            return null;
                        }}
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default KeyConfiguration;

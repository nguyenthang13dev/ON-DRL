"use client";
import renderHtmlWithSettings from "@/components/shared-components/renderHtmlWithSettings ";
import { configFormService } from "@/services/ConfigForm/ConfigForm.service";
import
  {
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Select,
    Spin,
    Switch,
  } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const PreviewConfigForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const Id = searchParams.get("Id");
    const [loading, setLoading] = useState(false);
    const [htmlContent, setHtmlContent] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [modalOpen, setModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState<string | null>(null);
    const [fieldConfig, setFieldConfig] = useState<any>({});
    const [form] = Form.useForm();

    const handleGetPreViewConfig = useCallback(async () => {
        setLoading(true);
        try {
            const res = await configFormService.PrerviewConfigSetting(Id!);
            if (res.status && res.data) {
                setHtmlContent(res.data.htmlContent || "");
            } else {
                setError(res.message || "Không lấy được nội dung file");
            }
        } catch (error) {
            message.error("Lỗi khi lấy dữ liệu xem trước");
        } finally {
            setLoading(false);
        }
    }, [Id]);

    useEffect(() => {
        if (!Id) return;
        setError("");
        handleGetPreViewConfig();
    }, [Id, handleGetPreViewConfig]);

    // Handle field click from renderHtmlWithSettings
    const handleFieldClick = (field: string) => {
        setCurrentField(field);
        // Load config if exists
        if (field && fieldConfig[field]) {
            form.setFieldsValue(fieldConfig[field]);
        } else {
            form.resetFields();
            form.setFieldsValue({
                key: field,
                type: "text",
                required: false,
            });
        }
        setModalOpen(true);
    };

    const handleSaveConfig = () => {
        const values = form.getFieldsValue();
        setFieldConfig((prev: any) => ({ ...prev, [values.key]: values }));
        setModalOpen(false);
    };

    return (
        <Card
            title="Cấu hình nội dung biểu mẫu"
            extra={<Button onClick={() => router.back()}>Quay lại</Button>}
            style={{ margin: 24 }}
        >
            {loading ? (
                <Spin />
            ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
            ) : (
                <div
                    style={{ minHeight: 400, background: "#fff", padding: 16 }}
                >
                    {renderHtmlWithSettings(
                        htmlContent,
                        handleFieldClick,
                        fieldConfig,
                    )}
                </div>
            )}
            <Modal
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    setCurrentField(null);
                    form.resetFields();
                }}
                title={`Cấu hình trường: ${currentField || ""}`}
                onOk={handleSaveConfig}
                okText="Lưu cấu hình"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        key: currentField,
                        type: "text",
                        required: false,
                    }}
                >
                    <Form.Item label="Tên key" name="key">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Loại dữ liệu"
                        name="type"
                        rules={[
                            { required: true, message: "Chọn loại dữ liệu" },
                        ]}
                    >
                        <Select>
                            <Select.Option value="text">Text</Select.Option>
                            <Select.Option value="number">Number</Select.Option>
                            <Select.Option value="datetime">
                                Datetime
                            </Select.Option>
                            <Select.Option value="dropdown">
                                Dropdown
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    {/* Min/Max for number */}
                    <Form.Item
                        noStyle
                        shouldUpdate={(prev, curr) => prev.type !== curr.type}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue("type") === "number" && (
                                <>
                                    <Form.Item
                                        label="Giá trị nhỏ nhất"
                                        name="min"
                                    >
                                        <InputNumber
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Giá trị lớn nhất"
                                        name="max"
                                    >
                                        <InputNumber
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>
                                </>
                            )
                        }
                    </Form.Item>
                    {/* Dropdown options */}
                    <Form.Item
                        noStyle
                        shouldUpdate={(prev, curr) => prev.type !== curr.type}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue("type") === "dropdown" && (
                                <Form.Item
                                    label="Danh sách lựa chọn (phân cách bởi dấu phẩy)"
                                    name="options"
                                >
                                    <Input placeholder="ví dụ: Lựa chọn 1, Lựa chọn 2, ..." />
                                </Form.Item>
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="Bắt buộc nhập"
                        name="required"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default PreviewConfigForm;

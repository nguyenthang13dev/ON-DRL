"use client";
import RenderHtmlWithSettings from "@/components/shared-components/renderHtmlWithSettings ";
import { configFormService } from "@/services/ConfigForm/ConfigForm.service";
import { configFormKeyService } from "@/services/configFormKey/configFormKey.service";
import { tableConfigFormKeyEditVMData } from "@/types/ConfigFormKey/ConfigFormKey";
import {
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
    const systemDefaultOptions = [
        { key: "{{user.fullName}}", label: "Họ tên (user.fullName)" },
        { key: "{{user.dateOfBirth}}", label: "Ngày sinh (user.dateOfBirth)" },
        {
            key: "{{user.studentCode}}",
            label: "Mã sinh viên (user.studentCode)",
        },
        { key: "{{user.className}}", label: "Lớp (user.className)" },
        { key: "{{user.email}}", label: "Email (user.email)" },
        { key: "{{user.phone}}", label: "Số điện thoại (user.phone)" },
    ];

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
                kTT_KEY: field,
                type: "text",
                isRequired: false,
                isSystem: false,
                defaultKey: undefined,
                configId: Id || "",
            });
        }
        setModalOpen(true);
    };

    const handleSaveConfig = async () => {
        const values = form.getFieldsValue();
        const payload: tableConfigFormKeyEditVMData = {
            id: values.id,
            kTT_KEY: values.kTT_KEY,
            type: values.type,
            min: values.min,
            max: values.max,
            isSystem: !!values.isSystem,
            isRequired: !!values.isRequired,
            defaultKey: values.defaultKey,
            configId: values.configId || (Id as string),
        };
        try {
            const res = await configFormKeyService.editByForm(payload);
            if ((res as any)?.status || (res as any)?.success) {
                message.success("Lưu cấu hình thành công");
                setFieldConfig((prev: any) => ({
                    ...prev,
                    [payload.kTT_KEY!]: payload,
                }));
                setModalOpen(false);
            } else {
                message.error((res as any)?.message || "Lỗi khi lưu cấu hình");
            }
        } catch (error) {
            message.error("Lỗi khi lưu cấu hình");
        }
    };

    return (
        <Card
            title="Cấu hình nội dung biểu mẫu"
            extra={
                <Button
                    onClick={() => router.back()}
                    size="small"
                    type="primary"
                >
                    Quay lại
                </Button>
            }
            style={{ margin: 24 }}
        >
            {loading ? (
                <Spin />
            ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
            ) : (
                <div
                    style={{
                        minHeight: 400,
                        background: "#fff",
                        padding: 16,
                        width: "100%",
                        boxSizing: "border-box",
                    }}
                >
                    <RenderHtmlWithSettings
                        html={htmlContent}
                        onFieldClick={handleFieldClick}
                        fieldConfig={fieldConfig}
                    />
                </div>
            )}
            <Modal
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    setCurrentField(null);
                    form.resetFields();
                }}
                title={`Cấu hình trường: [${currentField || ""}]`}
                onOk={handleSaveConfig}
                okText="Lưu cấu hình"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        kTT_KEY: currentField,
                        type: "text",
                        isRequired: false,
                        isSystem: false,
                        defaultKey: undefined,
                        configId: Id || "",
                    }}
                >
                    <Form.Item<tableConfigFormKeyEditVMData>
                        label="Tên key"
                        name="kTT_KEY"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Mã cấu hình (configId)"
                        name="configId"
                        hidden
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Dùng giá trị mặc định hệ thống"
                        name="isSystem"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                    <Form.Item
                        noStyle
                        shouldUpdate={(prev, curr) =>
                            prev.isSystem !== curr.isSystem
                        }
                    >
                        {({ getFieldValue }) =>
                            getFieldValue("isSystem") && (
                                <>
                                    <Form.Item
                                        label="Chọn khóa mặc định"
                                        name="defaultKey"
                                    >
                                        <Select
                                            placeholder="Ví dụ: Họ tên, Ngày sinh, ..."
                                            options={systemDefaultOptions.map(
                                                (o) => ({
                                                    label: o.label,
                                                    value: o.key,
                                                }),
                                            )}
                                            onChange={() => {}}
                                        />
                                    </Form.Item>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "#888",
                                            marginTop: -8,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Gợi ý khóa phổ biến:{" "}
                                        {systemDefaultOptions
                                            .map((o) => o.key)
                                            .join(", ")}
                                    </div>
                                </>
                            )
                        }
                    </Form.Item>
                    {/* Không dùng defaultValue tự do; dùng defaultKey khi isSystem = true */}
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
                    {/* Removed dropdown/datetime specific configurations */}
                    <Form.Item
                        label="Bắt buộc nhập"
                        name="isRequired"
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

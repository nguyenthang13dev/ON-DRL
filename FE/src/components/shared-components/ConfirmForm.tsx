import React, { useState, useCallback } from "react";
import {
    Card,
    Button,
    Space,
    Typography,
    message,
    Steps,
    Divider,
    Row,
    Col,
} from "antd";
import {
    FileWordOutlined,
    EyeOutlined,
    SettingOutlined,
    SaveOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";

import WordUploadForm from "./WordUploadForm";
import WordPreview from "./WordPreview";
import KeyConfiguration from "./KeyConfiguration";
import {
    wordService,
    KeyConfig,
    WordTemplateConfig,
} from "@/services/word/word.service";

const { Title, Text } = Typography;
const { Step } = Steps;

interface ConfirmFormProps {
    onSave?: (templateConfig: WordTemplateConfig) => void;
    onCancel?: () => void;
    initialTemplate?: WordTemplateConfig;
    title?: string;
}

const ConfirmForm: React.FC<ConfirmFormProps> = ({
    onSave,
    onCancel,
    initialTemplate,
    title = "Cấu hình Form từ File Word",
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [htmlPreview, setHtmlPreview] = useState<string>("");
    const [extractedKeys, setExtractedKeys] = useState<string[]>([]);
    const [keyConfigs, setKeyConfigs] = useState<KeyConfig[]>([]);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [showKeyConfig, setShowKeyConfig] = useState(false);
    const [templateName, setTemplateName] = useState<string>("");
    const [templateDescription, setTemplateDescription] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const steps = [
        {
            title: "Upload File",
            description: "Chọn file Word để upload",
            icon: <FileWordOutlined />,
        },
        {
            title: "Preview & Extract",
            description: "Xem trước và trích xuất key",
            icon: <EyeOutlined />,
        },
        {
            title: "Configure Keys",
            description: "Cấu hình các key",
            icon: <SettingOutlined />,
        },
        {
            title: "Save Template",
            description: "Lưu template",
            icon: <SaveOutlined />,
        },
    ];

    const handleFileUploaded = useCallback(
        (file: File, preview: string, keys: string[]) => {
            setUploadedFile(file);
            setHtmlPreview(preview);
            setExtractedKeys(keys);
            setCurrentStep(1);
            message.success(`Upload thành công! Tìm thấy ${keys.length} key.`);
        },
        [],
    );

    const handleFileRemoved = useCallback(() => {
        setUploadedFile(null);
        setHtmlPreview("");
        setExtractedKeys([]);
        setKeyConfigs([]);
        setCurrentStep(0);
    }, []);

    const handleKeyClick = useCallback((key: string) => {
        setSelectedKey(key);
        setShowKeyConfig(true);
    }, []);

    const handleSettingsClick = useCallback(() => {
        setShowKeyConfig(true);
    }, []);

    const handleKeyConfigSave = useCallback((configs: KeyConfig[]) => {
        setKeyConfigs(configs);
        setShowKeyConfig(false);
        setCurrentStep(2);
        message.success("Đã lưu cấu hình key");
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSaveTemplate = async () => {
        if (!templateName.trim()) {
            message.error("Vui lòng nhập tên template");
            return;
        }

        if (keyConfigs.length === 0) {
            message.error("Vui lòng cấu hình ít nhất một key");
            return;
        }

        setLoading(true);
        try {
            const templateConfig: WordTemplateConfig = {
                name: templateName,
                description: templateDescription,
                fileId: uploadedFile?.name || "",
                htmlPreview,
                keys: extractedKeys,
                keyConfigs,
            };

            const result = await wordService.saveTemplateConfig(templateConfig);

            if (result.success) {
                message.success("Lưu template thành công!");
                onSave?.(result.data!);
            } else {
                message.error(result.message);
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi lưu template");
            console.error("Save template error:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <WordUploadForm
                        onFileUploaded={handleFileUploaded}
                        onFileRemoved={handleFileRemoved}
                        maxSize={10}
                        acceptedTypes={[".doc", ".docx"]}
                    />
                );

            case 1:
                return (
                    <WordPreview
                        htmlPreview={htmlPreview}
                        keys={extractedKeys}
                        onKeyClick={handleKeyClick}
                        onSettingsClick={handleSettingsClick}
                        fileName={uploadedFile?.name}
                    />
                );

            case 2:
                return (
                    <Card title="Cấu hình Key" size="small">
                        <div style={{ marginBottom: 16 }}>
                            <Text type="secondary">
                                Đã cấu hình {keyConfigs.length}/
                                {extractedKeys.length} key
                            </Text>
                        </div>

                        {keyConfigs.length > 0 ? (
                            <div>
                                <Text strong>Danh sách key đã cấu hình:</Text>
                                <div style={{ marginTop: 8 }}>
                                    {keyConfigs.map((config, index) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: "8px 12px",
                                                margin: "4px 0",
                                                backgroundColor: "#f0f2f5",
                                                borderRadius: "4px",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Space>
                                                <Text code>[{config.key}]</Text>
                                                <Text>{config.label}</Text>
                                                <Text type="secondary">
                                                    ({config.type})
                                                </Text>
                                                {config.required && (
                                                    <Text type="danger">*</Text>
                                                )}
                                            </Space>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div
                                style={{ textAlign: "center", padding: "20px" }}
                            >
                                <Text type="secondary">
                                    Chưa có key nào được cấu hình
                                </Text>
                                <br />
                                <Button
                                    type="primary"
                                    icon={<SettingOutlined />}
                                    onClick={handleSettingsClick}
                                    style={{ marginTop: 8 }}
                                >
                                    Cấu hình Key
                                </Button>
                            </div>
                        )}
                    </Card>
                );

            case 3:
                return (
                    <Card title="Lưu Template" size="small">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <div>
                                <Text strong>Tên template:</Text>
                                <input
                                    type="text"
                                    value={templateName}
                                    onChange={(e) =>
                                        setTemplateName(e.target.value)
                                    }
                                    placeholder="Nhập tên template"
                                    style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        border: "1px solid #d9d9d9",
                                        borderRadius: "4px",
                                        marginTop: "4px",
                                    }}
                                />
                            </div>

                            <div>
                                <Text strong>Mô tả:</Text>
                                <textarea
                                    value={templateDescription}
                                    onChange={(e) =>
                                        setTemplateDescription(e.target.value)
                                    }
                                    placeholder="Nhập mô tả template (tùy chọn)"
                                    rows={3}
                                    style={{
                                        width: "100%",
                                        padding: "8px 12px",
                                        border: "1px solid #d9d9d9",
                                        borderRadius: "4px",
                                        marginTop: "4px",
                                        resize: "vertical",
                                    }}
                                />
                            </div>

                            <Divider />

                            <div>
                                <Text strong>Thông tin template:</Text>
                                <div
                                    style={{
                                        marginTop: 8,
                                        padding: "12px",
                                        backgroundColor: "#f9f9f9",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <Row gutter={[16, 8]}>
                                        <Col span={12}>
                                            <Text type="secondary">
                                                File gốc:
                                            </Text>
                                            <br />
                                            <Text>{uploadedFile?.name}</Text>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">
                                                Số key:
                                            </Text>
                                            <br />
                                            <Text>{extractedKeys.length}</Text>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">
                                                Key đã cấu hình:
                                            </Text>
                                            <br />
                                            <Text>{keyConfigs.length}</Text>
                                        </Col>
                                        <Col span={12}>
                                            <Text type="secondary">
                                                Kích thước file:
                                            </Text>
                                            <br />
                                            <Text>
                                                {uploadedFile
                                                    ? (
                                                          uploadedFile.size /
                                                          1024 /
                                                          1024
                                                      ).toFixed(2) + " MB"
                                                    : "N/A"}
                                            </Text>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Space>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <Card title={title}>
                <Steps current={currentStep} style={{ marginBottom: 24 }}>
                    {steps.map((step, index) => (
                        <Step
                            key={index}
                            title={step.title}
                            description={step.description}
                            icon={step.icon}
                        />
                    ))}
                </Steps>

                <div style={{ minHeight: "400px", marginBottom: 24 }}>
                    {renderStepContent()}
                </div>

                <div style={{ textAlign: "right" }}>
                    <Space>
                        {onCancel && <Button onClick={onCancel}>Hủy</Button>}

                        {currentStep > 0 && (
                            <Button onClick={handlePrev}>Quay lại</Button>
                        )}

                        {currentStep < steps.length - 1 ? (
                            <Button
                                type="primary"
                                onClick={handleNext}
                                disabled={currentStep === 0 && !uploadedFile}
                            >
                                Tiếp theo
                                <ArrowRightOutlined />
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                loading={loading}
                                onClick={handleSaveTemplate}
                                disabled={
                                    !templateName.trim() ||
                                    keyConfigs.length === 0
                                }
                            >
                                <SaveOutlined />
                                Lưu Template
                            </Button>
                        )}
                    </Space>
                </div>
            </Card>

            <KeyConfiguration
                visible={showKeyConfig}
                keys={extractedKeys}
                selectedKey={selectedKey}
                onClose={() => setShowKeyConfig(false)}
                onSave={handleKeyConfigSave}
                existingConfigs={keyConfigs}
            />
        </div>
    );
};

export default ConfirmForm;

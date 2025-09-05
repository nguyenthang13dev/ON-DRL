import React, { useState } from "react";
import {
    Card,
    Button,
    Space,
    Typography,
    message,
    Upload,
    Input,
    Select,
    DatePicker,
    Switch,
    Form,
    Row,
    Col,
} from "antd";
import {
    FileWordOutlined,
    EyeOutlined,
    SettingOutlined,
    UploadOutlined,
    SaveOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ConfirmFormTestProps {
    onSave?: (data: any) => void;
    onCancel?: () => void;
}

const ConfirmFormTest: React.FC<ConfirmFormTestProps> = ({
    onSave,
    onCancel,
}) => {
    const [form] = Form.useForm();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [htmlPreview, setHtmlPreview] = useState<string>("");
    const [extractedKeys, setExtractedKeys] = useState<string[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    // Mock data for testing
    const mockKeys = [
        "tenNguoiDung",
        "soDienThoai",
        "gioiTinh",
        "tuoi",
        "trinhDo",
    ];
    const mockHtmlPreview = `
    <div style="font-family: 'Times New Roman', serif; padding: 20px; line-height: 1.6;">
      <h2 style="text-align: center; color: #1890ff;">ĐƠN ĐĂNG KÝ THÔNG TIN</h2>
      
      <p><strong>Họ và tên:</strong> <span style="background-color: #fff3cd; padding: 2px 4px; border-radius: 3px;">[tenNguoiDung]</span></p>
      
      <p><strong>Số điện thoại:</strong> <span style="background-color: #fff3cd; padding: 2px 4px; border-radius: 3px;">[soDienThoai]</span></p>
      
      <p><strong>Giới tính:</strong> <span style="background-color: #fff3cd; padding: 2px 4px; border-radius: 3px;">[gioiTinh]</span></p>
      
      <p><strong>Tuổi:</strong> <span style="background-color: #fff3cd; padding: 2px 4px; border-radius: 3px;">[tuoi]</span></p>
      
      <p><strong>Trình độ:</strong> <span style="background-color: #fff3cd; padding: 2px 4px; border-radius: 3px;">[trinhDo]</span></p>
      
      <div style="margin-top: 30px; text-align: right;">
        <p><em>Ngày: ......../......../........</em></p>
        <p><strong>Ký tên</strong></p>
        <p style="margin-top: 50px;"><span style="background-color: #fff3cd; padding: 2px 4px; border-radius: 3px;">[tenNguoiDung]</span></p>
      </div>
    </div>
  `;

    const handleFileUpload = (info: any) => {
        const file = info.file;
        if (file) {
            setUploadedFile(file);
            setExtractedKeys(mockKeys);
            setHtmlPreview(mockHtmlPreview);
            setShowPreview(true);
            message.success(
                `Upload thành công! Tìm thấy ${mockKeys.length} key.`,
            );
        }
    };

    const handlePreviewClick = () => {
        setShowPreview(!showPreview);
    };

    const handleSave = () => {
        const values = form.getFieldsValue();
        const data = {
            ...values,
            uploadedFile: uploadedFile?.name,
            keys: extractedKeys,
            htmlPreview,
        };

        message.success("Lưu thành công!");
        onSave?.(data);
    };

    const handleKeyClick = (key: string) => {
        message.info(`Click vào key: [${key}]`);
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
            <Card title="Test ConfirmForm - Upload Word và Cấu hình Key">
                <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="large"
                >
                    {/* Upload Section */}
                    <Card title="1. Upload File Word" size="small">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Text type="secondary">
                                Chọn file Word (.doc, .docx) để upload và test
                                tính năng
                            </Text>

                            <Upload
                                name="file"
                                accept=".doc,.docx"
                                beforeUpload={() => false}
                                onChange={handleFileUpload}
                                showUploadList={false}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    type="dashed"
                                    style={{ width: "100%", height: "60px" }}
                                >
                                    {uploadedFile
                                        ? `Đã chọn: ${uploadedFile.name}`
                                        : "Chọn file Word"}
                                </Button>
                            </Upload>

                            {uploadedFile && (
                                <div
                                    style={{
                                        padding: "12px",
                                        backgroundColor: "#f6ffed",
                                        border: "1px solid #b7eb8f",
                                        borderRadius: "4px",
                                    }}
                                >
                                    <Space>
                                        <FileWordOutlined
                                            style={{ color: "#52c41a" }}
                                        />
                                        <Text strong>{uploadedFile.name}</Text>
                                        <Text type="secondary">
                                            ({extractedKeys.length} keys)
                                        </Text>
                                    </Space>
                                </div>
                            )}
                        </Space>
                    </Card>

                    {/* Preview Section */}
                    {uploadedFile && (
                        <Card
                            title={
                                <Space>
                                    <EyeOutlined />
                                    <span>2. Preview File Word</span>
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={handlePreviewClick}
                                    >
                                        {showPreview ? "Ẩn" : "Hiện"} Preview
                                    </Button>
                                </Space>
                            }
                            size="small"
                        >
                            {showPreview && (
                                <div>
                                    <div style={{ marginBottom: 16 }}>
                                        <Text type="secondary">
                                            Tìm thấy {extractedKeys.length} key
                                            có thể cấu hình. Click vào key được
                                            highlight để test.
                                        </Text>
                                    </div>

                                    <div
                                        style={{
                                            border: "1px solid #d9d9d9",
                                            borderRadius: "6px",
                                            padding: "16px",
                                            backgroundColor: "#fff",
                                            minHeight: "300px",
                                            maxHeight: "500px",
                                            overflow: "auto",
                                            lineHeight: "1.6",
                                            fontSize: "14px",
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: htmlPreview,
                                        }}
                                        onClick={(e) => {
                                            const target =
                                                e.target as HTMLElement;
                                            if (
                                                target.style.backgroundColor ===
                                                "rgb(255, 243, 205)"
                                            ) {
                                                const keyMatch =
                                                    target.textContent?.match(
                                                        /\[(.*?)\]/,
                                                    );
                                                if (keyMatch) {
                                                    handleKeyClick(keyMatch[1]);
                                                }
                                            }
                                        }}
                                    />

                                    <div
                                        style={{
                                            marginTop: 12,
                                            padding: "8px 12px",
                                            backgroundColor: "#f0f2f5",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        <Text
                                            strong
                                            style={{ fontSize: "12px" }}
                                        >
                                            Danh sách key:{" "}
                                        </Text>
                                        <Space wrap>
                                            {extractedKeys.map((key, index) => (
                                                <Button
                                                    key={index}
                                                    type="default"
                                                    size="small"
                                                    onClick={() =>
                                                        handleKeyClick(key)
                                                    }
                                                    style={{ fontSize: "11px" }}
                                                >
                                                    [{key}]
                                                </Button>
                                            ))}
                                        </Space>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Configuration Section */}
                    {extractedKeys.length > 0 && (
                        <Card title="3. Cấu hình Form" size="small">
                            <Form form={form} layout="vertical">
                                <Row gutter={16}>
                                    {extractedKeys.map((key, index) => (
                                        <Col
                                            span={12}
                                            key={index}
                                            style={{ marginBottom: 16 }}
                                        >
                                            <Form.Item
                                                label={`[${key}]`}
                                                name={key}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: `Vui lòng nhập ${key}`,
                                                    },
                                                ]}
                                            >
                                                {key === "soDienThoai" ||
                                                key === "tuoi" ? (
                                                    <Input
                                                        type="number"
                                                        placeholder={`Nhập ${key}`}
                                                    />
                                                ) : key === "gioiTinh" ||
                                                  key === "trinhDo" ? (
                                                    <Select
                                                        placeholder={`Chọn ${key}`}
                                                    >
                                                        {key === "gioiTinh" ? (
                                                            <>
                                                                <Option value="Nam">
                                                                    Nam
                                                                </Option>
                                                                <Option value="Nữ">
                                                                    Nữ
                                                                </Option>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Option value="Trung cấp">
                                                                    Trung cấp
                                                                </Option>
                                                                <Option value="Cao đẳng">
                                                                    Cao đẳng
                                                                </Option>
                                                                <Option value="Đại học">
                                                                    Đại học
                                                                </Option>
                                                                <Option value="Thạc sĩ">
                                                                    Thạc sĩ
                                                                </Option>
                                                            </>
                                                        )}
                                                    </Select>
                                                ) : (
                                                    <Input
                                                        placeholder={`Nhập ${key}`}
                                                    />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    ))}
                                </Row>
                            </Form>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div style={{ textAlign: "right" }}>
                        <Space>
                            {onCancel && (
                                <Button onClick={onCancel}>Hủy</Button>
                            )}
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                onClick={handleSave}
                                disabled={
                                    !uploadedFile || extractedKeys.length === 0
                                }
                            >
                                Lưu và Test
                            </Button>
                        </Space>
                    </div>
                </Space>
            </Card>
        </div>
    );
};

export default ConfirmFormTest;

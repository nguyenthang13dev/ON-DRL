import React, { useState, useRef } from "react";
import { Button, Upload, message, Card, Typography, Space } from "antd";
import {
    UploadOutlined,
    FileWordOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";

const { Title, Text } = Typography;

interface WordUploadFormProps {
    onFileUploaded?: (file: File, htmlPreview: string, keys: string[]) => void;
    onFileRemoved?: () => void;
    maxSize?: number; // MB
    acceptedTypes?: string[];
}

interface UploadedFileData {
    file: File;
    htmlPreview: string;
    keys: string[];
}

const WordUploadForm: React.FC<WordUploadFormProps> = ({
    onFileUploaded,
    onFileRemoved,
    maxSize = 10, // 10MB default
    acceptedTypes = [".doc", ".docx"],
}) => {
    const [uploadedFile, setUploadedFile] = useState<UploadedFileData | null>(
        null,
    );
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
        if (!acceptedTypes.includes(fileExtension)) {
            message.error(`Chỉ chấp nhận file ${acceptedTypes.join(", ")}`);
            return;
        }

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            message.error(`File không được vượt quá ${maxSize}MB`);
            return;
        }

        setUploading(true);
        try {
            // Upload file to server and get HTML preview + keys
            const result = await uploadWordFile(file);
            setUploadedFile(result);
            onFileUploaded?.(file, result.htmlPreview, result.keys);
            message.success("Upload file Word thành công!");
        } catch (error) {
            message.error("Có lỗi xảy ra khi upload file");
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    const uploadWordFile = async (file: File): Promise<UploadedFileData> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/word/upload-and-convert", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Upload failed");
        }

        const result = await response.json();
        return {
            file,
            htmlPreview: result.htmlPreview,
            keys: result.keys || [],
        };
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onFileRemoved?.();
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card
            title={
                <Space>
                    <FileWordOutlined style={{ color: "#1890ff" }} />
                    <span>Upload File Word</span>
                </Space>
            }
            style={{ marginBottom: 16 }}
        >
            <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                    <Text type="secondary">
                        Chọn file Word (.doc, .docx) để upload và cấu hình
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                        Kích thước tối đa: {maxSize}MB
                    </Text>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes.join(",")}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />

                {!uploadedFile ? (
                    <Button
                        type="dashed"
                        icon={<UploadOutlined />}
                        onClick={handleUploadClick}
                        loading={uploading}
                        style={{ width: "100%", height: "60px" }}
                    >
                        {uploading ? "Đang upload..." : "Chọn file Word"}
                    </Button>
                ) : (
                    <Card
                        size="small"
                        style={{
                            backgroundColor: "#f6ffed",
                            border: "1px solid #b7eb8f",
                        }}
                    >
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Space>
                                    <FileWordOutlined
                                        style={{ color: "#52c41a" }}
                                    />
                                    <Text strong>{uploadedFile.file.name}</Text>
                                </Space>
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={handleRemoveFile}
                                    size="small"
                                >
                                    Xóa
                                </Button>
                            </div>

                            <div>
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    Kích thước:{" "}
                                    {(
                                        uploadedFile.file.size /
                                        1024 /
                                        1024
                                    ).toFixed(2)}{" "}
                                    MB
                                </Text>
                                <br />
                                <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                >
                                    Số key tìm thấy: {uploadedFile.keys.length}
                                </Text>
                            </div>
                        </Space>
                    </Card>
                )}
            </Space>
        </Card>
    );
};

export default WordUploadForm;

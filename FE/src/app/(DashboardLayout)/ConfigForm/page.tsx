"use client";

import React, { useState } from "react";
import { Card, Button, Space, Typography, message, Modal } from "antd";
import {
    FileWordOutlined,
    EyeOutlined,
    SettingOutlined,
    PlayCircleOutlined,
} from "@ant-design/icons";
import withAuthorization from "@/libs/authentication";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import ConfirmFormTest from "@/components/shared-components/ConfirmFormTest";

const { Title, Text } = Typography;

const TestConfirmFormPage: React.FC = () => {
    const [showTestForm, setShowTestForm] = useState(false);
    const [testResults, setTestResults] = useState<any>(null);

    const handleStartTest = () => {
        setShowTestForm(true);
    };

    const handleSaveTest = (data: any) => {
        setTestResults(data);
        setShowTestForm(false);
        message.success("Test hoàn thành!");
    };

    const handleCancelTest = () => {
        setShowTestForm(false);
    };

    return (
        <div style={{ padding: "24px" }}>
            <AutoBreadcrumb />

            <Card
                title={
                    <Space>
                        <PlayCircleOutlined style={{ color: "#1890ff" }} />
                        <span>
                            Test ConfirmForm - Upload Word và Cấu hình Key
                        </span>
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={handleStartTest}
                    >
                        Bắt đầu Test
                    </Button>
                }
            >
                <div style={{ marginBottom: 16 }}>
                    <Text type="secondary">
                        Test tính năng upload file Word, preview HTML và cấu
                        hình các key trong file Word.
                    </Text>
                </div>

                <div
                    style={{
                        padding: "20px",
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                        border: "1px dashed #d9d9d9",
                    }}
                >
                    <Title level={4}>Hướng dẫn Test:</Title>
                    <ol style={{ paddingLeft: "20px" }}>
                        <li>
                            <Text>
                                Upload file Word (.doc, .docx) - sử dụng mock
                                data để test
                            </Text>
                        </li>
                        <li>
                            <Text>Xem preview HTML được convert từ Word</Text>
                        </li>
                        <li>
                            <Text>
                                Click vào các key được highlight để test tương
                                tác
                            </Text>
                        </li>
                        <li>
                            <Text>Điền thông tin vào form cấu hình</Text>
                        </li>
                        <li>
                            <Text>Lưu và xem kết quả test</Text>
                        </li>
                    </ol>
                </div>

                {testResults && (
                    <Card
                        title="Kết quả Test"
                        size="small"
                        style={{ marginTop: 16 }}
                        extra={
                            <Button
                                size="small"
                                onClick={() => setTestResults(null)}
                            >
                                Xóa kết quả
                            </Button>
                        }
                    >
                        <pre
                            style={{
                                backgroundColor: "#f5f5f5",
                                padding: "12px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                maxHeight: "300px",
                                overflow: "auto",
                            }}
                        >
                            {JSON.stringify(testResults, null, 2)}
                        </pre>
                    </Card>
                )}
            </Card>

            <Modal
                title="Test ConfirmForm"
                open={showTestForm}
                onCancel={handleCancelTest}
                footer={null}
                width={1200}
                style={{ top: 20 }}
            >
                <ConfirmFormTest
                    onSave={handleSaveTest}
                    onCancel={handleCancelTest}
                />
            </Modal>
        </div>
    );
};

export default withAuthorization(TestConfirmFormPage, "");

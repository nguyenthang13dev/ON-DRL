"use client";
import React, { useState } from "react";
import {
    Modal,
    Form,
    Input,
    Button,
    message,
    Space,
    Typography,
    Divider,
    Alert,
} from "antd";
import {
    LockOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    SafetyOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import { authService } from "@/services/auth/auth.service";
import { ChangePasswordType, OtpType } from "@/types/auth/User";

const { Title, Text } = Typography;

interface PasswordModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
    open,
    onClose,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (values: OtpType) => {
        setLoading(true);
        try {
            const response = await authService.Edit2FA({
                otpCode: values.otpCode,
                otpCodeConfirm: values.otpCodeConfirm,
                otpCodeOld: values.otpCodeOld,
            });
            if (response.status) {
                messageApi.success("Đổi mật khẩu thành công!");
                form.resetFields();
                onSuccess?.();
                onClose();
            } else {
                messageApi.error(response.message || "Đổi mật khẩu thất bại");
            }
        } catch (error) {
            messageApi.error("Đổi mật khẩu thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={
                    <Space>
                        <LockOutlined className="text-blue-600" />
                        <span>Đổi mật khẩu</span>
                    </Space>
                }
                open={open}
                onCancel={handleCancel}
                footer={null}
                width={500}
                destroyOnClose
            >
                <Alert
                    message="Lưu ý bảo mật"
                    description="2FA gồm 6 số."
                    type="info"
                    showIcon
                    style={{ marginBottom: 24 }}
                />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    requiredMark={false}
                >
                    <Form.Item
                        label="Mật khẩu 2FA hiện tại"
                        name="otpCodeOld"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu OTP hiện tại",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu 2FA hiện tại"
                            prefix={<LockOutlined />}
                            iconRender={(visible) =>
                                visible ? (
                                    <EyeTwoTone />
                                ) : (
                                    <EyeInvisibleOutlined />
                                )
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu 2FA mới"
                        name="otpCode"
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng nhập mật khẩu mới",
                            },
                            {
                                min: 6,
                                message: "Mật khẩu phải có ít nhất 6 ký tự",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu mới"
                            prefix={<LockOutlined />}
                            iconRender={(visible) =>
                                visible ? (
                                    <EyeTwoTone />
                                ) : (
                                    <EyeInvisibleOutlined />
                                )
                            }
                        />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu 2FA mới"
                        name="otpCodeConfirm"
                        dependencies={["otpCodeConfirm"]}
                        rules={[
                            {
                                required: true,
                                message: "Vui lòng xác nhận mật khẩu mới",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("otpCode") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Mật khẩu xác nhận không khớp!",
                                        ),
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập lại mật khẩu mới"
                            prefix={<LockOutlined />}
                            iconRender={(visible) =>
                                visible ? (
                                    <EyeTwoTone />
                                ) : (
                                    <EyeInvisibleOutlined />
                                )
                            }
                        />
                    </Form.Item>

                    <Divider />

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space
                            style={{
                                width: "100%",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Button onClick={handleCancel}>Hủy</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<CheckCircleOutlined />}
                            >
                                Đổi mật khẩu
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default PasswordModal;

import React, { useEffect, useState } from "react";
import { Button, Form, Input, Alert, Select, Row, Col } from "antd";
import {
    MailOutlined,
    LockOutlined,
    UserOutlined,
    PhoneOutlined,
    HomeOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AppDispatch } from "@/store/store";
import { useSelector } from "@/store/hooks";
import { setIsLoading, setShowMessage } from "@/store/general/GeneralSlice";
import { authService } from "@/services/auth/auth.service";
import { createEditType } from "@/types/auth/User";
import { useDispatch } from "react-redux";
import GioiTinhConstant from "@/constants/QLNhanSu/GioiTinhConstant";
import Link from "next/link";

const RegisterForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const route = useRouter();
    const [form] = Form.useForm();
    const loading = useSelector((state) => state.general.isLoading);
    const showMessage = useSelector((state) => state.general.showMessage);
    const [message, setMessage] = useState<string>("");
    const gioiTinhOptions = GioiTinhConstant.getDropdownList();

    const hideAuthMessage = () => {
        dispatch(setShowMessage(false));
    };

    const onRegister = async (registerForm: createEditType) => {
        dispatch(setIsLoading(true));
        try {
            const data = await authService.register(registerForm);
            if (data != null && data.status) {
                route.push("/auth/login"); // Chuyển hướng về trang đăng nhập
            } else {
                setMessage(
                    data.message || "Đăng ký thất bại, vui lòng thử lại",
                );
                dispatch(setShowMessage(true));
            }
        } catch (err) {
            setMessage("Có lỗi xảy ra, vui lòng thử lại");
            dispatch(setShowMessage(true));
        }
        dispatch(setIsLoading(false));
    };

    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => hideAuthMessage(), 3000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [showMessage]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, marginBottom: 0 }}
                animate={{
                    opacity: showMessage ? 1 : 0,
                    marginBottom: showMessage ? 20 : 0,
                }}
            >
                <Alert type="error" showIcon message={message} />
            </motion.div>

            <Form<createEditType>
                layout="vertical"
                name="register-form"
                form={form}
                onFinish={onRegister}
            >
                <Form.Item
                    name="username"
                    label="Tài khoản"
                    rules={[
                        { required: true, message: "Vui lòng nhập tài khoản" },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined className="text-[#7c3aed]" />}
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mật khẩu"
                    rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu" },
                        { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="text-[#7c3aed]" />}
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    dependencies={["password"]}
                    rules={[
                        {
                            required: true,
                            message: "Vui lòng xác nhận mật khẩu",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (
                                    !value ||
                                    getFieldValue("password") === value
                                ) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("Mật khẩu không khớp"),
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="text-[#7c3aed]" />}
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined className="text-[#7c3aed]" />}
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        size="large"
                        className="bg-[#7c3aed] hover:bg-[#6d28d9] border-0 font-semibold"
                    >
                        Đăng ký
                    </Button>
                </Form.Item>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                    Bạn đã có tài khoản?{" "}
                    <Link
                        href="/auth/login"
                        className="text-[#7c3aed] hover:text-[#6d28d9] font-semibold"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </Form>
        </>
    );
};

export default RegisterForm;

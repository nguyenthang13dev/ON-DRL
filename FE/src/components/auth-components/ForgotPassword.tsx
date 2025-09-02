import { ForgotPasswordType } from "@/types/auth/User";
import { MailOutlined, UserAddOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Form, Input, Row } from "antd";
import { useSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import { AppDispatch } from "@/store/store";
import { setIsLoading, setShowMessage } from "@/store/general/GeneralSlice";
import { authService } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const loading = useSelector((state) => state.general.isLoading);
  const route = useRouter();
  const [message, setMessage] = useState<string>("");
  const showMessage = useSelector((state) => state.general.showMessage);
  const baseUrl = window.location.origin;

  const onSubmit = async (forgotPassword: ForgotPasswordType) => {
    dispatch(setIsLoading(true));
    try {
      forgotPassword.url = baseUrl;
      const data = await authService.forgotPassword(forgotPassword);
      if (data != null && data.status) {
        route.push("/auth/forgotPasswordConfirmation");
      } else {
        dispatch(setShowMessage(true));
        setMessage(data.message || "Tài khoản và email không khớp nhau.");
        dispatch(setShowMessage(true));
      }
      dispatch(setIsLoading(false));
    } catch (err) {
      dispatch(setShowMessage(true));
      setMessage("Lỗi.");
      dispatch(setIsLoading(false));
    }
  };
  return (
    <>
      <Form<ForgotPasswordType>
        layout="vertical"
        name="forgotPassowrd-form"
        form={form}
        onFinish={onSubmit}
      >
        {showMessage && <Alert type={"error"} showIcon message={message} />}
        <Form.Item
          name="userName"
          label="Tài khoản"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tài khoản đăng nhập",
            },
          ]}
          className="font-semibold"
        >
          <Input prefix={<UserAddOutlined className="text-primary" />} placeholder="Nhập tên đăng nhập" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Vui lòng nhập email" }]}
          className="font-semibold"

        >
          <Input prefix={<MailOutlined className="text-primary" />} placeholder="Nhập email" />
        </Form.Item>
        <Row gutter={16} className="mt-4">
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading}>
                Xác nhận
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default ForgotPassword;

import { authService } from "@/services/auth/auth.service";
import { setIsLoading, setShowMessage } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import { ResetPasswordType } from "@/types/auth/User";
import { LockOutlined, MailOutlined, UserAddOutlined } from "@ant-design/icons";
import { Alert, Button, Col, Form, Input, Row } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export const ResetPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const showMessage = useSelector((state) => state.general.showMessage);
  const [message, setMessage] = useState<string>("");
  const route = useRouter();
  const loading = useSelector((state) => state.general.isLoading);
  const searchParams = useSearchParams();
  const onSubmit = async (resetPassword: ResetPasswordType) => {
    dispatch(setIsLoading(true));

    try {
      resetPassword.token = searchParams!.get("token") ?? "";
      resetPassword.userName = searchParams!.get("username") ?? "";
      const data = await authService.resetPassword(resetPassword);
      if (data != null && data.status) {
        form.resetFields();
        route.push("/auth/resetPasswordSuccess");
      } else {
        dispatch(setShowMessage(true));
        setMessage(data.message || "Cập nhật mật khẩu thất bại.");
        dispatch(setShowMessage(true));
        form.resetFields();
      }
      dispatch(setIsLoading(false));
    } catch (err) {
      dispatch(setShowMessage(true));
      setMessage("Lỗi." + err);
      dispatch(setIsLoading(false));
      form.resetFields();
    }
  };
  return (
    <>
      <Form<ResetPasswordType>
        layout="vertical"
        name="resetpassword-form"
        form={form}
        onFinish={onSubmit}
      >
        {showMessage && <Alert type={"error"} showIcon message={message} />}
        <Form.Item
          name="password"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          ]}
          className="font-semibold"
        >
          <Input.Password
            prefix={<LockOutlined className="text-primary" />}
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Nhập lại mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          ]}
          className="font-semibold"
        >
          <Input.Password prefix={<LockOutlined className="text-primary" />} />
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

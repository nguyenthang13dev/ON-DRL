import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Alert, Row, Col, Checkbox } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppDispatch } from '@/store/store';
import { useSelector } from '@/store/hooks';
import { setIsLoading, setShowMessage } from '@/store/general/GeneralSlice';
import { authService } from '@/services/auth/auth.service';
import { LoginType } from '@/types/auth/User';
import { setLogin } from '@/store/auth/AuthSlice';
import { useDispatch } from 'react-redux';
import Link from 'next/link';

interface LoginFormProps {
  onLoginStart?: () => void;
  onLoginEnd?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginStart, onLoginEnd }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();
  const loading = useSelector((state) => state.general.isLoading);
  const showMessage = useSelector((state) => state.general.showMessage);
  const [message, setMessage] = useState<string>('');

  const hideAuthMessage = () => {
    dispatch(setShowMessage(false));
  };

  const onLogin = async (loginForm: LoginType) => {
    if (onLoginStart) onLoginStart();
    dispatch(setIsLoading(true));

    try {
      const data = await authService.login(loginForm);
      if (data != null && data.status) {
        dispatch(setLogin(data));
        
        // Kiểm tra redirect parameter để chuyển hướng
        const redirectUrl = searchParams.get('redirect');
        const targetUrl = redirectUrl && redirectUrl !== '/' ? redirectUrl : '/dashboard';
        
        router.push(targetUrl);
        // Don't call onLoginEnd here - let the loading continue until navigation completes
      } else {
        setMessage(data.message || 'Tài khoản hoặc mật khẩu không đúng');
        dispatch(setShowMessage(true));
        if (onLoginEnd) onLoginEnd();
      }
    } catch (err) {
      setMessage('Tài khoản hoặc mật khẩu không đúng');
      if (onLoginEnd) onLoginEnd();
    } finally {
      if (!showMessage) {
        dispatch(setIsLoading(false));
      }
    }
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
      {showMessage && <Alert type="error" showIcon message={message} />}
      <Form<LoginType>
        layout="vertical"
        name="login-form"
        form={form}
        onFinish={onLogin}
      >
        <Form.Item
          name="username"
          label="Tài khoản"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tài khoản đăng nhập',
            },
          ]}
          className="font-semibold"
        >
          <Input
            prefix={<UserOutlined className="text-primary" />}
            placeholder="Tên đăng nhập"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          className="font-semibold"
        >
          <Input.Password
            prefix={<LockOutlined className="text-primary" />}
            placeholder="********"
          />
        </Form.Item>
        <div className="flex justify-between items-center mb-2">
          <Form.Item name="rememberme" className="mb-0">
            <Checkbox className="font-semibold">Ghi nhớ mật khẩu</Checkbox>
          </Form.Item>
          <Link
            href="/auth/forgotPassword"
            className="font-semibold !text-gray-700 !hover:text-gray-800 italic block"
          >
            Quên mật khẩu?
          </Link>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default LoginForm;

'use client';
import {
  CheckCircleFilled,
  CheckCircleOutlined,
  LoginOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Button, Flex, Image, Layout, Result, Row } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';

const ResetPasswordSuccess: React.FC = () => {
  const route = useRouter();
  const goToLogin = () => {
    route.push('/auth/login');
  };
  const backgroundStyle = {
    backgroundImage: 'url(/img/)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };
  return (
    <>
      <div className="h-100" style={backgroundStyle}>
        <div className="container d-flex flex-column justify-content-center h-100">
          <div className="text-center mb-3">
            <div style={{ width: '100px' }} className="m-auto mb-3">
              <Image
                className="img-fluid"
                src="/img/image1329quoc-huy-viet-nam.png"
                alt="Logo"
                preview={false}
              />
            </div>
            <div className="uppercase text-3xl font-bold text-primary">
              Hệ thống quản lý
            </div>
            <div className="uppercase text-3xl font-bold  text-primary">
              Đơn thư khiếu nại, tố cáo
            </div>
          </div>
          <Row justify="center">
            <Result
              style={{
                fontFamily: `var(--font-inter), system-ui`,
              }}
              className="p-0 m-0"
              icon={<CheckCircleOutlined className="text-primary" />}
              title="Cập nhật mật khẩu mới thành công"
              subTitle={
                <span className="font-semiold ">
                  Bạn có thể sử dụng mật khẩu mới để đăng nhập vào hệ thống.
                  <Link href="/auth/login" passHref>
                    <Button icon={<LoginOutlined />} type="link">
                      Quay lại trang đăng nhập
                    </Button>
                  </Link>
                </span>
              }
            />
          </Row>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordSuccess;

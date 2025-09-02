'use client';
import { ResetPassword as ResetPasswordAuth } from '@/components/auth-components/ResetPassword';
import { Card, Col, Row, Image, Divider } from 'antd';
import React from 'react';
const backgroundStyle = {
  backgroundImage: 'url(/img/background.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

const ResetPassword: React.FC = () => {
  return (
    <div className="h-100" style={backgroundStyle}>
      <div className="container d-flex flex-column justify-content-center h-100">
        <div className="text-center mb-5">
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
          <Col
            xs={20}
            sm={20}
            md={20}
            lg={8}
            className="bg-[#FEF6DF] rounded-lg"
          >
            <div className="font-bold text-2xl text-center p-2 pt-3">
              Thay đổi mật khẩu
            </div>
            <Divider
              className="my-2"
              style={{ borderBlockStart: '2px solid var(--color-primary)' }}
            />
            <div className="py-3 px-16 pb-4">
              <ResetPasswordAuth />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default ResetPassword;

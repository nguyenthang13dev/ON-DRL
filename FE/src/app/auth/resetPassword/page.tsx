'use client';
import { ResetPassword as ResetPasswordAuth } from '@/components/auth-components/ResetPassword';
import { Card, Col, Row, Image, Divider } from 'antd';
import React from 'react';
const backgroundStyle = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
          <div className="uppercase text-3xl font-bold text-white text-center">
            Hệ thống đánh giá điểm rèn luyện sinh viên
          </div>
          <div className="uppercase text-3xl font-bold text-white text-center">
            Đại học Thủy Lợi
          </div>
        </div>
        <Row justify="center">
          <Col
            xs={20}
            sm={20}
            md={20}
            lg={8}
            className="bg-white rounded-xl shadow-2xl"
          >
            <div className="font-bold text-2xl text-center p-2 pt-6 text-[#7c3aed]">
              Thay đổi mật khẩu
            </div>
            <Divider
              className="my-2"
              style={{ borderBlockStart: '3px solid #7c3aed' }}
            />
            <div className="py-6 px-8 pb-8">
              <ResetPasswordAuth />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default ResetPassword;

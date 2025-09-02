'use client';
import React, { useState } from 'react';
import LoginForm from '@/components/auth-components/LoginForm';
import { Col, Divider, Image, Row, Spin } from 'antd';

const backgroundStyle = {
  backgroundImage: 'url(/img/bg-login2.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
};

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginStart = () => setIsLoading(true);
  const handleLoginEnd = () => setIsLoading(false);

  return (
    <div className="h-100" style={backgroundStyle}>
      <div className="container d-flex flex-column justify-content-center h-100">
        <div className="h-100 d-flex flex-column justify-content-center">
          <div className="text-center mb-4">
            <div style={{ width: '100px' }} className="m-auto mb-3">
              <Image
                className="img-fluid"
                src="/img/hinet.png"
                alt="Logo"
                preview={false}
              />
            </div>
            <div className="uppercase text-3xl font-bold text-primary">
              Hệ thống quản lý nội bộ HINET - EMS
            </div>
          </div>
          <Row justify="center">
            <Col
              xs={20}
              sm={20}
              md={20}
              lg={10}
              className="bg-[#FEF6DF] rounded-lg"
            >
              <div className="font-bold text-2xl text-center p-2 pt-3">
                Đăng nhập hệ thống
              </div>
              <Divider
                className="my-2"
                style={{ borderBlockStart: '2px solid var(--color-primary)' }}
              />
              <div className="py-3 px-16 pb-4">
                <LoginForm />
              </div>
            </Col>
          </Row>
        </div>
        <div className="flex items-center gap-6 justify-center p-1">
          <div className="text-md font-semibold" style={{ width: "250px", textAlign: "center" }}>Công ty Cổ phần Công nghệ HiNET Việt Nam</div>
          <div>
            <div className="p-1">
              P1101, Đơn nguyên 1, Tòa nhà CT4, KĐT Mỹ Đình - Mễ Trì, Nam Từ Liêm, Hà Nội
            </div>
            <div className="flex gap-6 p-1">
              <div>Điện thoại: 024 858 735 55</div>
              <div>Website: www.hinet.com.vn</div>
              <div>Email: info@hinet.com.vn</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

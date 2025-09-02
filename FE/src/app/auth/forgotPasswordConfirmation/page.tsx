'user client';
import { MailOutlined, SmileOutlined } from '@ant-design/icons';
import { Layout, Result, Image, Flex, Col, Divider, Row } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import React from 'react';

const ForgotPassowrdConfirmation = () => {
  const backgroundStyle = {
    backgroundImage: 'url(/img/background.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  };
  return (
    <>
      <div className="h-100" style={backgroundStyle}>
        <div className="container d-flex flex-column justify-content-center h-100">
          <div className="h-100 d-flex flex-column justify-content-center">
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
              <div className="uppercase text-3xl font-bold text-primary">
                trong bộ quốc phòng
              </div>
            </div>
            <Row justify="center">
              <Result
                style={{
                  fontFamily: `var(--font-inter), system-ui`,
                }}
                icon={<MailOutlined className="text-primary" />}
                title="Đã gửi email xác nhận thành công!"
                subTitle="Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn để đặt lại mật khẩu."
                className="p-0 m-0"
              />
            </Row>
          </div>
          <div className="flex items-center gap-6 justify-center p-1">
            <div className="text-md font-semibold">THANH TRA BỘ QUỐC PHÒNG</div>
            <div>
              <div className="p-1">
                Địa chỉ: 61, phố Tôn Thất Thiệp, phường Điện Biên, quận Ba Đình,
                thành phố Hà Nội
              </div>
              <div className="flex gap-6 p-1">
                <div>Điện thoại: 069.533189 / 0865.611389</div>
                <div>Fax: 069551567</div>
                <div>Email: banthuongtruc1389@mod.gov.vn</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ForgotPassowrdConfirmation;

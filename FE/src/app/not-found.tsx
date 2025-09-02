"use client";
import { Button, Row, Col, Image, ConfigProvider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import Link from "next/link";
import { APP_NAME } from "@/configs/AppConfig";

import "@/app/assets/css/global.css";
import "./(DashboardLayout)/layout.css";
import styled from "@emotion/styled";
import { lightTheme } from "@/constants/ThemeConstant";

const AuthContainer = styled.div(() => ({
  height: "100vh",
}));

const Error = () => {
  return (
    <AuthContainer>
      <ConfigProvider theme={lightTheme}>
        <div className={`h-100 bg-white`}>
          <div className="container-fluid d-flex flex-column justify-content-between h-100 px-md-4 pb-md-4 pt-md-1">
            <div>
              <Image
                className="img-fluid"
                src={`/img/logo.png`}
                alt=""
                preview={false}
              />
            </div>
            <div className="container">
              <Row align="middle">
                <Col xs={24} sm={24} md={8}>
                  <h1 className="font-weight-bold mb-4 display-4">
                    Trang không tồn tại
                  </h1>
                  <p className="font-size-md mb-4">
                    Đường dẫn không tồn tại. Vui lòng thử lại
                  </p>
                  <Link href="/dashboard">
                    <Button type="primary" icon={<ArrowLeftOutlined />}>
                      Quay lại
                    </Button>
                  </Link>
                </Col>
                <Col xs={24} sm={24} md={{ span: 14, offset: 2 }}>
                  <Image
                    className="img-fluid mt-md-0 mt-4"
                    src="/img/others/img-20.png"
                    alt=""
                    preview={false}
                  />
                </Col>
              </Row>
            </div>
            <Flex justifyContent="space-between">
              <span>
                Copyright &copy; {`${new Date().getFullYear()}`}{" "}
                <span className="font-weight-semibold">{`${APP_NAME}`}</span>
              </span>
            </Flex>
          </div>
        </div>
      </ConfigProvider>
    </AuthContainer>
  );
};

export default Error;

"use client";
import LoginForm from "@/components/auth-components/LoginForm";
import SignaturePad from "@/components/signature/SignaturePad";
import KySoInfo from "@/components/signature/SisnatureInfo";
import { Col, Divider, Image, Row } from "antd";
import React, { useState } from "react";

const backgroundStyle = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
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
            <div style={{ width: "100px" }} className="m-auto mb-3">
              {/* <Image
                className="img-fluid"
                src="/img/hinet.png"
                alt="Logo"
                preview={false}
              /> */}
            </div>
            <div className="uppercase text-3xl font-bold text-white text-center">
              Hệ thống đánh giá điểm rèn luyện sinh viên - Đại học Thủy Lợi
            </div>
          </div>
          <Row justify="center">
            <Col
              xs={20}
              sm={20}
              md={20}
              lg={10}
              className="bg-white rounded-xl shadow-2xl"
            >
              <div className="font-bold text-2xl text-center p-2 pt-6 text-[#7c3aed]">
                Đăng nhập hệ thống
              </div>
              <Divider
                className="my-2"
                style={{ borderBlockStart: "3px solid #7c3aed" }}
              />
              <div className="py-6 px-8 pb-8">
                <LoginForm />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Login;

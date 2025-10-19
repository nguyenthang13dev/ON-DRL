"use client";
import React from "react";
import ForgotPasswordForm from "@/components/auth-components/ForgotPassword";
import { Card, Row, Col, Image, Divider } from "antd";

const backgroundStyle = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
};

const forgotPassowrd: React.FC = () => {
    return (
        <div className="h-100" style={backgroundStyle}>
            <div className="container d-flex flex-column justify-content-center h-100">
                <div className="h-100 d-flex flex-column justify-content-center">
                    <div className="text-center mb-4">
                        <div style={{ width: "100px" }} className="m-auto mb-3">
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
                                Quên mật khẩu
                            </div>
                            <Divider
                                className="my-2"
                                style={{
                                    borderBlockStart: "3px solid #7c3aed",
                                }}
                            />
                            <div className="py-6 px-8 pb-8">
                                <ForgotPasswordForm />
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="flex items-center gap-6 justify-center p-1">
                    <div className="text-md font-semibold">
                        THANH TRA BỘ QUỐC PHÒNG
                    </div>
                    <div>
                        <div className="p-1">
                            Địa chỉ: 61, phố Tôn Thất Thiệp, phường Điện Biên,
                            quận Ba Đình, thành phố Hà Nội
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
    );
};

export default forgotPassowrd;

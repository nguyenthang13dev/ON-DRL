"use client";
import { tableUserDataType } from "@/types/auth/User";
import React, { useEffect, useState } from "react";
import classes from "./page.module.css";
import {
    Button,
    Card,
    message,
    Modal,
    Row,
    Col,
    Descriptions,
    Tooltip,
    Popconfirm,
} from "antd";
import Flex from "@/components/shared-components/Flex";
import AutoBreadcrumb from "@/components/util-compenents/Breadcrumb";
import {
    EditOutlined,
    UserOutlined,
    InfoCircleOutlined,
    PhoneOutlined,
    MailOutlined,
    HomeOutlined,
    TeamOutlined,
    DeleteOutlined,
    LockOutlined,
    SafetyOutlined,
} from "@ant-design/icons";
import UpdateProfile from "./updateProfile";
import { userService } from "@/services/user/user.service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Avatar from "./Components/avatar";
import ChangeAvatar from "./Components/changeAvatar";
import PasswordModal from "./Components/password";

dayjs.extend(utc);
const Profile = () => {
    const [userInfo, getUserInfo] = useState<tableUserDataType>();
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isOpenModalAvatar, setIsOpenModalAvatar] = useState<boolean>(false);
    const [isOpenModalPassword, setIsOpenModalPassword] =
        useState<boolean>(false);
    const [messageApi, contextHolder] = message.useMessage();
    const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

    const handleShowModal = () => {
        setIsOpenModal(true);
    };

    const handleClose = () => {
        setIsOpenModal(false);
    };

    const hanleEditSuccess = () => {
        setIsOpenModal(false);
        loadData();
    };

    const handleShowModalAvatar = () => {
        setIsOpenModalAvatar(true);
    };

    const handleCloseAvatar = () => {
        setIsOpenModalAvatar(false);
    };

    const hanleEditAvatarSuccess = () => {
        setIsOpenModalAvatar(false);
        messageApi.success("Cập nhật thành công!");
        loadData();
    };

    const handleShowModalPassword = () => {
        setIsOpenModalPassword(true);
    };

    const handleClosePassword = () => {
        setIsOpenModalPassword(false);
    };

    const loadData = async () => {
        const response = await userService.GetProfile();
        if (response.status) {
            console.log(response.data);
            getUserInfo(response.data);
        }
    };
    const handlePasswordSuccess = () => {
        setIsOpenModalPassword(false);
        loadData();
        messageApi.success("Đổi mật khẩu thành công!");
    };
    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            {contextHolder}
            <Flex
                alignItems="center"
                justifyContent="space-between"
                className="mb-2 flex-wrap justify-content-end"
            >
                <AutoBreadcrumb />
                <div className="flex gap-2">
                    <Button
                        icon={<EditOutlined className="text-white" />}
                        size="middle"
                        type="primary"
                        danger
                        className="flex items-center shadow-sm hover:shadow-md transition-all duration-300"
                        onClick={handleShowModal}
                    >
                        Sửa thông tin
                    </Button>
                    <Button
                        icon={<LockOutlined className="text-white" />}
                        size="middle"
                        type="primary"
                        className="flex items-center shadow-sm hover:shadow-md transition-all duration-300"
                        onClick={handleShowModalPassword}
                    >
                        Đổi mật khẩu
                    </Button>
                </div>
            </Flex>

            <Card
                className={classes.profileCard}
                bordered={false}
                headStyle={{
                    backgroundColor: "#fff1f2",
                    borderBottom: "2px solid #fda4af",
                }}
            >
                <Row gutter={[16, 12]} align="top">
                    <Col
                        xs={24}
                        sm={7}
                        md={5}
                        lg={4}
                        xl={4}
                        className={classes.avatarCol}
                    >
                        <Avatar
                            src={`${StaticFileUrl}${userInfo?.picture ?? ""}`}
                            onSuccess={hanleEditAvatarSuccess}
                            onClose={handleCloseAvatar}
                            onOpen={handleShowModalAvatar}
                        />
                    </Col>
                    <Col xs={24} sm={17} md={19} lg={20} xl={20}>
                        <div
                            className={`${classes.sectionTitle} pl-2 py-2 rounded-r-md mb-3`}
                        >
                            <UserOutlined className="text-rose-600 mr-2" />
                            <span className="font-medium text-rose-700">
                                Thông tin tài khoản
                            </span>
                        </div>
                        <Descriptions
                            bordered
                            column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                            size="small"
                            className={`${classes.userInfo} ${classes.accountInfo}`}
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                borderLeft: "1px solid #fecdd3",
                            }}
                        >
                            <Descriptions.Item
                                label={
                                    <span className="flex items-center">
                                        <UserOutlined className="mr-2 text-rose-500" />{" "}
                                        Tên tài khoản
                                    </span>
                                }
                            >
                                <span className="text-gray-700">
                                    {userInfo?.userName || "Chưa cập nhật"}
                                </span>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <span className="flex items-center">
                                        <TeamOutlined className="mr-2 text-rose-500" />{" "}
                                        Vai trò
                                    </span>
                                }
                            >
                                {userInfo?.listRole?.length
                                    ? userInfo.listRole.map((role, index) => (
                                          <div
                                              key={index}
                                              className="py-1 px-2 bg-rose-50 border border-rose-200 rounded-md inline-block mr-2 mb-1"
                                          >
                                              {role}
                                          </div>
                                      ))
                                    : "Chưa cập nhật"}
                            </Descriptions.Item>
                        </Descriptions>

                        <div
                            className={`${classes.sectionTitle} pl-2 py-2 rounded-r-md mb-3`}
                        >
                            <InfoCircleOutlined className="text-rose-600 mr-2" />
                            <span className="font-medium text-rose-700">
                                Thông tin cá nhân
                            </span>
                        </div>
                        <Descriptions
                            bordered
                            column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                            size="small"
                            className={`${classes.userInfo} ${classes.personalInfo} `}
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                borderLeft: "1px solid #fecdd3",
                            }}
                        >
                            <Descriptions.Item
                                className="bg-rose-50"
                                label={
                                    <span className="flex items-center">
                                        <UserOutlined className="mr-2 text-rose-500 " />{" "}
                                        Họ tên
                                    </span>
                                }
                            >
                                {userInfo?.name || "Chưa cập nhật"}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <span className="flex items-center">
                                        <InfoCircleOutlined className="mr-2 text-rose-500" />{" "}
                                        Giới tính
                                    </span>
                                }
                            >
                                {userInfo?.gioiTinh_txt || "Chưa cập nhật"}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <span className="flex items-center">
                                        <InfoCircleOutlined className="mr-2 text-rose-500" />{" "}
                                        Ngày sinh
                                    </span>
                                }
                            >
                                {userInfo?.ngaySinh
                                    ? dayjs(userInfo.ngaySinh).format(
                                          "DD-MM-YYYY",
                                      )
                                    : "Chưa cập nhật"}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <span className="flex items-center">
                                        <PhoneOutlined className="mr-2 text-rose-500" />{" "}
                                        Điện thoại
                                    </span>
                                }
                            >
                                {userInfo?.phoneNumber || "Chưa cập nhật"}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <span className="flex items-center">
                                        <MailOutlined className="mr-2 text-rose-500" />{" "}
                                        Email
                                    </span>
                                }
                            >
                                {userInfo?.email || "Chưa cập nhật"}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <span className="flex items-center">
                                        <HomeOutlined className="mr-2 text-rose-500" />{" "}
                                        Địa chỉ
                                    </span>
                                }
                            >
                                {userInfo?.diaChi || "Chưa cập nhật"}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <span className="flex items-center">
                                        <TeamOutlined className="mr-2 text-rose-500" />{" "}
                                        Đơn vị
                                    </span>
                                }
                                span={2}
                            >
                                {userInfo?.tenDonVi_txt || "Chưa cập nhật"}
                            </Descriptions.Item>
                        </Descriptions>

                        <div
                            className={`${classes.sectionTitle} pl-2 py-2 rounded-r-md mb-3`}
                        >
                            <SafetyOutlined className="text-rose-600 mr-2" />
                            <span className="font-medium text-rose-700">
                                Thông tin bảo mật
                            </span>
                        </div>
                        <Descriptions
                            bordered
                            column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                            size="small"
                            className={`${classes.userInfo} ${classes.personalInfo}`}
                            contentStyle={{
                                backgroundColor: "#ffffff",
                                borderLeft: "1px solid #fecdd3",
                            }}
                        >
                            <Descriptions.Item
                                label={
                                    <span className="flex items-center">
                                        <LockOutlined className="mr-2 text-rose-500" />{" "}
                                        Mật khẩu 2FA
                                    </span>
                                }
                            >
                                <span className="text-gray-600">
                                    {" "}
                                    {userInfo?.otp || "Chưa cập nhật"}
                                </span>
                                <Button
                                    type="link"
                                    size="small"
                                    onClick={handleShowModalPassword}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    Đổi mật khẩu
                                </Button>
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={
                                    <span className="flex items-center">
                                        <SafetyOutlined className="mr-2 text-rose-500" />{" "}
                                        Xác thực 2FA
                                    </span>
                                }
                            >
                                {!userInfo?.otp ? (
                                    <span className="text-orange-600 font-medium">
                                        ⚠ Chưa kích hoạt
                                    </span>
                                ) : (
                                    <span className="text-green-600 font-medium">
                                        ✓ Đã kích hoạt
                                    </span>
                                )}
                            </Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>
            </Card>

            {isOpenModal && (
                <UpdateProfile
                    onSuccess={hanleEditSuccess}
                    onClose={handleClose}
                    item={userInfo}
                />
            )}
            {isOpenModalAvatar && (
                <ChangeAvatar
                    onSuccess={hanleEditAvatarSuccess}
                    onClose={handleCloseAvatar}
                />
            )}
            {isOpenModalPassword && (
                <PasswordModal
                    open={isOpenModalPassword}
                    onClose={handleClosePassword}
                    onSuccess={handlePasswordSuccess}
                />
            )}
        </>
    );
};

export default Profile;

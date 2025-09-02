'use client'
import { tableUserDataType } from '@/types/auth/User';
import React, { useEffect, useState } from 'react'
import classes from './page.module.css'
import { Button, Card, message, Modal, Row, Col, Descriptions, Tooltip, Popconfirm } from 'antd';
import Flex from '@/components/shared-components/Flex';
import AutoBreadcrumb from '@/components/util-compenents/Breadcrumb';
import { EditOutlined, UserOutlined, InfoCircleOutlined, PhoneOutlined, MailOutlined, HomeOutlined, TeamOutlined, DeleteOutlined } from '@ant-design/icons';
import UpdateProfile from './updateProfile';
import { userService } from '@/services/user/user.service';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Avatar from './Components/avatar';
import ChangeAvatar from './Components/changeAvatar';
import userTelegramService from '@/services/userTelegram/UserTelegramService';
import { UserTelegramDto } from '@/types/userTelegram/UserTelegram';
dayjs.extend(utc);
const Profile = () => {
  const [userInfo, getUserInfo] = useState<tableUserDataType>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isOpenModalAvatar, setIsOpenModalAvatar] = useState<boolean>(false);
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
    messageApi.success('Cập nhật thành công!')
    loadData();
  };

  const loadData = async () => {
    const response = await userService.GetProfile();
    if (response.status) {
      getUserInfo(response.data);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // State cho danh sách tài khoản Telegram đã liên kết
  const [linkedTeleAccounts, setLinkedTeleAccounts] = useState<UserTelegramDto[]>([]);

  useEffect(() => {
    const fetchLinkedTeleAccounts = async () => {
      try {
        const res = await userTelegramService.getAllLinked();
        if (res.status && Array.isArray(res.data)) {
          setLinkedTeleAccounts(res.data);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchLinkedTeleAccounts();
  }, []);

  // Hàm hủy liên kết tài khoản Telegram
  const handleUnlinkTelegram = async (chatId: string) => {
    try {
      const res = await userTelegramService.unlinkByChatIds([chatId]);
      if (res.status) {
        messageApi.success('Hủy liên kết thành công!');
        // Reload lại danh sách tài khoản đã liên kết
        const updatedRes = await userTelegramService.getAllLinked();
        if (updatedRes.status && Array.isArray(updatedRes.data)) {
          setLinkedTeleAccounts(updatedRes.data);
        }
      } else {
        messageApi.error(res.message || 'Hủy liên kết thất bại!');
      }
    } catch (error) {
      messageApi.error('Có lỗi xảy ra khi hủy liên kết!');
    }
  };

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
          </div>
        </Flex>

        <Card
            className={classes.profileCard}
            bordered={false}
            headStyle={{ backgroundColor: '#fff1f2', borderBottom: '2px solid #fda4af' }}
        >
          <Row gutter={[16, 12]} align="top">
            <Col xs={24} sm={7} md={5} lg={4} xl={4} className={classes.avatarCol}>
              <Avatar
                  src={`${StaticFileUrl}${userInfo?.picture ?? ''}`}
                  onSuccess={hanleEditAvatarSuccess}
                  onClose={handleCloseAvatar}
                  onOpen={handleShowModalAvatar}
              />
            </Col>
            <Col xs={24} sm={17} md={19} lg={20} xl={20}>
              <div className={`${classes.sectionTitle} pl-2 py-2 rounded-r-md mb-3`}>
                <UserOutlined className="text-rose-600 mr-2" />
                <span className="font-medium text-rose-700">Thông tin tài khoản</span>
              </div>
              <Descriptions
                  bordered
                  column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                  size="small"
                  className={`${classes.userInfo} ${classes.accountInfo}`}
                  contentStyle={{ backgroundColor: '#ffffff', borderLeft: '1px solid #fecdd3' }}
              >
                <Descriptions.Item
                    label={
                      <span className="flex items-center">
                    <UserOutlined className="mr-2 text-rose-500" /> Tên tài khoản
                  </span>
                    }
                >
                <span className="text-gray-700">
                  {userInfo?.userName || 'Chưa cập nhật'}
                </span>
                </Descriptions.Item>
                <Descriptions.Item
                    label={
                      <span className="flex items-center">
                    <TeamOutlined className="mr-2 text-rose-500" /> Vai trò
                  </span>
                    }
                >
                  {userInfo?.listRole?.length ? (
                      userInfo.listRole.map((role, index) => (
                          <div key={index} className="py-1 px-2 bg-rose-50 border border-rose-200 rounded-md inline-block mr-2 mb-1">
                            {role}
                          </div>
                      ))
                  ) : (
                      'Chưa cập nhật'
                  )}
                </Descriptions.Item>
              </Descriptions>

              <div className={`${classes.sectionTitle} pl-2 py-2 rounded-r-md mb-3`}>
                <InfoCircleOutlined className="text-rose-600 mr-2" />
                <span className="font-medium text-rose-700">Thông tin cá nhân</span>
              </div>
              <Descriptions
                  bordered
                  column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2 }}
                  size="small"
                  className={`${classes.userInfo} ${classes.personalInfo} `}
                  contentStyle={{ backgroundColor: '#ffffff', borderLeft: '1px solid #fecdd3' }}
              >
                <Descriptions.Item
                    className="bg-rose-50"
                    label={
                      <span className="flex items-center">
                    <UserOutlined className="mr-2 text-rose-500 " /> Họ tên
                  </span>
                    }
                >
                  {userInfo?.name || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item
                    label={
                      <span className="flex items-center">
                    <InfoCircleOutlined className="mr-2 text-rose-500" /> Giới tính
                  </span>
                    }
                >
                  {userInfo?.gioiTinh_txt || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item
                    label={
                      <span className="flex items-center">
                    <InfoCircleOutlined className="mr-2 text-rose-500" /> Ngày sinh
                  </span>
                    }
                >
                  {userInfo?.ngaySinh ? dayjs(userInfo.ngaySinh).format('DD-MM-YYYY') : 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item
                    label={
                      <span className="flex items-center">
                    <PhoneOutlined className="mr-2 text-rose-500" /> Điện thoại
                  </span>
                    }
                >
                  {userInfo?.phoneNumber || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item
                    label={
                      <span className="flex items-center">
                    <MailOutlined className="mr-2 text-rose-500" /> Email
                  </span>
                    }
                >
                  {userInfo?.email || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item
                    label={
                      <span className="flex items-center">
                    <HomeOutlined className="mr-2 text-rose-500" /> Địa chỉ
                  </span>
                    }
                >
                  {userInfo?.diaChi || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item
                    label={
                      <span className="flex items-center">
                    <TeamOutlined className="mr-2 text-rose-500" /> Đơn vị
                  </span>
                    }
                    span={2}
                >
                  {userInfo?.tenDonVi_txt || 'Chưa cập nhật'}
                </Descriptions.Item>
              </Descriptions>
              {/* Hiển thị tài khoản Telegram đã liên kết */}
              {linkedTeleAccounts.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div className="font-medium text-rose-700 mb-2 flex items-center">
                    <UserOutlined className="text-rose-600 mr-2" />
                    Tài khoản Telegram đã liên kết
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    {linkedTeleAccounts.map(acc => (
                      <div key={acc.id} style={{
                        background: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        borderRadius: 10,
                        padding: 12,
                        minWidth: 220
                      }}>
                        <div><b>ChatId:</b> {acc.chatId}</div>
                        <div><b>Họ tên:</b> {acc.fullName || '-'}</div>
                        <div><b>Ngày liên kết:</b> {acc.linkedAt ? new Date(acc.linkedAt).toLocaleString() : '-'}</div>
                        <div><b>Trạng thái:</b> {acc.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</div>
                        <div style={{ marginTop: 8 }}>
                          <Popconfirm
                            title="Hủy liên kết"
                            description="Bạn có chắc chắn muốn hủy liên kết tài khoản Telegram này?"
                            onConfirm={() => handleUnlinkTelegram(acc.chatId)}
                            okText="Có"
                            cancelText="Không"
                          >
                            <Button
                              type="primary"
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                            >
                              Hủy liên kết
                            </Button>
                          </Popconfirm>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
      </>
  )
}

export default Profile;
import React from "react";
import {
  HomeOutlined,
  EnvironmentOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Descriptions, Typography, Tag, theme } from "antd";
import { DescriptionsProps } from "antd";
import { NS_NhanSuType } from "@/types/QLNhanSu/nS_NhanSu/nS_NhanSu";

const { Text } = Typography;

interface Props {
  userInfo?: NS_NhanSuType;
}

const BasicInfoDescription: React.FC<Props> = ({ userInfo }) => {
  const {
    token: { colorTextSecondary },
  } = theme.useToken();

  const labelStyle: React.CSSProperties = {
    fontWeight: 500,
    color: colorTextSecondary,
    background: "#fafafa",
    padding: "8px 12px",
  };

  const contentStyle: React.CSSProperties = {
    padding: "8px 12px",
  };

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      span: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
      label: (
        <>
          <UserOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          Họ và tên
        </>
      ),
      children: <Text>{userInfo?.hoTen || <i>Chưa cập nhật</i>}</Text>,
    },
    {
      key: "2",
      span: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
      label: (
        <>
          <IdcardOutlined style={{ marginRight: 8, color: "#722ed1" }} />
          Mã số nhân viên
        </>
      ),
      children: <Text>{userInfo?.maNV || <i>Chưa cập nhật</i>}</Text>,
    },
    {
      key: "3",
      span: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
      label: (
        <>
          <MailOutlined style={{ marginRight: 8, color: "#1677ff" }} />
          Email
        </>
      ),
      children: <Text>{userInfo?.email || <i>Chưa cập nhật</i>}</Text>,
    },
    {
      key: "4",
      span: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
      label: (
        <>
          <PhoneOutlined style={{ marginRight: 8, color: "#389e0d" }} />
          Điện thoại
        </>
      ),
      children: <Text>{userInfo?.dienThoai || <i>Chưa cập nhật</i>}</Text>,
    },
    {
      key: "5",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      label: (
        <>
          <HomeOutlined style={{ marginRight: 8, color: "#faad14" }} />
          Địa chỉ thường trú
        </>
      ),
      children: (
        <Text>{userInfo?.diaChiThuongTru || <i>Chưa cập nhật</i>}</Text>
      ),
    },
    {
      key: "6",
      span: { xs: 1, sm: 2, md: 3, lg: 3, xl: 2, xxl: 2 },
      label: (
        <>
          <EnvironmentOutlined style={{ marginRight: 8, color: "#13c2c2" }} />
          Địa chỉ tạm trú
        </>
      ),
      children: <Text>{userInfo?.diaChiTamTru || <i>Chưa cập nhật</i>}</Text>,
    },
  ];

  return (
    <Descriptions
      bordered
      size="small"
      column={{ xs: 1, sm: 1, md: 2 }}
      layout="horizontal"
      labelStyle={labelStyle}
      contentStyle={contentStyle}
    >
      {items.map((item) => (
        <Descriptions.Item key={item.key} label={item.label} span={item.span}>
          {item.children}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
};

export default BasicInfoDescription;

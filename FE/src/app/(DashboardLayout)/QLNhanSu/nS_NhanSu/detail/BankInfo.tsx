import React from "react";
import {
  BankOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { Descriptions, Typography, theme } from "antd";
import { DescriptionsProps } from "antd";
import { NS_NhanSuType } from "@/types/QLNhanSu/nS_NhanSu/nS_NhanSu";

const { Text } = Typography;

interface Props {
  userInfo?: NS_NhanSuType;
}

const BankInfoDescription: React.FC<Props> = ({ userInfo }) => {
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
      span: 2,
      label: (
        <>
          <BankOutlined style={{ marginRight: 8, color: "#52c41a" }} />
          Ngân hàng
        </>
      ),
      children: <Text>{userInfo?.nganHang || <i>Chưa cập nhật</i>}</Text>,
    },
    {
      key: "2",
      span: 2,
      label: (
        <>
          <CreditCardOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          Số tài khoản
        </>
      ),
      children: (
        <Text>{userInfo?.soTaiKhoanNganHang || <i>Chưa cập nhật</i>}</Text>
      ),
    },
  ];

  return (
    <Descriptions
      bordered
      size="middle"
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

export default BankInfoDescription;

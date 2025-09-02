import React from "react";
import {
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  IdcardOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Descriptions, Typography, Tag, theme } from "antd";
import { DescriptionsProps } from "antd";
import { NS_NhanSuType } from "@/types/QLNhanSu/nS_NhanSu/nS_NhanSu";
import dayjs from "dayjs";

const { Text } = Typography;

interface Props {
  userInfo?: NS_NhanSuType;
}

const PersonalInfoDescription: React.FC<Props> = ({ userInfo }) => {
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
      key: "6",
      span: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 1 },
      label: (
        <>
          <FileTextOutlined style={{ marginRight: 8, color: "#d46b08" }} />
          Mã số thuế
        </>
      ),
      children: (
        <Text>
          {userInfo?.maSoThueCaNhan ?? <i>Chưa cập nhật</i>}
        </Text>
      ),
    },
    {
      key: "1",
      span: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 1 },
      label: (
        <>
          <CalendarOutlined style={{ marginRight: 8, color: "#52c41a" }} />
          Ngày sinh
        </>
      ),
      children: (
        <Text>
          {userInfo?.ngaySinh ? (
            dayjs(userInfo.ngaySinh).format("DD/MM/YYYY")
          ) : (
            <i>Chưa cập nhật</i>
          )}
        </Text>
      ),
    },
    {
      key: "2",
      span: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3, xxl: 1 },
      label: (
        <>
          <ManOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          Giới tính
        </>
      ),
      children:
        userInfo?.gioiTinh === 1 ? (
          <Tag icon={<ManOutlined />} color="blue">
            Nam
          </Tag>
        ) : userInfo?.gioiTinh === 2 ? (
          <Tag icon={<WomanOutlined />} color="magenta">
            Nữ
          </Tag>
        ) : (
          <i>Chưa cập nhật</i>
        ),
    },
    {
      key: "3",
      span: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
      label: (
        <>
          <IdcardOutlined style={{ marginRight: 8, color: "#722ed1" }} />
          CMND/CCCD
        </>
      ),
      children: <Text>{userInfo?.cMND || <i>Chưa cập nhật</i>}</Text>,
    },
    {
      key: "4",
      span: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 },
      label: (
        <>
          <ClockCircleOutlined style={{ marginRight: 8, color: "#fa541c" }} />
          Ngày cấp
        </>
      ),
      children: (
        <Text>
          {userInfo?.ngayCapCMND ? (
            dayjs(userInfo.ngayCapCMND).format("DD/MM/YYYY")
          ) : (
            <i>Chưa cập nhật</i>
          )}
        </Text>
      ),
    },
    {
      key: "5",
      span: { xs: 3, sm: 3, md: 3, lg: 3, xl: 3, xxl: 3 },
      label: (
        <>
          <EnvironmentOutlined style={{ marginRight: 8, color: "#13c2c2" }} />
          Nơi cấp
        </>
      ),
      children: <Text>{userInfo?.noiCapCMND || <i>Chưa cập nhật</i>}</Text>,
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

export default PersonalInfoDescription;

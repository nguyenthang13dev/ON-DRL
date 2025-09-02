import React from "react";
import {
  CalendarOutlined,
  ApartmentOutlined,
  SolutionOutlined,
  HourglassOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from "@ant-design/icons";
import { Descriptions, Typography, Tag, theme } from "antd";
import { DescriptionsProps } from "antd";
import { NS_NhanSuType } from "@/types/QLNhanSu/nS_NhanSu/nS_NhanSu";
import dayjs, { Dayjs } from "dayjs";

const { Text } = Typography;

interface Props {
  userInfo?: NS_NhanSuType;
}

const WorkInfoDescription: React.FC<Props> = ({ userInfo }) => {
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

  const calcWorkingDuration = (startDate?: string | Dayjs | null) => {
    if (!startDate) return <i>Chưa cập nhật</i>;
    const start = dayjs(startDate);
    const now = dayjs();

    const years = now.diff(start, "year");
    const months = now.subtract(years, "year").diff(start, "month");

    let result = "";
    if (years > 0) result += `${years} năm `;
    if (months > 0) result += `${months} tháng`;
    if (result === "") result = "Dưới 1 tháng";
    return result.trim();
  };

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      span: 2,
      label: (
        <>
          <SolutionOutlined style={{ marginRight: 8, color: "#1677ff" }} />
          Chức vụ
        </>
      ),
      children: <Text>{userInfo?.chucVu_txt || <i>Chưa cập nhật</i>}</Text>,
    },
    {
      key: "2",
      span: 2,
      label: (
        <>
          <ApartmentOutlined style={{ marginRight: 8, color: "#fa8c16" }} />
          Phòng ban
        </>
      ),
      children: <Text>{userInfo?.phongBan_txt || <i>Chưa cập nhật</i>}</Text>,
    },
    {
      key: "3",
      span: 1,
      label: (
        <>
          <CalendarOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          Ngày vào làm
        </>
      ),
      children: (
        <Text>
          {userInfo?.ngayVaoLam ? (
            dayjs(userInfo.ngayVaoLam).format("DD/MM/YYYY")
          ) : (
            <i>Chưa cập nhật</i>
          )}
        </Text>
      ),
    },
    {
      key: "4",
      span: 1,
      label: (
        <>
          <HourglassOutlined style={{ marginRight: 8, color: "#722ed1" }} />
          Thời gian làm việc
        </>
      ),
      children: <Text>{calcWorkingDuration(userInfo?.ngayVaoLam)}</Text>,
    },
    {
      key: "5",
      span: 2,
      label: (
        <>
          <CheckCircleTwoTone
            twoToneColor="#52c41a"
            style={{ marginRight: 8 }}
          />
          Trạng thái
        </>
      ),
      children:
        Number(userInfo?.trangThai) === 1 ? (
          <Tag
            color="processing"
            icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
            style={{ borderRadius: 20, padding: "2px 12px" }}
          >
            Đang làm việc
          </Tag>
        ) : (
          <Tag
            color="default"
            icon={<CloseCircleTwoTone twoToneColor="#999" />}
            style={{ borderRadius: 20, padding: "2px 12px" }}
          >
            Đã nghỉ việc
          </Tag>
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

export default WorkInfoDescription;

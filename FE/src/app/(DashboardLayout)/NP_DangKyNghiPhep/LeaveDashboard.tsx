import { Card, Col, Row } from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  HourglassOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import React from "react";
import { ThongTinNghiPhepType } from "@/types/NP_DangKyNghiPhep/NP_DangKyNghiphep";

const LeaveCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) => (
  <Card
    style={{ borderRadius: 8, width: "100%" }}
    bodyStyle={{
      display: "flex",
      alignItems: "center",
      padding: 16,
    }}
  >
    <div
      style={{
        backgroundColor: color,
        borderRadius: 12,
        padding: 12,
        marginRight: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {React.cloneElement(icon as React.ReactElement, {
        style: { fontSize: 24, color: "white" },
      })}
    </div>
    <div>
      <div style={{ fontSize: 20, fontWeight: "bold" }}>{value}</div>
      <div style={{ color: "#888" }}>{title}</div>
    </div>
  </Card>
);

const LeaveDashboard = (thongKe: ThongTinNghiPhepType) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <LeaveCard
          title="Số ngày phép"
          value={thongKe.tongSoNgayPhep ?? 0}
          icon={<CalendarOutlined />}
          color="#1890ff"
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <LeaveCard
          title="Đã sử dụng"
          value={thongKe.soNgayPhepDaSuDung ?? 0}
          icon={<CheckCircleOutlined />}
          color="#52c41a"
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <LeaveCard
          title="Còn lại"
          value={thongKe.soNgayPhepConLai ?? 0}
          icon={<HourglassOutlined />}
          color="#13c2c2"
        />
      </Col>
    </Row>
  );
};

export default LeaveDashboard;

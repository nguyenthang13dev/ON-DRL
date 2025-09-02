import React from "react";
import { Row, Col, Card } from "antd";
import DanhSachNS from "./Components/DanhSachNS";

const NS_BaoCaoThongKePage: React.FC = () => {
  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Hàng 1: Employee Status và Attendance Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={12}>
          {/* <Card
            style={{ height: "400px" }}
            bodyStyle={{ height: "calc(100% - 57px)" }}
          >
            <div style={{ marginTop: "10px" }}>
              <DanhSachNS />
            </div>
          </Card> */}
          <DanhSachNS />
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Attendance Overview"
            style={{ height: "400px" }}
            bodyStyle={{ height: "calc(100% - 57px)" }}
          >
            {/* Component Attendance Overview sẽ được thêm vào đây */}
          </Card>
        </Col>
      </Row>

      {/* Hàng 2: Clock-in/Out và Jobs Applicants */}
      <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={12}>
          <Card
            title="Clock-in/Out"
            style={{ height: "400px" }}
            bodyStyle={{ height: "calc(100% - 57px)" }}
          >
            {/* Component Clock-in/Out sẽ được thêm vào đây */}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Jobs Applicants"
            style={{ height: "400px" }}
            bodyStyle={{ height: "calc(100% - 57px)" }}
          >
            {/* Component Jobs Applicants sẽ được thêm vào đây */}
          </Card>
        </Col>
      </Row>

      {/* Hàng 3: Employees và Todo */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title="Employees"
            style={{ height: "400px" }}
            bodyStyle={{ height: "calc(100% - 57px)" }}
          >
            {/* Component Employees sẽ được thêm vào đây */}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Todo"
            style={{ height: "400px" }}
            bodyStyle={{ height: "calc(100% - 57px)" }}
          >
            {/* Component Todo sẽ được thêm vào đây */}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NS_BaoCaoThongKePage;

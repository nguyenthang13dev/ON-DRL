import React from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Descriptions,
  Space,
  Statistic,
  List,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { MdAccessTime } from "react-icons/md";
import { TbCalendarOff } from "react-icons/tb";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { DataTableChamCongType } from "@/types/QLNhanSu/nS_ChamCong/nS_ChamCong";
import TrangThaiChamCongConstant from "@/constants/QLNhanSu/TrangThaiChamCongConstant";

const { Title, Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  employeeData: DataTableChamCongType | null;
  startDate?: string;
  endDate?: string;
  isFullScreen?: boolean; // Thêm prop để biết có phải fullscreen không
}

const ChamCongDetailModal: React.FC<Props> = ({
  open,
  onClose,
  employeeData,
  startDate = dayjs()
    .subtract(1, "month")
    .startOf("month")
    .format("DD/MM/YYYY"),
  endDate = dayjs().subtract(1, "month").endOf("month").format("DD/MM/YYYY"),
  isFullScreen = false,
}) => {
  if (!employeeData) return null;

  // Tính toán thống kê chấm công (không tính ngày chủ nhật)
  const calculateStatistics = () => {
    const startDateParsed = dayjs(startDate, "DD/MM/YYYY");
    const daysInMonth = startDateParsed.isValid()
      ? startDateParsed.daysInMonth()
      : 31;

    const stats = {
      tongNgayLam: 0,
      ngayBinhThuong: 0,
      ngayDiMuon: 0,
      ngayVeSom: 0,
      ngayChuaCham: 0,
      ngayNghiLe: 0,
      ngayNghiPhep: 0,
    };

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = startDateParsed.date(day);
      const isSunday = currentDay.day() === 0;
      if (isSunday) {
        continue;
      }
      const dayData = employeeData.dataOfDate?.[`day_${day}`];
      if (
        dayData &&
        dayData.trangThai !== undefined &&
        dayData.trangThai !== null
      ) {
        switch (dayData.trangThai) {
          case TrangThaiChamCongConstant.BinhThuong:
            stats.ngayBinhThuong++;
            break;
          case TrangThaiChamCongConstant.DiMuon:
            stats.ngayDiMuon++;
            break;
          case TrangThaiChamCongConstant.VeSom:
            stats.ngayVeSom++;
            break;
          case TrangThaiChamCongConstant.ChuaChamCong:
            // Kiểm tra xem có phải nghỉ lễ, nghỉ phép hay thực sự chưa chấm công
            if (dayData.isNghiLe) {
              stats.ngayNghiLe++;
            } else if (dayData.isNghiPhep) {
              stats.ngayNghiPhep++;
            } else {
              stats.ngayChuaCham++;
            }
            break;
        }
      }
    }

    stats.tongNgayLam = stats.ngayBinhThuong + stats.ngayDiMuon;

    return stats;
  };

  // Lấy danh sách ngày có dữ liệu chấm công (không bao gồm chủ nhật)
  const getAttendanceData = () => {
    const startDateParsed = dayjs(startDate, "DD/MM/YYYY");
    const daysInMonth = startDateParsed.isValid()
      ? startDateParsed.daysInMonth()
      : 31;

    const attendanceList = [];

    for (let day = 1; day <= daysInMonth; day++) {
      // Kiểm tra nếu là chủ nhật thì bỏ qua
      const currentDay = startDateParsed.date(day);
      const isSunday = currentDay.day() === 0;

      if (isSunday) {
        continue;
      }

      const dayData = employeeData.dataOfDate?.[`day_${day}`];

      if (
        dayData &&
        dayData.trangThai !== undefined &&
        dayData.trangThai !== null
      ) {
        const { trangThai, gioVao, isNghiLe, isNghiPhep } = dayData;

        // Xử lý trạng thái dựa trên trangThai và các flag
        let statusInfo = "";
        let color = "default";

        switch (trangThai) {
          case TrangThaiChamCongConstant.BinhThuong:
            statusInfo = "Bình thường";
            color = "green";
            break;
          case TrangThaiChamCongConstant.DiMuon:
            statusInfo = "Đi muộn";
            color = "orange";
            break;
          case TrangThaiChamCongConstant.VeSom:
            statusInfo = "Về sớm";
            color = "blue";
            break;
          case TrangThaiChamCongConstant.ChuaChamCong:
            // Phân biệt các loại nghỉ
            if (isNghiLe) {
              statusInfo = "Nghỉ lễ";
              color = "purple";
            } else if (isNghiPhep) {
              statusInfo = "Nghỉ phép";
              color = "cyan";
            } else {
              statusInfo = "Chưa chấm công";
              color = "red";
            }
            break;
          default:
            statusInfo = String(
              TrangThaiChamCongConstant.getDisplayName(trangThai)
            );
            break;
        }

        attendanceList.push({
          day,
          date: startDateParsed.date(day).format("DD/MM/YYYY"),
          dayOfWeek: startDateParsed.date(day).format("dddd"),
          trangThai,
          statusInfo,
          color,
          gioVao,
          isNghiLe,
          isNghiPhep,
        });
      }
    }

    return attendanceList.sort((a, b) => a.day - b.day);
  };

  const stats = calculateStatistics();
  const currentMonth = dayjs(startDate, "DD/MM/YYYY");
  const attendanceData = getAttendanceData();

  // Function để render nội dung chính (dùng chung cho modal và fullscreen)
  const renderContent = () => {
    return (
      <>
        {/* Thông tin nhân viên */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            size="small"
            style={{ marginBottom: "16px" }}
            title={
              <Space>
                <UserOutlined />
                <span>Thông tin nhân viên</span>
              </Space>
            }
          >
            <Descriptions column={3} size="small">
              <Descriptions.Item label="Mã nhân viên">
                <Text code strong>
                  {employeeData.maNV}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Họ và tên">
                <Text strong>{employeeData.hoTen}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Chức vụ">
                <Tag color="blue">{employeeData.chucVu}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </motion.div>

        {/* Thống kê chấm công */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            size="small"
            style={{ marginBottom: "16px" }}
            title={
              <Space>
                <CheckCircleOutlined />
                <span>
                  Thống kê chấm công tháng {currentMonth.month() + 1}/
                  {currentMonth.year()}
                </span>
              </Space>
            }
          >
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Tổng ngày làm"
                  value={stats.tongNgayLam}
                  valueStyle={{ color: "#1890ff" }}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Ngày đi làm đúng giờ"
                  value={stats.ngayBinhThuong}
                  valueStyle={{ color: "#52c41a" }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Ngày đi muộn"
                  value={stats.ngayDiMuon}
                  valueStyle={{ color: "#faad14" }}
                  prefix={<WarningOutlined />}
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: "16px" }}>
              <Col span={8}>
                <Statistic
                  title="Ngày chưa chấm công"
                  value={stats.ngayChuaCham}
                  valueStyle={{ color: "#ff4d4f" }}
                  prefix={<CloseCircleOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Ngày nghỉ lễ"
                  value={stats.ngayNghiLe}
                  valueStyle={{ color: "#722ed1" }}
                  prefix={<CalendarOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Ngày nghỉ phép"
                  value={stats.ngayNghiPhep}
                  valueStyle={{ color: "#13c2c2" }}
                  prefix={<TbCalendarOff />}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: "12px" }}>
              <Col span={24}>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "12px",
                    fontStyle: "italic",
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  * Thống kê và danh sách không bao gồm ngày chủ nhật
                </Text>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* Danh sách chấm công */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            size="small"
            title={
              <Space>
                <CalendarOutlined />
                <span>
                  Danh sách chấm công chi tiết tháng {currentMonth.month() + 1}/
                  {currentMonth.year()}
                </span>
              </Space>
            }
          >
            <List
              grid={{
                gutter: 8,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 4,
                xl: 5,
                xxl: 6,
              }}
              dataSource={attendanceData}
              locale={{
                emptyText: "Không có dữ liệu chấm công trong tháng này",
              }}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    size="small"
                    style={{
                      textAlign: "center",
                      border: `2px solid ${
                        item.color === "green"
                          ? "#52c41a"
                          : item.color === "orange"
                          ? "#faad14"
                          : item.color === "blue"
                          ? "#1890ff"
                          : item.color === "purple"
                          ? "#722ed1"
                          : item.color === "cyan"
                          ? "#13c2c2"
                          : "#ff4d4f"
                      }`,
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ marginBottom: "4px" }}>
                      <Text strong style={{ fontSize: "14px" }}>
                        Ngày {item.day}
                      </Text>
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {item.date} - {item.dayOfWeek}
                      </Text>
                    </div>
                    <div style={{ marginBottom: "4px" }}>
                      <Tag
                        color={item.color}
                        style={{ fontSize: "11px", fontWeight: "bold" }}
                      >
                        {item.statusInfo}
                      </Tag>
                    </div>
                    {item.gioVao && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MdAccessTime
                          style={{
                            marginRight: "4px",
                            fontSize: "20px",
                            color: "#1890ff",
                          }}
                        />
                        <Text
                          style={{
                            fontSize: "12px",
                            color: "#1890ff",
                            margin: 0,
                          }}
                        >
                          {item.gioVao}
                        </Text>
                      </div>
                    )}
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </motion.div>
      </>
    );
  };

  // Nếu là fullscreen, render như một page thay vì modal
  if (isFullScreen) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          background: "#f5f5f5",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Custom Header cho fullscreen */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "20px",
              color: "white",
              borderRadius: "8px",
              marginBottom: "24px",
            }}
          >
            <Space>
              <UserOutlined style={{ fontSize: "20px" }} />
              <Title level={4} style={{ color: "white", margin: 0 }}>
                CHI TIẾT CHẤM CÔNG - {employeeData.hoTen?.toUpperCase()}
              </Title>
            </Space>

            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                display: "block",
                marginTop: "8px",
              }}
            >
              Xem chi tiết thông tin chấm công trong tháng{" "}
              {currentMonth.month() + 1}/{currentMonth.year()}
            </Text>
          </motion.div>

          {/* Nội dung chính */}
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      width={1000}
      footer={null}
      destroyOnClose
      closable={false}
      maskClosable={true}
    >
      {/* Custom Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px",
          margin: "-24px -24px 24px -24px",
          color: "white",
          borderRadius: "8px 8px 0 0",
          position: "relative",
        }}
      >
        <Space>
          <UserOutlined style={{ fontSize: "20px" }} />
          <Title level={4} style={{ color: "white", margin: 0 }}>
            CHI TIẾT CHẤM CÔNG - {employeeData.hoTen?.toUpperCase()}
          </Title>
        </Space>

        {/* Close Button */}
        <CloseOutlined
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.8)",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
          }}
        />

        <Text
          style={{
            color: "rgba(255,255,255,0.8)",
            display: "block",
            marginTop: "8px",
          }}
        >
          Xem chi tiết thông tin chấm công trong tháng{" "}
          {currentMonth.month() + 1}/{currentMonth.year()}
        </Text>
      </motion.div>

      {/* Nội dung chính */}
      {renderContent()}
    </Modal>
  );
};

export default ChamCongDetailModal;

"use client"; 


import { HoatDongDangKyType } from "@/types/hoatDongNgoaiKhoa/hoatDongNgoaiKhoa";
import
  {
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    QrcodeOutlined,
    TeamOutlined,
    UserAddOutlined,
    UserDeleteOutlined,
  } from "@ant-design/icons";
import
  {
    Button,
    Descriptions,
    Modal,
    QRCode,
    Space,
    Tag,
    Typography,
  } from "antd";
import React from "react";

const { Title, Text, Paragraph } = Typography;

interface ActivityDetailModalProps {
  open: boolean;
  activity: HoatDongDangKyType | null;
  onClose: () => void;
  onRegister: (activity: HoatDongDangKyType) => void;
  onCancelRegistration: (activity: HoatDongDangKyType) => void;
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  open,
  activity,
  onClose,
  onRegister,
  onCancelRegistration,
}) => {
  if (!activity) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "INACTIVE":
        return "red";
      case "PENDING":
        return "orange";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang mở đăng ký";
      case "INACTIVE":
        return "Đã đóng đăng ký";
      case "PENDING":
        return "Chờ phê duyệt";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canRegister = activity.canRegister && activity.status === "ACTIVE";
  const canCancel = activity.isRegistered && activity.status === "ACTIVE";

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>Chi tiết hoạt động ngoại khóa</span>
          {activity.isRegistered && (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Đã đăng ký
            </Tag>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      width={800}
      footer={
        <Space>
          <Button onClick={onClose}>Đóng</Button>
          {activity.isRegistered ? (
            <Button
              danger
              icon={<UserDeleteOutlined />}
              onClick={() => {
                onCancelRegistration(activity);
                onClose();
              }}
              disabled={!canCancel}
            >
              Hủy đăng ký
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => {
                onRegister(activity);
                onClose();
              }}
              disabled={!canRegister}
            >
              Đăng ký tham gia
            </Button>
          )}
        </Space>
      }
    >
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {/* Header với tên hoạt động */}
        <div style={{ marginBottom: "24px", textAlign: "center" }}>
          <Title level={3} style={{ marginBottom: "8px" }}>
            {activity.tenHoatDong}
          </Title>
          <Tag color={getStatusColor(activity.status)} style={{ fontSize: "14px" }}>
            {getStatusText(activity.status)}
          </Tag>
        </div>

        {/* Mô tả hoạt động */}
        {activity.moTa && (
          <div style={{ marginBottom: "24px" }}>
            <Title level={5}>Mô tả hoạt động</Title>
            <Paragraph>{activity.moTa}</Paragraph>
          </div>
        )}

        {/* Thông tin chi tiết */}
        <Descriptions
          title="Thông tin chi tiết"
          bordered
          column={1}
          size="small"
        >
          <Descriptions.Item
            label={
              <span>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Thời gian bắt đầu
              </span>
            }
          >
            {formatDate(activity.thoiGianBatDau || "")}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                Thời gian kết thúc
              </span>
            }
          >
            {formatDate(activity.thoiGianKetThuc || "")}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span>
                <EnvironmentOutlined style={{ marginRight: 8 }} />
                Địa điểm
              </span>
            }
          >
            {activity.diaDiem || "Chưa xác định"}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <span>
                <TeamOutlined style={{ marginRight: 8 }} />
                Số lượng đăng ký
              </span>
            }
          >
            <Space>
              {activity.soLuongToiDa && (
                <>
                  <Text type="secondary">/ {activity.soLuongToiDa}</Text>
                  <Text type="secondary">người</Text>
                </>
              )}
              {/* {activity.soLuongToiDa && activity.soLuongDangKy && 
               activity.soLuongDangKy >= activity.soLuongToiDa && (
                <Tag color="red">Đã đầy</Tag>
              )} */}
            </Space>
          </Descriptions.Item>

          {activity.isRegistered && activity.registrationDate && (
            <Descriptions.Item
              label={
                <span>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  Ngày đăng ký
                </span>
              }
            >
              <Text type="success">
                {formatDate(activity.registrationDate)}
              </Text>
            </Descriptions.Item>
          )}

          <Descriptions.Item
            label={
              <span>
                <CalendarOutlined style={{ marginRight: 8 }} />
                Ngày tạo
              </span>
            }
          >
            {formatDate(activity.createdDate || "")}
          </Descriptions.Item>

          <Descriptions.Item label="Người tạo">
            {activity.createdBy || "-"}
          </Descriptions.Item>
        </Descriptions>

        {/* QR Code */}
        {activity.qrValue && (
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Title level={5}>
              <QrcodeOutlined style={{ marginRight: 8 }} />
              QR Code
            </Title>
            <div style={{ padding: "16px", backgroundColor: "#fafafa", borderRadius: "8px" }}>
              <QRCode value={activity.qrValue} size={160} />
              <div style={{ marginTop: "8px" }}>
                <Text type="secondary" style={{ fontSize: "12px", fontFamily: "monospace" }}>
                  {activity.qrValue}
                </Text>
              </div>
            </div>
          </div>
        )}

        {/* Hướng dẫn đăng ký */}
        {!activity.isRegistered && canRegister && (
          <div style={{ 
            marginTop: "24px", 
            padding: "16px", 
            backgroundColor: "#e6f7ff", 
            borderRadius: "8px",
            border: "1px solid #91d5ff"
          }}>
            <Title level={5} style={{ color: "#1890ff", marginBottom: "8px" }}>
              📝 Hướng dẫn đăng ký
            </Title>
            <ul style={{ marginBottom: 0, paddingLeft: "20px" }}>
              <li>Nhấn nút &ldquo;Đăng ký tham gia&rdquo; để xác nhận đăng ký</li>
              <li>Sau khi đăng ký thành công, bạn có thể hủy đăng ký nếu cần</li>
              <li>Vui lòng tham gia đúng thời gian và địa điểm đã thông báo</li>
              <li>Liên hệ ban tổ chức nếu có thắc mắc</li>
            </ul>
          </div>
        )}

        {/* Thông báo khi đã đăng ký */}
        {activity.isRegistered && (
          <div style={{ 
            marginTop: "24px", 
            padding: "16px", 
            backgroundColor: "#f6ffed", 
            borderRadius: "8px",
            border: "1px solid #b7eb8f"
          }}>
            <Title level={5} style={{ color: "#52c41a", marginBottom: "8px" }}>
              ✅ Bạn đã đăng ký tham gia hoạt động này
            </Title>
            <Text>
              Ngày đăng ký: <strong>{formatDate(activity.registrationDate || "")}</strong>
            </Text>
            <br />
            <Text type="secondary">
              Bạn có thể hủy đăng ký nếu không thể tham gia.
            </Text>
          </div>
        )}

        {/* Cảnh báo khi không thể đăng ký */}
        {!activity.isRegistered && !canRegister && (
          <div style={{ 
            marginTop: "24px", 
            padding: "16px", 
            backgroundColor: "#fff2f0", 
            borderRadius: "8px",
            border: "1px solid #ffccc7"
          }}>
            <Title level={5} style={{ color: "#ff4d4f", marginBottom: "8px" }}>
              ⚠️ Không thể đăng ký
            </Title>
            <Text>
              {activity.status !== "ACTIVE" && "Hoạt động này không còn mở đăng ký."}
              {activity.status === "ACTIVE" && !activity.canRegister && "Hoạt động đã đạt số lượng tối đa."}
            </Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ActivityDetailModal;
import React, { useState, useEffect } from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  TimePicker,
  Button,
  message,
  Divider,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  SaveOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs, { Dayjs } from "dayjs";
import { DataTableChamCongType, UpdateDataListByMaNV } from "@/types/QLNhanSu/nS_ChamCong/nS_ChamCong";
import TrangThaiChamCongConstant from "@/constants/QLNhanSu/TrangThaiChamCongConstant";
import nS_ChamCongService from "@/services/QLNhanSu/nS_ChamCong/nS_ChamCongService";

const { Title, Text } = Typography;

interface Props {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => Promise<void>;
  employeeData: DataTableChamCongType | null;
  startDate?: string;
  endDate?: string;
}

interface DayEditData {
  day: number;
  date: string;
  dayOfWeek: string;
  gioVao: string | null;
  trangThai: number;
  isEdited: boolean;
}

const EditChamCongModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  employeeData,
  startDate = dayjs()
    .subtract(1, "month")
    .startOf("month")
    .format("DD/MM/YYYY"),
  endDate = dayjs().subtract(1, "month").endOf("month").format("DD/MM/YYYY"),
}) => {
  const [editData, setEditData] = useState<DayEditData[]>([]);
  const [loading, setSaving] = useState(false);

  useEffect(() => {
    if (employeeData && open) {
      initializeEditData();
    }
  }, [employeeData, open, startDate]);

  const initializeEditData = () => {
    const startDateParsed = dayjs(startDate, "DD/MM/YYYY");
    const daysInMonth = startDateParsed.isValid()
      ? startDateParsed.daysInMonth()
      : 31;

    const dataList: DayEditData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      // Kiểm tra nếu là chủ nhật thì bỏ qua
      const currentDay = startDateParsed.date(day);
      const isSunday = currentDay.day() === 0;

      if (isSunday) {
        continue;
      }

      const dayData = employeeData?.dataOfDate?.[`day_${day}`];

      dataList.push({
        day,
        date: currentDay.format("DD/MM/YYYY"),
        dayOfWeek: currentDay.format("dddd"),
        gioVao: dayData?.gioVao || null,
        trangThai: dayData?.trangThai ?? TrangThaiChamCongConstant.ChuaChamCong,
        isEdited: false,
      });
    }

    setEditData(dataList);
  };

  const handleTimeChange = (
    day: number,
    field: "gioVao",
    time: Dayjs | null
  ) => {
    setEditData((prev) =>
      prev.map((item) => {
        if (item.day === day) {
          return {
            ...item,
            [field]: time ? time.format("HH:mm") : null,
            isEdited: true,
          };
        }
        return item;
      })
    );
  };
  const handleSave = async () => {
    try {
      setSaving(true);

      // Lọc chỉ các ngày đã được chỉnh sửa
      const editedDays = editData.filter((item) => item.isEdited);

      if (editedDays.length === 0) {
        message.warning("Không có thay đổi nào để lưu!");
        return;
      }

      if (!employeeData?.maNV) {
        message.error("Không tìm thấy mã nhân viên!");
        return;
      }

      // Chuẩn bị dữ liệu theo format UpdateDataListByMaNV
      const saveData: UpdateDataListByMaNV = {
        maNV: employeeData.maNV,
        chamCongList: editedDays.map((item) => ({
          ngayLam: item.date,
          gioVao: item.gioVao || "",
        })),
      };

      // Gọi API để cập nhật
      const response = await nS_ChamCongService.updateDataListByMaNV(saveData);
      
      if (response.status) {
        message.success("Cập nhật chấm công thành công!");
        onClose();
        // Gọi callback để reload dữ liệu ở parent component
        if (onSave) {
          await onSave(saveData);
        }
      } else {
        message.error(response.message || "Có lỗi xảy ra khi cập nhật!");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      message.error("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (trangThai: number) => {
    switch (trangThai) {
      case TrangThaiChamCongConstant.BinhThuong:
        return "#52c41a";
      case TrangThaiChamCongConstant.DiMuon:
        return "#faad14";
      case TrangThaiChamCongConstant.VeSom:
        return "#1890ff";
      case TrangThaiChamCongConstant.ChuaChamCong:
        return "#ff4d4f";
      default:
        return "#d9d9d9";
    }
  };

  const currentMonth = dayjs(startDate, "DD/MM/YYYY");
  const editedCount = editData.filter((item) => item.isEdited).length;

  if (!employeeData) return null;

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
      destroyOnClose
      closable={false}
      maskClosable={false}
      centered
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
          <EditOutlined style={{ fontSize: "20px" }} />
          <Title level={4} style={{ color: "white", margin: 0 }}>
            CHỈNH SỬA CHẤM CÔNG - {employeeData.hoTen?.toUpperCase()}
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
          Chỉnh sửa giờ vào/ra cho tháng {currentMonth.month() + 1}/
          {currentMonth.year()}
          {editedCount > 0 && (
            <span style={{ marginLeft: "16px" }}>
              • {editedCount} ngày đã thay đổi
            </span>
          )}
        </Text>
      </motion.div>

      {/* Employee Info */}
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
          <Row gutter={16}>
            <Col span={8}>
              <Text type="secondary">Mã nhân viên:</Text>
              <div>
                <Text code strong>
                  {employeeData.maNV}
                </Text>
              </div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Họ và tên:</Text>
              <div>
                <Text strong>{employeeData.hoTen}</Text>
              </div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Chức vụ:</Text>
              <div>
                <Tag color="blue">{employeeData.chucVu}</Tag>
              </div>
            </Col>
          </Row>
        </Card>
      </motion.div>

      {/* Edit Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card
          size="small"
          title={
            <Space>
              <ClockCircleOutlined />
              <span>Chỉnh sửa thời gian chấm công</span>
            </Space>
          }
          extra={
            <Text type="secondary" style={{ fontSize: "12px" }}>
              * Không bao gồm ngày chủ nhật
            </Text>
          }
        >
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              padding: "8px",
            }}
          >
            <Row gutter={[16, 16]}>
              {editData.map((item) => (
                <Col xs={24} sm={12} md={8} lg={6} key={item.day}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: item.day * 0.02 }}
                  >
                    <Card
                      size="small"
                      style={{
                        border: `2px solid ${
                          item.isEdited
                            ? "#fa8c16"
                            : getStatusColor(item.trangThai)
                        }`,
                        borderRadius: "8px",
                        position: "relative",
                        transition: "all 0.3s ease",
                      }}
                      bodyStyle={{ padding: "12px" }}
                    >
                      {item.isEdited && (
                        <div
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "#fa8c16",
                            color: "white",
                            borderRadius: "50%",
                            width: "16px",
                            height: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          !
                        </div>
                      )}

                      <div style={{ textAlign: "center", marginBottom: "8px" }}>
                        <Text strong style={{ fontSize: "14px" }}>
                          Ngày {item.day}
                        </Text>
                        <div>
                          <Text type="secondary" style={{ fontSize: "11px" }}>
                            {item.date}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary" style={{ fontSize: "10px" }}>
                            {item.dayOfWeek}
                          </Text>
                        </div>
                      </div>

                      <Space
                        direction="vertical"
                        style={{ width: "100%" }}
                        size={8}
                      >
                        <div>
                          <Text style={{ fontSize: "11px" }}>Giờ vào:</Text>
                          <TimePicker
                            size="small"
                            format="HH:mm"
                            placeholder="--:--"
                            style={{ width: "100%" }}
                            value={
                              item.gioVao ? dayjs(item.gioVao, "HH:mm") : null
                            }
                            onChange={(time) =>
                              handleTimeChange(item.day, "gioVao", time)
                            }
                          />
                        </div>
                        {/* <div>
                          <Text style={{ fontSize: "11px" }}>Giờ ra:</Text>
                          <TimePicker
                            size="small"
                            format="HH:mm"
                            placeholder="--:--"
                            style={{ width: "100%" }}
                            value={
                              item.gioRa ? dayjs(item.gioRa, "HH:mm") : null
                            }
                            onChange={(time) =>
                              handleTimeChange(item.day, "gioRa", time)
                            }
                          />
                        </div> */}
                      </Space>

                      <div style={{ marginTop: "8px", textAlign: "center" }}>
                        <Tag
                          color={
                            item.trangThai ===
                            TrangThaiChamCongConstant.BinhThuong
                              ? "green"
                              : item.trangThai ===
                                TrangThaiChamCongConstant.DiMuon
                              ? "orange"
                              : item.trangThai ===
                                TrangThaiChamCongConstant.VeSom
                              ? "blue"
                              : "red"
                          }
                          style={{ fontSize: "10px" }}
                        >
                          {TrangThaiChamCongConstant.getDisplayName(
                            item.trangThai
                          )}
                        </Tag>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          marginTop: "24px",
          textAlign: "right",
          borderTop: "1px solid #f0f0f0",
          paddingTop: "16px",
        }}
      >
        <Space>
          <Button
            onClick={onClose}
            size="large"
            style={{
              borderRadius: "8px",
              minWidth: "100px",
              height: "40px",
            }}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={loading}
            disabled={editedCount === 0}
            size="large"
            style={{
              borderRadius: "8px",
              minWidth: "120px",
              height: "40px",
              border: "none",
              color: "#fff",
            }}
          >
            Lưu thay đổi ({editedCount})
          </Button>
        </Space>
      </motion.div>
    </Modal>
  );
};

export default EditChamCongModal;

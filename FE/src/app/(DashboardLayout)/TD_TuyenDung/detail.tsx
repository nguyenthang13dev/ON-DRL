import React from "react";
import { Modal, Table, Tag, Descriptions } from "antd";
import { TD_TuyenDungType, getTinhTrangLabel, getLoaiLabel, getHinhThucLabel } from "@/types/TD_TuyenDung/TD_TuyenDung";
import dayjs from "dayjs";
import tD_UngVienService from "@/services/TD_UngVien/TD_UngVienService";
import { TD_UngVienDto } from "@/types/TD_UngVien/TD_UngVien";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data?: TD_TuyenDungType | null;
}

const TD_TuyenDungDetail: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [ungVienList, setUngVienList] = React.useState<TD_UngVienDto[]>([]);
  const [uvLoading, setUvLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && data?.id) {
      setUvLoading(true);
      tD_UngVienService.getData({ TuyenDungId: data.id, pageIndex: 1, pageSize: 100 })
        .then(res => {
          if (res.status && res.data?.items) setUngVienList(res.data.items);
          else setUngVienList([]);
        })
        .finally(() => setUvLoading(false));
    } else {
      setUngVienList([]);
    }
  }, [isOpen, data?.id]);

  const handleDownloadCV = async (ungVien: TD_UngVienDto) => {
    try {
      const blob = await tD_UngVienService.downloadCV(ungVien.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = ungVien.cvFile?.split("/").pop() || `CV_${ungVien.hoTen}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Tải file thất bại");
    }
  };

  if (!data) return null;

  const getTinhTrangColor = (tinhTrang: number): string => {
    switch (tinhTrang) {
      case 0:
        return "processing"; // Đang tuyển
      case 1:
        return "error"; // Đã đóng
      case 2:
        return "warning"; // Hoãn
      default:
        return "default";
    }
  };

  const formatDate = (date: string | dayjs.Dayjs): string => {
    if (!date) return "Không xác định";
    return dayjs(date).format("DD/MM/YYYY");
  };

  return (
    <Modal
      title="Chi tiết vị trí tuyển dụng"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions
        bordered
        column={2}
        size="middle"
        labelStyle={{ fontWeight: "bold", width: "30%" }}
      >
        <Descriptions.Item label="Tên vị trí" span={2}>
          <strong style={{ fontSize: "16px", color: "#1890ff" }}>
            {data.tenViTri}
          </strong>
        </Descriptions.Item>

        <Descriptions.Item label="Phòng ban">
          {data.tenPhongBan || "Không xác định"}
        </Descriptions.Item>

        <Descriptions.Item label="Số lượng cần tuyển">
          <Tag color="blue" style={{ fontSize: "14px", padding: "4px 8px" }}>
            {data.soLuongCanTuyen} người
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày bắt đầu">
          {formatDate(data.ngayBatDau)}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày kết thúc">
          {formatDate(data.ngayKetThuc)}
        </Descriptions.Item>

        <Descriptions.Item label="Tình trạng" span={2}>
          <Tag
            color={getTinhTrangColor(data.tinhTrang)}
            style={{ fontSize: "14px", padding: "4px 12px" }}
          >
            {getTinhTrangLabel(data.tinhTrang)}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Mô tả" span={2}>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              padding: "8px",
              backgroundColor: "#f5f5f5",
              borderRadius: "4px",
              whiteSpace: "pre-wrap",
            }}
          >
            {data.moTa || "Không có mô tả"}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Loại tuyển dụng">
          {getLoaiLabel(data.loai)}
        </Descriptions.Item>
        <Descriptions.Item label="Hình thức">
          {getHinhThucLabel(data.hinhThuc)}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {data.createdDate ? formatDate(data.createdDate) : "Không xác định"}
        </Descriptions.Item>

        <Descriptions.Item label="Người tạo">
          {data.createdBy || "Không xác định"}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày cập nhật">
          {data.modifiedDate ? formatDate(data.modifiedDate) : "Không xác định"}
        </Descriptions.Item>

        <Descriptions.Item label="Người cập nhật">
          {data.modifiedBy || "Không xác định"}
        </Descriptions.Item>
      </Descriptions>

      {/* Thông tin thống kê thêm */}
      <div style={{ marginTop: "20px" }}>
        <h4>Thông tin thống kê</h4>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div
            style={{
              padding: "12px",
              backgroundColor: "#e6f7ff",
              borderRadius: "6px",
              border: "1px solid #91d5ff",
            }}
          >
            <div style={{ fontSize: "12px", color: "#666" }}>Thời gian tuyển dụng</div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#1890ff" }}>
              {dayjs(data.ngayKetThuc).diff(dayjs(data.ngayBatDau), "day")} ngày
            </div>
          </div>

          <div
            style={{
              padding: "12px",
              backgroundColor: "#f6ffed",
              borderRadius: "6px",
              border: "1px solid #b7eb8f",
            }}
          >
            <div style={{ fontSize: "12px", color: "#666" }}>Trạng thái hiện tại</div>
            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#52c41a" }}>
              {getTinhTrangLabel(data.tinhTrang)}
            </div>
          </div>

          {data.ngayKetThuc && (
            <div
              style={{
                padding: "12px",
                backgroundColor: dayjs().isAfter(dayjs(data.ngayKetThuc)) ? "#fff2e8" : "#f0f5ff",
                borderRadius: "6px",
                border: `1px solid ${dayjs().isAfter(dayjs(data.ngayKetThuc)) ? "#ffbb96" : "#adc6ff"}`,
              }}
            >
              <div style={{ fontSize: "12px", color: "#666" }}>Thời hạn</div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: dayjs().isAfter(dayjs(data.ngayKetThuc)) ? "#fa8c16" : "#2f54eb",
                }}
              >
                {dayjs().isAfter(dayjs(data.ngayKetThuc)) ? "Đã hết hạn" : "Còn hiệu lực"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách ứng viên ứng tuyển cho vị trí này */}
      <div style={{ marginTop: 32 }}>
        <h4>Danh sách ứng viên ứng tuyển</h4>
        <Table
          dataSource={ungVienList}
          loading={uvLoading}
          rowKey="id"
          bordered
          size="small"
          pagination={false}
          columns={[
            {
              title: "Họ tên",
              dataIndex: "hoTen",
              key: "hoTen",
              render: (text: string) => <span style={{ color: '#1890ff', fontWeight: 500 }}>{text}</span>,
            },
            {
              title: "Email",
              dataIndex: "email",
              key: "email",
            },
            {
              title: "SĐT",
              dataIndex: "soDienThoai",
              key: "soDienThoai",
            },
            {
              title: "Ngày sinh",
              dataIndex: "ngaySinh",
              key: "ngaySinh",
              render: (value: string) => value ? dayjs(value).format("DD/MM/YYYY") : "-",
            },
            {
              title: "Giới tính",
              dataIndex: "gioiTinhText",
              key: "gioiTinhText",
            },
            {
              title: "Ngày ứng tuyển",
              dataIndex: "ngayUngTuyen",
              key: "ngayUngTuyen",
              render: (value: string) => value ? dayjs(value).format("DD/MM/YYYY") : "-",
            },
            {
              title: "Trạng thái",
              dataIndex: "trangThai",
              key: "trangThai",
              render: (value: number) => {
                switch (value) {
                  case 0: return "Chưa xét duyệt";
                  case 1: return "Đã xét duyệt";
                  case 2: return "Đang chờ phỏng vấn";
                  case 3: return "Đã nhận việc";
                  case 4: return "Đã từ chối";
                  case 5: return "Đạt phỏng vấn";
                  default: return "-";
                }
              },
            },
            {
              title: "Ghi chú",
              dataIndex: "ghiChuUngVien",
              key: "ghiChuUngVien",
              render: (value: string) => value || "-",
            },
            {
              title: "CV",
              dataIndex: "cvFile",
              key: "cvFile",
              render: (_: string, record: TD_UngVienDto) => record.cvFile ? (
                <Button
                  type="link"
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownloadCV(record)}
                  style={{ padding: 0, height: 'auto' }}
                >
                  Tải CV
                </Button>
              ) : <span style={{ color: '#999' }}>Chưa có</span>,
            },
          ]}
        />
      </div>
    </Modal>
  );
};

export default TD_TuyenDungDetail;

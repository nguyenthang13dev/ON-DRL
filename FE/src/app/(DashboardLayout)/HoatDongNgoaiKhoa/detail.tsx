import { hoatDongNgoaiKhoaService } from "@/services/hoatDongNgoaiKhoa/hoatDongNgoaiKhoa.service";
import { setIsLoading } from "@/store/general/GeneralSlice";
import { useSelector } from "@/store/hooks";
import { AppDispatch } from "@/store/store";
import {
    HoatDongNgoaiKhoaType,
    TableHoatDongNgoaiKhoaDataType,
} from "@/types/hoatDongNgoaiKhoa/hoatDongNgoaiKhoa";
import { CloseOutlined, QrcodeOutlined, UserOutlined } from "@ant-design/icons";
import {
    Avatar,
    Button,
    Descriptions,
    Drawer,
    Empty,
    List,
    Modal,
    QRCode,
    Space,
    Tag,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface DetailProps {
  isOpen: boolean;
  onClose: () => void;
  hoatDong?: TableHoatDongNgoaiKhoaDataType;
}

const HoatDongNgoaiKhoaDetail: React.FC<DetailProps> = ({
  isOpen,
  onClose,
  hoatDong,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state) => state.general.isLoading);
  const [detailData, setDetailData] = useState<HoatDongNgoaiKhoaType | null>(
    null
  );
  const [isShowQRCode, setIsShowQRCode] = useState<boolean>(false);

  const fetchDetailData = useCallback(async (id: string) => {
    try {
      dispatch(setIsLoading(true));
      const response = await hoatDongNgoaiKhoaService.getById(id);
      if (response.status) {
        setDetailData(response.data);
      } else {
        toast.error("Không thể tải thông tin chi tiết");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải thông tin chi tiết");
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (isOpen && hoatDong?.id) {
      fetchDetailData(hoatDong.id);
    }
  }, [isOpen, hoatDong?.id, fetchDetailData]);

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
        return "Đang hoạt động";
      case "INACTIVE":
        return "Không hoạt động";
      case "PENDING":
        return "Chờ phê duyệt";
      default:
        return status;
    }
  };

  const handleClose = () => {
    setDetailData(null);
    onClose();
  };

  if (!hoatDong) return null;

  return (
    <>
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Chi tiết hoạt động ngoại khóa</span>
          </div>
        }
        open={isOpen}
        onClose={handleClose}
        width={600}
        loading={loading}
        closeIcon={<CloseOutlined />}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<QrcodeOutlined />}
              onClick={() => setIsShowQRCode(true)}
            >
              Xem QR Code
            </Button>
          </Space>
        }
      >
        {detailData && (
          <>
            <Descriptions
              title="Thông tin cơ bản"
              bordered
              column={1}
              size="small"
            >
              <Descriptions.Item label="Tên hoạt động">
                <strong>{detailData.tenHoatDong}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(detailData.status)}>
                  {getStatusText(detailData.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mã QR">
                <Space>
                  <span style={{ fontFamily: "monospace" }}>
                    {detailData.qrValue}
                  </span>
                  <Button
                    type="link"
                    size="small"
                    icon={<QrcodeOutlined />}
                    onClick={() => setIsShowQRCode(true)}
                  >
                    Xem QR
                  </Button>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {detailData.createdDate
                  ? new Date(detailData.createdDate).toLocaleString("vi-VN")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo">
                {detailData.createdBy || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">
                {detailData.updatedDate
                  ? new Date(detailData.updatedDate).toLocaleString("vi-VN")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Người cập nhật">
                {detailData.updatedBy || "-"}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: "24px" }}>
              <h4 style={{ marginBottom: "16px" }}>
                <UserOutlined style={{ marginRight: "8px" }} />
                Danh sách đăng ký ({detailData.danhSachDangKy?.length || 0} người)
              </h4>
              
              {detailData.danhSachDangKy && detailData.danhSachDangKy.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={detailData.danhSachDangKy}
                  renderItem={(user, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar icon={<UserOutlined />} />
                        }
                        title={user.fullName || user.userName}
                        description={
                          <Space direction="vertical" size="small">
                            {user.email && <span>Email: {user.email}</span>}
                            {user.phoneNumber && <span>SĐT: {user.phoneNumber}</span>}
                          </Space>
                        }
                      />
                      <div>{index + 1}</div>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty
                  description="Chưa có ai đăng ký tham gia hoạt động này"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>
          </>
        )}
      </Drawer>

      {/* QR Code Modal */}
      <Modal
        title="QR Code"
        open={isShowQRCode}
        onCancel={() => setIsShowQRCode(false)}
        footer={null}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          {detailData?.qrValue && (
            <>
              <QRCode value={detailData.qrValue} size={200} />
              <p style={{ marginTop: "16px", wordBreak: "break-all" }}>
                {detailData.qrValue}
              </p>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Hoạt động: {detailData.tenHoatDong}
              </p>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default HoatDongNgoaiKhoaDetail;
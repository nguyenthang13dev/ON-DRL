import { Modal, Spin, Button, Row, Col, Avatar, Tag, Tooltip, Divider, Card, Typography, Space } from "antd";
import { useEffect, useState } from "react";
import { TD_UngVienDto, GioiTinhUngVien } from "@/types/TD_UngVien/TD_UngVien";
import tD_UngVienService from "@/services/TD_UngVien/TD_UngVienService";
import dayjs from "dayjs";
import Link from "next/link";
import { motion } from "framer-motion";
// React-icons
import { FiEye, FiCalendar, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaUserCircle, FaMars, FaVenus, FaGenderless } from "react-icons/fa";
import { HiOutlineBriefcase } from "react-icons/hi";
import { PiStudentBold } from "react-icons/pi";
import { MdEventNote } from "react-icons/md";

const { Title, Text } = Typography;

const getGioiTinhText = (value?: number) => {
  switch (value) {
    case GioiTinhUngVien.Nam: return "Nam";
    case GioiTinhUngVien.Nu: return "Nữ";
    case GioiTinhUngVien.Khac: return "Khác";
    default: return "-";
  }
};

const getTrangThaiTag = (trangThai?: number) => {
  switch (trangThai) {
    case 0: return <Tag color="default">Chưa xét duyệt</Tag>;
    case 1: return <Tag color="success">Đã xét duyệt</Tag>;
    case 2: return <Tag color="processing">Đang chờ phỏng vấn</Tag>;
    case 3: return <Tag color="purple">Đã nhận việc</Tag>;
    case 4: return <Tag color="error">Đã từ chối</Tag>;
    case 5: return <Tag color="magenta">Đạt phỏng vấn</Tag>;
    default: return <Tag>-</Tag>;
  }
};

interface TD_UngVienDetailProps {
  open: boolean;
  onCancel: () => void;
  id: string | null;
}

const TD_UngVienDetail = ({ open, onCancel, id }: TD_UngVienDetailProps) => {
  const [data, setData] = useState<TD_UngVienDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [hoveringTag, setHoveringTag] = useState(false);

  useEffect(() => {
    if (open && id) {
      setLoading(true);
      tD_UngVienService.get(id)
        .then(res => {
          if (res.status && res.data) setData(res.data);
          else setData(null);
        })
        .finally(() => setLoading(false));
    } else {
      setData(null);
    }
  }, [open, id]);

  const handleViewCV = async () => {
    if (!data?.id) return;
    setDownloading(true);
    try {
      const blob = await tD_UngVienService.viewCV(data.id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Không revoke ngay để tránh lỗi khi file chưa kịp load
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (e) {
      alert("Không xem được file CV");
    } finally {
      setDownloading(false);
    }
  };

  const getInitials = (name?: string) => name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) : "";

  return (
    <Modal open={open} onCancel={onCancel} title={null} footer={null} width={900} bodyStyle={{ padding: 0 }} destroyOnClose centered closable={false}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "12px 12px 0 0",
          padding: "32px",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-50%",
            width: "200%",
            height: "200%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            transform: "rotate(45deg)",
          }}
        />
        <Row align="middle" gutter={24}>
          <Col>
            <Avatar
              size={100}
              style={{
                border: "4px solid rgba(255,255,255,0.3)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                background: "#8b9dad",
                fontSize: 36,
                fontWeight: 700,
              }}
              icon={<FaUserCircle size={80} />}
            >
              {getInitials(data?.hoTen)}
            </Avatar>
          </Col>
          <Col flex={1}>
            <Title level={2} style={{ color: "white", margin: 0, fontSize: "28px" }}>
              {data?.hoTen || "-"}
            </Title>
            {/* Trạng thái và vị trí ứng tuyển trên cùng một hàng */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: 8 }}>
              <div>{getTrangThaiTag(data?.trangThai)}</div>
              <div style={{ marginLeft: 'auto' }}>
                {data?.viTriTuyenDungText && data?.tuyenDungId ? (
                  <Tag
                    color="rgba(255,255,255,0.9)"
                    style={{
                      color: "#764ba2",
                      border: "none",
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontWeight: 500,
                      fontSize: 14,
                      boxShadow: '0 2px 8px #764ba233',
                      background: 'rgba(255,255,255,0.95)',
                      cursor: 'pointer',
                      transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s, color 0.2s, text-decoration 0.2s',
                      transform: hoveringTag ? 'scale(1.05)' : 'scale(1)',
                      zIndex: 2,
                    }}
                    onMouseEnter={() => setHoveringTag(true)}
                    onMouseLeave={() => setHoveringTag(false)}
                  >
                    <Link
                      href={`/TD_TuyenDung/${data.tuyenDungId}`}
                      style={{ color: "#764ba2", textDecoration: "none", fontWeight: 500, display: 'inline-block', transition: 'color 0.2s, text-decoration 0.2s, transform 0.2s' }}
                      onMouseOver={e => {
                        e.currentTarget.style.color = '#1890ff';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={e => {
                        e.currentTarget.style.textDecoration = 'none';
                        e.currentTarget.style.color = '#764ba2';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {data.viTriTuyenDungText}
                    </Link>
                  </Tag>
                ) : (
                  <Tag
                    color="rgba(255,255,255,0.9)"
                    style={{
                      color: "#764ba2",
                      border: "none",
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontWeight: 500,
                      fontSize: 14,
                      boxShadow: '0 2px 8px #764ba233',
                      background: 'rgba(255,255,255,0.95)',
                      cursor: 'pointer',
                      zIndex: 2,
                    }}
                  >
                    {data?.viTriTuyenDungText || "-"}
                  </Tag>
                )}
              </div>
            </div>
          </Col>
          {data?.cvFile && (
            <Tooltip title="Xem CV">
              <Button
                type="primary"
                icon={<FiEye size={20} />}
                loading={downloading}
                onClick={handleViewCV}
                style={{
                  position: "absolute",
                  top: 32,
                  right: 32,
                  zIndex: 3,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 2px 8px #1890ff33",
                  borderRadius: 8,
                  fontWeight: 500,
                }}
              >
                Xem CV
              </Button>
            </Tooltip>
          )}
        </Row>
      </motion.div>
      {loading ? <Spin style={{ margin: 40 }} /> : data ? (
        <div style={{ padding: "32px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Row gutter={[24, 24]}>
              {/* Thông tin cá nhân */}
              <Col xs={24} lg={12}>
                <Card
                  title={<Space><FaUserCircle style={{ color: "#667eea" }} size={22} /><span>Thông tin cá nhân</span></Space>}
                  bordered={false}
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px", height: "100%" }}
                  headStyle={{ borderBottom: "1px solid #f0f0f0", fontSize: "16px", fontWeight: 600 }}
                >
                  <InfoRow label="Giới tính" value={getGioiTinhText(data.gioiTinh)} icon={data.gioiTinh === 1 ? <FaMars style={{ color: "#1890ff" }} /> : data.gioiTinh === 2 ? <FaVenus style={{ color: "#f759ab" }} /> : <FaGenderless style={{ color: "#aaa" }} />} />
                  <InfoRow label="Ngày sinh" value={data.ngaySinh ? dayjs(data.ngaySinh).format("DD/MM/YYYY") : "-"} icon={<FiCalendar />} />
                  <InfoRow label="Email" value={data.email || "-"} icon={<FiMail />} />
                  <InfoRow label="Số điện thoại" value={data.soDienThoai || "-"} icon={<FiPhone />} />
                  <InfoRow label="Địa chỉ" value={data.diaChi || "-"} icon={<FiMapPin />} />
                </Card>
              </Col>
              {/* Thông tin ứng tuyển */}
              <Col xs={24} lg={12}>
                <Card
                  title={<Space><HiOutlineBriefcase style={{ color: "#764ba2" }} size={22} /><span>Thông tin ứng tuyển</span></Space>}
                  bordered={false}
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px", height: "100%" }}
                  headStyle={{ borderBottom: "1px solid #f0f0f0", fontSize: "16px", fontWeight: 600 }}
                >
                  <InfoRow label="Trình độ học vấn" value={data.trinhDoHocVan || "-"} icon={<PiStudentBold />} />
                  <InfoRow label="Kinh nghiệm" value={data.kinhNghiem || "-"} icon={<HiOutlineBriefcase />} />
                  <InfoRow label="Ngày ứng tuyển" value={data.ngayUngTuyen ? dayjs(data.ngayUngTuyen).format("DD/MM/YYYY") : "-"} icon={<FiCalendar />} />
                  <InfoRow label="Phỏng vấn" value={data.thoiGianPhongVan ? dayjs(data.thoiGianPhongVan).format("DD/MM/YYYY HH:mm") : "-"} icon={<FiCalendar />} />
                </Card>
              </Col>
            </Row>
            {/* Ghi chú ứng viên */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              <Col xs={24}>
                <Card
                  title={<Space><MdEventNote style={{ color: "#1890ff" }} size={22} /><span>Ghi chú ứng viên</span></Space>}
                  bordered={false}
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "12px" }}
                  headStyle={{ borderBottom: "1px solid #f0f0f0", fontSize: "16px", fontWeight: 600 }}
                >
                  <div style={{ minHeight: 40, color: "#444" }}>
                    {data.ghiChuUngVien || <span style={{ color: "#bbb" }}>Không có ghi chú</span>}
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </div>
      ) : <div style={{ padding: 32 }}>Không có dữ liệu</div>}
    </Modal>
  );
};

// Block hiển thị thông tin với icon, label nhỏ, value nổi bật
function InfoRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 12 }}>
      <span style={{ fontSize: 18, marginRight: 10 }}>{icon}</span>
      <span style={{ fontWeight: 500, color: "#888", minWidth: 90, fontSize: 13 }}>{label}:</span>
      <span style={{ marginLeft: 8, color: "#222", fontWeight: 600, fontSize: 15 }}>{value}</span>
    </div>
  );
}

export default TD_UngVienDetail; 
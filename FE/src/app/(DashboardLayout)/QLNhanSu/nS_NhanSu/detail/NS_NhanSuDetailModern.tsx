"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Descriptions,
  Button,
  Modal,
  message,
  Avatar,
  Tag,
  Space,
  Typography,
  Divider,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  IdcardOutlined,
  BankOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  EditOutlined,
  CheckCircleOutlined,
  StopOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import GioiTinhConstant from "@/constants/QLNhanSu/GioiTinhConstant";
import { NS_NhanSuType } from "@/types/QLNhanSu/nS_NhanSu/nS_NhanSu";
import { duLieuDanhMucService } from "@/services/duLieuDanhMuc/duLieuDanhMuc.service";
import { departmentService } from "@/services/department/department.service";
import ChangeAvatar from "./changeAvatarNhanSu";
import nS_NhanSuService from "@/services/QLNhanSu/nS_NhanSu/nS_NhanSuService";
import BangCapTable from "../table/BangCapTable";
import HopDongLaoDongTable from "../table/HopDongLaoDongTable";
import KinhNghiemLamViecTable from "../table/KinhNghiemLamViecTable";
import { FaFileContract, FaGraduationCap } from "react-icons/fa6";
import { MdWorkHistory } from "react-icons/md";

const { Title, Text } = Typography;
interface Props {
  item?: NS_NhanSuType | null;
  onClose: () => void;
}
const StaticFileUrl = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;

const NS_NhanSuDetailModern: React.FC<Props> = ({ item, onClose }) => {
  const [chucVu, setChucVu] = useState<string>("");
  const [phongBan, setPhongBan] = useState<string>("");
  const [isOpenModalAvatar, setIsOpenModalAvatar] = useState<boolean>(false);
  const [isOpenBangCapModal, setIsOpenBangCapModal] = useState<boolean>(false);
  const [isOpenHopDongModal, setIsOpenHopDongModal] = useState<boolean>(false);
  const [isOpenKinhNghiemModal, setIsOpenKinhNghiemModal] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [img, setImg] = useState<string | undefined>();
  const [userInfo, setUserInfo] = useState<NS_NhanSuType>();

  const handleShowModalAvatar = () => {
    setIsOpenModalAvatar(true);
  };
  const handleCloseAvatar = () => {
    setIsOpenModalAvatar(false);
  };

  const handleShowBangCapModal = () => {
    setIsOpenBangCapModal(true);
  };

  const handleCloseBangCapModal = () => {
    setIsOpenBangCapModal(false);
  };

  const handleShowHopDongModal = () => {
    setIsOpenHopDongModal(true);
  };

  const handleCloseHopDongModal = () => {
    setIsOpenHopDongModal(false);
  };

  const handleShowKinhNghiemModal = () => {
    setIsOpenKinhNghiemModal(true);
  };

  const handleCloseKinhNghiemModal = () => {
    setIsOpenKinhNghiemModal(false);
  };

  const hanleEditAvatarSuccess = () => {
    setIsOpenModalAvatar(false);
    messageApi.success("Cập nhật thành công!");
    loadData();
  };

  const loadData = async () => {
    const response = await nS_NhanSuService.getDetail(item?.id ?? "");
    if (response.status) {
      setUserInfo(response.data);
      setChucVu(response.data.chucVu_txt ?? "");
      setPhongBan(response.data.phongBan_txt ?? "");
    }
  };

  useEffect(() => {
    loadData();
  }, [item?.id]);

  return (
    <>
      {contextHolder}
      <Modal
        title={null}
        open={true}
        onCancel={onClose}
        footer={null}
        width={900}
        bodyStyle={{ padding: 0 }}
        destroyOnClose
        centered
        closable={false}
      >
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ position: "relative" }}
              >
                <Avatar
                  size={100}
                  src={
                    userInfo?.hinhAnh
                      ? `${StaticFileUrl}${userInfo.hinhAnh}?v=${Date.now()}`
                      : `/img/avatars/default_avatar.png`
                  }
                  icon={<UserOutlined />}
                  style={{
                    border: "4px solid rgba(255,255,255,0.3)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                  }}
                />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  style={{
                    position: "absolute",
                    bottom: -5,
                    right: -5,
                    background: "#fff",
                    borderRadius: "50%",
                    padding: "4px",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                  onClick={handleShowModalAvatar}
                >
                  <EditOutlined
                    style={{ color: "#667eea", fontSize: "14px" }}
                  />
                </motion.div>
              </motion.div>
            </Col>
            <Col flex={1}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Title
                  level={2}
                  style={{ color: "white", margin: 0, fontSize: "28px" }}
                >
                  {item?.hoTen || "Chưa cập nhật"}
                </Title>
                <Space style={{ marginTop: 8 }}>
                  <Tag
                    color="rgba(255,255,255,0.9)"
                    style={{
                      color: "#667eea",
                      border: "none",
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontWeight: 500,
                    }}
                  >
                    {chucVu || "Chưa cập nhật chức vụ"}
                  </Tag>
                  <Tag
                    color="rgba(255,255,255,0.9)"
                    style={{
                      color: "#764ba2",
                      border: "none",
                      borderRadius: "20px",
                      padding: "4px 12px",
                      fontWeight: 500,
                    }}
                  >
                    {phongBan || "Chưa cập nhật phòng ban"}
                  </Tag>
                </Space>
                <div style={{ marginTop: 12 }}>
                  <Space>
                    {Number(item?.trangThai) === 1 ? (
                      <Tag
                        icon={<CheckCircleOutlined />}
                        color="success"
                        style={{
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "12px",
                        }}
                      >
                        Đang làm việc
                      </Tag>
                    ) : (
                      <Tag
                        icon={<StopOutlined />}
                        color="error"
                        style={{
                          borderRadius: "20px",
                          padding: "4px 12px",
                          fontSize: "12px",
                        }}
                      >
                        Đã nghỉ việc
                      </Tag>
                    )}

                    {/* Nút xem bằng cấp */}
                    <Tooltip title="Xem danh sách bằng cấp" placement="bottom">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          display: "inline-block",
                          background: "rgba(255,255,255,0.2)",
                          borderRadius: "50%",
                          padding: "8px",
                          cursor: "pointer",
                          backdropFilter: "blur(10px)",
                        }}
                        onClick={handleShowBangCapModal}
                      >
                        <FaGraduationCap
                          style={{ color: "white", fontSize: "16px" }}
                        />
                      </motion.div>
                    </Tooltip>

                    {/* Nút xem hợp đồng */}
                    <Tooltip
                      title="Xem danh sách hợp đồng lao động"
                      placement="bottom"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          display: "inline-block",
                          background: "rgba(255,255,255,0.2)",
                          borderRadius: "50%",
                          padding: "8px",
                          cursor: "pointer",
                          backdropFilter: "blur(10px)",
                        }}
                        onClick={handleShowHopDongModal}
                      >
                        <FaFileContract
                          style={{ color: "white", fontSize: "16px" }}
                        />
                      </motion.div>
                    </Tooltip>

                    {/* Nút xem kinh nghiệm làm việc */}
                    <Tooltip
                      title="Xem danh sách kinh nghiệm làm việc"
                      placement="bottom"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          display: "inline-block",
                          background: "rgba(255,255,255,0.2)",
                          borderRadius: "50%",
                          padding: "8px",
                          cursor: "pointer",
                          backdropFilter: "blur(10px)",
                        }}
                        onClick={handleShowKinhNghiemModal}
                      >
                        <MdWorkHistory
                          style={{ color: "white", fontSize: "16px" }}
                        />
                      </motion.div>
                    </Tooltip>
                  </Space>
                </div>
              </motion.div>
            </Col>
          </Row>
        </motion.div>

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
                  title={
                    <Space>
                      <UserOutlined style={{ color: "#667eea" }} />
                      <span>Thông tin cá nhân</span>
                    </Space>
                  }
                  bordered={false}
                  style={{
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    borderRadius: "12px",
                    height: "100%",
                  }}
                  headStyle={{
                    borderBottom: "1px solid #f0f0f0",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={16}
                  >
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        CMND/CCCD
                      </Text>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginTop: "4px",
                        }}
                      >
                        {item?.cMND || "Chưa cập nhật"}
                      </div>
                    </div>
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Ngày sinh
                      </Text>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginTop: "4px",
                        }}
                      >
                        <CalendarOutlined
                          style={{ marginRight: 8, color: "#667eea" }}
                        />
                        {item?.ngaySinh
                          ? dayjs(item.ngaySinh).format("DD/MM/YYYY")
                          : "Chưa cập nhật"}
                      </div>
                    </div>
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Giới tính
                      </Text>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginTop: "4px",
                        }}
                      >
                        {item?.gioiTinh === 1 ? (
                          <>
                            <ManOutlined
                              style={{ marginRight: 8, color: "#1890ff" }}
                            />
                            Nam
                          </>
                        ) : item?.gioiTinh === 2 ? (
                          <>
                            <WomanOutlined
                              style={{ marginRight: 8, color: "#f759ab" }}
                            />
                            Nữ
                          </>
                        ) : (
                          "Chưa cập nhật"
                        )}
                      </div>
                    </div>
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Ngày vào làm
                      </Text>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginTop: "4px",
                        }}
                      >
                        <CalendarOutlined
                          style={{ marginRight: 8, color: "#52c41a" }}
                        />
                        {item?.ngayVaoLam
                          ? dayjs(item.ngayVaoLam).format("DD/MM/YYYY")
                          : "Chưa cập nhật"}
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>

              {/* Thông tin liên hệ */}
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <Space>
                      <PhoneOutlined style={{ color: "#52c41a" }} />
                      <span>Thông tin liên hệ</span>
                    </Space>
                  }
                  bordered={false}
                  style={{
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    borderRadius: "12px",
                    height: "100%",
                  }}
                  headStyle={{
                    borderBottom: "1px solid #f0f0f0",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={16}
                  >
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Điện thoại
                      </Text>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginTop: "4px",
                        }}
                      >
                        <PhoneOutlined
                          style={{ marginRight: 8, color: "#52c41a" }}
                        />
                        {item?.dienThoai || "Chưa cập nhật"}
                      </div>
                    </div>
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Email
                      </Text>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginTop: "4px",
                        }}
                      >
                        <MailOutlined
                          style={{ marginRight: 8, color: "#1890ff" }}
                        />
                        {item?.email || "Chưa cập nhật"}
                      </div>
                    </div>
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Địa chỉ thường trú
                      </Text>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginTop: "4px",
                        }}
                      >
                        <HomeOutlined
                          style={{ marginRight: 8, color: "#fa8c16" }}
                        />
                        {item?.diaChiThuongTru || "Chưa cập nhật"}
                      </div>
                    </div>
                    <div>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Địa chỉ tạm trú
                      </Text>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginTop: "4px",
                        }}
                      >
                        <HomeOutlined
                          style={{ marginRight: 8, color: "#fa8c16" }}
                        />
                        {item?.diaChiTamTru || "Chưa cập nhật"}
                      </div>
                    </div>
                  </Space>
                </Card>
              </Col>

              {/* Thông tin ngân hàng & thuế */}
              <Col xs={24}>
                <Card
                  title={
                    <Space>
                      <BankOutlined style={{ color: "#f759ab" }} />
                      <span>Thông tin tài chính</span>
                    </Space>
                  }
                  bordered={false}
                  style={{
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    borderRadius: "12px",
                  }}
                  headStyle={{
                    borderBottom: "1px solid #f0f0f0",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Mã số thuế
                      </Text>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginTop: "4px",
                        }}
                      >
                        <IdcardOutlined
                          style={{ marginRight: 8, color: "#fa541c" }}
                        />
                        {item?.maSoThueCaNhan || "Chưa cập nhật"}
                      </div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Số tài khoản
                      </Text>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginTop: "4px",
                        }}
                      >
                        <BankOutlined
                          style={{ marginRight: 8, color: "#13c2c2" }}
                        />
                        {item?.soTaiKhoanNganHang || "Chưa cập nhật"}
                      </div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Ngân hàng
                      </Text>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginTop: "4px",
                        }}
                      >
                        <BankOutlined
                          style={{ marginRight: 8, color: "#722ed1" }}
                        />
                        {item?.nganHang || "Chưa cập nhật"}
                      </div>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                      <Text
                        type="secondary"
                        style={{
                          fontSize: "12px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Nơi cấp CMND
                      </Text>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          marginTop: "4px",
                        }}
                      >
                        <IdcardOutlined
                          style={{ marginRight: 8, color: "#eb2f96" }}
                        />
                        {item?.noiCapCMND || "Chưa cập nhật"}
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: "24px",
              textAlign: "right",
              borderTop: "1px solid #f0f0f0",
              paddingTop: "20px",
            }}
          >
            <Button
              onClick={onClose}
              size="large"
              style={{
                borderRadius: "8px",
                minWidth: "120px",
                height: "40px",
                fontWeight: 500,
              }}
            >
              Đóng
            </Button>
          </motion.div>
        </div>

        {isOpenModalAvatar && (
          <ChangeAvatar
            id={item?.id ?? ""}
            onSuccess={hanleEditAvatarSuccess}
            onClose={handleCloseAvatar}
          />
        )}

        {isOpenBangCapModal && (
          <Modal
            title={
              <Space>
                <FaGraduationCap style={{ color: "#52c41a" }} />
                <span>Danh sách bằng cấp - {item?.hoTen}</span>
              </Space>
            }
            open={true}
            onCancel={handleCloseBangCapModal}
            footer={null}
            width={1000}
            centered
            destroyOnClose
            closable={false}
          >
            <BangCapTable nhanSuId={item?.id} isDetail={true} />
          </Modal>
        )}

        {isOpenHopDongModal && (
          <Modal
            title={
              <Space>
                <FaFileContract style={{ color: "#1890ff" }} />
                <span>Danh sách hợp đồng lao động - {item?.hoTen}</span>
              </Space>
            }
            open={true}
            onCancel={handleCloseHopDongModal}
            footer={null}
            width={1200}
            centered
            destroyOnClose
            closable={false}
          >
            <HopDongLaoDongTable nhanSuId={item?.id} isDetail={true} />
          </Modal>
        )}

        {isOpenKinhNghiemModal && (
          <Modal
            title={
              <Space>
                <MdWorkHistory style={{ color: "#722ed1" }} />
                <span>Danh sách kinh nghiệm làm việc - {item?.hoTen}</span>
              </Space>
            }
            open={true}
            onCancel={handleCloseKinhNghiemModal}
            footer={null}
            width={1200}
            centered
            destroyOnClose
            closable={false}
          >
            <KinhNghiemLamViecTable nhanSuId={item?.id} isDetail={true} />
          </Modal>
        )}
      </Modal>
    </>
  );
};

export default NS_NhanSuDetailModern;

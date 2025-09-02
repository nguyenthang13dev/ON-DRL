import React, { useEffect, useState } from "react";
import { Button, Col, Drawer, Image, Row, Space, Grid, Tabs } from "antd";
import { NS_NhanSuType } from "@/types/QLNhanSu/nS_NhanSu/nS_NhanSu";
import nS_NhanSuService from "@/services/QLNhanSu/nS_NhanSu/nS_NhanSuService";
import { toast } from "react-toastify";
import { TabsProps } from "antd/lib";
import BasicInfoDescription from "./BasicInfo";
import PersonalInfoDescription from "./PersonalInfo";
import WorkInfoDescription from "./WorkInfo";
import {
  CarryOutOutlined,
  CreditCardOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import BankInfoDescription from "./BankInfo";
import TabTableNhanSu from "./TabTableNhanSu";
import { PermissionType } from "@/types/role/role";
import { useSelector } from "@/store/hooks";
import { hasMultiPermission } from "@/libs/Permission";
import LeaveDashboard from "@/app/(DashboardLayout)/NP_DangKyNghiPhep/LeaveDashboard";
import { ThongTinNghiPhepType } from "@/types/NP_DangKyNghiPhep/NP_DangKyNghiphep";
import { nP_DangKyNghiPhepService } from "@/services/NghiPhep/NP_DangKyNghiPhep/NP_DangKyNghiPhep.service";
const { useBreakpoint } = Grid;

interface Props {
  isOpen: boolean;
  id?: string;
  onClose: () => void;
}
const base_path = process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL;
const DetailNhanSuDrawer: React.FC<Props> = ({ isOpen, id, onClose }) => {
  const screens = useBreakpoint();

  const [userInfo, setUserInfo] = useState<NS_NhanSuType>();
  const [loadingDrawer, setLoadingDrawer] = useState<boolean>(false);
  const [thongTinNghiPhep, setThongTinNghiPhep] =
    useState<ThongTinNghiPhepType>();
  //lấy quyền người dùng
  const permissions: PermissionType[] | null = useSelector(
    (state) => state.permission.permissions
  );

  const modulePermission = hasMultiPermission(
    permissions ?? [],
    "QUANLYNGHIPHEP"
  );

  const getDrawerWidth = () => {
    if (screens.xs) return "100%";
    if (screens.sm) return "60%";
    if (screens.md) return "60%";
    if (screens.lg) return "60%";
    return "60%";
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <>
          <InfoCircleOutlined style={{ marginRight: 8, color: "#1890ff" }} />
          Thông tin cơ bản
        </>
      ),
      children: <BasicInfoDescription userInfo={userInfo} />,
    },
    {
      key: "2",
      label: (
        <>
          <UserOutlined style={{ marginRight: 8, color: "#52c41a" }} />
          Thông tin cá nhân
        </>
      ),
      children: <PersonalInfoDescription userInfo={userInfo} />,
    },
    {
      key: "3",
      label: (
        <>
          <CarryOutOutlined style={{ marginRight: 8, color: "#fa8c16" }} />
          Thông tin công việc
        </>
      ),
      children: <WorkInfoDescription userInfo={userInfo} />,
    },
    {
      key: "4",
      label: (
        <>
          <CreditCardOutlined style={{ marginRight: 8, color: "#722ed1" }} />
          Thông tin ngân hàng
        </>
      ),
      children: <BankInfoDescription userInfo={userInfo} />,
    },
  ];

  const handleGetSoNgayPhep = async () => {
    try {
      const res = await nP_DangKyNghiPhepService.GetSoNgayPhep();
      setThongTinNghiPhep(res.data);
    } catch (err) {
      toast.error("Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    if(!modulePermission.canTUCHOINGHIPHEPAll) handleGetSoNgayPhep();
  }, []);

  useEffect(() => {
    const handleGetUserInfo = async () => {
      setLoadingDrawer(true);
      try {
        const res = await nS_NhanSuService.getDetail(id ?? "");
        if (res.status && res.data != null) {
          setUserInfo(res.data);
          setLoadingDrawer(false);
        } else {
          setUserInfo(undefined);
          toast.error("Không tìm thấy thông tin nhân sự.");
        }
      } catch (error) {
        console.log("Error: ", error);
        toast.error("Lỗi khi tải thông tin.");
        setUserInfo(undefined);
      }
    };

    if (isOpen) {
      handleGetUserInfo();
    }
  }, [isOpen, id]);

  return (
    <>
      <Drawer
        title={userInfo?.hoTen}
        placement="right"
        onClose={onClose}
        open={isOpen}
        loading={loadingDrawer}
        width={getDrawerWidth()}
        extra={
          <Space>
            <Button onClick={onClose}>Đóng</Button>
          </Space>
        }
      >
        <div className="user-detail">
          <Row gutter={24}>
            <Col lg={4} md={4} sm={24} xs={24}>
              <Image
                alt={userInfo?.hoTen || ""}
                src={
                  userInfo?.hinhAnh
                    ? `${base_path}${userInfo.hinhAnh}?v=${Date.now()}`
                    : `/img/avatars/default_avatar.png`
                }
              />
            </Col>
            <Col lg={20} md={20} sm={24} xs={24}>
              <Tabs defaultActiveKey="1" items={items} />
            </Col>

            <Col style={{paddingTop: "15px"}} lg={24} md={24} sm={24} xs={24}>
              {!modulePermission.canTUCHOINGHIPHEPAll ? (
                <LeaveDashboard {...(thongTinNghiPhep ?? {})} />
              ) : (
                <></>
              )}
              <TabTableNhanSu maNV={userInfo?.maNV ?? ""} />
            </Col>
          </Row>
        </div>
      </Drawer>
    </>
  );
};

export default DetailNhanSuDrawer;

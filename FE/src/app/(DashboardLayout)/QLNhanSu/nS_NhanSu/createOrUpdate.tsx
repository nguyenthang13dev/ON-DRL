import React, { useEffect, useState } from "react";
import {
  Form,
  FormProps,
  Input,
  Select,
  DatePicker,
  Modal,
  Row,
  Col,
  TabsProps,
  Tabs,
  Button,
  Upload,
  Card,
  Space,
  Typography,
  Divider,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  IdcardOutlined,
  BankOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  NS_NhanSuCreateOrUpdateType,
  NS_NhanSuType,
} from "@/types/QLNhanSu/nS_NhanSu/nS_NhanSu";
import * as extensions from "@/utils/extensions";
import nS_NhanSuService from "@/services/QLNhanSu/nS_NhanSu/nS_NhanSuService";
import GioiTinhConstant from "@/constants/QLNhanSu/GioiTinhConstant";
import dayjs from "dayjs";
import TrangThaiConstant from "@/constants/QLNhanSu/TrangThaiConstant";
import { Dropdown } from "@amcharts/amcharts5/.internal/charts/stock/toolbar/Dropdown";
import { DropdownOption } from "@/types/general";
import { duLieuDanhMucService } from "@/services/duLieuDanhMuc/duLieuDanhMuc.service";
import NhomDanhMucConstant from "@/constants/NhomDanhMucConstant";
import { departmentService } from "@/services/department/department.service";
import DepartmentOrganizationConstant from "@/constants/QLNhanSu/DepartmentOrganizationConstant";
import BangCapTable from "./table/BangCapTable";
import HopDongLaoDongTable from "./table/HopDongLaoDongTable";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import KinhNghiemLamViecTable from "./table/KinhNghiemLamViecTable";

const { Title, Text } = Typography;

interface Props {
  item?: NS_NhanSuType | null;
  onClose: () => void;
  onSuccess: () => void;
}

const NS_NhanSuCreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm<NS_NhanSuCreateOrUpdateType>();
  const [chucVuOptions, setChucVuOptions] = useState<DropdownOption[]>([]);
  const [phongBanOptions, setPhongBanOptions] = useState<DropdownOption[]>([]);
  const [chucVuLoaded, setChucVuLoaded] = useState(false);
  const [phongBanLoaded, setPhongBanLoaded] = useState(false);
  const [activeTab, setActiveTab] = React.useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);

  const handleOnFinish: FormProps<NS_NhanSuCreateOrUpdateType>["onFinish"] =
    async (formData: NS_NhanSuCreateOrUpdateType) => {
      if (isLoading) return; // Prevent multiple submissions

      const payload = {
        ...formData,
      };

      setIsLoading(true);
      try {
        if (props.item) {
          const response = await nS_NhanSuService.update(payload);
          if (response.status) {
            toast.success("Chỉnh sửa thành công");
            form.resetFields();
            props.onSuccess();
            props.onClose();
          } else {
            toast.error(response.message);
          }
        } else {
          const response = await nS_NhanSuService.create(payload);
          if (response.status) {
            toast.success("Thêm mới thành công");
            form.resetFields();
            props.onSuccess();
            props.onClose();
          } else {
            toast.error(response.message);
          }
        }
      } catch (error) {
        console.error("API Error:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    };

  const handleCancel = () => {
    if (isLoading) return; // Prevent closing while API is in progress
    form.resetFields();
    props.onClose();
  };

  React.useEffect(() => {
    const fetchDropdownsChucVu = async () => {
      try {
        const response = await duLieuDanhMucService.GetDropdown(
          NhomDanhMucConstant.VaiTroDuAn
        );
        if (response.status) {
          setChucVuOptions(
            response.data.map((item: any) => ({
              value: item.value,
              label: item.label,
            }))
          );
          setChucVuLoaded(true);
        }
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu chức vụ");
      }
    };
    fetchDropdownsChucVu();
  }, []);

  React.useEffect(() => {
    const fetchDropdownsPhongBan = async () => {
      try {
        const response = await departmentService.getDropDepartmentByShortName(
          DepartmentOrganizationConstant.CongTyCoPhanHiNet
        );
        if (response.status) {
          setPhongBanOptions(
            response.data.map((item: any) => ({
              value: item.value,
              label: item.label,
            }))
          );
          setPhongBanLoaded(true);
        }
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu phòng ban");
      }
    };
    fetchDropdownsPhongBan();
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (props.item && chucVuLoaded && phongBanLoaded) {
        const chucVu = await duLieuDanhMucService.GetById(
          props.item.chucVuId ?? ""
        );
        const phongBan = await departmentService.getDetail(
          props.item.phongBanId ?? ""
        );
        form.setFieldsValue({
          ...props.item,
          ngaySinh: props.item.ngaySinh ? dayjs(props.item.ngaySinh) : null,
          ngayCapCMND: props.item.ngayCapCMND
            ? dayjs(props.item.ngayCapCMND)
            : null,
          ngayVaoLam: props.item.ngayVaoLam
            ? dayjs(props.item.ngayVaoLam)
            : null,
          gioiTinh:
            props.item.gioiTinh !== undefined && props.item.gioiTinh !== null
              ? String(props.item.gioiTinh)
              : undefined,
        });
      }
    };
    fetchData();
  }, [form, props.item, chucVuLoaded, phongBanLoaded]);

  //Tab
  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Thông tin chung của nhân sự",
      children: (
        <Form
          layout="vertical"
          form={form}
          name="formCreateUpdate"
          style={{ maxWidth: 1200 }}
          onFinish={handleOnFinish}
          autoComplete="off"
        >
          {props.item && (
            <Form.Item<NS_NhanSuCreateOrUpdateType> name="id" hidden>
              <Input />
            </Form.Item>
          )}

          {/* Thông tin cơ bản */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              title={
                <Space>
                  <UserOutlined style={{ color: "#667eea" }} />
                  <span>Thông tin cơ bản</span>
                </Space>
              }
              bordered={false}
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                borderRadius: "12px",
                marginBottom: "24px",
              }}
              headStyle={{
                borderBottom: "1px solid #f0f0f0",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Mã nhân viên
                      </Text>
                    }
                    name="maNV"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mã nhân viên!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập mã nhân viên"
                      size="large"
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Họ và tên
                      </Text>
                    }
                    name="hoTen"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ tên!" },
                    ]}
                  >
                    <Input
                      placeholder="Nhập họ và tên"
                      size="large"
                      style={{ borderRadius: "8px" }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Ngày sinh
                      </Text>
                    }
                    name="ngaySinh"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày sinh!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const ngayVaoLam = getFieldValue("ngayVaoLam");
                          const ngayCapCMND = getFieldValue("ngayCapCMND");
                          if (!value) return Promise.resolve();
                          if (value.isAfter(dayjs(), "day")) {
                            return Promise.reject(
                              new Error("Ngày sinh không thể là tương lai!")
                            );
                          }
                          if (ngayVaoLam && value.isAfter(ngayVaoLam, "day")) {
                            return Promise.reject(
                              new Error("Ngày sinh phải trước ngày vào làm!")
                            );
                          }
                          if (
                            ngayCapCMND &&
                            value.isAfter(ngayCapCMND, "day")
                          ) {
                            return Promise.reject(
                              new Error("Ngày sinh phải trước ngày cấp CMND!")
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      placeholder="Ngày sinh"
                      style={{ width: "100%", borderRadius: "8px" }}
                      size="large"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      allowClear
                      inputReadOnly={false}
                      suffixIcon={
                        <CalendarOutlined style={{ color: "#667eea" }} />
                      }
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Giới tính
                      </Text>
                    }
                    name="gioiTinh"
                    rules={[
                      { required: true, message: "Vui lòng chọn giới tính!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn giới tính"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                      }
                      options={[
                        {
                          value: GioiTinhConstant.Nam,
                          label: (
                            <Space>
                              <ManOutlined style={{ color: "#1890ff" }} />
                              {GioiTinhConstant.getDisplayName(
                                GioiTinhConstant.Nam
                              )}
                            </Space>
                          ),
                        },
                        {
                          value: GioiTinhConstant.Nu,
                          label: (
                            <Space>
                              <WomanOutlined style={{ color: "#f759ab" }} />
                              {GioiTinhConstant.getDisplayName(
                                GioiTinhConstant.Nu
                              )}
                            </Space>
                          ),
                        },
                        {
                          value: GioiTinhConstant.Khac,
                          label: GioiTinhConstant.getDisplayName(
                            GioiTinhConstant.Khac
                          ),
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Chức vụ
                      </Text>
                    }
                    name="chucVuId"
                    rules={[
                      { required: true, message: "Vui lòng chọn chức vụ!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn chức vụ"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                      }
                      options={chucVuOptions.map((opt) => ({
                        label: opt.label,
                        value: opt.value,
                      }))}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Phòng ban
                      </Text>
                    }
                    name="phongBanId"
                    rules={[
                      { required: true, message: "Vui lòng chọn phòng ban!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn phòng ban"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                      }
                      options={phongBanOptions.map((opt) => ({
                        label: opt.label,
                        value: opt.value,
                      }))}
                      allowClear
                      showSearch
                      optionFilterProp="label"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Trạng thái
                      </Text>
                    }
                    name="trangThai"
                    rules={[
                      { required: true, message: "Vui lòng chọn trạng thái!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn trạng thái làm việc"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                      }
                      options={[
                        {
                          value: TrangThaiConstant.DangLamViec,
                          label: TrangThaiConstant.getDisplayName(
                            TrangThaiConstant.DangLamViec
                          ),
                        },
                        {
                          value: TrangThaiConstant.NghiViec,
                          label: TrangThaiConstant.getDisplayName(
                            TrangThaiConstant.NghiViec
                          ),
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Ngày vào làm
                      </Text>
                    }
                    name="ngayVaoLam"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày vào làm!",
                      },
                    ]}
                  >
                    <DatePicker
                      placeholder="DD/MM/YYYY"
                      style={{ width: "100%", borderRadius: "8px" }}
                      size="large"
                      format={{
                        format: "DD-MM-YYYY",
                        type: "mask",
                      }}
                      allowClear
                      inputReadOnly={false}
                      suffixIcon={
                        <CalendarOutlined style={{ color: "#52c41a" }} />
                      }
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </motion.div>

          {/* Thông tin liên hệ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
                marginBottom: "24px",
              }}
              headStyle={{
                borderBottom: "1px solid #f0f0f0",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Điện thoại
                      </Text>
                    }
                    name="dienThoai"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại phải có đúng 10 chữ số",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập số điện thoại"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      prefix={<PhoneOutlined style={{ color: "#52c41a" }} />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Email
                      </Text>
                    }
                    name="email"
                    rules={[
                      {
                        type: "email",
                        message: "Email không hợp lệ!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập địa chỉ email"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      prefix={<MailOutlined style={{ color: "#1890ff" }} />}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Địa chỉ thường trú
                      </Text>
                    }
                    name="diaChiThuongTru"
                  >
                    <Input
                      placeholder="Nhập địa chỉ thường trú"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      prefix={<HomeOutlined style={{ color: "#fa8c16" }} />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Địa chỉ tạm trú
                      </Text>
                    }
                    name="diaChiTamTru"
                  >
                    <Input
                      placeholder="Nhập địa chỉ tạm trú"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      prefix={<HomeOutlined style={{ color: "#fa8c16" }} />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </motion.div>

          {/* Thông tin CMND/CCCD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              title={
                <Space>
                  <IdcardOutlined style={{ color: "#fa541c" }} />
                  <span>Thông tin CMND/CCCD</span>
                </Space>
              }
              bordered={false}
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                borderRadius: "12px",
                marginBottom: "24px",
              }}
              headStyle={{
                borderBottom: "1px solid #f0f0f0",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Số CMND/CCCD
                      </Text>
                    }
                    name="cMND"
                  >
                    <Input
                      placeholder="Nhập số CMND/CCCD"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      prefix={<IdcardOutlined style={{ color: "#fa541c" }} />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Ngày cấp
                      </Text>
                    }
                    name="ngayCapCMND"
                  >
                    <DatePicker
                      placeholder="DD/MM/YYYY"
                      style={{ width: "100%", borderRadius: "8px" }}
                      size="large"
                      format="DD/MM/YYYY"
                      allowClear
                      inputReadOnly={false}
                      suffixIcon={
                        <CalendarOutlined style={{ color: "#fa541c" }} />
                      }
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode as HTMLElement
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Nơi cấp
                      </Text>
                    }
                    name="noiCapCMND"
                  >
                    <Input
                      placeholder="Nhập nơi cấp CMND/CCCD"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      prefix={<BankOutlined style={{ color: "#fa541c" }} />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </motion.div>

          {/* Thông tin tài chính */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
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
                marginBottom: "24px",
              }}
              headStyle={{
                borderBottom: "1px solid #f0f0f0",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Mã số thuế cá nhân
                      </Text>
                    }
                    name="maSoThueCaNhan"
                  >
                    <Input
                      placeholder="Nhập mã số thuế cá nhân"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      prefix={<IdcardOutlined style={{ color: "#f759ab" }} />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Số tài khoản ngân hàng
                      </Text>
                    }
                    name="soTaiKhoanNganHang"
                  >
                    <Input
                      placeholder="Nhập số tài khoản"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      prefix={<BankOutlined style={{ color: "#13c2c2" }} />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item<NS_NhanSuCreateOrUpdateType>
                    label={
                      <Text style={{ fontWeight: 500, color: "#666" }}>
                        Ngân hàng
                      </Text>
                    }
                    name="nganHang"
                  >
                    <Input
                      placeholder="Nhập tên ngân hàng"
                      size="large"
                      style={{ borderRadius: "8px" }}
                      prefix={<BankOutlined style={{ color: "#722ed1" }} />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </motion.div>
        </Form>
      ),
    },
    ...(props.item
      ? [
          {
            key: "2",
            label: "Bằng cấp",
            children: <BangCapTable nhanSuId={props.item?.id} />,
          },
          {
            key: "3",
            label: "Hợp đồng lao động",
            children: <HopDongLaoDongTable nhanSuId={props.item?.id} />,
          },
          {
            key: "4",
            label: "Kinh nghiệm làm việc",
            children: (
              <KinhNghiemLamViecTable
                nhanSuId={props.item?.id}
                maNV={props.item?.maNV ?? undefined}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <Modal
      title={null}
      open={true}
      onOk={() => !isLoading && form.submit()}
      onCancel={handleCancel}
      cancelText="Đóng"
      width={1200}
      bodyStyle={{
        padding: 0,
        maxHeight: "80vh",
        overflow: "hidden",
      }}
      destroyOnClose
      centered
      closable={false}
      maskClosable={!isLoading}
      keyboard={!isLoading}
      footer={
        activeTab === "1"
          ? [
              <Button
                key="cancel"
                onClick={handleCancel}
                size="large"
                style={{
                  borderRadius: "8px",
                  minWidth: "120px",
                  height: "40px",
                  fontWeight: 500,
                }}
                icon={<CloseOutlined />}
                disabled={isLoading}
              >
                Đóng
              </Button>,
              <Button
                key="ok"
                type="primary"
                onClick={() => form.submit()}
                size="large"
                style={{
                  borderRadius: "8px",
                  minWidth: "120px",
                  height: "40px",
                  fontWeight: 500,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
                icon={<SaveOutlined />}
                loading={isLoading}
                disabled={isLoading}
              >
                {props.item ? "Cập nhật" : "Thêm mới"}
              </Button>,
            ]
          : [
              <Button
                key="cancel"
                onClick={handleCancel}
                size="large"
                style={{
                  borderRadius: "8px",
                  minWidth: "120px",
                  height: "40px",
                  fontWeight: 500,
                }}
                icon={<CloseOutlined />}
                disabled={isLoading}
              >
                Đóng
              </Button>,
            ]
      }
    >
      {/* Custom Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "24px",
          color: "white",
          position: "relative",
          overflow: "hidden",
          borderRadius: "8px 8px 0 0",
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

        <Space style={{ position: "relative", zIndex: 1 }}>
          <UserOutlined style={{ fontSize: "20px" }} />
          <Title level={4} style={{ color: "white", margin: 0 }}>
            {props.item ? "CHỈNH SỬA THÔNG TIN NHÂN SỰ" : "THÊM MỚI NHÂN SỰ"}
          </Title>
        </Space>
        <Text
          style={{
            color: "rgba(255,255,255,0.8)",
            marginTop: "8px",
            position: "relative",
            zIndex: 1,
            display: "block",
          }}
        >
          Vui lòng điền đầy đủ thông tin bên dưới
        </Text>
      </motion.div>

      {/* Content */}
      <div
        style={{
          background: "#f8f9fa",
          maxHeight: "calc(80vh - 200px)",
          overflowY: "auto",
          cursor: isLoading ? "wait" : "default",
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabPosition="top"
          destroyInactiveTabPane
          style={{
            padding: "24px 24px 0 24px",
            background: "white",
            minHeight: "auto",
          }}
          tabBarStyle={{
            marginBottom: "24px",
            borderBottom: "2px solid #f0f0f0",
            padding: "0",
          }}
        />
      </div>
    </Modal>
  );
};
export default NS_NhanSuCreateOrUpdate;

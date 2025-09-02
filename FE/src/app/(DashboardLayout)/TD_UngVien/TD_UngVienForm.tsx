import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Row,
  Col,
  Button,
  Divider,
  Avatar,
  Tooltip
} from "antd";
import { UploadOutlined, UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, FilePdfOutlined, CalendarOutlined, BookOutlined, SolutionOutlined, FileTextOutlined } from "@ant-design/icons";
import { TD_UngVienCreate, TD_UngVienEdit, TD_UngVienDto, GioiTinhUngVien } from "@/types/TD_UngVien/TD_UngVien";
import dayjs, { Dayjs } from "dayjs";
import tdTuyenDungService from "@/services/TD_TuyenDung/TD_TuyenDungService";
import { TD_TuyenDungType } from "@/types/TD_TuyenDung/TD_TuyenDung";
import { toast } from "react-toastify";
const { TextArea } = Input;

interface TD_UngVienFormValues {
  HoTen: string;
  NgaySinh?: Dayjs;
  GioiTinh?: number;
  Email: string;
  SoDienThoai: string;
  DiaChi?: string;
  TrinhDoHocVan?: string;
  KinhNghiem?: string;
  NgayUngTuyen?: Dayjs;
  ThoiGianPhongVan?: Dayjs;
  TrangThai?: number;
  GhiChuUngVien?: string;
  TuyenDungId?: string;
}

interface TD_UngVienFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: TD_UngVienCreate | TD_UngVienEdit) => void;
  loading?: boolean;
  initialValues?: TD_UngVienDto | null;
}

const TD_UngVienForm: React.FC<TD_UngVienFormProps> = ({
  open,
  onCancel,
  onSubmit,
  loading,
  initialValues,
}) => {
  const [form] = Form.useForm<TD_UngVienFormValues>();
  const [fileList, setFileList] = useState<any[]>([]);
  const [viTriOptions, setViTriOptions] = useState<{ label: string; value: string }[]>([]);
  const [viTriLoading, setViTriLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Lấy danh sách vị trí tuyển dụng
      setViTriLoading(true);
      tdTuyenDungService.getData({ pageIndex: 1, pageSize: 100, tenViTri: undefined })
        .then(res => {
          if (res.status && res.data?.items) {
            setViTriOptions(res.data.items.map((item: TD_TuyenDungType) => ({
              label: item.tenViTri,
              value: item.id,
            })));
          } else {
            setViTriOptions([]);
          }
        })
        .finally(() => setViTriLoading(false));
      if (initialValues) {
        // Edit mode
        form.setFieldsValue({
          NgaySinh: initialValues.ngaySinh ? dayjs(initialValues.ngaySinh) : undefined,
          NgayUngTuyen: initialValues.ngayUngTuyen ? dayjs(initialValues.ngayUngTuyen) : undefined,
          ThoiGianPhongVan: initialValues.thoiGianPhongVan ? dayjs(initialValues.thoiGianPhongVan) : undefined,
          HoTen: initialValues.hoTen,
          GioiTinh: initialValues.gioiTinh,
          Email: initialValues.email,
          SoDienThoai: initialValues.soDienThoai,
          DiaChi: initialValues.diaChi,
          TrinhDoHocVan: initialValues.trinhDoHocVan,
          KinhNghiem: initialValues.kinhNghiem,
          TrangThai: initialValues.trangThai,
          GhiChuUngVien: initialValues.ghiChuUngVien,
          TuyenDungId: initialValues.tuyenDungId,
        });
      } else {
        // Create mode
        form.resetFields();
        setFileList([]);
      }
    }
  }, [open, initialValues, form]);

  const handleFinish = (values: TD_UngVienFormValues) => {
    const formData: TD_UngVienCreate | TD_UngVienEdit = {
      HoTen: values.HoTen,
      NgaySinh: values.NgaySinh ? values.NgaySinh.format("YYYY-MM-DD") : undefined,
      GioiTinh: values.GioiTinh,
      Email: values.Email,
      SoDienThoai: values.SoDienThoai,
      DiaChi: values.DiaChi,
      TrinhDoHocVan: values.TrinhDoHocVan,
      KinhNghiem: values.KinhNghiem,
      NgayUngTuyen: values.NgayUngTuyen ? values.NgayUngTuyen.format("YYYY-MM-DD") : undefined,
      ThoiGianPhongVan: values.ThoiGianPhongVan ? values.ThoiGianPhongVan.format("YYYY-MM-DDTHH:mm") : undefined,
      TrangThai: values.TrangThai,
      GhiChuUngVien: values.GhiChuUngVien,
      TuyenDungId: values.TuyenDungId,
    } as TD_UngVienCreate | TD_UngVienEdit;

    // Add file if exists
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.CVFile = fileList[0].originFileObj;
    }

    // Add ID for edit mode
    if (initialValues?.id) {
      (formData as TD_UngVienEdit).id = initialValues.id;
    }

    onSubmit(formData);
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const uploadProps = {
    beforeUpload: (file: File) => {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Chỉ chấp nhận file PDF, DOCX, XLSX, JPG, PNG!');
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error('File không được vượt quá 10MB!');
        return false;
      }
      
      return false; // Prevent auto upload
    },
    fileList,
    onChange: ({ fileList }: any) => {
      setFileList(fileList);
    },
    maxCount: 1,
  };

  const gioiTinhOptions = [
    { label: "Nam", value: GioiTinhUngVien.Nam },
    { label: "Nữ", value: GioiTinhUngVien.Nu },
    { label: "Khác", value: GioiTinhUngVien.Khac },
  ];

  const trangThaiOptions = [
    { label: "Chưa xét duyệt", value: 0 },
    { label: "Đã xét duyệt", value: 1 },
    { label: "Đang chờ phỏng vấn", value: 2 },
    { label: "Đã nhận việc", value: 3 },
    { label: "Đã từ chối", value: 4 },
  ];

  const getInitials = (name?: string) => name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) : "";

  const iconLabel = (icon: React.ReactNode, text: string) => (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ marginRight: 6 }}>{icon}</span>{text}
    </span>
  );

  return (
    <Modal
      title={null}
      open={open}
      onCancel={handleCancel}
      width={800}
      destroyOnClose
      bodyStyle={{ padding: 0 }}
      footer={null}
    >
      <div style={{ background: "#f8fafc", borderRadius: 16, overflow: "hidden" }}>
        {/* Header gradient + Avatar */}
        <div style={{
          background: "linear-gradient(90deg, rgb(119 119 119) 0%, rgb(0 44 55) 100%)",
          height: 120,
          position: "relative"
        }}>
          <Avatar
            size={96}
            style={{
              position: "absolute",
              left: "50%",
              top: 80,
              transform: "translate(-50%, 0)",
              border: "4px solid #fff",
              background: "#8b9dad",
              fontSize: 36,
              fontWeight: 700,
              zIndex: 2
            }}
            icon={<UserOutlined />}
          >
            {getInitials(form.getFieldValue("HoTen"))}
          </Avatar>
        </div>
        {/* Tên ứng viên (nếu có) */}
        <div style={{ textAlign: "center", marginTop: 56, marginBottom: 8 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#222" }}>{form.getFieldValue("HoTen") || (initialValues ? initialValues.hoTen : "")}</div>
          <div style={{ color: "#888", fontSize: 15, marginTop: 4 }}>
            <SolutionOutlined /> {viTriOptions.find(v => v.value === form.getFieldValue("TuyenDungId"))?.label || "-"}
          </div>
        </div>
        <Divider style={{ margin: "16px 0" }} />
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          style={{ padding: "0 32px 24px 32px" }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={iconLabel(<UserOutlined />, "Họ tên")}
                name="HoTen"
                rules={[
                  { max: 250, message: "Họ tên không được vượt quá 250 ký tự!" },
                ]}
              >
                <Input placeholder="Nhập họ tên" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={iconLabel(<CalendarOutlined />, "Ngày sinh")}
                name="NgaySinh"
                rules={[]}
              >
                <DatePicker
                  placeholder="Chọn ngày sinh"
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={iconLabel(<UserOutlined />, "Giới tính")}
                name="GioiTinh"
                rules={[]}
              >
                <Select
                  placeholder="Chọn giới tính"
                  options={gioiTinhOptions}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={iconLabel(<MailOutlined />, "Email")}
                name="Email"
                rules={[
                  { type: "email", message: "Email không hợp lệ!" },
                  { max: 250, message: "Email không được vượt quá 250 ký tự!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={iconLabel(<PhoneOutlined />, "Số điện thoại")}
                name="SoDienThoai"
                rules={[
                  { max: 20, message: "Số điện thoại không được vượt quá 20 ký tự!" },
                  { pattern: /^(0|\+84)[1-9][0-9]{8}$/, message: "Số điện thoại không hợp lệ." },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            {/* Ngày ứng tuyển chỉ hiển thị khi chỉnh sửa */}
            {initialValues && (
              <Col xs={24} sm={12}>
                <Form.Item
                  label={iconLabel(<CalendarOutlined />, "Ngày ứng tuyển")}
                  name="NgayUngTuyen"
                  rules={[]}
                >
                  <DatePicker
                    placeholder="Chọn ngày ứng tuyển"
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            )}
            {/* Thời gian phỏng vấn chỉ hiển thị khi chỉnh sửa */}
            {initialValues && (
              <Col xs={24} sm={12}>
                <Form.Item
                  label={iconLabel(<CalendarOutlined />, "Thời gian phỏng vấn")}
                  name="ThoiGianPhongVan"
                  rules={[]}
                >
                  <DatePicker
                    showTime
                    placeholder="Chọn thời gian phỏng vấn"
                    format="DD/MM/YYYY HH:mm"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} sm={12}>
              <Form.Item
                label={iconLabel(<SolutionOutlined />, "Vị trí tuyển dụng")}
                name="TuyenDungId"
                rules={[]}
              >
                <Select
                  placeholder="Chọn vị trí tuyển dụng"
                  allowClear
                  showSearch
                  loading={viTriLoading}
                  filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                  options={viTriOptions}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label={iconLabel(<HomeOutlined />, "Địa chỉ")}
                name="DiaChi"
                rules={[
                  { max: 500, message: "Địa chỉ không được vượt quá 500 ký tự!" },
                ]}
              >
                <TextArea
                  placeholder="Nhập địa chỉ"
                  rows={2}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label={iconLabel(<BookOutlined />, "Trình độ học vấn")}
                name="TrinhDoHocVan"
                rules={[
                  { max: 500, message: "Trình độ học vấn không được vượt quá 500 ký tự!" },
                ]}
              >
                <TextArea
                  placeholder="Nhập trình độ học vấn"
                  rows={2}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label={iconLabel(<SolutionOutlined />, "Kinh nghiệm")}
                name="KinhNghiem"
                rules={[
                  { max: 1000, message: "Kinh nghiệm không được vượt quá 1000 ký tự!" },
                ]}
              >
                <TextArea
                  placeholder="Nhập kinh nghiệm làm việc"
                  rows={3}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label={iconLabel(<FileTextOutlined />, "Ghi chú ứng viên")}
                name="GhiChuUngVien"
                rules={[
                  { max: 1000, message: "Ghi chú không được vượt quá 1000 ký tự!" }]
                }
              >
                <TextArea
                  placeholder="Nhập ghi chú ứng viên"
                  rows={2}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label={iconLabel(<FilePdfOutlined />, "CV File")}
                name="CVFile"
                rules={[]}
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Tải lên CV</Button>
                  <div style={{ marginTop: 8, color: '#666', fontSize: '12px' }}>
                    Hỗ trợ: PDF, DOCX (Tối đa 10MB)
                  </div>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>{initialValues ? "Cập nhật" : "Thêm mới"}</Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default TD_UngVienForm; 
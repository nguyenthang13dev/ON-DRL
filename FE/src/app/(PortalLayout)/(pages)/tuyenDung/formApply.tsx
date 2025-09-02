import {
  Button, Col, DatePicker, Form, Input, Modal, Radio, Row, Select, Tabs, Upload
} from 'antd';
import { UploadOutlined, CalendarOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { TD_UngVienAndDonUngTuyenCreate, TD_UngVienCreate } from '@/types/TD_UngVien/TD_UngVien';
import tD_UngVienService from '@/services/TD_UngVien/TD_UngVienService';
import { toast } from 'react-toastify';
import { TabsProps } from 'antd/lib';
import { Typography } from 'antd';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  donUngTuyen: {
    ViTriId: string;
    TrangThai?: number;
    GhiChu?: string;
    NgayNopDon: string;
  };
  item?: any;
}

const educationOptions = [
  { label: 'Trung học phổ thông', value: 'THPT' },
  { label: 'Trung cấp', value: 'TrungCap' },
  { label: 'Cao đẳng', value: 'CaoDang' },
  { label: 'Đại học', value: 'DaiHoc' },
  { label: 'Thạc sĩ', value: 'ThacSi' },
  { label: 'Tiến sĩ', value: 'TienSi' },
];

const { Text } = Typography;

const FormApply: React.FC<Props> = (props) => {
  const [form] = Form.useForm();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnFinish = async (formData: TD_UngVienCreate) => {
    if (isLoading) return;
    const payload = {
      ...formData,
      ...props.donUngTuyen,
      CVFile: cvFile ? cvFile : formData.CVFile,
    };
    setIsLoading(true);
    // try {
    //   const res = await tD_UngVienService.createUngVienAndDonUngTuyen(payload);
    //   if (res && res.status) {
    //     toast.success("Nộp hồ sơ thành công");
    //     form.resetFields();
    //     props.onSuccess();
    //     props.onClose();
    //   } else {
    //     toast.error(res?.message || "Có lỗi xảy ra khi nộp hồ sơ");
    //   }
    // } catch (error) {
    //   toast.error("Có lỗi xảy ra khi nộp hồ sơ");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleCancel = () => {
    if (isLoading) return;
    form.resetFields();
    props.onClose();
  };

  const handleBeforeUpload = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file PDF, DOC hoặc DOCX!");
      return false;
    }
    if (file.size / 1024 / 1024 >= 5) {
      toast.error('File phải nhỏ hơn 5MB!');
      return false;
    }
    setCvFile(file);
    form.setFieldsValue({ CVFile: file });
    return false;
  };

  const tabItems: TabsProps['items'] = [
    {
      key: "1",
      label: "Thông tin cơ bản",
      children: (
        <Form
          style={{ maxWidth: 1200 }}
          name="formApply"
          autoComplete="off"
          form={form}
          layout="vertical"
          onFinish={handleOnFinish}
          initialValues={{
            GioiTinh: 0,
            ...props.item,
            ...props.donUngTuyen,
          }}
        >
          {props.item && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="HoTen"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }, { max: 250 }]}
              >
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <Text style={{ fontWeight: 500, color: "#666" }}>
                    Ngày sinh
                  </Text>
                }
                name="NgaySinh"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày sinh!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      // Lấy các trường liên quan nếu có
                      const ngayVaoLam = getFieldValue("NgayVaoLam");
                      const ngayCapCMND = getFieldValue("NgayCapCMND");
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
                      if (ngayCapCMND && value.isAfter(ngayCapCMND, "day")) {
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
                  format={{ format: "DD-MM-YYYY", type: "mask" }}
                  allowClear
                  inputReadOnly={false}
                  suffixIcon={<CalendarOutlined style={{ color: "#667eea" }} />}
                  getPopupContainer={triggerNode =>
                    triggerNode.parentNode as HTMLElement
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="GioiTinh"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
              >
                <Radio.Group>
                  <Radio value={0}>Nam</Radio>
                  <Radio value={1}>Nữ</Radio>
                  <Radio value={2}>Khác</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="Email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                  { max: 250 }
                ]}
              >
                <Input placeholder="email@example.com" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="SoDienThoai"
                label="Số điện thoại"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại' },
                  { pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: 'Số điện thoại không hợp lệ' },
                  { max: 250 }
                ]}
              >
                <Input placeholder="0912345678" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="DiaChi"
                label="Địa chỉ"
                rules={[{ max: 250 }]}
              >
                <Input placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="TrinhDoHocVan"
                label="Trình độ học vấn"
                rules={[{ max: 200 }]}
              >
                <Select
                  placeholder="Chọn trình độ học vấn"
                  options={educationOptions}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="KinhNghiem"
                label="Kinh nghiệm làm việc"
                rules={[{ max: 500 }]}
              >
                <Input.TextArea rows={2} placeholder="Mô tả kinh nghiệm, kỹ năng..." />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="CVFile"
            label="Tải lên CV"
            rules={[{ required: true, message: 'Vui lòng tải lên CV' }]}
            extra="Chỉ chấp nhận file PDF, DOC, DOCX (tối đa 5MB)"
          >
            <Upload
              accept=".pdf,.doc,.docx"
              beforeUpload={handleBeforeUpload}
              maxCount={1}
              showUploadList={true}
            >
              <Button icon={<UploadOutlined />}>Chọn file CV</Button>
            </Upload>
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <Modal
      title="Nộp hồ sơ ứng tuyển"
      open={true}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      cancelText="Đóng"
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Đóng
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()} loading={isLoading}>
          Nộp hồ sơ
        </Button>,
      ]}
    >
      <Tabs activeKey="1" items={tabItems} tabPosition="top" />
    </Modal>
  );
};

export default FormApply;
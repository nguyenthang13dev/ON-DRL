import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
} from "antd";
import { toast } from "react-toastify";
import {
  TD_TuyenDungType,
  TD_TuyenDungCreateType,
  TD_TuyenDungEditType,
  TD_TuyenDungTinhTrangOptions,
  TD_TuyenDungLoaiOptions,
  TD_TuyenDungHinhThucOptions,
} from "@/types/TD_TuyenDung/TD_TuyenDung";
import tdTuyenDungService from "@/services/TD_TuyenDung/TD_TuyenDungService";
import dayjs from "dayjs";
import CKEditor4Component from "@/components/cKEditor-components/CKEditorComponent";

const { TextArea } = Input;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  data?: TD_TuyenDungType | null;
}

const TD_TuyenDungCreateOrUpdate: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  data,
}) => {
  const [form] = Form.useForm<TD_TuyenDungCreateType | TD_TuyenDungEditType>();
  const [loading, setLoading] = useState(false);
 const [editorMoTa, setEditorMoTa] = useState("");
  useEffect(() => {
    if (isOpen) {
      if (data) {
        form.setFieldsValue({
          ...data,
          ngayBatDau: data.ngayBatDau ? dayjs(data.ngayBatDau) : undefined,
          ngayKetThuc: data.ngayKetThuc ? dayjs(data.ngayKetThuc) : undefined,
          soLuongCanTuyen: data.soLuongCanTuyen.toString(),
          tinhTrang: data.tinhTrang.toString(),
        });
        setEditorMoTa(data.moTa ?? "");
      } else {
        // Chế độ thêm mới
        setEditorMoTa("");
        form.resetFields();
      }
    }
  }, [isOpen, data, form]);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = {
        ...values,
        ngayBatDau: values.ngayBatDau ? dayjs(values.ngayBatDau).format("YYYY-MM-DD") : undefined,
        ngayKetThuc: values.ngayKetThuc ? dayjs(values.ngayKetThuc).format("YYYY-MM-DD") : undefined,
        soLuongCanTuyen: values.soLuongCanTuyen ? Number(values.soLuongCanTuyen) : undefined,
        tinhTrang: values.tinhTrang ? Number(values.tinhTrang) : undefined,
      };

      let response;
      if (data) {
        response = await tdTuyenDungService.update({
          ...formData,
          id: data.id,
        });
      } else {
        response = await tdTuyenDungService.create(formData);
      }

      if (response.status) {
        toast.success(
          data ? "Cập nhật vị trí tuyển dụng thành công" : "Thêm mới vị trí tuyển dụng thành công"
        );
        form.resetFields();
        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={data ? "Chỉnh sửa vị trí tuyển dụng" : "Thêm mới vị trí tuyển dụng"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText={data ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      confirmLoading={loading}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item<TD_TuyenDungCreateType>
              label="Tên vị trí"
              name="tenViTri"
              rules={[
                { required: true, message: "Vui lòng nhập tên vị trí!" },
                { max: 250, message: "Tên vị trí không được vượt quá 250 ký tự!" },
              ]}
            >
              <Input placeholder="Nhập tên vị trí" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<TD_TuyenDungCreateType>
              label="Số lượng cần tuyển"
              name="soLuongCanTuyen"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng cần tuyển!" },
              ]}
            >
              <Input placeholder="Nhập số lượng" type="number" min={1} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<TD_TuyenDungCreateType>
              label="Ngày bắt đầu"
              name="ngayBatDau"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
              ]}
            >
              <DatePicker
                placeholder="Chọn ngày bắt đầu"
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<TD_TuyenDungCreateType>
              label="Ngày kết thúc"
              name="ngayKetThuc"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ]}
            >
              <DatePicker
                placeholder="Chọn ngày kết thúc"
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<TD_TuyenDungCreateType>
              label="Tình trạng"
              name="tinhTrang"
              rules={[
                { required: true, message: "Vui lòng chọn tình trạng!" },
              ]}
            >
              <Select placeholder="Chọn tình trạng">
                {TD_TuyenDungTinhTrangOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value.toString()}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item<TD_TuyenDungCreateType>
              label="Loại tuyển dụng"
              name="loai"
              rules={[
                { required: true, message: "Vui lòng chọn loại tuyển dụng!" },
              ]}
            >
              <Select placeholder="Chọn loại tuyển dụng">
                {TD_TuyenDungLoaiOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item<TD_TuyenDungCreateType>
              label="Hình thức"
              name="hinhThuc"
              rules={[
                { required: true, message: "Vui lòng chọn hình thức!" },
              ]}
            >
              <Select placeholder="Chọn hình thức">
                {TD_TuyenDungHinhThucOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item<TD_TuyenDungCreateType>
              label="Mô tả"
              name="moTa"
            >
              {/* <TextArea
                placeholder="Nhập mô tả vị trí tuyển dụng"
                rows={4}
                maxLength={1000}
                showCount
              /> */}

               <CKEditor4Component
              initialData={editorMoTa}
              onChange={(data) => {
                form.setFieldsValue({ moTa: data });
              }}
            />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TD_TuyenDungCreateOrUpdate;

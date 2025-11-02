import { khoaService } from "@/services/khoa/khoa.service";
import { lopHanhChinhService } from "@/services/lopHanhChinh/lopHanhChinh.service";
import { sinhVienService } from "@/services/sinhVien/sinhVien.service";
import { DropdownOption } from "@/types/general";
import { SinhVien, createEditType } from "@/types/sinhVien/sinhVien";
import { DatePicker, Form, FormProps, Input, Modal, Radio, Select } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  sinhVien?: SinhVien | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateOrUpdate: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const [khoaOptions, setKhoaOptions] = useState<DropdownOption[]>([]);
  const [lopOptions, setLopOptions] = useState<DropdownOption[]>([]);

  const handleOnFinish: FormProps<createEditType>["onFinish"] = async (
    formData: createEditType
  ) => {
    try {
      if (props.sinhVien) {
        const response = await sinhVienService.Update(
          props.sinhVien.id!,
          formData
        );
        if (response.status) {
          toast.success("Chỉnh sửa sinh viên thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await sinhVienService.Create(formData);
        if (response.status) {
          toast.success("Tạo mới sinh viên thành công");
          form.resetFields();
          props.onSuccess();
          props.onClose();
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    setIsOpen(props.isOpen);
    if (props.isOpen) {
      loadKhoaOptions();
      if (props.sinhVien) {
        form.setFieldsValue({
          ...props.sinhVien,
          ngaySinh: props.sinhVien.ngaySinh
            ? dayjs(props.sinhVien.ngaySinh)
            : null,
        });
        // Load lớp theo khoa khi edit
        if (props.sinhVien.khoaId) {
          loadLopOptions(props.sinhVien.khoaId);
        }
      } else {
        form.resetFields();
        setLopOptions([]); // Reset danh sách lớp khi thêm mới
      }
    }
  }, [props.isOpen, props.sinhVien, form]);

  const loadKhoaOptions = async () => {
    try {
      const response = await khoaService.GetDropKhoa();
      if (response.status && response.data) {
        setKhoaOptions(response.data);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách khoa");
    }
  };

  const loadLopOptions = async (khoaId?: string) => {
    try {
      // Sử dụng getDataByPage để lấy danh sách lớp theo khoa
      const response = await lopHanhChinhService.getDataByPage({
        khoaId: khoaId,
        pageIndex: 1,
        pageSize: 1000, // Lấy tất cả lớp
      });
      if (response && response.data && response.data.items) {
        // Chuyển đổi dữ liệu thành format DropdownOption
        const lopDropdownOptions: DropdownOption[] = response.data.items.map(
          (lop: any) => ({
            value: lop.id,
            label: lop.tenLop,
          })
        );
        setLopOptions(lopDropdownOptions);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách lớp");
    }
  };

  const handleKhoaChange = (khoaId: string) => {
    // Reset lớp khi thay đổi khoa
    form.setFieldValue("lopId", undefined);
    setLopOptions([]);

    // Load danh sách lớp theo khoa mới
    if (khoaId) {
      loadLopOptions(khoaId);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    props.onClose();
  };

  return (
    <Modal
      title={props.sinhVien ? "Chỉnh sửa sinh viên" : "Thêm mới sinh viên"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText={props.sinhVien ? "Cập nhật" : "Tạo mới"}
      cancelText="Hủy"
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleOnFinish}>
        <Form.Item
          label="Mã sinh viên"
          name="maSV"
          rules={[{ required: true, message: "Vui lòng nhập mã sinh viên!" }]}
        >
          <Input placeholder="Nhập mã sinh viên" />
        </Form.Item>

        <Form.Item
          label="Họ tên"
          name="hoTen"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          label="Ngày sinh"
          name="ngaySinh"
          rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
        >
          <DatePicker
            placeholder="Chọn ngày sinh"
            style={{ width: "100%" }}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gioiTinh"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Radio.Group>
            <Radio value={true}>Nam</Radio>
            <Radio value={false}>Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="trangThai"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value="DangHoc">Đang học</Select.Option>
            <Select.Option value="BaoLuu">Bảo lưu</Select.Option>
            <Select.Option value="DaTotNghiep">Đã tốt nghiệp</Select.Option>
            <Select.Option value="NghiHoc">Nghỉ học</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Khoa"
          name="khoaId"
          rules={[{ required: true, message: "Vui lòng chọn khoa!" }]}
        >
          <Select
            placeholder="Chọn khoa"
            showSearch
            optionFilterProp="children"
            onChange={handleKhoaChange}
          >
            {khoaOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Lớp"
          name="lopHanhChinhId"
          rules={[{ required: true, message: "Vui lòng chọn lớp!" }]}
        >
          <Select
            placeholder="Chọn lớp"
            showSearch
            optionFilterProp="children"
            disabled={lopOptions.length === 0}
          >
            {lopOptions.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdate;

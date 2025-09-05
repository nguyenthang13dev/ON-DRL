import { Form, FormProps, Input, Modal, Select, Card } from "antd";
import React, { useEffect } from "react";
import { searchSinhVien } from "@/types/sinhVien/sinhVien";

interface Props {
  onFinish: FormProps<searchSinhVien>["onFinish"];
}

const Search: React.FC<Props> = (props: Props) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.submit();
  };

  const handleReset = () => {
    form.resetFields();
    props.onFinish?.({});
  };

  return (
    <Card className="mb-3">
      <Form
        form={form}
        layout="inline"
        onFinish={props.onFinish}
        className="row gx-1 gy-1"
      >
        <Form.Item
          label="Mã sinh viên"
          name="maSV"
          className="col-12 col-md-6 col-lg-3"
        >
          <Input placeholder="Nhập mã sinh viên" />
        </Form.Item>

        <Form.Item
          label="Họ tên"
          name="hoTen"
          className="col-12 col-md-6 col-lg-3"
        >
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          className="col-12 col-md-6 col-lg-3"
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="trangThai"
          className="col-12 col-md-6 col-lg-3"
        >
          <Select placeholder="Chọn trạng thái" allowClear>
            <Select.Option value="active">Hoạt động</Select.Option>
            <Select.Option value="inactive">Không hoạt động</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item className="col-12">
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary btn-sm">
              Tìm kiếm
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary btn-sm"
            >
              Đặt lại
            </button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Search;

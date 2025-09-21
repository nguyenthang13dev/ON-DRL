"use client";
import { searchGiaoVien } from "@/types/giaoVien/giaoVien";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, FormProps, Input, Row, Select } from "antd";
import { useState } from "react";

interface SearchProps {
  onFinish: FormProps<searchGiaoVien>["onFinish"];
}

const Search: React.FC<SearchProps> = ({ onFinish }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (values: searchGiaoVien) => {
    setIsLoading(true);
    try {
      if (onFinish) {
        await onFinish(values);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    if (onFinish) {
      onFinish({});
    }
  };

  return (
    <Card size="small" className="mb-3">
      <Form form={form} layout="horizontal" onFinish={handleSubmit}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Mã giáo viên" name="maGiaoVien">
              <Input placeholder="Nhập mã giáo viên" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Họ tên" name="hoTen">
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Email" name="email">
              <Input placeholder="Nhập email" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Trạng thái" name="trangThai">
              <Select placeholder="Chọn trạng thái" allowClear>
                <Select.Option value="DangLam">Đang làm</Select.Option>
                <Select.Option value="NghiViec">Nghỉ việc</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={isLoading}
            >
              Tìm kiếm
            </Button>
            <Button onClick={handleReset} style={{ marginLeft: 8 }}>
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Search;

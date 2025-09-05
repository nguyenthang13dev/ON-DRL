"use client";
import { searchKhoa } from "@/types/khoa/khoa";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, FormProps, Input, Row } from "antd";
import { useState } from "react";

interface SearchProps {
  onFinish: FormProps<searchKhoa>["onFinish"];
}

const Search: React.FC<SearchProps> = ({ onFinish }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (values: searchKhoa) => {
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
          <Col span={8}>
            <Form.Item label="Mã khoa" name="maKhoa">
              <Input placeholder="Nhập mã khoa" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Tên khoa" name="tenKhoa">
              <Input placeholder="Nhập tên khoa" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
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
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Search;

'use client';

import { SearchConfigFormData } from "@/types/ConfigForm/ConfigForm";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, FormProps, Input, Row, Select } from "antd";

interface SearchProps {
  onFinish: FormProps<SearchConfigFormData>["onFinish"];
  pageIndex: number;
  pageSize: number;
}

const { Option } = Select;

const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = Form.useForm<SearchConfigFormData>();

  const handleSubmit = (values: SearchConfigFormData) => {
    const searchData = {
      ...values,
      pageIndex: 1,
      pageSize,
    };
    onFinish?.(searchData);
  };

  const handleReset = () => {
    form.resetFields();
    const searchData = {
      pageIndex: 1,
      pageSize,
    };
    onFinish?.(searchData);
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Tên cấu hình" name="name">
              <Input placeholder="Nhập tên cấu hình..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Mô tả" name="description">
              <Input placeholder="Nhập mô tả..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Trạng thái" name="isActive">
              <Select placeholder="Chọn trạng thái" allowClear>
                <Option value={true}>Hoạt động</Option>
                <Option value={false}>Không hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  htmlType="submit"
                >
                  Tìm kiếm
                </Button>
                <Button onClick={handleReset}>Làm mới</Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Search;

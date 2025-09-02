import React from "react";
import { Form, Input, Row, Col, DatePicker, Button, Card } from "antd";
import { TD_UngVienSearch } from "@/types/TD_UngVien/TD_UngVien";
import { FormProps } from "antd";

interface SearchProps {
  onFinish: FormProps<TD_UngVienSearch>["onFinish"];
}

const Search: React.FC<SearchProps> = ({ onFinish }) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onFinish?.({ pageIndex: 1, pageSize: 10 });
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ pageIndex: 1, pageSize: 10 }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="hoTenEmail"
              label="Tên/Email"
            >
              <Input 
                placeholder="Nhập họ tên hoặc email" 
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="soDienThoai"
              label="Số điện thoại"
            >
              <Input 
                placeholder="Nhập số điện thoại" 
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              name="ngayUngTuyen"
              label="Ngày ứng tuyển"
            >
              <DatePicker 
                placeholder="Chọn ngày ứng tuyển"
                format="DD/MM/YYYY"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label=" " style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                Tìm kiếm
              </Button>
              <Button onClick={handleReset}>
                Làm mới
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Search; 
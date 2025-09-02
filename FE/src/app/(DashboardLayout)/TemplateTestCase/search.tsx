import React from "react";
import { Button, Col, Form, Input, Row } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { TemplateTestCaseSearch } from "@/types/templateTestCase/templateTestCase";

interface Props {
  onFinish: (values: TemplateTestCaseSearch) => void;
}

const Search: React.FC<Props> = ({ onFinish }) => {
  const [form] = Form.useForm<TemplateTestCaseSearch>();

  const handleFinish = (values: TemplateTestCaseSearch) => {
    onFinish(values);
  };

  const handleReset = () => {
    form.resetFields();
    onFinish({
      pageIndex: 1,
      pageSize: 20,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item<TemplateTestCaseSearch>
            label="Tên Template"
            name="templateName"
          >
            <Input placeholder="Nhập tên template" />
          </Form.Item>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item<TemplateTestCaseSearch>
            label="Từ khóa"
            name="keyWord"
          >
            <Input placeholder="Nhập từ khóa" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item<TemplateTestCaseSearch>
            label="Nội dung Template"
            name="templateContent"
          >
            <Input placeholder="Nhập nội dung template" />
          </Form.Item>
        </Col>

        <Col xs={24} sm={12} md={8} lg={6}>
          <Form.Item label=" " colon={false}>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                htmlType="submit"
              >
                Tìm kiếm
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                Làm mới
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Search; 
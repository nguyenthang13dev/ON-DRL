import { Button, Card, Col, Form, FormProps, Input, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import React from "react";
import { TacNhan_UseCaseSearchType } from "@/types/TacNhan_UseCase/TacNhan_UseCase";

interface SearchProps {
  onFinish: ((values: TacNhan_UseCaseSearchType) => void) | undefined;
}
const Search: React.FC<SearchProps> = ({ onFinish }) => {
  return (
    <Card>
      <Form
        layout="vertical"
        name="searchTacNhanUseCase"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={24} justify={"center"}>
          <Col span={12}>
            <Form.Item<TacNhan_UseCaseSearchType> label="Mã tác nhân" name="maTacNhan">
              <Input placeholder="Mã tác nhân" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item<TacNhan_UseCaseSearchType> label="Tên tác nhân" name="tenTacNhan">
              <Input placeholder="Tên tác nhân" />
            </Form.Item>
          </Col>
        </Row>
        <Button
          type="primary"
          htmlType="submit"
          icon={<SearchOutlined />}
          size="small"
        >
          Tìm kiếm
        </Button>
      </Form>
    </Card>
  );
};
export default Search; 
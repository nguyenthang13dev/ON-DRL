import { DropdownOption } from "@/types/general";
import { SearchSubjectData } from "@/types/Subject/Subject";
import { Button, Card, Col, Form, FormProps, Input, Row, Select } from "antd";
import { useState } from "react";

interface SearchProps {
  onFinish: FormProps<SearchSubjectData>["onFinish"];
  pageIndex: number;
  pageSize: number;
}

const { Option } = Select;

const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [ form ] = Form.useForm<SearchSubjectData>();
  const [ departmentOptions, setDepartmentOptions ] = useState<DropdownOption[]>( [] );

  const handleSubmit = (values: SearchSubjectData) => {
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
          <Col span={6}>
            <Form.Item label="Mã môn học" name="subjectCode">
              <Input
                placeholder="Nhập mã môn học..."
                style={{ textTransform: "uppercase" }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Tên môn học" name="name">
              <Input placeholder="Nhập tên môn học..." />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Khoa/Bộ môn" name="department">
              <Select
                placeholder="Chọn khoa/bộ môn"
                allowClear
                showSearch
                options={departmentOptions}
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Col>
       
        </Row>
        <Row justify="end" gutter={16}>
          <Button onClick={() =>
          {
            form.submit();
          }}>
            Tìm kiếm
          </Button>
        </Row>

        
      </Form>
    </Card>
  );
};

export default Search;

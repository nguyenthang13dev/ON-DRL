import { SearchSubjectData } from "@/types/Subject/Subject";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, FormProps, Input, InputNumber, Row, Select } from "antd";
import { useMemo } from "react";

interface SearchProps {
  onFinish: FormProps<SearchSubjectData>["onFinish"];
  pageIndex: number;
  pageSize: number;
}

const { Option } = Select;

const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = Form.useForm<SearchSubjectData>();

  const departmentOptions = useMemo(() => [
    { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Khoa Kỹ thuật Xây dựng" },
    { id: "b2c3d4e5-f6g7-8901-bcde-f23456789012", name: "Khoa Kỹ thuật Thủy lợi" },
    { id: "c3d4e5f6-g7h8-9012-cdef-345678901234", name: "Khoa Môi trường" },
    { id: "d4e5f6g7-h8i9-0123-def0-456789012345", name: "Khoa Kinh tế" },
    { id: "e5f6g7h8-i9j0-1234-ef01-567890123456", name: "Khoa Cơ khí" },
    { id: "f6g7h8i9-j0k1-2345-f012-678901234567", name: "Khoa Điện - Điện tử" },
    { id: "g7h8i9j0-k1l2-3456-0123-789012345678", name: "Khoa Công nghệ thông tin" },
    { id: "h8i9j0k1-l2m3-4567-1234-890123456789", name: "Khoa Ngoại ngữ" },
    { id: "i9j0k1l2-m3n4-5678-2345-901234567890", name: "Khoa Khoa học cơ bản" },
    { id: "j0k1l2m3-n4o5-6789-3456-012345678901", name: "Khoa Giáo dục thể chất" },
  ], []);

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
            <Form.Item label="Mã môn học" name="code">
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
              <Select placeholder="Chọn khoa/bộ môn" allowClear>
                {departmentOptions.map((dept) => (
                  <Option key={dept.id} value={dept.id}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Học kỳ" name="semester">
              <Select placeholder="Chọn học kỳ" allowClear>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <Option key={sem} value={sem}>
                    Học kỳ {sem}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Số tín chỉ" name="credits">
              <InputNumber
                min={1}
                max={10}
                style={{ width: "100%" }}
                placeholder="Chọn số tín chỉ"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Loại môn học" name="isElective">
              <Select placeholder="Chọn loại môn" allowClear>
                <Option value={false}>Bắt buộc</Option>
                <Option value={true}>Tự chọn</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label=" ">
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

import { SearchHoatDongNgoaiKhoaData } from "@/types/hoatDongNgoaiKhoa/hoatDongNgoaiKhoa";
import { SearchOutlined, UndoOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, FormProps, Input, Row, Select } from "antd";

interface SearchProps {
  onFinish: FormProps<SearchHoatDongNgoaiKhoaData>["onFinish"];
  pageIndex: number;
  pageSize: number;
}

const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = Form.useForm();

  const handleFinish: FormProps<SearchHoatDongNgoaiKhoaData>["onFinish"] = (
    values
  ) => {
    const searchData: SearchHoatDongNgoaiKhoaData = {
      ...values,
      pageIndex: 1, // Reset to first page when searching
      pageSize,
    };
    onFinish?.(searchData);
  };

  const handleReset = () => {
    form.resetFields();
    const emptySearch: SearchHoatDongNgoaiKhoaData = {
      pageIndex: 1,
      pageSize,
    };
    onFinish?.(emptySearch);
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              label="Tên hoạt động"
              name="tenHoatDong"
            >
              <Input 
                placeholder="Nhập tên hoạt động" 
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              label="Trạng thái"
              name="status"
            >
              <Select 
                placeholder="Chọn trạng thái" 
                allowClear
              >
                <Select.Option value="ACTIVE">Đang hoạt động</Select.Option>
                <Select.Option value="INACTIVE">Không hoạt động</Select.Option>
                <Select.Option value="PENDING">Chờ phê duyệt</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              label="QR Code"
              name="qrValue"
            >
              <Input 
                placeholder="Nhập mã QR" 
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item label=" " style={{ marginBottom: 0 }}>
              <div style={{ display: "flex", gap: "8px" }}>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  htmlType="submit"
                >
                  Tìm kiếm
                </Button>
                <Button
                  icon={<UndoOutlined />}
                  onClick={handleReset}
                >
                  Làm mới
                </Button>
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Search;
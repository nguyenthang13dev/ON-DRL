import { Button, Card, Col, DatePicker, Form, Input, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { searchNP_DangKyNghiPhepDataType } from "@/types/NP_DangKyNghiPhep/NP_DangKyNghiphep";

interface SearchProps {
  onFinish: ((values: searchNP_DangKyNghiPhepDataType) => void) | undefined;
}
const Search: React.FC<SearchProps> = ({ onFinish }) => {
  return (
    <>
      <Card>
        <Form
          layout="vertical"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<searchNP_DangKyNghiPhepDataType>
                label="Tên nhân sự"
                name="tenNhanSuFilter"
                rules={[
                  { required: true, message: "Vui lòng nhập thông tin này!" },
                ]}
              >
                <Input placeholder="Nhập tên nhân sự VD: Hoàng Văn A" />
              </Form.Item>
            </Col>

            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<searchNP_DangKyNghiPhepDataType> label="Ngày xin nghỉ">
                <Input.Group compact>
                  <Form.Item<searchNP_DangKyNghiPhepDataType>
                    name="ngayXinNghiFrom"
                    noStyle
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      placeholder="Từ"
                    />
                  </Form.Item>
                  <Form.Item<searchNP_DangKyNghiPhepDataType>
                    name="ngayXinNghiTo"
                    noStyle
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      placeholder="Đến"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>
          <Flex alignItems="center" justifyContent="center">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              size="small"
            >
              Tìm kiếm
            </Button>
          </Flex>
        </Form>
      </Card>
    </>
  );
};

export default Search;

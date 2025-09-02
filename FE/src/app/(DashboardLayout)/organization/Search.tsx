import { Button, Card, Col, Form, Input, Row, Select } from "antd";
import classes from "./page.module.css";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";

import { userService } from "@/services/user/user.service";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { DepartmentSearch } from "@/types/department/department";

interface SearchProps {
  handleSearch: (values: DepartmentSearch) => void;
}
const Search: React.FC<SearchProps> = ({ handleSearch }) => {
  const [form] = Form.useForm();
  const handleExport = async () => {
    const excelBase64 = await userService.exportExcel();
    downloadFileFromBase64(excelBase64.data, "Danh sách người dùng.xlsx");
  };
  const onSearch = () => {
    form.validateFields().then((values) => {
      if (values.isActive) {
        values.isActive = values.isActive === "true" ? true : false;
      } else {
        values.isActive = undefined;
      }
      values.level = 1;
      handleSearch(values);
    });
  };
  return (
    <>
      <Card className={`${classes.customCardShadow} ${classes.mgButton10}`}>
        <Form
          form={form}
          layout="vertical"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          //onFinish={onSearch}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                key={1}
                label={<strong>Tên tổ chức</strong>}
                name="name"
              >
                <Input placeholder="Nhập tên tổ chức" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                key={2}
                label={<strong>Mã tổ chức</strong>}
                name="code"
              >
                <Input placeholder="Nhập mã tổ chức" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                key={3}
                label={<strong>Trạng thái</strong>}
                name="isActive"
              >
                <Select defaultValue={""}>
                  <Select.Option key={0} value="">
                    Tất cả trạng thái
                  </Select.Option>
                  <Select.Option key={1} value="true">
                    Hoạt động
                  </Select.Option>
                  <Select.Option key={2} value="false">
                    Khoá
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Flex alignItems="center" justifyContent="center">
            <Button
              type="primary"
              htmlType="button"
              icon={<SearchOutlined />}
              className={classes.mgright5}
              size="small"
              onClick={onSearch}
            >
              Tìm kiếm
            </Button>
            <Button
              onClick={handleExport}
              type="primary"
              icon={<DownloadOutlined />}
              className={`${classes.mgright5} ${classes.colorKetXuat}`}
              size="small"
            >
              Kết xuất
            </Button>
          </Flex>
        </Form>
      </Card>
    </>
  );
};

export default Search;

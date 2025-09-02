import { Button, Card, Col, Form, FormProps, Input, Row, Select } from "antd";
import classes from "./page.module.css";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { useEffect } from "react";
import { userService } from "@/services/user/user.service";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { searchModule } from "@/types/menu/menu";

interface SearchProps {
  onFinish: ((values: searchModule) => void) | undefined;
}
const Search: React.FC<SearchProps> = ({ onFinish }) => {
  const handleExport = async () => {
    const excelBase64 = await userService.exportExcel();
    downloadFileFromBase64(excelBase64.data, "Danh sách người dùng.xlsx");
  };

  return (
    <>
      <Card className={`${classes.customCardShadow} ${classes.mgButton10}`}>
        <Form
          layout="vertical"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={24} justify={"center"}>
            <Col span={8}>
              <Form.Item<searchModule> label="Mã chức năng" name="code">
                <Input placeholder="Mã chức năng" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<searchModule> label="Tên chức năng" name="name">
                <Input placeholder="Tên chức năng" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<searchModule> label="Trạng thái" name="isShow">
                <Select defaultValue={null}>
                  <Select.Option value={null}>
                    -- Chọn trạng thái --
                  </Select.Option>
                  <Select.Option value={true}>Hiển thị</Select.Option>
                  <Select.Option value={false}>Không hiển thị</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Flex alignItems="center" justifyContent="center">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              className={classes.mgright5}
              size="small"
            >
              Tìm kiếm
            </Button>
            {/* <Button
              onClick={handleExport}
              type="primary"
              icon={<DownloadOutlined />}
              className={`${classes.mgright5} ${classes.colorKetXuat}`}
              size="small"
            >
              Kết xuất
            </Button> */}
          </Flex>
        </Form>
      </Card>
    </>
  );
};

export default Search;

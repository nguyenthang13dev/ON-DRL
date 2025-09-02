import { Button, Card, Col, Form, Input, Row } from "antd";
import classes from "./page.module.css";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { useEffect } from "react";
import { userService } from "@/services/user/user.service";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { searchRole } from "@/types/role/role";
import { GroupUserService } from "@/services/groupUser/groupUser.service";

interface SearchProps {
  onFinish: ((values: searchRole) => void) | undefined;
}
const Search: React.FC<SearchProps> = ({ onFinish }) => {
  const handleExport = async () => {
    const excelBase64 = await GroupUserService.exportExcel();
    downloadFileFromBase64(excelBase64.data, "Danh sách nhóm người sử dụng.xlsx");
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
            <Col span={12}>
              <Form.Item<searchRole> label="Mã nhóm người sử dụng" name="code">
                <Input placeholder="Mã nhóm người sử dụng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<searchRole> label="Tên nhóm người sử dụng" name="name">
                <Input placeholder="Tên nhóm người sử dụng" />
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

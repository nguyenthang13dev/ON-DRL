import { Button, Card, Col, Form, FormProps, Input, Row, Select } from "antd";
import classes from "./page.module.css";
import {
  DownloadOutlined,
  SearchOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { searchUserData } from "@/types/auth/User";
import { useEffect } from "react";

import { roleService } from "@/services/role/role.service";
import { fetchDropdown } from "@/utils/fetchDropdown";
import { userService } from "@/services/user/user.service";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { DropdownOption } from "@/types/general";

interface SearchProps {
  onFinish: ((values: searchUserData) => void) | undefined;
  dropVaiTros: DropdownOption[];
  setDropVaiTros: React.Dispatch<React.SetStateAction<DropdownOption[]>>;
}
const Search: React.FC<SearchProps> = ({
  onFinish,
  dropVaiTros,
  setDropVaiTros,
}) => {
  useEffect(() => {
    const fetchAllDropdowns = async () => {
      await Promise.all([
        fetchDropdown(
          dropVaiTros,
          () => roleService.getDropDown(""),
          setDropVaiTros
        ),
      ]);
    };
    fetchAllDropdowns();
  }, [dropVaiTros, setDropVaiTros]);

  const handleExport = async () => {
    const excelBase64 = await userService.exportExcel();
    downloadFileFromBase64(excelBase64.data, "Danh sách người dùng.xlsx");
  };

  return (
    <>
      <Card className={classes.customCardShadow + classes.mgButton10}>
        <Form
          layout="vertical"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item<searchUserData> label="Họ tên" name="name">
                <Input placeholder="Họ tên" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<searchUserData> label="Tài khoản" name="userName">
                <Input placeholder="Tài khoản" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<searchUserData> label="Email" name="email">
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item<searchUserData> label="Địa chỉ" name="diaChi">
                <Input placeholder="Địa chỉ" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item<searchUserData> label="Vai trò" name="vaiTro">
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Vai trò"
                  fieldNames={{ label: "label", value: "value" }}
                  options={dropVaiTros}
                >
                  <Select.Option value="All">All</Select.Option>
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
            <Button
              onClick={handleExport}
              color="pink"
              variant="solid"
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

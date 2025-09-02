import React from "react";
import { Button, Card, Col, Form, Input, Select, DatePicker, Row } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import * as extensions from "@/utils/extensions";
import { Dictionary, DropdownOption } from "@/types/general";
import { GioiHanDiaChiMangSearchType } from "@/types/gioiHanDiaChiMang/gioiHanDiaChiMang";
import gioiHanDiaChiMangService from "@/services/gioiHanDiaChiMang/gioiHanDiaChiMangService";

interface SearchProps {
  onFinish: ((values: GioiHanDiaChiMangSearchType) => void) | undefined;
  pageIndex: number;
  pageSize: number;
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = useForm<GioiHanDiaChiMangSearchType>();
  const [dropdowns, setDropdown] = React.useState<Dictionary<DropdownOption[]>>({});
  const Export = async () => {
    const formValues = form.getFieldsValue();

    const exportData = {
      ...formValues,
      pageIndex,
      pageSize,
    };

    const response = await gioiHanDiaChiMangService.exportExcel(exportData);
    if (response.status) {
      downloadFileFromBase64(response.data, "Danh sách giới hạn địa chỉ mạng.xlsx");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <Card className="customCardShadow mb-3">
        <Form
          form={form}
          layout="vertical"
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<GioiHanDiaChiMangSearchType>
                key="iPAddress"
                label="Địa chỉ mạng"
                name="iPAddress">
                <Input placeholder="Địa chỉ mạng" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<GioiHanDiaChiMangSearchType>
                key="allowed"
                label="Cho phép truy cập"
                name="allowed"
              >
                <Select placeholder="Chọn quyền truy cập" allowClear>
                  <Select.Option value={true}>Cho phép</Select.Option>
                  <Select.Option value={false}>Không cho phép</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Flex
            alignItems="center"
            justifyContent="center"
            className="btn-group"
          >
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              size="small"
            >
              Tìm kiếm
            </Button>
            {/* <Button
              onClick={Export}
              type="primary"
              icon={<DownloadOutlined />}
              className="colorKetXuat"
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

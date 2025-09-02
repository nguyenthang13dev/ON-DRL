import React from "react";
import { Button, Card, Col, Form, Input, Select, DatePicker, Row } from "antd";
import {
  DownloadOutlined,
  FilePdfOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import * as extensions from "@/utils/extensions";
import { Dictionary, DropdownOption } from "@/types/general";
import { SystemLogsSearchType } from "@/types/systemLogs/systemLogs";
import systemLogsService from "@/services/systemLogs/systemLogsService";

interface SearchProps {
  onFinish: ((values: SystemLogsSearchType) => void) | undefined;
  pageIndex: number;
  pageSize: number;
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = useForm<SystemLogsSearchType>();
  const [dropdowns, setDropdown] = React.useState<Dictionary<DropdownOption[]>>(
    {}
  );
  const Export = async () => {
    const formValues = form.getFieldsValue();

    const exportData = {
      ...formValues,
      pageIndex,
      pageSize,
    };

    const response = await systemLogsService.exportExcel(exportData);
    if (response.status) {
      downloadFileFromBase64(response.data, "Danh sách log hệ thống.xlsx");
    } else {
      toast.error(response.message);
    }
  };
  const ExportPdf = async () => {
    const formValues = form.getFieldsValue();

    const exportData = {
      ...formValues,
      pageIndex,
      pageSize,
    };

    const response = await systemLogsService.exportPdf(exportData);
    if (response.status) {
      downloadFileFromBase64(response.data, "Danh sách log hệ thống.pdf");
    } else {
      toast.error(response.message);
    }
  };
  React.useEffect(() => {
    async function fetchDropdowns() {
      const dropdownResponse = await systemLogsService.getDropdowns();
      if (dropdownResponse.status) {
        setDropdown(dropdownResponse.data);
      }
    }
    fetchDropdowns();
  }, [form]);

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
              <Form.Item<SystemLogsSearchType>
                key="userId"
                label="Id tài khoản"
                name="userId"
              >
                <Select
                  placeholder="Id tài khoản"
                  options={dropdowns["AppUser"]}
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<SystemLogsSearchType>
                key="userName"
                label="Tên tài khoản"
                name="userName"
              >
                <Input placeholder="Tên tài khoản" />
              </Form.Item>
            </Col>
            <Form.Item<SystemLogsSearchType> label="Thờigian">
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item<SystemLogsSearchType> name="timestampFrom" noStyle>
                    <DatePicker
                      format="DD/MM/YYYY"
                      className="w-100"
                      placeholder="Từ"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<SystemLogsSearchType> name="timestampTo" noStyle>
                    <DatePicker
                      format="DD/MM/YYYY"
                      className="w-100"
                      placeholder="Từ"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<SystemLogsSearchType>
                key="iPAddress"
                label="Địa chỉ Ip"
                name="iPAddress"
              >
                <Input placeholder="Địa chỉ Ip" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<SystemLogsSearchType>
                key="level"
                label="Loại"
                name="level"
              >
                <Select placeholder="Loại" options={dropdowns["LogLevel"]} />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<SystemLogsSearchType>
                key="message"
                label="Nội dung"
                name="message"
              >
                <Input placeholder="Nội dung" />
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
            <Button
              onClick={Export}
              type="primary"
              icon={<DownloadOutlined />}
              className="colorKetXuat"
              size="small"
            >
              Kết xuất Excel
            </Button>
            <Button
              onClick={ExportPdf}
              type="primary"
              icon={<FilePdfOutlined />}
              className="colorKetXuat"
              size="small"
            >
              Kết xuất Pdf
            </Button>
          </Flex>
        </Form>
      </Card>
    </>
  );
};

export default Search;

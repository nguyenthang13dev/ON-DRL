import React from "react";
import { Button, Card, Col, Form, Input, Select, DatePicker, Row, InputNumber } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import * as extensions from "@/utils/extensions";

import { ArcFilePlanSearchType } from "@/types/arcFilePlan/arcFilePlan";
import arcFilePlanService from "@/services/arcFilePlan/arcFilePlanService";

interface SearchProps {
  onFinish: ((values: ArcFilePlanSearchType) => void) | undefined;
  pageIndex: number;
  pageSize: number;
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = useForm<ArcFilePlanSearchType>();

  const Export = async () => {
    const formValues = form.getFieldsValue();

    const exportData = {
      ...formValues,
      pageIndex,
      pageSize,
    };

    const response = await arcFilePlanService.exportExcel(exportData);
    if (response.status) {
      downloadFileFromBase64(response.data, "Danh sách thành phần thu thập.xlsx");
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
              <Form.Item<ArcFilePlanSearchType>
                key="fileCode"
                label="Mã hồ sơ"
                name="fileCode">
                <Input placeholder="Mã hồ sơ" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<ArcFilePlanSearchType>
                key="fileCatalog"
                label="Mục lục hoặc số năm hình thành hồ sơ"
                name="fileCatalog">
                <InputNumber
                  placeholder="Mục lục hoặc số năm hình thành hồ sơ"
                  min={0}
                  style={{ width: "100%", borderRadius: "4px" }}
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<ArcFilePlanSearchType>
                key="fileNotaion"
                label="Số và ký hiệu hồ sơ"
                name="fileNotaion">
                <Input placeholder="Số và ký hiệu hồ sơ" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<ArcFilePlanSearchType>
                key="title"
                label="Tiêu đề hồ sơ"
                name="title">
                <Input placeholder="Tiêu đề hồ sơ" />
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
              Kết xuất
            </Button>
          </Flex>
        </Form>
      </Card>
    </>
  );
};

export default Search;

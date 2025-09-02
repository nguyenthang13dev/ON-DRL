import React from "react";
import { Button, Card, Col, Form, Input, Select, DatePicker, Row } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";

import { ArcPlanSearchType } from "@/types/arcPlan/arcPlan";
import arcPlanService from "@/services/arcPlan/arcPlanService";
import { DropdownOption } from "@/types/general";
import { removeAccents } from "@/libs/CommonFunction";

interface SearchProps {
  onFinish: ((values: ArcPlanSearchType) => void) | undefined;
  pageIndex: number;
  pageSize: number;
  dropdownTTKH: DropdownOption[];
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize, dropdownTTKH }) => {
  const [form] = useForm<ArcPlanSearchType>();

  const Export = async () => {
    const formValues = form.getFieldsValue();

    const exportData = {
      ...formValues,
      pageIndex,
      pageSize,
    };

    const response = await arcPlanService.exportExcel(exportData);
    if (response.status) {
      downloadFileFromBase64(response.data, "Danh sách arcPlan.xlsx");
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
            <Col span={8}>
              <Form.Item<ArcPlanSearchType>
                key="planID"
                label="Mã kế hoạch"
                name="planID">
                <Input placeholder="Mã kế hoạch" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<ArcPlanSearchType>
                key="name"
                label="Tên kế hoạch"
                name="name">
                <Input placeholder="Tên kế hoạch" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<ArcPlanSearchType>
                key="description"
                label="Mô tả"
                name="description">
                <Input placeholder="Mô tả" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item<ArcPlanSearchType>
                    key="startDate"
                    label="Ngày bắt đầu"
                    name="startDate">
                    <DatePicker
                      format="DD/MM/YYYY"
                      className="w-100"
                      placeholder="Ngày bắt đầu"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<ArcPlanSearchType>
                    key="endDate"
                    label="Ngày kết thúc"
                    name="endDate">
                    <DatePicker
                      format="DD/MM/YYYY"
                      className="w-100"
                      placeholder="Ngày kết thúc"
                    />
                  </Form.Item>
                </Col>
              </Row>

            </Col>

            <Col span={8}>
              <Form.Item<ArcPlanSearchType>
                key="status"
                label="Trạng thái kế hoạch"
                name="status">
                <Select
                  placeholder="Trạng thái kế hoạch"
                  options={dropdownTTKH}
                  allowClear
                  showSearch
                  filterOption={(input, option) => {
                    return removeAccents(option?.label ?? "")
                      .toLowerCase()
                      .includes(removeAccents(input).toLowerCase());
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item<ArcPlanSearchType>
                key="outcome"
                label="Kết quả dự kiến"
                name="outcome">
                <Input placeholder="Kết quả dự kiến" />
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

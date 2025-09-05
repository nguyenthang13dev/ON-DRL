import React from "react";
import { Button, Card, Col, Form, Input, Select, DatePicker, Row } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import * as extensions from "@/utils/extensions";

import { ActivitiesSearchType } from "@/types/activities/activities";
import activitiesService from "@/services/activities/activitiesService";

interface SearchProps {
  onFinish: ((values: ActivitiesSearchType) => void) | undefined;
  pageIndex: number;
  pageSize: number;
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = useForm<ActivitiesSearchType>();
   
  const Export = async () => {
    const formValues = form.getFieldsValue();

    const exportData = {
      ...formValues,
      pageIndex,
      pageSize,
    };

    const response = await activitiesService.exportExcel(exportData);
    if (response.status) {
      downloadFileFromBase64(response.data, "Danh sách .xlsx");
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
							<Form.Item<ActivitiesSearchType>
								key="startDate"
								label="Thời gian bắt đầu"
								name="startDate">
								<Input placeholder="Thời gian bắt đầu"/>
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ActivitiesSearchType>
								key="endDate"
								label="Thời gian kết thúc"
								name="endDate">
								<Input placeholder="Thời gian kết thúc"/>
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ActivitiesSearchType>
								key="name"
								label="Tên hoạt động"
								name="name">
								<Input placeholder="Tên hoạt động"/>
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ActivitiesSearchType>
								key="description"
								label="Mô tả"
								name="description">
								<Input placeholder="Mô tả"/>
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ActivitiesSearchType>
								key="qRPath"
								label="QR tham gia"
								name="qRPath">
								<Input placeholder="QR tham gia"/>
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

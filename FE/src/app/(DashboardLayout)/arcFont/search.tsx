import React from "react";
import { Button, Card, Col, Form, Input, Select, DatePicker, Row } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import * as extensions from "@/utils/extensions";

import { ArcFontSearchType } from "@/types/arcFont/arcFont";
import arcFontService from "@/services/arcFont/arcFontService";

interface SearchProps {
  onFinish: ((values: ArcFontSearchType) => void) | undefined;
  pageIndex: number;
  pageSize: number;
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = useForm<ArcFontSearchType>();
   
  const Export = async () => {
    const formValues = form.getFieldsValue();

    const exportData = {
      ...formValues,
      pageIndex,
      pageSize,
    };

    const response = await arcFontService.exportExcel(exportData);
    if (response.status) {
      downloadFileFromBase64(response.data, "Danh sách quản lý phông.xlsx");
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
							<Form.Item<ArcFontSearchType>
								key="identifier"
								label="Mã cơ quan lưu trữ"
								name="identifier">
								<Input placeholder="Mã cơ quan lưu trữ"/>
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcFontSearchType>
								key="organId"
								label="Mã phông lưu trữ"
								name="organId">
								<Input placeholder="Mã phông lưu trữ"/>
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcFontSearchType>
								key="fondName"
								label="Tên phông lưu trữ"
								name="fondName">
								<Input placeholder="Tên phông lưu trữ"/>
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcFontSearchType>
								key="archivesTimeStart"
								label="Năm bắt đầu"
								name="archivesTimeStart">
								<Input placeholder="Năm bắt đầu"/>
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcFontSearchType>
								key="archivesTimeEnd"
								label="Năm kết thúc"
								name="archivesTimeEnd">
								<Input placeholder="Năm kết thúc"/>
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcFontSearchType>
								key="paperTotal"
								label="Tổng số tài liệu giấy"
								name="paperTotal">
								<Input placeholder="Tổng số tài liệu giấy"/>
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcFontSearchType>
								key="paperDigital"
								label="Số lượng tài liệu giấy đã số hóa"
								name="paperDigital">
								<Input placeholder="Số lượng tài liệu giấy đã số hóa"/>
							</Form.Item>
						</Col>
						<Col xl={6} lg={8} md={12} xs={24}>
							<Form.Item<ArcFontSearchType>
								key="language"
								label="Ngôn ngữ"
								name="language">
								<Input placeholder="Ngôn ngữ"/>
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

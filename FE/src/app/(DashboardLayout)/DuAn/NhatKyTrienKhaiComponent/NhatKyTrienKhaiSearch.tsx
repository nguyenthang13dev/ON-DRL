import React from "react";
import { Button, Card, Col, Form, Input, DatePicker, Row } from "antd";
import { DownloadOutlined, SearchOutlined, FileWordOutlined, CloseOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";

import { DA_NhatKyTrienKhaiSearchType } from "@/types/dA_DuAn/dA_NhatKyTrienKhai";
import dA_NhatKyTrienKhaiService from "@/services/dA_DuAn/dA_NhatKyTrienKhaiService";

interface SearchProps {
  onFinish: ((values: DA_NhatKyTrienKhaiSearchType) => void) | undefined;
  pageIndex: number;
  pageSize: number;
  duAnId?: string | null;
  onCancel?: () => void;
}

const NhatKyTrienKhaiSearch: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize, duAnId, onCancel }) => {
  const [form] = useForm<DA_NhatKyTrienKhaiSearchType>();
   

  
  const handleReset = () => {
    form.resetFields();
    if (onFinish) {
      onFinish({
        duAnId: duAnId || undefined,
        pageIndex,
        pageSize
      });
    }
  };
  
  const handleFormSubmit = (values: DA_NhatKyTrienKhaiSearchType) => {
    if (onFinish) {
      onFinish({
        ...values,
        duAnId: duAnId || undefined
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  
  return (
    <Card 
      className="customCardShadow mb-3" 
      title="Tìm kiếm nâng cao"
      extra={
        <Button 
          icon={<CloseOutlined />} 
          onClick={handleCancel}
          type="text"
        />
      }
    >
      <Form
        form={form}
        layout="vertical"
        name="nhatKyTrienKhaiSearch"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        onFinish={handleFormSubmit}
        autoComplete="off"
      >
        <Row gutter={24}>
          <Col xl={6} lg={8} md={12} xs={24}>
            <Form.Item<DA_NhatKyTrienKhaiSearchType> label="Ngày bắt đầu">
              <Input.Group compact>
                <Form.Item<DA_NhatKyTrienKhaiSearchType>
                  name="ngayBatDau"
                  noStyle
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    placeholder="Từ"
                    size="small"
                  />
                </Form.Item>

              
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xl={6} lg={8} md={12} xs={24}>
            <Form.Item<DA_NhatKyTrienKhaiSearchType> label="Ngày kết thúc">
              <Input.Group compact>
                <Form.Item<DA_NhatKyTrienKhaiSearchType>
                    name="ngayKetThuc"
                  noStyle
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    style={{ width: "100%" }}
                    placeholder="Ngày kết thúc"
                    size="small"
                  />
                </Form.Item>
          
              </Input.Group>
            </Form.Item>
          </Col>
          <Col xl={6} lg={8} md={12} xs={24}>
            <Form.Item<DA_NhatKyTrienKhaiSearchType>
              key="hangMucCongViec"
              label="Hạng mục công việc"
              name="hangMucCongViec">
              <Input placeholder="Hạng mục công việc"/>
            </Form.Item>
          </Col>
          <Col xl={6} lg={8} md={12} xs={24}>
            <Form.Item<DA_NhatKyTrienKhaiSearchType>
              key="noiDungThucHien"
              label="Nội dung thực hiện"
              name="noiDungThucHien">
              <Input placeholder="Nội dung thực hiện"/>
            </Form.Item>
          </Col>
          <Col xl={6} lg={8} md={12} xs={24}>
            <Form.Item<DA_NhatKyTrienKhaiSearchType>
              key="phanCong"
              label="Phân công"
              name="phanCong">
              <Input placeholder="Phân công"/>
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
            onClick={handleReset}
            size="small"
          >
            Xóa tìm
          </Button>
      
        </Flex>
      </Form>
    </Card>
  );
};

export default NhatKyTrienKhaiSearch;   
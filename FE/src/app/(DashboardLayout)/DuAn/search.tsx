import React from "react";
import { Button, Card, Col, Form, Input, Select, DatePicker, Row } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import * as extensions from "@/utils/extensions";

import { DA_DuAnSearchType } from "@/types/dA_DuAn/dA_DuAn";
import dA_DuAnService from "@/services/dA_DuAn/dA_DuAnService";

interface SearchProps {
  onFinish: ((values: DA_DuAnSearchType) => void) | undefined;
  pageIndex: number;
  pageSize: number;
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = useForm<DA_DuAnSearchType>();
   
  const Export = async () => {
    const formValues = form.getFieldsValue();

    const exportData = {
      ...formValues,
      pageIndex,
      pageSize,
    };

    const response = await dA_DuAnService.exportExcel(exportData);
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
              <Form.Item<DA_DuAnSearchType> label="Ngày bắt đầu">
                <Input.Group compact>
                  <Form.Item<DA_DuAnSearchType>
                    name="ngayBatDauFrom"
                    noStyle
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ width: 110 }}
                      placeholder="Từ"
                      size="small"
                    />
                  </Form.Item>
                  <span style={{ margin: "0 8px" }}>-</span>
                  <Form.Item<DA_DuAnSearchType>
                    name="ngayBatDauTo"
                    noStyle
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ width: 110 }}
                      placeholder="Đến"
                      size="small"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<DA_DuAnSearchType> label="Ngày kết thúc">
                <Input.Group compact>
                  <Form.Item<DA_DuAnSearchType>
                    name="ngayKetThucFrom"
                    noStyle
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ width: 110 }}
                      placeholder="Từ"
                      size="small"
                    />
                  </Form.Item>
                  <span style={{ margin: "0 8px" }}>-</span>
                  <Form.Item<DA_DuAnSearchType>
                    name="ngayKetThucTo"
                    noStyle
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      style={{ width: 110 }}
                      placeholder="Đến"
                      size="small"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<DA_DuAnSearchType>
                key="tenDuAn"
                label="Tên dự án"
                name="tenDuAn">
                <Input placeholder="Tên dự án"/>
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<DA_DuAnSearchType>
                key="moTaDuAn"
                label="Mô tả dự án"
                name="moTaDuAn">
                <Input placeholder="Mô tả dự án"/>
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<DA_DuAnSearchType>
                key="ngayTiepNhan"
                label="Ngày tiếp nhận"
                name="ngayTiepNhan">
                <Input placeholder="Ngày tiếp nhận"/>
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<DA_DuAnSearchType>
                key="yeuCauDuAn"
                label="Yêu cầu dự án"
                name="yeuCauDuAn">
                <Input placeholder="Yêu cầu dự án"/>
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<DA_DuAnSearchType>
                key="trangThaiThucHien"
                label="Trạng thái thực hiện"
                name="trangThaiThucHien">
                <Input placeholder="Trạng thái thực hiện"/>
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<DA_DuAnSearchType>
                key="timeCaiDatMayChu"
                label="Thời gian cài đặt máy chủ"
                name="timeCaiDatMayChu">
                <Input placeholder="Thời gian cài đặt máy chủ"/>
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<DA_DuAnSearchType>
                key="isBackupMayChu"
                label="Backup dữ liệu?"
                name="isBackupMayChu">
                <Input placeholder="Backup dữ liệu?"/>
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<DA_DuAnSearchType>
                key="linkDemo"
                label="Link demo"
                name="linkDemo">
                <Input placeholder="Link demo"/>
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<DA_DuAnSearchType>
                key="linkThucTe"
                label="Link thực tế"
                name="linkThucTe">
                <Input placeholder="Link thực tế"/>
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

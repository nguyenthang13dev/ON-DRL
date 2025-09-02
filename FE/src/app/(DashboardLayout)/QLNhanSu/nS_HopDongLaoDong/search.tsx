import React from "react";
import { Button, Card, Col, Form, Input, Select, DatePicker, Row } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import * as extensions from "@/utils/extensions";

import { NS_HopDongLaoDongSearchType } from "@/types/QLNhanSu/nS_HopDongLaoDong/nS_HopDongLaoDong";
import nS_HopDongLaoDongService from "@/services/QLNhanSu/nS_HopDongLaoDong/nS_HopDongLaoDongService";

interface SearchProps {
  onFinish: ((values: NS_HopDongLaoDongSearchType) => void) | undefined;
  pageIndex: number;
  pageSize: number;
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = useForm<NS_HopDongLaoDongSearchType>();

  const Export = async () => {
    const formValues = form.getFieldsValue();

    const exportData = {
      ...formValues,
      pageIndex,
      pageSize,
    };

    const response = await nS_HopDongLaoDongService.exportExcel(exportData);
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
              <Form.Item<NS_HopDongLaoDongSearchType>
                key="nhanSuId"
                label=""
                name="nhanSuId"
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Form.Item<NS_HopDongLaoDongSearchType> label="Thờigian">
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item<NS_HopDongLaoDongSearchType>
                    name="ngayKyFrom"
                    noStyle
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      className="w-100"
                      placeholder="Từ"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<NS_HopDongLaoDongSearchType>
                    name="ngayKyTo"
                    noStyle
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      className="w-100"
                      placeholder="Từ"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item<NS_HopDongLaoDongSearchType> label="Thờigian">
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item<NS_HopDongLaoDongSearchType>
                    name="ngayHetHanFrom"
                    noStyle
                  >
                    <DatePicker
                      format="DD/MM/YYYY"
                      className="w-100"
                      placeholder="Từ"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item<NS_HopDongLaoDongSearchType>
                    name="ngayHetHanTo"
                    noStyle
                  >
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
              <Form.Item<NS_HopDongLaoDongSearchType>
                key="loaiHopDong"
                label=""
                name="loaiHopDong"
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_HopDongLaoDongSearchType>
                key="soHopDong"
                label=""
                name="soHopDong"
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_HopDongLaoDongSearchType>
                key="ghiChu"
                label=""
                name="ghiChu"
              >
                <Input placeholder="" />
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

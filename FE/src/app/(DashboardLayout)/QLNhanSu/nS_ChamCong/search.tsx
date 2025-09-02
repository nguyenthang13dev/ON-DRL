import React from "react";
import { Button, Card, Col, Form, Input, Select, DatePicker, Row } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import * as extensions from "@/utils/extensions";

import { NS_ChamCongSearchType } from "@/types/QLNhanSu/nS_ChamCong/nS_ChamCong";
import nS_ChamCongService from "@/services/QLNhanSu/nS_ChamCong/nS_ChamCongService";

interface SearchProps {
  onFinish: ((values: NS_ChamCongSearchType) => void) | undefined;
  pageIndex: number;
  pageSize: number;
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = useForm<NS_ChamCongSearchType>();

  const Export = async () => {
    const formValues = form.getFieldsValue();

    const exportData = {
      ...formValues,
      pageIndex,
      pageSize,
    };

    const response = await nS_ChamCongService.exportExcel(exportData);
    if (response.status) {
      downloadFileFromBase64(response.data, "Danh sách chấm Công.xlsx");
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
              <Form.Item<NS_ChamCongSearchType>
                key="nhanSuId"
                label="nhanSuId"
                name="nhanSuId"
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_ChamCongSearchType>
                key="gioVao"
                label="Giờ vào"
                name="gioVao"
              >
                <Input placeholder="Giờ vào" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_ChamCongSearchType>
                key="gioRa"
                label="Giờ ra"
                name="gioRa"
              >
                <Input placeholder="Giờ ra" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_ChamCongSearchType>
                key="ngayLamViec"
                label="Ngày làm việc"
                name="ngayLamViec"
              >
                <Input placeholder="Ngày làm việc" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_ChamCongSearchType>
                key="ngayTao"
                label="Ngày tạo"
                name="ngayTao"
              >
                <Input placeholder="Ngày tạo" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_ChamCongSearchType>
                key="trangThai"
                label="Trạng thái"
                name="trangThai"
              >
                <Input placeholder="Trạng thái" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_ChamCongSearchType>
                key="diMuon"
                label="Đi muộn"
                name="diMuon"
              >
                <Input placeholder="Đi muộn" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_ChamCongSearchType>
                key="veSom"
                label="Về sớm"
                name="veSom"
              >
                <Input placeholder="Về sớm" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_ChamCongSearchType>
                key="soGioLam"
                label="Số giờ làm"
                name="soGioLam"
              >
                <Input placeholder="Số giờ làm" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_ChamCongSearchType>
                key="ghiChu"
                label="Ghi chú"
                name="ghiChu"
              >
                <Input placeholder="Ghi chú" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_ChamCongSearchType>
                key="maNV"
                label="Mã nhân viên"
                name="maNV"
              >
                <Input placeholder="Mã nhân viên" />
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

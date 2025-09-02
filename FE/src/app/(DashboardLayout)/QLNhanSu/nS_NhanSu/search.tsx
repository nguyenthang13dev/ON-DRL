import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Input, Select, DatePicker, Row } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import { downloadFileFromBase64 } from "@/utils/fileDownload";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import * as extensions from "@/utils/extensions";

import { NS_NhanSuSearchType } from "@/types/QLNhanSu/nS_NhanSu/nS_NhanSu";
import nS_NhanSuService from "@/services/QLNhanSu/nS_NhanSu/nS_NhanSuService";
import TrangThaiConstant from "@/constants/QLNhanSu/TrangThaiConstant";
import { DropdownOption } from "@/types/general";
import { duLieuDanhMucService } from "@/services/duLieuDanhMuc/duLieuDanhMuc.service";
import NhomDanhMucConstant from "@/constants/NhomDanhMucConstant";
import { departmentService } from "@/services/department/department.service";
import DepartmentOrganizationConstant from "@/constants/QLNhanSu/DepartmentOrganizationConstant";

interface SearchProps {
  onFinish: ((values: NS_NhanSuSearchType) => void) | undefined;
  pageIndex: number;
  pageSize: number;
}
const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = useForm<NS_NhanSuSearchType>();
  const [chucVuOptions, setChucVuOptions] = useState<DropdownOption[]>([]);
  const [phongBanOptions, setPhongBanOptions] = useState<DropdownOption[]>([]);
  const [phongBanLoaded, setPhongBanLoaded] = useState(false);
  const [chucVuLoaded, setChucVuLoaded] = useState(false);

  //function
  const fetchDropdownsChucVu = async () => {
    try {
      const response = await duLieuDanhMucService.GetDropdown(
        NhomDanhMucConstant.VaiTroDuAn
      );
      if (response.status) {
        setChucVuOptions(
          response.data.map((item: any) => ({
            value: item.value,
            label: item.label,
          }))
        );
        setChucVuLoaded(true);
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu chức vụ");
    }
  };

  const fetchDropdownsPhongBan = async () => {
    try {
      const response = await departmentService.getDropDepartmentByShortName(
        DepartmentOrganizationConstant.CongTyCoPhanHiNet
      );
      if (response.status) {
        setPhongBanOptions(
          response.data.map((item: any) => ({
            value: item.value,
            label: item.label,
          }))
        );
        setPhongBanLoaded(true);
      }
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu phòng ban");
    }
  };
  //

  //UseEffect
  useEffect(() => {
    fetchDropdownsChucVu();
    fetchDropdownsPhongBan();
  }, []);
  //
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
              <Form.Item<NS_NhanSuSearchType>
                key="hoTen"
                label="Họ tên"
                name="hoTen"
              >
                <Input placeholder="Họ tên" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_NhanSuSearchType>
                key="chucVuId"
                label="Chức vụ"
                name="chucVuId"
              >
                <Select
                  placeholder="Chức vụ"
                  allowClear
                  options={chucVuOptions.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_NhanSuSearchType>
                key="maNV"
                label="Mã nhân viên"
                name="maNV"
              >
                <Input placeholder="Mã nhân viên" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_NhanSuSearchType>
                key="phongBanId"
                label="Phòng ban"
                name="phongBanId"
              >
                <Select
                  placeholder="Phòng ban"
                  allowClear
                  options={phongBanOptions.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} justify="center">
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_NhanSuSearchType>
                key="cMND"
                label="CMND"
                name="cMND"
              >
                <Input placeholder="CMND" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_NhanSuSearchType>
                key="dienThoai"
                label="Điện thoại"
                name="dienThoai"
              >
                <Input placeholder="Điện thoại" />
              </Form.Item>
            </Col>
            <Col xl={6} lg={8} md={12} xs={24}>
              <Form.Item<NS_NhanSuSearchType>
                key="trangThai"
                label="Trạng thái"
                name="trangThai"
              >
                <Select
                  placeholder="Trạng thái làm việc"
                  allowClear
                  options={[
                    {
                      value: TrangThaiConstant.DangLamViec,
                      label: TrangThaiConstant.getDisplayName(
                        TrangThaiConstant.DangLamViec
                      ),
                    },
                    {
                      value: TrangThaiConstant.NghiViec,
                      label: TrangThaiConstant.getDisplayName(
                        TrangThaiConstant.NghiViec
                      ),
                    },
                  ]}
                />
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
          </Flex>
        </Form>
      </Card>
    </>
  );
};

export default Search;

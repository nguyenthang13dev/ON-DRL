import React, { useEffect, useState } from "react";
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { TD_TuyenDungSearchType, TD_TuyenDungTinhTrangOptions } from "@/types/TD_TuyenDung/TD_TuyenDung";
import { DropdownOption } from "@/types/general";
import { departmentService } from "@/services/department/department.service";
import dayjs from "dayjs";

interface Props {
  onFinish: (values: TD_TuyenDungSearchType) => void;
}

const Search: React.FC<Props> = ({ onFinish }) => {
  const [form] = Form.useForm<TD_TuyenDungSearchType>();
  const [phongBanOptions, setPhongBanOptions] = useState<DropdownOption[]>([]);

  useEffect(() => {
    loadPhongBanOptions();
  }, []);

  const loadPhongBanOptions = async () => {
    try {
      const response = await departmentService.getDataByPage({});
      if (response.status && response.data) {
        setPhongBanOptions(
          response.data.items.map((d: any) => ({
            label: `${d.name} (${d.code})`,
            value: d.id,
          }))
        );
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng ban:", error);
    }
  };

  const handleFinish = (values: TD_TuyenDungSearchType) => {
    onFinish(values);
  };

  const handleReset = () => {
    form.resetFields();
    onFinish({
      pageIndex: 1,
      pageSize: 10,
    });
  };

  return (
    <Card className="mb-4">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item<TD_TuyenDungSearchType>
              label="Tên vị trí"
              name="tenViTri"
            >
              <Input placeholder="Nhập tên vị trí" />
            </Form.Item>
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item<TD_TuyenDungSearchType>
              label="Phòng ban"
              name="phongBanId"
            >
              <Select
                placeholder="Chọn phòng ban"
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {phongBanOptions.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item<TD_TuyenDungSearchType>
              label="Số lượng cần tuyển"
              name="soLuongCanTuyen"
            >
              <Input placeholder="Nhập số lượng" type="number" />
            </Form.Item>
          </Col>

          {/* Bỏ lọc tình trạng */}

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item<TD_TuyenDungSearchType>
              label="Ngày bắt đầu từ"
              name="ngayBatDau"
            >
              <DatePicker
                placeholder="Chọn ngày bắt đầu"
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item<TD_TuyenDungSearchType>
              label="Ngày kết thúc đến"
              name="ngayKetThuc"
            >
              <DatePicker
                placeholder="Chọn ngày kết thúc"
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row justify="center" gutter={[16, 16]}>
          <Col>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
            >
              Tìm kiếm
            </Button>
          </Col>
          <Col>
            <Button
              type="default"
              onClick={handleReset}
              icon={<ReloadOutlined />}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default Search;

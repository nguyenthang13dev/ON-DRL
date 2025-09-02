import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Tag,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Flex from "@/components/shared-components/Flex";
import dayjs from "dayjs";
import { DA_NoiDungCuocHopSearchType } from "@/types/dA_DuAn/dA_NoiDungCuocHop";
import { DropdownOption } from "@/types/general";
import dA_NoiDungCuocHopService from "@/services/dA_DuAn/dA_NoiDungCuocHopService";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface SearchProps {
  onFinish: (values: DA_NoiDungCuocHopSearchType) => void;
  pageIndex: number;
  pageSize: number;
}

const Search: React.FC<SearchProps> = ({ onFinish, pageIndex, pageSize }) => {
  const [form] = Form.useForm<DA_NoiDungCuocHopSearchType>();

  const [thanhPhan, setThanhPhanOptions] = useState<DropdownOption[]>([]);
  useEffect(() => {
    GetDropDownUser().then((data) => {
      setThanhPhanOptions(data);
    });
  }, []);
  const GetDropDownUser = (): Promise<DropdownOption[]> => {
    return dA_NoiDungCuocHopService
      .getDropDownUser()
      .then((response) => {
        return response.data as DropdownOption[];
      })
      .catch((error) => {
        //console.error("Lỗi khi gọi API, sử dụng dữ liệu mock", error);
        return [{ label: "Không có dữ liệu", value: "" }];
      });
  };
  // Danh sách thành phần tham gia mẫu (có thể thay bằng API)
  // const thanhPhanOptions = [
  //   "Ban giám đốc",
  //   "Phòng kế toán",
  //   "Phòng kỹ thuật",
  //   "Khách hàng",
  //   "Đối tác",
  // ];

  const handleSubmit = (values: DA_NoiDungCuocHopSearchType) => {
    // Format lại dữ liệu trước khi submit
    const formattedValues = {
      ...values,
      thanhPhanThamGia: Array.isArray(values.thanhPhanThamGia)
        ? values.thanhPhanThamGia.join(",")
        : values.thanhPhanThamGia,
      thoiGianHop: values.thoiGianHop
        ? dayjs(values.thoiGianHop).format("YYYY-MM-DD")
        : undefined,
    };
    onFinish(formattedValues);
  };

  return (
    <Card className="customCardShadow mb-3">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          isNoiBo: undefined, // Mặc định không chọn loại cuộc họp
        }}
      >
        <Row gutter={16}>
          {/* Loại cuộc họp */}
          <Col span={8}>
            <Form.Item name="isNoiBo" label={<strong>Loại cuộc họp</strong>}>
              <Select placeholder="Chọn loại cuộc họp">
                <Option value={undefined}>Tất cả</Option>
                <Option value={true}>Nội bộ</Option>
                <Option value={false}>Họp với khách hàng</Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Thời gian họp */}
          <Col span={8}>
            <Form.Item name="thoiGianHop" label={<strong>Ngày họp</strong>}>
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày họp"
              />
            </Form.Item>
          </Col>

          {/* Địa điểm */}
          <Col span={8}>
            <Form.Item name="diaDiemCuocHop" label={<strong>Địa điểm</strong>}>
              <Input placeholder="Nhập địa điểm" />
            </Form.Item>
          </Col>

          {/* Thành phần tham gia */}
          <Col span={8}>
            {/* <Form.Item
              name="thanhPhanThamGia"
              label={<strong>Thành phần tham gia</strong>}
            >
              <Select
                mode="multiple"
                placeholder="Chọn thành phần"
                tagRender={(props) => (
                  <Tag closable={true} color="orange" onClose={props.onClose}>
                    {props.label}
                  </Tag>
                )}
              >
                {thanhPhanOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Select>
            </Form.Item> */}
            <Form.Item
              label={<strong>Thành phần tham gia</strong>}
              name="thanhPhanThamGia" // đây là name để form quản lý
              getValueProps={(value) => ({
                value: (value || "").split(",").filter(Boolean),
              })}
              getValueFromEvent={(values) => values.join(",")} // trả về dạng chuỗi a,b,c
            >
              <Select
                mode="multiple"
                placeholder="Chọn thành phần"
                options={thanhPhan} // [{ label: "...", value: "..." }]
                tagRender={(props) => (
                  <Tag color="orange" closable onClose={props.onClose}>
                    {props.label}
                  </Tag>
                )}
              />
            </Form.Item>
          </Col>

          {/* Nội dung cuộc họp */}
          {/* <Col span={8}>
            <Form.Item name="noiDungCuocHop" label="Nội dung">
              <Input placeholder="Nhập nội dung tìm kiếm" />
            </Form.Item>
          </Col> */}
        </Row>

        <Flex justifyContent="center" className="mt-4">
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            style={{ marginRight: 8 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              onFinish({ pageIndex, pageSize });
            }}
          >
            Xóa bộ lọc
          </Button>
        </Flex>
      </Form>
    </Card>
  );
};

export default Search;

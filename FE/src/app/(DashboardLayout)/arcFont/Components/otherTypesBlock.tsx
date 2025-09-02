// OtherTypesBlock.tsx
import React from "react";
import { Form, Select, InputNumber, Button, Space, Card } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

interface Option {
  label: string;
  value: string;
}

interface Props {
  loaiOptions: Option[];
  donViOptions: Option[];
}

const OtherTypesBlock: React.FC<Props> = ({ loaiOptions, donViOptions }) => {
  console.log(loaiOptions, donViOptions)
  return (
    <Card title="Các loại tài liệu khác" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-md">
      <div className="flex">
        <div className="text-center pb-2"
          style={{ width: 350 }}>
          Loại tài liệu
        </div>
        <div className="text-center pb-2 pl-1"
          style={{ width: 70 }}>
          số lượng
        </div>
        <div
          className="text-center pb-2"
          style={{ width: 120 }}>
          Đơn vị tính
        </div>
      </div>
      <Form.List name="lstOtherTypes">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} align="baseline" style={{ display: "flex", marginBottom: 8 }}>
                <Form.Item
                  {...restField}
                  name={[name, "loaiTaiLieu"]}
                  rules={[{ required: true, message: "Chọn loại tài liệu" }]}
                >
                  <Select
                    style={{ width: 350 }}
                    placeholder="Loại tài liệu"
                    options={loaiOptions}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "soLuong"]}
                  className="m-1"
                  rules={[{ required: true, message: "Nhập số lượng" }]}
                >
                  <InputNumber placeholder="Số lượng" min={0}
                    style={{ width: 70 }} />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "donViTinh"]}
                >
                  <Select
                    style={{ width: 120 }}
                    placeholder="Đơn vị tính"
                    options={donViOptions}
                  />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                Thêm loại tài liệu
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Card >
  );
};

export default OtherTypesBlock;

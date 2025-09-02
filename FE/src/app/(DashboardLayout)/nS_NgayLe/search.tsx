import { Button, DatePicker, Form, Input, Select } from "antd";

interface Props {
  onSearch: (values: any) => void;
}

const { Option } = Select;
const { RangePicker } = DatePicker;

const Search: React.FC<Props> = ({ onSearch }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    // Xử lý giá trị khoảng ngày để truyền đúng cho API
    let ngayBatDau = null;
    let ngayKetThuc = null;
    if (values.khoangNgay && values.khoangNgay.length === 2) {
      ngayBatDau = values.khoangNgay[0]?.format("YYYY-MM-DD");
      ngayKetThuc = values.khoangNgay[1]?.format("YYYY-MM-DD");
    }
    const submitValues = {
      ...values,
      ngayBatDau,
      ngayKetThuc,
    };
    delete submitValues.khoangNgay; // Xoá trường không cần thiết
    onSearch(submitValues);
  };
  return (
    <Form form={form} layout="inline" onFinish={handleFinish} style={{ marginBottom: 16 }}>
      <Form.Item name="tenNgayLe" label="Tên ngày lễ">
        <Input placeholder="Nhập tên ngày lễ" allowClear />
      </Form.Item>
      <Form.Item name="nam" label="Năm">
        <Input type="number" min={2000} max={2100} placeholder="Năm" allowClear />
      </Form.Item>
      <Form.Item name="loai" label="Loại">
        <Select allowClear style={{ width: 160 }} placeholder="Chọn loại">
          <Option value={1}>Quốc lễ</Option>
          <Option value={2}>Công ty quy định</Option>
        </Select>
      </Form.Item>
       <Form.Item name="khoangNgay" label="Khoảng ngày">
        <RangePicker format="DD/MM" picker="date" allowClear style={{ width: 220 }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Tìm kiếm</Button>
      </Form.Item>
    </Form>
  );
};

export default Search; 
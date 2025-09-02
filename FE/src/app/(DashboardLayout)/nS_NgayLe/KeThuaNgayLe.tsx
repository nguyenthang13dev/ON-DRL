import React, { useState } from "react";
import { Button, Form, Input, Modal, Table, Typography, message } from "antd";

interface NgayLe {
  id: number;
  tenNgayLe: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  tenLoaiNL?: string;
}

interface Props {
  fetchNgayLeByNam: (nam: number) => Promise<NgayLe[]>;
  onKeThua: (namMoi: number, namCu: number) => Promise<void>;
}

const KeThuaNgayLe: React.FC<Props> = ({ fetchNgayLeByNam, onKeThua }) => {
  const [form] = Form.useForm();
  const [namCu, setNamCu] = useState<string>("");
  const [namMoi, setNamMoi] = useState<number | null>(null);
  const [ngayLeList, setNgayLeList] = useState<NgayLe[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Bỏ debounce và onChange năm cha, chỉ lưu giá trị
  const handleNamCuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNamCu(e.target.value);
    setNgayLeList([]); // Xoá danh sách cũ khi đổi năm cha
  };

  const handleNamMoiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNamMoi(Number(e.target.value));
  };

  // Nút kiểm tra: lấy danh sách ngày lễ theo năm cha
  const handleKiemTra = async () => {
    if (!namCu) {
      message.warning("Vui lòng nhập năm cha.");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchNgayLeByNam(Number(namCu));
      setNgayLeList(data);
      if (data.length === 0) {
        message.info("Không có ngày lễ nào trong năm này.");
      }
    } catch {
      message.error("Không lấy được danh sách ngày lễ.");
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!namCu || !namMoi) {
      message.warning("Vui lòng nhập đủ năm cha và năm kế thừa.");
      return;
    }
    setConfirmVisible(true);
  };

  const handleConfirm = async () => {
    setConfirmVisible(false);
    if (!namCu || !namMoi) return;
    try {
      await onKeThua(namMoi, Number(namCu));
      message.success(`Đã kế thừa dữ liệu từ năm ${namCu} sang năm ${namMoi}`);
      setNgayLeList([]);
      form.resetFields();
    } catch {
      message.error("Kế thừa thất bại.");
    }
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="Năm cha (năm bị kế thừa)" name="namCu" rules={[{ required: true, message: "Nhập năm cha" }]}>
            <Input type="number" min={2000} max={2100} onChange={handleNamCuChange} value={namCu} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleKiemTra}>Kiểm tra</Button>
          </Form.Item>
          <Form.Item label="Năm kế thừa" name="namMoi" rules={[{ required: true, message: "Nhập năm kế thừa" }]}>
            <Input type="number" min={2000} max={2100} onChange={handleNamMoiChange} />
          </Form.Item>
        </Form>
      </div>
      <Table
        dataSource={ngayLeList}
        rowKey="id"
        pagination={false}
        bordered
        size="small"
        columns={[
          { title: "Tên ngày lễ", dataIndex: "tenNgayLe" },
          { title: "Ngày bắt đầu", dataIndex: "ngayBatDau" },
          { title: "Ngày kết thúc", dataIndex: "ngayKetThuc" },
          { title: "Loại", dataIndex: "tenLoaiNL", render: (val: string) => val || "-" },
        ]}
        loading={loading}
        style={{ marginTop: 8, marginBottom: 16 }}
      />
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Button onClick={() => form.resetFields()} style={{ marginRight: 8 }}>Đóng</Button>
        <Button type="primary" onClick={handleSubmit}>Kế thừa</Button>
      </div>
      <Modal
        open={confirmVisible}
        onOk={handleConfirm}
        onCancel={() => setConfirmVisible(false)}
        okText="Xác nhận"
        cancelText="Huỷ"
      >
        <Typography.Text>
          Năm <b>{namMoi}</b> sẽ kế thừa dữ liệu từ năm <b>{namCu}</b>.<br />
          <span style={{ color: "red" }}>Dữ liệu năm {namMoi} sẽ bị xóa bỏ hết nếu có!</span><br />
          Bạn có chắc chắn muốn thực hiện?
        </Typography.Text>
      </Modal>
    </>
  );
};

export default KeThuaNgayLe;
import { useState, useEffect } from "react";
import { Button, Modal, Table, Input, DatePicker, Select, Form } from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import nS_NgayLeService from "@/services/nS_NgayLe/nS_NgayLeService";
import { NS_NgayLeDto } from "@/types/nS_NgayLe/NS_NgayLe";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface AddManyDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddManyDialog: React.FC<AddManyDialogProps> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [editList, setEditList] = useState<Partial<NS_NgayLeDto>[]>([]);
  const [loaiNgayLeOptions, setLoaiNgayLeOptions] = useState<{ code: string; name: string }[]>([]);

  // Lấy danh sách loại ngày lễ khi mở modal
  useEffect(() => {
    if (open) {
      nS_NgayLeService.getLoaiNgayLe().then(res => {
        if (res.data?.status && Array.isArray(res.data.data)) {
          // Map lại thành { code, name }
          setLoaiNgayLeOptions(res.data.data.map((item: any) => ({ code: item.code || item.Code, name: item.name || item.Name })));
        } else {
          setLoaiNgayLeOptions([]);
        }
      });
    }
  }, [open]);

  // Thêm dòng mới
  const handleAddRow = () => {
    setEditList([
      ...editList,
      {
        tenNgayLe: "",
        ngayBatDau: "",
        ngayKetThuc: "",
        loaiNLCode: loaiNgayLeOptions[0]?.code || "",
        moTa: "",
        trangThai: "HoatDong",
        nam: year,
      } as Partial<NS_NgayLeDto>,
    ]);
  };

  // Sửa dòng
  const handleEditRow = (idx: number, field: string, value: any) => {
    setEditList(list =>
      list.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  // Xóa dòng
  const handleDeleteRow = (idx: number) => {
    setEditList(list => list.filter((_, i) => i !== idx));
  };

  // Lưu tất cả
  const handleSave = async () => {
    if (editList.length === 0) {
      toast.error("Vui lòng thêm ít nhất một ngày lễ");
      return;
    }
    setLoading(true);
    try {
      const res = await nS_NgayLeService.createMany(
        editList.map(x => {
          return {
            tenNgayLe: x.tenNgayLe || "",
            ngayBatDau: x.ngayBatDau || "",
            ngayKetThuc: x.ngayKetThuc || "",
            loaiNLCode: x.loaiNLCode || (loaiNgayLeOptions[0]?.code || ""),
            moTa: x.moTa || "",
            trangThai: x.trangThai || "HoatDong",
            nam: x.nam ?? year,
          };
        })
      );
      if (res.data?.status) {
        toast.success("Thêm thành công!");
        onSuccess();
        onClose();
        setEditList([]); // Reset danh sách
      } else {
        toast.error(res.data?.message || "Có lỗi khi thêm dữ liệu");
      }
    } catch {
      toast.error("Lỗi khi thêm dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} title="Thêm nhiều ngày nghỉ lễ" footer={null} width={1500} destroyOnClose>
      <div style={{ marginBottom: 16 }}>
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="Năm"> 
            <Input type="number" min={2000} max={2200} value={year} onChange={e => setYear(Number(e.target.value))} style={{ width: 100 }} />
          </Form.Item>
        </Form>
        <Button onClick={handleAddRow} type="primary">Thêm dòng</Button>
      </div>
      <Table
        dataSource={editList}
        rowKey={(_, index) => index?.toString() || "0"}
        pagination={false}
        bordered
        size="small"
        columns={[
          { title: "Tên ngày lễ", dataIndex: "tenNgayLe", render: (val, _, idx) => <Input value={val} onChange={e => handleEditRow(idx, "tenNgayLe", e.target.value)} /> },
          {
            title: "Khoảng ngày",
            dataIndex: "range",
            render: (_, row, idx) => (
              <RangePicker
                value={row.ngayBatDau && row.ngayKetThuc ? [dayjs(row.ngayBatDau), dayjs(row.ngayKetThuc)] : undefined}
                onChange={dates => {
                  handleEditRow(idx, "ngayBatDau", dates?.[0]?.format("YYYY-MM-DD") || "");
                  handleEditRow(idx, "ngayKetThuc", dates?.[1]?.format("YYYY-MM-DD") || "");
                }}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
              />
            )
          },
          { title: "Loại", dataIndex: "loai", render: (val, _, idx) =>
            <Select
              value={editList[idx]?.loaiNLCode}
              onChange={v => handleEditRow(idx, "loaiNLCode", v)}
              style={{ width: 250 }}
              placeholder="Chọn loại ngày lễ"
            >
              {loaiNgayLeOptions.map(opt => (
                <Option key={opt.code} value={opt.code}>{opt.name}</Option>
              ))}
            </Select>
        },
          { title: "Mô tả", dataIndex: "moTa", render: (val, _, idx) => <Input value={val} onChange={e => handleEditRow(idx, "moTa", e.target.value)} /> },
          { title: "Trạng thái", dataIndex: "trangThai", render: (val, _, idx) => <Select value={val} onChange={v => handleEditRow(idx, "trangThai", v)} style={{ width: 120 }}><Option value="HoatDong">Hoạt động</Option><Option value="KhongHoatDong">Không hoạt động</Option></Select> },
          { title: "", dataIndex: "actions", render: (_, __, idx) => <Button danger onClick={() => handleDeleteRow(idx)}>Xóa</Button> },
        ]}
        loading={loading}
      />
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>Hủy</Button>
        <Button type="primary" onClick={handleSave} loading={loading}>Thêm tất cả</Button>
      </div>
    </Modal>
  );
};

export default AddManyDialog; 
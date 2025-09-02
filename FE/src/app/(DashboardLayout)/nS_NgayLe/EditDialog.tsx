import { useState, useEffect } from "react";
import { Button, Modal, Table, Input, DatePicker, Select } from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import nS_NgayLeService from "@/services/nS_NgayLe/nS_NgayLeService";
import { NS_NgayLeDto, NS_NgayLeCreateUpdateType } from "@/types/nS_NgayLe/NS_NgayLe";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (values: NS_NgayLeCreateUpdateType) => void;
  item?: NS_NgayLeDto | null;
}

const EditDialog: React.FC<EditDialogProps> = ({ open, onClose, onSuccess, item }) => {
  const [editData, setEditData] = useState<Partial<NS_NgayLeDto>>({});
  const [loading, setLoading] = useState(false);
  const [loaiNgayLeOptions, setLoaiNgayLeOptions] = useState<{ code: string; name: string }[]>([]);

  useEffect(() => {
    if (item) {
      setEditData(item);
    } else {
      setEditData({
        tenNgayLe: "",
        ngayBatDau: "",
        ngayKetThuc: "",
        loaiNLCode: "",
        moTa: "",
        trangThai: "HoatDong",
        nam: new Date().getFullYear(),
      });
    }
    if (open) {
      nS_NgayLeService.getLoaiNgayLe().then(res => {
        if (res.data?.status && Array.isArray(res.data.data)) {
          setLoaiNgayLeOptions(res.data.data.map((item: any) => ({ code: item.code || item.Code, name: item.name || item.Name })));
        } else {
          setLoaiNgayLeOptions([]);
        }
      });
    }
  }, [item, open]);

  const handleEditField = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await nS_NgayLeService.createMany([{
        ...(item ? { id: item.id } : {}),
        tenNgayLe: editData.tenNgayLe || "",
        ngayBatDau: editData.ngayBatDau || "",
        ngayKetThuc: editData.ngayKetThuc || "",
        loaiNLCode: editData.loaiNLCode || (loaiNgayLeOptions[0]?.code || ""),
        moTa: editData.moTa || "",
        trangThai: editData.trangThai || "HoatDong",
        nam: editData.nam ?? new Date().getFullYear(),
      }]);
      if (res.data?.status) {
        toast.success(item ? "Cập nhật thành công!" : "Thêm mới thành công!");
        onSuccess({
          ...(item ? { id: item.id } : {}),
          tenNgayLe: editData.tenNgayLe || "",
          ngayBatDau: editData.ngayBatDau || "",
          ngayKetThuc: editData.ngayKetThuc || "",
          loaiNLCode: editData.loaiNLCode || (loaiNgayLeOptions[0]?.code || ""),
          moTa: editData.moTa || "",
          trangThai: editData.trangThai || "HoatDong",
          nam: editData.nam ?? new Date().getFullYear(),
        });
        onClose();
      } else {
        toast.error(res.data?.message || (item ? "Cập nhật thất bại" : "Thêm mới thất bại"));
      }
    } catch (err) {
      toast.error("Lỗi khi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      open={open} 
      onCancel={onClose} 
      title={item ? "Chỉnh sửa ngày lễ" : "Thêm ngày lễ"} 
      footer={null} 
      width="1500px" 
      style={{ top: 200 }} 
      destroyOnClose
    >
      <Table
        dataSource={[editData]}
        rowKey="id"
        pagination={false}
        bordered
        size="small"
        columns={[
          { title: "Tên ngày lễ", dataIndex: "tenNgayLe", render: (val) => <Input value={val} onChange={e => handleEditField("tenNgayLe", e.target.value)} /> },
          {
            title: "Khoảng ngày",
            dataIndex: "range",
            render: (_, row) => (
              <RangePicker
                value={row.ngayBatDau && row.ngayKetThuc ? [dayjs(row.ngayBatDau), dayjs(row.ngayKetThuc)] : undefined}
                onChange={dates => {
                  handleEditField("ngayBatDau", dates?.[0]?.format("YYYY-MM-DD") || "");
                  handleEditField("ngayKetThuc", dates?.[1]?.format("YYYY-MM-DD") || "");
                }}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
              />
            )
          },
          { title: "Loại", dataIndex: "loaiNLCode", render: (val) => (
            <Select
              value={val}
              onChange={v => handleEditField("loaiNLCode", v)}
              style={{ width: 250 }}
              placeholder="Chọn loại ngày lễ"
            >
              {loaiNgayLeOptions.map(opt => (
                <Option key={opt.code} value={opt.code}>{opt.name}</Option>
              ))}
            </Select>
          ) },
          { title: "Mô tả", dataIndex: "moTa", render: (val) => <Input value={val} onChange={e => handleEditField("moTa", e.target.value)} /> },
          { title: "Trạng thái", dataIndex: "trangThai", render: (val) => <Select value={val} onChange={v => handleEditField("trangThai", v)} style={{ width: 120 }}><Option value="HoatDong">Hoạt động</Option><Option value="KhongHoatDong">Không hoạt động</Option></Select> },
          { title: "Năm", dataIndex: "nam", render: (val) => <Input value={val} onChange={e => handleEditField("nam", e.target.value)} type="number" min={2000} max={2200} style={{ width: 80 }} /> },
        ]}
        loading={loading}
      />
      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>Hủy</Button>
        <Button type="primary" onClick={handleSave} loading={loading}>{item ? "Cập nhật" : "Thêm mới"}</Button>
      </div>
    </Modal>
  );
};

export default EditDialog; 
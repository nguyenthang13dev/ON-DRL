import { Modal, Descriptions, Tag } from "antd";
import React from "react";
import dayjs from "dayjs";
import { SinhVien } from "@/types/sinhVien/sinhVien";

interface Props {
  isOpen: boolean;
  sinhVien?: SinhVien | null;
  onClose: () => void;
}

const SinhVienDetail: React.FC<Props> = (props: Props) => {
  return (
    <Modal
      title="Chi tiết sinh viên"
      open={props.isOpen}
      onCancel={props.onClose}
      footer={null}
      width={600}
    >
      {props.sinhVien && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã sinh viên">
            {props.sinhVien.maSV}
          </Descriptions.Item>
          <Descriptions.Item label="Họ tên">
            {props.sinhVien.hoTen}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {dayjs(props.sinhVien.ngaySinh).format("DD/MM/YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">
            <Tag color={props.sinhVien.gioiTinh ? "blue" : "pink"}>
              {props.sinhVien.gioiTinh ? "Nam" : "Nữ"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {props.sinhVien.email}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={props.sinhVien.trangThai === "active" ? "green" : "red"}>
              {props.sinhVien.trangThai === "active" ? "Hoạt động" : "Không hoạt động"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Khoa ID">
            {props.sinhVien.khoaId}
          </Descriptions.Item>
          <Descriptions.Item label="Lớp ID">
            {props.sinhVien.lopId}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default SinhVienDetail;

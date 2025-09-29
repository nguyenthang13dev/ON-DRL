"use client";
import { Modal, Descriptions, Tag } from "antd";
import React from "react";
import { GiaoVien } from "@/types/giaoVien/giaoVien";

interface Props {
  isOpen: boolean;
  giaoVien?: GiaoVien | null;
  onClose: () => void;
}

const GiaoVienDetail: React.FC<Props> = (props: Props) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DangLam":
        return "green";
      case "NghiViec":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "DangLam":
        return "Đang làm";
      case "NghiViec":
        return "Nghỉ việc";
      default:
        return status;
    }
  };

  return (
    <Modal
      title="Chi tiết giáo viên"
      open={props.isOpen}
      onCancel={props.onClose}
      footer={null}
      width={600}
    >
      {props.giaoVien && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã giáo viên">
            {props.giaoVien.maGiaoVien}
          </Descriptions.Item>
          <Descriptions.Item label="Họ tên">
            {props.giaoVien.hoTen}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {props.giaoVien.email}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {props.giaoVien.soDienThoai || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Tên khoa">
            {props.giaoVien.tenKhoa || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(props.giaoVien.trangThai)}>
              {getStatusText(props.giaoVien.trangThai)}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default GiaoVienDetail;

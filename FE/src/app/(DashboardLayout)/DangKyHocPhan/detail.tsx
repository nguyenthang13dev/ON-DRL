"use client";
import { Modal, Descriptions } from "antd";
import React from "react";
import { DangKyHocPhan } from "@/types/dangKyHocPhan/dangKyHocPhan";

interface Props {
  isOpen: boolean;
  dangKyHocPhan?: DangKyHocPhan | null;
  onClose: () => void;
}

const DangKyHocPhanDetail: React.FC<Props> = (props: Props) => {
  return (
    <Modal
      title="Chi tiết đăng ký học phần"
      open={props.isOpen}
      onCancel={props.onClose}
      footer={null}
      width={600}
    >
      {props.dangKyHocPhan && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Sinh viên ID">
            {props.dangKyHocPhan.sinhVienId}
          </Descriptions.Item>
          <Descriptions.Item label="Lớp học phần ID">
            {props.dangKyHocPhan.lopHocPhanId}
          </Descriptions.Item>
          <Descriptions.Item label="Điểm quá trình">
            {props.dangKyHocPhan.diemQuaTrinh}
          </Descriptions.Item>
          <Descriptions.Item label="Điểm thi">
            {props.dangKyHocPhan.diemThi}
          </Descriptions.Item>
          <Descriptions.Item label="Điểm tổng kết">
            {props.dangKyHocPhan.diemTongKet}
          </Descriptions.Item>
          <Descriptions.Item label="Kết quả">
            {props.dangKyHocPhan.ketQua}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default DangKyHocPhanDetail;

"use client";
import { Modal, Descriptions } from "antd";
import React from "react";
import { LopHanhChinh } from "@/types/lopHanhChinh/lopHanhChinh";

interface Props {
  isOpen: boolean;
  lopHanhChinh?: LopHanhChinh | null;
  onClose: () => void;
}

const LopHanhChinhDetail: React.FC<Props> = (props: Props) => {
  return (
    <Modal
      title="Chi tiết lớp hành chính"
      open={props.isOpen}
      onCancel={props.onClose}
      footer={null}
      width={600}
    >
      {props.lopHanhChinh && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Tên lớp">
            {props.lopHanhChinh.tenLop}
          </Descriptions.Item>
          <Descriptions.Item label="Khoa ID">
            {props.lopHanhChinh.khoaId}
          </Descriptions.Item>
          <Descriptions.Item label="Giáo viên cố vấn ID">
            {props.lopHanhChinh.giaoVienCoVanId || "-"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default LopHanhChinhDetail;

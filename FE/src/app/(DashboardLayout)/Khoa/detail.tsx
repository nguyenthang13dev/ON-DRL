import { Modal, Descriptions } from "antd";
import React from "react";
import { Khoa } from "@/types/khoa/khoa";

interface Props {
  isOpen: boolean;
  khoa?: Khoa | null;
  onClose: () => void;
}

const KhoaDetail: React.FC<Props> = (props: Props) => {
  return (
    <Modal
      title="Chi tiết khoa"
      open={props.isOpen}
      onCancel={props.onClose}
      footer={null}
      width={500}
    >
      {props.khoa && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã khoa">
            {props.khoa.maKhoa}
          </Descriptions.Item>
          <Descriptions.Item label="Tên khoa">
            {props.khoa.tenKhoa}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default KhoaDetail;

import React from "react";
import { Modal, Table } from "antd";
import { TacNhan_UseCaseType } from "@/types/TacNhan_UseCase/TacNhan_UseCase";

interface DetailProps {
  tacNhanUseCase?: TacNhan_UseCaseType | null;
  isOpen: boolean;
  onClose: () => void;
}

const TacNhanUseCaseDetail: React.FC<DetailProps> = ({ tacNhanUseCase, isOpen, onClose }) => {
  const columns = [
    { title: "Trường", dataIndex: "field", key: "field", width: 150 },
    { title: "Giá trị", dataIndex: "value", key: "value" },
  ];
  const data = [
    { key: "1", field: "Mã tác nhân", value: tacNhanUseCase?.maTacNhan || "" },
    { key: "2", field: "Tên tác nhân", value: tacNhanUseCase?.tenTacNhan || "" },
    { key: "3", field: "Ngày tạo", value: tacNhanUseCase?.createdDate || "" },
  ];
  return (
    <Modal
      title="Chi tiết Tác Nhân UseCase"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <Table
        columns={columns}
        bordered
        dataSource={data}
        rowKey="key"
        pagination={false}
        tableLayout="fixed"
      />
    </Modal>
  );
};
export default TacNhanUseCaseDetail; 
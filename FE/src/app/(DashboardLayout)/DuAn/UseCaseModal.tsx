"use client";
import React, { useRef, useState } from "react";
import { Modal, Tabs, Tooltip, Button } from "antd";
import {
  BulbOutlined,
  SaveOutlined,
  FileExcelOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import GenerateUserCase from "./GenerateUserCase";
import TacNhanList from "./TacNhanList";

interface UseCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  idDuAn: string;
}

const UseCaseModal: React.FC<UseCaseModalProps> = ({
  isOpen,
  onClose,
  idDuAn,
}) => {
  const genUserCaseRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<string>("generate-usecase");

  // Function to handle tab change
  const handleTabChange = (key: string) => {
    setActiveTab(key);

    // Reload actor list when switching to "Tạo Use Case" tab
    if (
      key === "generate-usecase" &&
      genUserCaseRef.current?.reloadTacNhanList
    ) {
      genUserCaseRef.current.reloadTacNhanList();
    }
  };

  // Function to handle modal close
  const handleModalClose = () => {
    onClose();
  };

  const tabItems = [
    {
      key: "generate-usecase",
      label: "Tạo Use Case",
      children: (
        <div style={{ padding: "16px 0" }}>
          <GenerateUserCase idDuAn={idDuAn} ref={genUserCaseRef} />
        </div>
      ),
    },
    {
      key: "tac-nhan",
      label: "Danh sách tác nhân",
      children: (
        <div style={{ padding: "16px 0" }}>
          <TacNhanList idDuAn={idDuAn} />
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Quản lý Use Case"
        open={isOpen}
        onCancel={handleModalClose}
        footer={null}
        width={1500}
        destroyOnClose
      >
        <Tabs
          defaultActiveKey="generate-usecase"
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          type="card"
          style={{ marginTop: 16 }}
        />
      </Modal>

      {/* Fixed Toolbar for GenerateUserCase actions - chỉ hiển thị khi tab GenerateUserCase active */}
      {isOpen && activeTab === "generate-usecase" && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            right: 32,
            transform: "translateY(-50%)",
            zIndex: 1001, // Ensure it's above the modal
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: 8,
            borderRadius: 8,
            background: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Tooltip placement="left" title="Thêm trường hợp sử dụng">
            <Button
              type="default"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={() => genUserCaseRef.current?.handleAddRow()}
              style={{
                borderColor: "#1890ff",
                color: "#1890ff",
              }}
            />
          </Tooltip>
          <Tooltip placement="left" title="Tạo mô tả tất cả">
            <Button
              type="default"
              shape="circle"
              icon={<BulbOutlined />}
              onClick={() => genUserCaseRef.current?.handleGenerateAll()}
              loading={genUserCaseRef.current?.loading}
              disabled={genUserCaseRef.current?.loading}
              style={{
                borderColor: "#ffe58f",
                color: "#faad14",
              }}
            />
          </Tooltip>
          <Tooltip placement="left" title="Lưu tất cả">
            <Button
              type="default"
              shape="circle"
              icon={<SaveOutlined />}
              onClick={() => genUserCaseRef.current?.handleSaveAllUseCases()}
              loading={genUserCaseRef.current?.saving}
              disabled={
                genUserCaseRef.current?.saving ||
                !idDuAn ||
                idDuAn.trim() === ""
              }
              style={{
                borderColor: "#b7eb8f",
                color: "#52c41a",
              }}
            />
          </Tooltip>
          <Tooltip placement="left" title="Xuất Excel">
            <Button
              type="default"
              shape="circle"
              icon={<FileExcelOutlined />}
              onClick={() => genUserCaseRef.current?.exportTableToExcel()}
              disabled={!genUserCaseRef.current?.isDataReady}
              style={{
                borderColor: "#91d5ff",
                color: "#1890ff",
              }}
            />
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default UseCaseModal;

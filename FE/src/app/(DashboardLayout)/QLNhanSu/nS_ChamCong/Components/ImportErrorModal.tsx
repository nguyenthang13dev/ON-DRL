import React, { useEffect } from "react";
import { Modal, Table, Typography, Space, Tag } from "antd";
import { ExclamationCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

interface ErrorItem {
  row: number;
  message: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  errors: string[];
  totalErrors: number;
}

const ImportErrorModal: React.FC<Props> = ({
  open,
  onClose,
  errors,
  totalErrors,
}) => {
  const parseErrors = (errorArray: string[]): ErrorItem[] => {
    return errorArray.map((error, index) => {
      const rowMatch = error.match(/\[Row (\d+)\]/);
      const row = rowMatch ? parseInt(rowMatch[1]) : index + 1;
      const message = error.replace(/\[Row \d+\]\s*/, "");

      return {
        row,
        message,
      };
    });
  };

  const errorData = parseErrors(errors);

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center" as const,
      render: (_: any, __: any, index: number) => (
        <Tag color="red">{index + 1}</Tag>
      ),
    },
    {
      title: "Dòng",
      dataIndex: "row",
      key: "row",
      width: 80,
      align: "center" as const,
      render: (row: number) => <Tag color="orange">Dòng {row}</Tag>,
    },
    {
      title: "Chi tiết lỗi",
      dataIndex: "message",
      key: "message",
      render: (message: string) => (
        <Text style={{ color: "#ff4d4f" }}>{message}</Text>
      ),
    },
  ];

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      width={800}
      footer={null}
      destroyOnClose
      closable={false}
      style={{ top: 20 }}
    >
      {/* Custom Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)",
          padding: "20px",
          margin: "-24px -24px 24px -24px",
          color: "white",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Space>
          <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
          <Title level={4} style={{ color: "white", margin: 0 }}>
            CHI TIẾT LỖI IMPORT
          </Title>
        </Space>
        <Text
          style={{
            color: "rgba(255,255,255,0.8)",
            display: "block",
            marginTop: "8px",
          }}
        >
          Danh sách chi tiết các lỗi xảy ra trong quá trình import dữ liệu
        </Text>
      </motion.div>

      {/* Error Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: "20px" }}
      >
        <Space>
          <Text strong style={{ color: "#ff4d4f" }}>
            Tổng số lỗi: <Tag color="red">{totalErrors}</Tag>
          </Text>
          <Text type="secondary">({errorData.length} lỗi chi tiết)</Text>
        </Space>
      </motion.div>

      {/* Error Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Table
          columns={columns}
          dataSource={errorData}
          rowKey={(record) => `${record.row}-${record.message}`}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} trong ${total} lỗi`,
            size: "small",
          }}
          size="small"
          bordered
          scroll={{ y: 400 }}
          style={{
            marginBottom: "20px",
          }}
          className="custom-pagination-table"
        />
      </motion.div>

      {/* Footer */}
      <div style={{ textAlign: "right" }}>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onClose}
          style={{
            background: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            cursor: "pointer",
            fontWeight: "500",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CloseOutlined />
          Đóng
        </motion.button>
      </div>
    </Modal>
  );
};

export default ImportErrorModal;

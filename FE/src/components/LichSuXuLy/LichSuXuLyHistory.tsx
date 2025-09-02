"use client";
import { useEffect, useState } from "react";
import { Modal, Table, TableProps, Descriptions, Tag, Spin, Empty } from "antd";
import { LichSuXuLyType } from "@/types/LichSuXuLy/LichSuXuLy";
import lichSuXuLyService from "@/services/LichSuXuLy/LichSuXuLyService";
import { toast } from "react-toastify";
import dayjs from "dayjs";

interface LichSuXuLyHistoryProps {
  itemId: string;
  itemType: string;
  visible?: boolean;
  onClose?: () => void;
  title?: string;
  inline?: boolean;
}

const LichSuXuLyHistory = ({ 
  itemId, 
  itemType, 
  visible = false, 
  onClose, 
  title = "Lịch sử xử lý", 
  inline = false
}: LichSuXuLyHistoryProps) => {
  const [data, setData] = useState<LichSuXuLyType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!itemId || !itemType) return;
    
    setLoading(true);
    try {
      const res = await lichSuXuLyService.getByItem(itemId, itemType);
      if (res.status && res.data) {
        setData(res.data);
      } else {
        toast.error(res.message || "Lỗi lấy lịch sử xử lý");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy lịch sử xử lý");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((inline || visible) && itemId && itemType) {
      fetchHistory();
    }
  }, [inline, visible, itemId, itemType]);

  const columns: TableProps<LichSuXuLyType>["columns"] = [
    {
      title: "STT",
      dataIndex: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Thời gian",
      dataIndex: "createdDate",
      width: 150,
      render: (date) => date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      render: (note) => note || "-",
    },
    {
      title: "Dữ liệu cũ",
      dataIndex: "oldData",
      width: 200,
      render: (oldData) => {
        if (!oldData) return "-";
        return (
          <div style={{ maxWidth: 200, wordBreak: "break-word" }}>
            {oldData.length > 100 ? `${oldData.substring(0, 100)}...` : oldData}
          </div>
        );
      },
    },
    {
      title: "Dữ liệu mới",
      dataIndex: "newDaTa",
      width: 200,
      render: (newData) => {
        if (!newData) return "-";
        return (
          <div style={{ maxWidth: 200, wordBreak: "break-word" }}>
            {newData.length > 100 ? `${newData.substring(0, 100)}...` : newData}
          </div>
        );
      },
    },
  ];

  const handleClose = () => {
    setData([]);
    if (onClose) onClose();
  };

  if (inline) {
    return (
      <div>
        
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" />
          </div>
        ) : data.length === 0 ? (
          <Empty description="Không có lịch sử xử lý" />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={false}
            size="small"
            scroll={{ y: 400 }}
          />
        )}
      </div>
    );
  }
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={1000}
      destroyOnClose
    >
      <div style={{ marginBottom: 16 }}>
        <Descriptions size="small" column={2}>
          <Descriptions.Item label="Item ID">{itemId}</Descriptions.Item>
          <Descriptions.Item label="Item Type">{itemType}</Descriptions.Item>
        </Descriptions>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
        </div>
      ) : data.length === 0 ? (
        <Empty description="Không có lịch sử xử lý" />
      ) : (
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          pagination={false}
          size="small"
          scroll={{ y: 400 }}
        />
      )}
    </Modal>
  );
};

export default LichSuXuLyHistory; 
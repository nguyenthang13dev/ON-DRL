import {
  Modal,
  Descriptions,
  Tag,
  Button,
  List,
  Typography,
  Empty,
} from "antd";
import { DA_NoiDungCuocHopType } from "@/types/dA_DuAn/dA_NoiDungCuocHop";
import { useEffect, useState } from "react";
import {
  TaiLieuDinhKem,
  TaiLieuDinhKemSearch,
} from "@/types/taiLieuDinhKem/taiLieuDinhKem";
import TaiLieuDinhKemService from "@/services/taiLieuDinhKem/taiLieuDinhKem.service";
import { FileOutlined, DownloadOutlined } from "@ant-design/icons";
import KeHoachTrienKhaiModal from '@/app/(DashboardLayout)/DuAn/KeHoachTrienKhaiNoiBo/KeHoachTrienKhaiModal';
import { useRef } from 'react';
import { userService } from '@/services/user/user.service';

const { Text, Link } = Typography;

interface Props {
  item: DA_NoiDungCuocHopType;
  onClose: () => void;
  userOptions?: Array<{ value: string; label: string }>;
  onAddTask?: (task: any) => void;
}

const DA_NoiDungCuocHopDetail: React.FC<Props> = ({ item, onClose, userOptions: _userOptions = [], onAddTask }) => {
  const [documents, setDocuments] = useState<TaiLieuDinhKem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [userOptions, setUserOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [showAddTaskButton, setShowAddTaskButton] = useState<{ x: number; y: number; text: string } | null>(null);
  const selectionChangeTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!item.id) return;

      setLoading(true);
      try {
        const searchObj: TaiLieuDinhKemSearch = {
          item_ID: item.id,
          loaiTaiLieu: "NoiDungCuocHop",
          tenTaiLieu: "",
          dinhDangFile: "",
        };

        const response = await TaiLieuDinhKemService.getData(searchObj);
        if (response.status && response.data) {
          setDocuments(response.data.items || []);
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [item.id]);

  useEffect(() => {
    if (showAddTaskModal) {
      userService.getDropdown().then(res => {
        if (res.status && Array.isArray(res.data)) {
          setUserOptions(res.data.map((u: any) => ({ value: u.value, label: u.label })));
        } else {
          setUserOptions([]);
        }
      });
    }
  }, [showAddTaskModal]);

  // Chỉ hiện nút khi mouseup (kết thúc bôi đen)
  const handleMouseUp = () => {
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection && selection.toString();
      if (text && text.trim().length > 0 && contentRef.current && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setShowAddTaskButton({
          x: rect.right,
          y: rect.bottom,
          text,
        });
      } else {
        setShowAddTaskButton(null);
      }
    }, 10);
  };

  const handleDownload = (file: TaiLieuDinhKem) => {
    const link = document.createElement("a");
    link.href = `${process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL}/${file.duongDanFile}`;
    link.download = file.tenTaiLieu;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return size + " B";
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + " KB";
    return (size / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Context menu handler
  const handleContentContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    const text = selection && selection.toString();
    if (text && text.trim().length > 0) {
      e.preventDefault();
      setSelectedText(text);
      setContextMenu({ x: e.clientX, y: e.clientY });
    } else {
      setContextMenu(null);
    }
  };

  const handleAddTaskClick = () => {
    setShowAddTaskModal(true);
    setContextMenu(null);
  };

  const handleCloseAddTaskModal = () => {
    setShowAddTaskModal(false);
    setSelectedText('');
  };

  const handleSaveAddTaskModal = (task: any) => {
    setShowAddTaskModal(false);
    setSelectedText('');
    if (onAddTask) onAddTask(task);
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: "16px", fontWeight: "bold" }}>
          Chi tiết cuộc họp
        </div>
      }
      open={true}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
    >
      <Descriptions bordered column={1} labelStyle={{ paddingLeft: 8 }}>
        <Descriptions.Item label={<strong>Tên dự án</strong>}>
          {item.tenDuAn}
        </Descriptions.Item>

        <Descriptions.Item label={<strong>Loại cuộc họp</strong>}>
          <Tag color={item.isNoiBo ? "blue" : "green"}>
            {item.isNoiBo ? "Nội bộ" : "Họp với khách hàng"}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label={<strong>Thời gian</strong>}>
          {formatDateTime(new Date(item.thoiGianHop))}
        </Descriptions.Item>

        <Descriptions.Item label={<strong>Thành phần tham gia</strong>}>
          {item.thanhPhanThamGiaText}
        </Descriptions.Item>

        <Descriptions.Item label={<strong>Địa điểm</strong>}>
          {item.diaDiemCuocHop}
        </Descriptions.Item>

        <Descriptions.Item label={<strong>Tài liệu đính kèm</strong>}>
          <div style={{ marginTop: 8 }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Text type="secondary">Đang tải tài liệu...</Text>
              </div>
            ) : documents.length > 0 ? (
              <List
                dataSource={documents}
                renderItem={(file) => (
                  <List.Item
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid #f0f0f0",
                    }}
                    actions={[
                      <Button
                        key="download"
                        type="link"
                        size="small"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(file)}
                        style={{ padding: 0 }}
                      >
                        Tải xuống
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <FileOutlined
                          style={{ fontSize: 16, color: "#1890ff" }}
                        />
                      }
                      title={
                        <Link
                          href={`${process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL}/${file.duongDanFile}`}
                          target="_blank"
                          style={{ fontWeight: "normal" }}
                        >
                          {file.tenTaiLieu}
                        </Link>
                      }
                      description={
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          <Text type="secondary">
                            {file.dinhDangFile.toUpperCase()} •{" "}
                            {formatFileSize(file.kichThuoc)}
                            {file.ngayPhatHanh && (
                              <>
                                {" "}
                                •{" "}
                                {new Date(
                                  file.ngayPhatHanh
                                ).toLocaleDateString()}
                              </>
                            )}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có tài liệu đính kèm"
                style={{ margin: "20px 0" }}
              />
            )}
          </div>
        </Descriptions.Item>
      </Descriptions>

      <div
        style={{ margin: "24px 0 16px", fontSize: "16px", fontWeight: "bold" }}
      >
        Nội dung cuộc họp
      </div>

      <div
        ref={contentRef}
        onMouseUp={handleMouseUp}
        // onContextMenu={handleContentContextMenu} // Bỏ context menu
        style={{
          border: "1px solid #f0f0f0",
          borderRadius: 4,
          padding: 16,
          minHeight: 200,
          maxHeight: 400,
          overflowY: "auto",
          position: 'relative',
        }}
        dangerouslySetInnerHTML={{ __html: item.noiDungCuocHop }}
      />
      {showAddTaskButton && (
        <div
          style={{
            position: 'fixed',
            top: showAddTaskButton.y + 8,
            left: showAddTaskButton.x + 8,
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 9999,
            padding: '4px 12px',
            cursor: 'pointer',
            fontWeight: 500,
            userSelect: 'none',
          }}
          onMouseDown={e => e.preventDefault()}
          onClick={() => {
            setSelectedText(showAddTaskButton.text);
            setShowAddTaskModal(true);
            setShowAddTaskButton(null);
          }}
        >
          Thêm công việc mới
        </div>
      )}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 9999,
            padding: '4px 0',
            minWidth: 180,
          }}
          onClick={handleAddTaskClick}
          onMouseLeave={() => setContextMenu(null)}
        >
          <div style={{ padding: '8px 16px', cursor: 'pointer', fontWeight: 500 }}>
            Thêm công việc mới
          </div>
        </div>
      )}
      {showAddTaskModal && (
        <KeHoachTrienKhaiModal
          visible={showAddTaskModal}
          onClose={handleCloseAddTaskModal}
          onSave={handleSaveAddTaskModal}
          userOptions={userOptions}
          mode="add"
          initialNoiDungCongViec={selectedText}
          duAnId={item.duAnId}
        />
      )}
    </Modal>
  );
};

function formatDateTime(date: Date | string | number): string {
  // Xử lý đầu vào
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === "string" || typeof date === "number") {
    d = new Date(date);
  } else {
    return "Invalid Date";
  }

  // Kiểm tra Date hợp lệ
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }

  // Lấy các thành phần ngày tháng
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  // Trả về chuỗi định dạng dd/mm/yyyy hh:mm
  return `${hours}:${minutes} ${day}/${month}/${year} `;
}

export default DA_NoiDungCuocHopDetail;

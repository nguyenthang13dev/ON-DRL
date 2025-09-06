'use client';

import { TableConfigFormDataType } from "@/types/ConfigForm/ConfigForm";
import { CloseOutlined, DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import { Button, Descriptions, Drawer, Space, Tag, Typography } from "antd";

interface ConfigFormDetailProps {
  isOpen: boolean;
  onClose: () => void;
  configForm?: TableConfigFormDataType;
}

const { Text } = Typography;

const ConfigFormDetail: React.FC<ConfigFormDetailProps> = ({
  isOpen,
  onClose,
  configForm,
}) => {
  if (!configForm) return null;

  const handleDownloadFile = () => {
    if (configForm.fileDinhKems) {
      window.open(`${process.env.NEXT_PUBLIC_STATIC_FILE_BASE_URL}/${configForm.fileDinhKems}`, '_blank');
    }
  };

  return (
    <Drawer
      title="Chi tiết Cấu hình Biểu mẫu"
      width={600}
      onClose={onClose}
      open={isOpen}
      extra={
        <Button onClick={onClose} icon={<CloseOutlined />}>
          Đóng
        </Button>
      }
    >
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="ID">
          <Text code>{configForm.id}</Text>
        </Descriptions.Item>
        
        <Descriptions.Item label="Tên cấu hình">
          <Text strong style={{ fontSize: 16 }}>
            {configForm.name}
          </Text>
        </Descriptions.Item>
        
        <Descriptions.Item label="Mô tả">
          <div style={{ whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>
            {configForm.description || '-'}
          </div>
        </Descriptions.Item>
        
        <Descriptions.Item label="Trạng thái">
          <Tag color={configForm.isActive ? "green" : "red"} style={{ fontSize: 13 }}>
            {configForm.isActive ? "Hoạt động" : "Không hoạt động"}
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="File đính kèm">
          {configForm.fileDinhKems ? (
            <Space>
              <Tag color="blue" icon={<FileTextOutlined />}>
                Có file đính kèm
              </Tag>
              <Button 
                size="small" 
                type="link" 
                icon={<DownloadOutlined />}
                onClick={handleDownloadFile}
              >
                Tải xuống
              </Button>
            </Space>
          ) : (
            <Tag color="default">Không có file</Tag>
          )}
        </Descriptions.Item>
        
        <Descriptions.Item label="Ngày tạo">
          <Space direction="vertical" size={0}>
            <Text>
              {configForm.createdDate ? 
                new Date(configForm.createdDate).toLocaleString("vi-VN") : '-'}
            </Text>
            {configForm.createdBy && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Người tạo: {configForm.createdBy}
              </Text>
            )}
          </Space>
        </Descriptions.Item>
        
        <Descriptions.Item label="Cập nhật lần cuối">
          <Space direction="vertical" size={0}>
            <Text>
              {configForm.updatedDate ? 
                new Date(configForm.updatedDate).toLocaleString("vi-VN") : '-'}
            </Text>
            {configForm.updatedBy && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                Người cập nhật: {configForm.updatedBy}
              </Text>
            )}
          </Space>
        </Descriptions.Item>
      </Descriptions>
      
      <div style={{ 
        marginTop: 24, 
        padding: 16, 
        backgroundColor: '#f9f9f9', 
        borderRadius: 8,
        border: '1px solid #d9d9d9'
      }}>
        <Text strong>Thông tin bổ sung:</Text>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>Cấu hình này được sử dụng để tạo biểu mẫu tự động</li>
          <li>File đính kèm sẽ được dùng làm mẫu cho việc tạo form</li>
          <li>Trạng thái &quot;Hoạt động&quot; cho phép sử dụng cấu hình trong hệ thống</li>
          <li>Có thể chỉnh sửa hoặc xóa cấu hình nếu không còn sử dụng</li>
        </ul>
      </div>
    </Drawer>
  );
};

export default ConfigFormDetail;

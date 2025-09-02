import React from 'react';
import { Card, Row, Col, Space, Avatar, Tag, Button, Tooltip, Dropdown } from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  EyeOutlined, 
  EditOutlined,
  CheckCircleOutlined,
  StopOutlined,
  DownOutlined
} from '@ant-design/icons';
import { TD_UngVienDto } from '@/types/TD_UngVien/TD_UngVien';
import dayjs from 'dayjs';
import styles from './styles.module.css';

// Enum cho trạng thái phỏng vấn
enum InterviewStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  IN_PROGRESS = 'in_progress'
}

interface InterviewData extends TD_UngVienDto {
  interviewStatus?: InterviewStatus;
  duration?: number;
}

interface InterviewCardProps {
  item: InterviewData;
  onViewDetail: (item: InterviewData) => void;
  onUpdateTime: (item: InterviewData) => void;
  onUpdateStatus: (id: string, status: InterviewStatus) => void;
  showActions?: boolean;
  size?: 'small' | 'default';
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  item,
  onViewDetail,
  onUpdateTime,
  onUpdateStatus,
  showActions = false,
  size = 'small'
}) => {
  const getStatusTag = (status?: InterviewStatus) => {
    switch (status) {
      case InterviewStatus.SCHEDULED:
        return <Tag color="blue" className={styles.statusTag}>Đã lên lịch</Tag>;
      case InterviewStatus.IN_PROGRESS:
        return <Tag color="orange" className={styles.statusTag}>Đang diễn ra</Tag>;
      case InterviewStatus.COMPLETED:
        return <Tag color="green" className={styles.statusTag}>Đã hoàn thành</Tag>;
      case InterviewStatus.CANCELLED:
        return <Tag color="red" className={styles.statusTag}>Đã hủy</Tag>;
      default:
        return <Tag className={styles.statusTag}>Không xác định</Tag>;
    }
  };

  const getCardClassName = () => {
    let className = `${styles.interviewCard} ${styles.hoverEffect}`;
    switch (item.interviewStatus) {
      case InterviewStatus.SCHEDULED:
        className += ` ${styles.interviewCardScheduled}`;
        break;
      case InterviewStatus.IN_PROGRESS:
        className += ` ${styles.interviewCardInProgress}`;
        break;
      case InterviewStatus.COMPLETED:
        className += ` ${styles.interviewCardCompleted}`;
        break;
      case InterviewStatus.CANCELLED:
        className += ` ${styles.interviewCardCancelled}`;
        break;
    }
    return className;
  };

  const cardActions = showActions ? [
    <Tooltip title="Xem chi tiết" key="view">
      <Button 
        type="text" 
        icon={<EyeOutlined />}
        onClick={() => onViewDetail(item)}
      />
    </Tooltip>,
    <Tooltip title="Cập nhật thời gian" key="edit">
      <Button 
        type="text" 
        icon={<EditOutlined />}
        onClick={() => onUpdateTime(item)}
      />
    </Tooltip>,
    <Dropdown
      key="status"
      menu={{
        items: [
          {
            key: 'completed',
            label: 'Đánh dấu hoàn thành',
            icon: <CheckCircleOutlined />,
            onClick: () => onUpdateStatus(item.id, InterviewStatus.COMPLETED)
          },
          {
            key: 'cancelled',
            label: 'Đánh dấu đã hủy',
            icon: <StopOutlined />,
            onClick: () => onUpdateStatus(item.id, InterviewStatus.CANCELLED)
          }
        ]
      }}
    >
      <Button type="text">
        Trạng thái <DownOutlined />
      </Button>
    </Dropdown>
  ] : undefined;

  return (
    <Card 
      size={size}
      className={getCardClassName()}
      onClick={() => !showActions && onViewDetail(item)}
      actions={cardActions}
    >
      <Row gutter={[16, 8]} align="middle">
        <Col xs={24} sm={showActions ? 12 : 24}>
          <Space>
            <Avatar 
              size={showActions ? "large" : "default"} 
              icon={<UserOutlined />} 
            />
            <div>
              <div className={styles.candidateName}>{item.hoTen}</div>
              {getStatusTag(item.interviewStatus)}
            </div>
          </Space>
        </Col>
        
        <Col xs={24} sm={showActions ? 12 : 24}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Space>
              <MailOutlined />
              <span style={{ fontSize: '12px' }}>{item.email}</span>
            </Space>
            <Space>
              <PhoneOutlined />
              <span style={{ fontSize: '12px' }}>{item.soDienThoai}</span>
            </Space>
          </Space>
        </Col>
        
        <Col span={24}>
          <Tag color="purple" className={styles.positionTag}>
            {item.viTriTuyenDungText}
          </Tag>
          {item.thoiGianPhongVan && (
            <Tag color="default" style={{ marginLeft: 8 }}>
              {dayjs(item.thoiGianPhongVan).format('HH:mm')}
            </Tag>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default InterviewCard;
export { InterviewStatus };
export type { InterviewData };

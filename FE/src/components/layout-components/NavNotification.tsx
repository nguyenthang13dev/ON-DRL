import { notificationService } from '@/services/notification/notification.service';
import {
  BellOutlined,
  CheckCircleOutlined,
  MailOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Button, Empty, List, Popover } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import NavItem from './NavItem';
// import 'dayjs/locale/vi';
dayjs.extend(relativeTime);
// dayjs.locale('vi');

interface NotificationItem {
  id: string;
  img?: string;
  type: string;
  icon: string;
  name: string;
  desc: string;
  time: string;
  link: string;
}

const notificationData: [] = [];

const getIcon = (icon: string) => {
  switch (icon) {
    case 'mail':
      return <MailOutlined />;
    case 'alert':
      return <WarningOutlined />;
    case 'check':
      return <CheckCircleOutlined />;
    default:
      return <MailOutlined />;
  }
};

export const NavNotification: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  const handleOpenNotificationLink = async (id: string, link: string) => {
    try {
      const response = await notificationService.markAsRead(id);
      if (response && response.status) {
        router.push(link);
        setNotifications((pre) => pre.filter((x) => x.id != id));
      }
    } catch (error) {
    } finally {
      setPopoverOpen(false);
    }
  };

  const getNotificationBody = (list: NotificationItem[]) => {
    return list.length > 0 ? (
      <List
        size="small"
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => (
          <List.Item className="list-clickable">
            <a
              onClick={(e) => {
                e.preventDefault();
                handleOpenNotificationLink(item.id, item.link);
              }}
              href={item.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex w-100"
            >
              <div className="flex" title={item.desc}>
                <div className="pr-2">
                  {item.img ? (
                    <Avatar src={`/img/avatars/${item.img}`} size="small" />
                  ) : (
                    <Avatar
                      className={`ant-avatar-${item.type}`}
                      icon={getIcon(item.icon)}
                      size="small"
                    />
                  )}
                </div>
                <div>
                  <div className="truncate-2-lines">
                    <span className="font-weight-bold text-dark">
                      {item.name}
                    </span>
                    <span className="text-gray-light">{item.desc}</span>
                  </div>
                  <small className="ml-auto">{item.time}</small>
                </div>
              </div>
            </a>
          </List.Item>
        )}
      />
    ) : (
      <div className="empty-notification min-h-32">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Chưa có thông báo"
        />
      </div>
    );
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotification();
      if (response && response.data && response.data.items && Array.isArray(response.data.items)) {
        setNotifications(
          response.data.items.map((item: any) => ({
            id: item.id,
            img: '',
            type: item.type,
            icon: '',
            name: '',
            desc: item.message,
            time: dayjs(item.createdDate).fromNow(),
            link: item.link,
          }))
        );
      } else {
        console.warn('Dữ liệu không phải là mảng:', response.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách thông báo:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const notificationList = (
    <div className="w-64">
      <div className="border-bottom d-flex justify-content-between align-items-center px-3 py-2">
        <h5 className="mb-0">Thông báo</h5>
        {notifications.length > 0 && (
          <Button
            className="text-primary"
            type="text"
            onClick={() => setNotifications([])}
            size="small"
          >
            Xóa
          </Button>
        )}
      </div>
      <div className="nav-notification-body max-h-[415px] overflow-y-auto">
        {getNotificationBody(notifications)}
      </div>
      {notifications.length > 0 ? (
        <div className="px-3 py-2 border-top text-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setPopoverOpen(false);
              router.push('/notification/user');
            }}
          >
            Xem tất cả
          </a>
        </div>
      ) : null}
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      title={null}
      content={notificationList}
      trigger="click"
      overlayClassName="nav-notification"
      open={popoverOpen}
      onOpenChange={(visible) => setPopoverOpen(visible)}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <NavItem>
        <Badge count={notifications.length} className="!text-gray-600">
          <BellOutlined className="nav-icon mx-auto" type="bell" />
        </Badge>
      </NavItem>
    </Popover>
  );
};

export default NavNotification;

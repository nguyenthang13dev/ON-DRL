"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Typography,
  Tag,
  Space,
  Popconfirm,
  message,
  Badge,
  Empty,
} from "antd";
import {
  SendOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import userTelegramService from "@/services/userTelegram/UserTelegramService";
import { UserTelegramDto } from "@/types/userTelegram/UserTelegram";
import type { ColumnsType } from "antd/es/table";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

interface LinkedAccountsDashboardProps {
  onLinkNew?: () => void;
  refreshTrigger?: number;
}

const LinkedAccountsDashboard: React.FC<LinkedAccountsDashboardProps> = ({
  onLinkNew,
  refreshTrigger = 0,
}) => {
  const [linkedAccounts, setLinkedAccounts] = useState<UserTelegramDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch linked accounts
  const fetchLinkedAccounts = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await userTelegramService.getAllLinked();

      if (response.status && Array.isArray(response.data)) {
        setLinkedAccounts(response.data);
      } else {
        setLinkedAccounts([]);
      }
    } catch (error) {
      console.error("Error fetching linked accounts:", error);
      toast.error("Không thể tải danh sách tài khoản đã liên kết");
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Handle unlink account
  const handleUnlinkAccount = useCallback(
    async (chatId: string, fullName?: string) => {
      try {
        setLoading(true);
        const response = await userTelegramService.unlinkByChatIds([chatId]);

        if (response.status) {
          toast.success(
            `Đã gỡ liên kết tài khoản ${fullName || "Telegram"} thành công!`
          );
          setLinkedAccounts((prev) =>
            prev.filter((acc) => acc.chatId !== chatId)
          );
        } else {
          toast.error(response.message || "Có lỗi xảy ra khi gỡ liên kết");
        }
      } catch (error: any) {
        console.error("Error unlinking account:", error);
        toast.error("Có lỗi xảy ra khi gỡ liên kết tài khoản");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Không xác định";

    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Không xác định";
    }
  };

  // Table columns
  const columns: ColumnsType<UserTelegramDto> = [
    {
      title: "Tài khoản",
      key: "account",
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#0088cc] rounded-full flex items-center justify-center">
            <SendOutlined className="text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {record.fullName || "Chưa cập nhật"}
            </div>
            <div className="text-sm text-gray-500">
              Chat ID: {record.chatId}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "status",
      width: 120,
      render: (isActive: boolean) => (
        <Badge
          status={isActive ? "success" : "error"}
          text={
            <span className={isActive ? "text-green-600" : "text-red-600"}>
              {isActive ? "Hoạt động" : "Ngừng hoạt động"}
            </span>
          }
        />
      ),
    },
    {
      title: "Ngày liên kết",
      dataIndex: "linkedAt",
      key: "linkedDate",
      width: 180,
      render: (date: string) => (
        <div className="flex items-center text-gray-600">
          <CalendarOutlined className="mr-2" />
          <span>{formatDate(date)}</span>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Gỡ liên kết tài khoản"
          description={`Bạn có chắc chắn muốn gỡ liên kết tài khoản "${
            record.fullName || "Telegram"
          }"?`}
          onConfirm={() => handleUnlinkAccount(record.chatId, record.fullName)}
          okText="Có"
          cancelText="Không"
          okButtonProps={{ loading }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={loading}
            className="hover:bg-red-50"
          >
            Gỡ
          </Button>
        </Popconfirm>
      ),
    },
  ];

  // Load data on mount and when refreshTrigger changes
  useEffect(() => {
    fetchLinkedAccounts();
  }, [fetchLinkedAccounts, refreshTrigger]);

  return (
    <Card
      className="border-0 shadow-md"
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SendOutlined className="text-[#0088cc] mr-3 text-lg" />
            <Title level={5} className="mb-0 text-[#2A5DA3]">
              Tài khoản Telegram đã liên kết
            </Title>
          </div>
          <Space>
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={fetchLinkedAccounts}
              loading={refreshing}
              className="text-gray-500 hover:text-[#2A5DA3] hover:bg-blue-50"
            >
              Làm mới
            </Button>
            {onLinkNew && (
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={onLinkNew}
                className="bg-[#2A5DA3] hover:bg-blue-600 border-0"
              >
                Liên kết mới
              </Button>
            )}
          </Space>
        </div>
      }
    >
      {linkedAccounts.length === 0 ? (
        <div className="py-12">
          <Empty
            image={
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SendOutlined className="text-2xl text-gray-400" />
              </div>
            }
            imageStyle={{ height: "auto" }}
            description={
              <div className="text-center">
                <Text className="text-gray-500 block mb-2">
                  Chưa có tài khoản Telegram nào được liên kết
                </Text>
                <Text className="text-sm text-gray-400">
                  Liên kết tài khoản Telegram để nhận thông báo từ hệ thống
                </Text>
              </div>
            }
          >
            {onLinkNew && (
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={onLinkNew}
                className="bg-[#2A5DA3] hover:bg-blue-600 border-0"
              >
                Liên kết tài khoản đầu tiên
              </Button>
            )}
          </Empty>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-sm text-gray-600">Tổng liên kết</Text>
                  <div className="text-2xl font-bold text-[#2A5DA3]">
                    {linkedAccounts.length}
                  </div>
                </div>
                <UserOutlined className="text-2xl text-[#2A5DA3]" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-sm text-gray-600">Đang hoạt động</Text>
                  <div className="text-2xl font-bold text-green-600">
                    {linkedAccounts.filter((acc) => acc.isActive).length}
                  </div>
                </div>
                <CheckCircleOutlined className="text-2xl text-green-600" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Text className="text-sm text-gray-600">Ngừng hoạt động</Text>
                  <div className="text-2xl font-bold text-red-600">
                    {linkedAccounts.filter((acc) => !acc.isActive).length}
                  </div>
                </div>
                <ClockCircleOutlined className="text-2xl text-red-600" />
              </div>
            </div>
          </div>

          {/* Accounts Table */}
          <Table
            columns={columns}
            dataSource={linkedAccounts}
            rowKey="id"
            pagination={false}
            loading={refreshing}
            className="telegram-accounts-table"
            scroll={{ x: 800 }}
          />
        </>
      )}

      <style jsx global>{`
        .telegram-accounts-table .ant-table-thead > tr > th {
          background: #fafafa;
          border-bottom: 2px solid #f0f0f0;
          font-weight: 600;
          color: #2a5da3;
        }

        .telegram-accounts-table .ant-table-tbody > tr:hover > td {
          background: #f8faff;
        }

        .telegram-accounts-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px;
        }
      `}</style>
    </Card>
  );
};

export default LinkedAccountsDashboard;

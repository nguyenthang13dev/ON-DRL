"use client";
import React, { useState, useCallback } from "react";
import { Card, Button, Typography, Space } from "antd";
import {
  ArrowLeftOutlined,
  SendOutlined,
  LinkOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import TelegramLinkingInterface from "./TelegramLinkingInterface";
import LinkedAccountsDashboard from "./LinkedAccountsDashboard";
import { UserTelegramDto } from "@/types/userTelegram/UserTelegram";

const { Title, Text } = Typography;

type ViewMode = "dashboard" | "linking";

interface TelegramAccountManagerProps {
  onBack?: () => void;
  className?: string;
}

const TelegramAccountManager: React.FC<TelegramAccountManagerProps> = ({
  onBack,
  className = "",
}) => {
  const [currentView, setCurrentView] = useState<ViewMode>("dashboard");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Handle switching to linking view
  const handleStartLinking = useCallback(() => {
    setCurrentView("linking");
  }, []);

  // Handle back to dashboard
  const handleBackToDashboard = useCallback(() => {
    setCurrentView("dashboard");
    // Trigger refresh to show new linked account
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Handle successful linking
  const handleLinkingSuccess = useCallback((account: UserTelegramDto) => {
    console.log("New account linked:", account);
    setCurrentView("dashboard");
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const renderHeader = () => {
    if (currentView === "linking") {
      return null; // TelegramLinkingInterface has its own header
    }

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={onBack}
                type="text"
                className="text-[#2A5DA3] hover:bg-blue-50"
              >
                Quay lại
              </Button>
            )}
            <div>
              <Title level={3} className="mb-2 text-[#2A5DA3]">
                <LinkOutlined className="mr-3 text-[#2A5DA3]" />
                Quản lý liên kết tài khoản
              </Title>
              <Text className="text-gray-600">
                Kết nối và quản lý các tài khoản bên ngoài
              </Text>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case "linking":
        return (
          <TelegramLinkingInterface
            onBack={handleBackToDashboard}
            onSuccess={handleLinkingSuccess}
          />
        );

      case "dashboard":
      default:
        return (
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <Title level={5} className="mb-2 text-[#2A5DA3]">
                    Liên kết tài khoản Telegram
                  </Title>
                  <Text className="text-gray-600">
                    Kết nối với Telegram để nhận thông báo và cập nhật từ hệ
                    thống
                  </Text>
                </div>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={handleStartLinking}
                  className="bg-[#2A5DA3] hover:bg-blue-600 border-0 px-6"
                >
                  Liên kết mới
                </Button>
              </div>
            </Card>

            {/* Linked Accounts Dashboard */}
            <LinkedAccountsDashboard
              onLinkNew={handleStartLinking}
              refreshTrigger={refreshTrigger}
            />
          </div>
        );
    }
  };

  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      {renderHeader()}
      {renderContent()}
    </div>
  );
};

export default TelegramAccountManager;

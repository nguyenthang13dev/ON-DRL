"use client";
import React from "react";
import { Card, Typography, Badge, Space } from "antd";
import {
  SendOutlined,
  FacebookOutlined,
  GoogleOutlined,
  GithubOutlined,
  WindowsOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface Provider {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  available: boolean;
  comingSoon?: boolean;
  popular?: boolean;
}

interface ModernProviderSelectionProps {
  onProviderSelect: (providerId: string) => void;
  loading?: boolean;
}

const ModernProviderSelection: React.FC<ModernProviderSelectionProps> = ({
  onProviderSelect,
  loading = false,
}) => {
  const providers: Provider[] = [
    {
      id: "telegram",
      name: "Telegram",
      description: "Nhận thông báo qua Telegram Bot",
      icon: <SendOutlined className="text-2xl" />,
      color: "#0088cc",
      bgColor: "from-blue-500 to-blue-600",
      available: true,
      popular: true,
    },
    {
      id: "facebook",
      name: "Facebook",
      description: "Đăng nhập bằng Facebook",
      icon: <FacebookOutlined className="text-2xl" />,
      color: "#1877f2",
      bgColor: "from-blue-600 to-blue-700",
      available: false,
      comingSoon: true,
    },
    {
      id: "google",
      name: "Google",
      description: "Đăng nhập bằng Google",
      icon: <GoogleOutlined className="text-2xl" />,
      color: "#4285f4",
      bgColor: "from-red-500 to-orange-500",
      available: false,
      comingSoon: true,
    },
    {
      id: "github",
      name: "GitHub",
      description: "Kết nối với GitHub",
      icon: <GithubOutlined className="text-2xl" />,
      color: "#333",
      bgColor: "from-gray-800 to-gray-900",
      available: false,
      comingSoon: true,
    },
    {
      id: "microsoft",
      name: "Microsoft",
      description: "Đăng nhập bằng Microsoft",
      icon: <WindowsOutlined className="text-2xl" />,
      color: "#00bcf2",
      bgColor: "from-blue-400 to-blue-500",
      available: false,
      comingSoon: true,
    },
  ];

  const renderProviderCard = (provider: Provider) => {
    const isAvailable = provider.available && !loading;

    return (
      <Card
        key={provider.id}
        className={`
          relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
          ${isAvailable ? "hover:scale-105" : "opacity-60 cursor-not-allowed"}
        `}
        onClick={() => isAvailable && onProviderSelect(provider.id)}
        bodyStyle={{ padding: 0 }}
      >
        {/* Background Gradient */}
        <div className={`h-32 bg-gradient-to-br ${provider.bgColor} relative`}>
          {/* Popular Badge */}
          {provider.popular && (
            <div className="absolute top-3 right-3">
              <Badge.Ribbon text="Phổ biến" color="gold" />
            </div>
          )}

          {/* Coming Soon Overlay */}
          {provider.comingSoon && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <ClockCircleOutlined className="text-2xl mb-2" />
                <div className="text-sm font-medium">Sắp ra mắt</div>
              </div>
            </div>
          )}

          {/* Provider Icon */}
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {provider.icon}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Title level={5} className="mb-0 text-gray-900">
              {provider.name}
            </Title>
            {isAvailable && <ArrowRightOutlined className="text-gray-400" />}
          </div>

          <Text className="text-gray-600 text-sm leading-relaxed">
            {provider.description}
          </Text>

          {/* Status Indicator */}
          <div className="mt-4 flex items-center">
            {provider.available ? (
              <div className="flex items-center text-green-600">
                <CheckCircleOutlined className="mr-2" />
                <span className="text-sm font-medium">Có sẵn</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-400">
                <ClockCircleOutlined className="mr-2" />
                <span className="text-sm">Đang phát triển</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <Title level={2} className="mb-4 text-[#2A5DA3]">
          Chọn phương thức liên kết
        </Title>
        <Text className="text-gray-600 text-lg">
          Kết nối với các dịch vụ bên ngoài để nâng cao trải nghiệm sử dụng
        </Text>
      </div>

      {/* Provider Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {providers.map(renderProviderCard)}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 rounded-xl p-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <CheckCircleOutlined className="text-[#2A5DA3] text-xl mr-2" />
          <Title level={5} className="mb-0 text-[#2A5DA3]">
            An toàn & Bảo mật
          </Title>
        </div>
        <Text className="text-gray-600">
          Tất cả kết nối được mã hóa và tuân thủ các tiêu chuẩn bảo mật cao
          nhất. Thông tin của bạn sẽ được bảo vệ tuyệt đối.
        </Text>
      </div>
    </div>
  );
};

export default ModernProviderSelection;

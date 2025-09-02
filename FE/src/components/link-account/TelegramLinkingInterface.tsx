"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Typography,
  message,
  Spin,
  Card,
  Steps,
  Badge,
  Modal,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  SendOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  LinkOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import userTelegramService from "@/services/userTelegram/UserTelegramService";
import { UserTelegramDto } from "@/types/userTelegram/UserTelegram";
import { toast } from "react-toastify";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

interface TelegramToken {
  token: string;
  createdAt: string;
}

interface TelegramLinkingInterfaceProps {
  onBack?: () => void;
  onSuccess?: (account: UserTelegramDto) => void;
}

const TelegramLinkingInterface: React.FC<TelegramLinkingInterfaceProps> = ({
  onBack,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [token, setToken] = useState<TelegramToken | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [polling, setPolling] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_RETRIES = 3;
  const POLLING_INTERVAL = 3000; // 3 seconds

  const steps = [
    {
      title: "Tạo mã xác thực",
      description: "Tạo mã để liên kết với Telegram",
      icon: <SafetyCertificateOutlined />,
    },
    {
      title: "Mở Telegram",
      description: "Truy cập bot trên Telegram",
      icon: <SendOutlined />,
    },
    {
      title: "Kết nối tài khoản",
      description: "Hoàn tất liên kết",
      icon: <LinkOutlined />,
    },
  ];

  // Generate token
  const handleGenerateToken = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userTelegramService.generateTelegramLinkToken();
      console.log("Token response:", response); // Debug log

      if (response.status && response.data) {
        // Xử lý cả token và Token để đảm bảo tương thích
        const data = response.data as any;
        const tokenValue: string | undefined = data.token || data.Token;
        if (tokenValue) {
          const newToken: TelegramToken = {
            token: tokenValue,
            createdAt: new Date().toISOString(),
          };

          setToken(newToken);
          setCurrentStep(1);
          toast.success("Đã tạo mã xác thực thành công!");
        } else {
          throw new Error("Không nhận được mã xác thực");
        }
      } else {
        throw new Error(response.message || "Không thể tạo mã xác thực");
      }
    } catch (error: any) {
      console.error("Error generating token:", error);
      setError(error.message || "Có lỗi xảy ra khi tạo mã xác thực");
      toast.error("Không thể tạo mã xác thực. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }, []);

  // Copy token to clipboard
  const handleCopyToken = useCallback(async () => {
    if (!token) return;

    try {
      await navigator.clipboard.writeText(token.token);
      setCopySuccess(true);
      toast.success("Đã sao chép mã xác thực!");

      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      toast.error("Không thể sao chép. Vui lòng copy thủ công!");
      setShowTokenModal(true);
    }
  }, [token]);

  // Start polling for connection status
  const startPolling = useCallback(() => {
    if (!token || polling) return;

    setPolling(true);
    const intervalId = setInterval(async () => {
      try {
        const response = await userTelegramService.checkLinked(token.token);
        const data = response.data as any;
        const isLinked = data?.Linked || data?.linked;

        if (response.status && isLinked) {
          setPolling(false);
          clearInterval(intervalId);
          setCurrentStep(3);
          toast.success("Liên kết Telegram thành công!");

          // Fetch updated account info
          const accountsResponse = await userTelegramService.getAllLinked();
          if (accountsResponse.status && accountsResponse.data?.length > 0) {
            const latestAccount =
              accountsResponse.data[accountsResponse.data.length - 1];
            onSuccess?.(latestAccount);
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, POLLING_INTERVAL);

    // Stop polling after 5 minutes
    setTimeout(() => {
      setPolling(false);
      clearInterval(intervalId);
    }, 300000);
  }, [token, polling, onSuccess]);

  // Open Telegram bot
  const handleOpenTelegram = useCallback(() => {
    const botUrl = `https://t.me/HiNET_Service_bot?start=${token?.token}`;
    window.open(botUrl, "_blank");
    setCurrentStep(2);
    startPolling();
 }, [token, startPolling]);

  

  // Retry generation
  const handleRetry = useCallback(() => {
    if (retryCount >= MAX_RETRIES) {
      toast.error("Đã vượt quá số lần thử. Vui lòng liên hệ hỗ trợ!");
      return;
    }

    setRetryCount((prev) => prev + 1);
    setCurrentStep(0);
    setToken(null);
    setError(null);
    handleGenerateToken();
  }, [retryCount, handleGenerateToken]);

  // Reset state
  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setToken(null);
    setError(null);
    setRetryCount(0);
    setPolling(false);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
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
                <SendOutlined className="mr-3 text-[#0088cc]" />
                Liên kết tài khoản Telegram
              </Title>
              <Text className="text-gray-600">
                Kết nối với Telegram để nhận thông báo từ hệ thống
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Steps Progress */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-md">
            <Title level={5} className="mb-4 text-[#2A5DA3]">
              Tiến trình liên kết
            </Title>
            <Steps
              direction="vertical"
              current={currentStep}
              className="telegram-steps"
            >
              {steps.map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  status={
                    index < currentStep
                      ? "finish"
                      : index === currentStep
                      ? "process"
                      : "wait"
                  }
                />
              ))}
            </Steps>
          </Card>
        </div>

        {/* Main Action Area */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md min-h-[400px]">
            {/* Step 0: Generate Token */}
            {currentStep === 0 && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SafetyCertificateOutlined className="text-2xl text-[#2A5DA3]" />
                  </div>
                  <Title level={4} className="mb-2">
                    Bắt đầu liên kết
                  </Title>
                  <Text className="text-gray-600">
                    Tạo mã xác thực để kết nối với bot Telegram
                  </Text>
                </div>

                {error && (
                  <div className="mb-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <ExclamationCircleOutlined className="text-red-500 mr-2" />
                        <Text className="text-red-600">{error}</Text>
                      </div>
                      {retryCount < MAX_RETRIES && (
                        <Button
                          type="link"
                          onClick={handleRetry}
                          className="p-0 mt-2 text-red-600"
                        >
                          Thử lại ({MAX_RETRIES - retryCount} lần còn lại)
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={handleGenerateToken}
                  className="bg-[#2A5DA3] hover:bg-blue-600 border-0 px-8 py-2 h-auto"
                  disabled={retryCount >= MAX_RETRIES}
                >
                  {loading ? "Đang tạo mã..." : "Tạo mã xác thực"}
                </Button>
              </div>
            )}

            {/* Step 1: Token Generated */}
            {currentStep === 1 && token && (
              <div className="py-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleOutlined className="text-2xl text-green-600" />
                  </div>
                  <Title level={4} className="mb-2">
                    Mã xác thực đã được tạo
                  </Title>
                  <Text className="text-gray-600">
                    Sao chép mã và mở Telegram để hoàn tất liên kết
                  </Text>
                </div>

                {/* Token Display */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Text strong className="text-[#2A5DA3]">
                      Mã xác thực của bạn:
                    </Text>
                    <Button
                      type="link"
                      icon={<InfoCircleOutlined />}
                      onClick={() => setShowTokenModal(true)}
                      className="text-gray-500"
                    >
                      Xem hướng dẫn
                    </Button>
                  </div>

                  <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
                    <div className="flex flex-col gap-3">
                      <div className="max-w-full overflow-hidden">
                        <code className="text-sm font-mono text-[#2A5DA3] font-bold break-all leading-relaxed block bg-blue-50 p-3 rounded border">
                          {token.token}
                        </code>
                      </div>
                      <div className="flex justify-center">
                        <Tooltip
                          title={copySuccess ? "Đã sao chép!" : "Sao chép mã"}
                        >
                          <Button
                            type="primary"
                            size="small"
                            icon={
                              copySuccess ? (
                                <CheckCircleOutlined />
                              ) : (
                                <CopyOutlined />
                              )
                            }
                            onClick={handleCopyToken}
                            className={`${
                              copySuccess
                                ? "bg-green-500 border-green-500"
                                : "bg-[#2A5DA3] border-[#2A5DA3]"
                            } hover:bg-blue-600`}
                          >
                            {copySuccess ? "Đã sao chép!" : "Sao chép"}
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  <div className="text-center space-y-4">
                    <Button
                      type="primary"
                      size="large"
                      icon={<SendOutlined />}
                      onClick={handleOpenTelegram}
                      className="bg-[#0088cc] hover:bg-[#006699] border-0 px-8"
                    >
                      Mở Telegram
                    </Button>

                    <div>
                      <Button
                        type="text"
                        onClick={handleCopyToken}
                        className="text-[#2A5DA3]"
                      >
                        Hoặc sao chép mã để dán thủ công
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Manual Instructions */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <Text strong className="text-[#2A5DA3] block mb-2">
                    Hướng dẫn thủ công:
                  </Text>
                  <ol className="text-sm text-gray-700 space-y-1 pl-4">
                    <li>1. Mở ứng dụng Telegram trên điện thoại/máy tính</li>
                    <li>
                      2. Tìm kiếm bot:{" "}
                      <code className="bg-white px-1 rounded">
                        @HiNET_Service_bot
                      </code>
                    </li>
                    <li>
                      3. Nhấn <strong>/start</strong> và dán mã xác thực
                    </li>
                    <li>4. Chờ hệ thống xác nhận kết nối</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Step 2: Waiting for Connection */}
            {currentStep === 2 && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {polling ? (
                        <Spin
                          indicator={
                            <ClockCircleOutlined
                              className="text-2xl text-yellow-600"
                              spin
                            />
                          }
                        />
                      ) : (
                        <ClockCircleOutlined className="text-2xl text-yellow-600" />
                      )}
                    </div>
                    {polling && (
                      <Badge
                        status="processing"
                        text="Đang kiểm tra..."
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                      />
                    )}
                  </div>
                  <Title level={4} className="mb-2">
                    Đang chờ kết nối
                  </Title>
                  <Text className="text-gray-600">
                    Vui lòng hoàn tất các bước trên Telegram
                  </Text>
                </div>

                <div className="space-y-4">
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleOpenTelegram}
                    className="bg-[#0088cc] hover:bg-[#006699] border-0"
                  >
                    Mở lại Telegram
                  </Button>

                  <div>
                    <Button
                      type="text"
                      onClick={handleReset}
                      className="text-gray-500"
                    >
                      Bắt đầu lại
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {currentStep === 3 && (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircleOutlined className="text-2xl text-green-600" />
                  </div>
                  <Title level={4} className="mb-2 text-green-600">
                    Liên kết thành công!
                  </Title>
                  <Text className="text-gray-600">
                    Tài khoản Telegram đã được liên kết với hệ thống
                  </Text>
                </div>

                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <SendOutlined className="text-green-600 text-xl mr-2" />
                    <Text strong className="text-green-700">
                      Telegram đã kết nối
                    </Text>
                  </div>
                  <Text className="text-green-600">
                    Bạn sẽ nhận được thông báo từ hệ thống qua Telegram
                  </Text>
                </div>

                <Button
                  type="primary"
                  onClick={onBack}
                  className="bg-[#2A5DA3] hover:bg-blue-600 border-0"
                >
                  Hoàn tất
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Token Manual Modal */}
      <Modal
        title="Hướng dẫn liên kết thủ công"
        open={showTokenModal}
        onCancel={() => setShowTokenModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowTokenModal(false)}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        <div className="space-y-4">
          <div>
            <Text strong>Mã xác thực:</Text>
            <div className="bg-gray-100 p-3 rounded mt-2">
              <code className="text-sm font-mono text-[#2A5DA3] break-all leading-relaxed block">
                {token?.token}
              </code>
            </div>
          </div>

          <div>
            <Text strong>Các bước thực hiện:</Text>
            <ol className="mt-2 space-y-2">
              <li>
                1. Mở Telegram và tìm kiếm <code>@HiNET_Service_bot</code>
              </li>
              <li>2. Nhấn vào bot và chọn START</li>
              <li>2. Nhấn vào bot và chọn START</li>
              <li>3. Gửi mã xác thực trên vào chat với bot</li>
              <li>4. Chờ bot xác nhận kết nối thành công</li>
            </ol>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .telegram-steps .ant-steps-item-icon {
          background: #f0f0f0;
          border-color: #d9d9d9;
        }

        .telegram-steps .ant-steps-item-process .ant-steps-item-icon {
          background: #2a5da3;
          border-color: #2a5da3;
        }

        .telegram-steps .ant-steps-item-finish .ant-steps-item-icon {
          background: #52c41a;
          border-color: #52c41a;
        }

        .telegram-steps .ant-steps-item-title {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default TelegramLinkingInterface;

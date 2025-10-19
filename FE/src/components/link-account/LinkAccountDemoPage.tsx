"use client";
import React from "react";
import { Card } from "antd";
import { LinkAccountInterface } from "@/components/link-account";

const LinkAccountDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <Card className="border-0 shadow-sm mb-6">
          <div className="text-center py-4">
            <h1 className="text-2xl font-bold text-[#2A5DA3] mb-2">
              Demo: Giao diện Liên kết Tài khoản
            </h1>
            <p className="text-gray-600">
              Thiết kế UI/UX chuyên nghiệp cho chức năng liên kết tài khoản
              Telegram
            </p>
          </div>
        </Card>

        <LinkAccountInterface />
      </div>
    </div>
  );
};

export default LinkAccountDemoPage;

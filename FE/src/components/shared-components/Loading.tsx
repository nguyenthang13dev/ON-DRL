import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";

const Icon = <LoadingOutlined style={{ fontSize: 35 }} spin />;

interface LoadingProps {
  content?: "content" | "page" | "inline";
  size?: "small" | "default" | "large";
  spinning?: boolean;
  children?: React.ReactNode;
  tip?: string;
}

interface LoadingWrapperProps {
  children?: React.ReactNode;
  spinning?: boolean;
  size?: "small" | "default" | "large";
  tip?: string;
  indicator?: React.ReactElement;
}

// Component wrapper cho Spin loading
export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  children,
  spinning = false,
  size = "default",
  tip,
  indicator
}) => {
  const getIconSize = () => {
    switch (size) {
      case "small": return 16;
      case "large": return 32;
      default: return 24;
    }
  };

  const defaultIndicator = indicator || <LoadingOutlined style={{ fontSize: getIconSize() }} spin />;

  return (
    <Spin 
      spinning={spinning} 
      indicator={defaultIndicator}
      tip={tip}
      size={size}
    >
      {children}
    </Spin>
  );
};

const Loading: React.FC<LoadingProps> = ({ 
  content = "content", 
  size = "default" 
}) => {
  const LoadingContainer = styled("div")`
    ${content === "content"
      ? `
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        `
      : ""}

    ${content === "page"
      ? `
            position: fixed;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            background: rgba(255, 255, 255, 0.8);
        `
      : ""}

    ${content === "inline"
      ? `
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `
      : ""}
  `;

  const getIconSize = () => {
    switch (size) {
      case "small": return 20;
      case "large": return 50;
      default: return 35;
    }
  };

  const icon = <LoadingOutlined style={{ fontSize: getIconSize() }} spin />;

  return (
    <LoadingContainer className="text-center">
      <Spin indicator={icon} />
    </LoadingContainer>
  );
};

export default Loading;

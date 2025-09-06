import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Space, Typography, Modal, message } from "antd";
import {
  EyeOutlined,
  SettingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface WordPreviewProps {
  htmlPreview: string;
  keys: string[];
  onKeyClick?: (key: string) => void;
  onSettingsClick?: () => void;
  fileName?: string;
}

interface KeyPosition {
  key: string;
  position: number;
  element?: HTMLElement;
}

const WordPreview: React.FC<WordPreviewProps> = ({
  htmlPreview,
  keys,
  onKeyClick,
  onSettingsClick,
  fileName,
}) => {
  const [keyPositions, setKeyPositions] = useState<KeyPosition[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (htmlPreview && previewRef.current) {
      // Set HTML content
      previewRef.current.innerHTML = htmlPreview;

      // Find and highlight keys
      highlightKeys();
    }
  }, [htmlPreview, keys]);

  const highlightKeys = () => {
    if (!previewRef.current || !keys.length) return;

    const positions: KeyPosition[] = [];
    const walker = document.createTreeWalker(
      previewRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node: Node | null;
    while ((node = walker.nextNode())) {
      const text = node.textContent || "";

      // Find all keys in format [key] in this text node
      keys.forEach((key) => {
        const regex = new RegExp(`\\[${key}\\]`, "gi");
        const matches = [...text.matchAll(regex)];

        matches.forEach((match) => {
          if (match.index !== undefined) {
            positions.push({
              key,
              position: match.index,
              element: node?.parentElement || undefined,
            });
          }
        });
      });
    }

    // Highlight keys in HTML
    highlightKeysInHTML();
    setKeyPositions(positions);
  };

  const highlightKeysInHTML = () => {
    if (!previewRef.current) return;

    let html = previewRef.current.innerHTML;

    keys.forEach((key) => {
      const regex = new RegExp(`\\[${key}\\]`, "gi");
      html = html.replace(regex, (match) => {
        return `<span class="word-key-highlight" data-key="${key}" style="
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 3px;
          padding: 2px 4px;
          margin: 0 1px;
          cursor: pointer;
          position: relative;
          display: inline-block;
        ">${match}</span>`;
      });
    });

    previewRef.current.innerHTML = html;

    // Add click event listeners to highlighted keys
    const highlightedKeys = previewRef.current.querySelectorAll(
      ".word-key-highlight"
    );
    highlightedKeys.forEach((element: any) => {
      element.addEventListener("click", (e: any) => {
        e.preventDefault();
        const key = element.getAttribute("data-key");
        if (key) {
          setSelectedKey(key);
          onKeyClick?.(key);
        }
      });

      // Add hover effect
      element.addEventListener("mouseenter", () => {
        element.style.backgroundColor = "#ffeaa7";
        element.style.borderColor = "#fdcb6e";
      });

      element.addEventListener("mouseleave", () => {
        element.style.backgroundColor = "#fff3cd";
        element.style.borderColor = "#ffeaa7";
      });
    });
  };

  const handleKeyClick = (key: string) => {
    setSelectedKey(key);
    onKeyClick?.(key);
  };

  const handleSettingsClick = () => {
    onSettingsClick?.();
  };

  const refreshPreview = () => {
    if (previewRef.current) {
      previewRef.current.innerHTML = htmlPreview;
      highlightKeys();
    }
  };

  return (
    <Card
      title={
        <Space>
          <EyeOutlined style={{ color: "#1890ff" }} />
          <span>Preview File Word</span>
          {fileName && <Text type="secondary">({fileName})</Text>}
        </Space>
      }
      extra={
        <Space>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={refreshPreview}
            size="small"
            title="Làm mới preview"
          />
          <Button
            type="primary"
            icon={<SettingOutlined />}
            onClick={handleSettingsClick}
            size="small"
          >
            Cấu hình
          </Button>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <div style={{ marginBottom: 12 }}>
        <Text type="secondary">
          Tìm thấy {keys.length} key có thể cấu hình. Click vào key được
          highlight để cấu hình hoặc bấm nút Cấu hình.
        </Text>
      </div>

      <div
        ref={previewRef}
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: "6px",
          padding: "16px",
          backgroundColor: "#fff",
          minHeight: "300px",
          maxHeight: "500px",
          overflow: "auto",
          lineHeight: "1.6",
          fontSize: "14px",
        }}
        className="word-preview-content"
      />

      {keys.length > 0 && (
        <div
          style={{
            marginTop: 12,
            padding: "8px 12px",
            backgroundColor: "#f0f2f5",
            borderRadius: "4px",
          }}
        >
          <Text strong style={{ fontSize: "12px" }}>
            Danh sách key:{" "}
          </Text>
          <Space wrap>
            {keys.map((key, index) => (
              <Button
                key={index}
                type={selectedKey === key ? "primary" : "default"}
                size="small"
                onClick={() => handleKeyClick(key)}
                style={{ fontSize: "11px" }}
              >
                [{key}]
              </Button>
            ))}
          </Space>
        </div>
      )}
    </Card>
  );
};

export default WordPreview;

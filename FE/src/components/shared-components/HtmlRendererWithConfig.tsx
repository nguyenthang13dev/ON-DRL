import React, { useMemo } from "react";
import { SettingFilled } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import parse from "html-react-parser";

interface FieldConfig {
    type?: string;
    required?: boolean;
    min?: number;
    max?: number;
    options?: string;
    [key: string]: any;
}

interface HtmlRendererWithConfigProps {
    html: string;
    onFieldClick?: (field: string) => void;
    fieldConfig?: Record<string, FieldConfig>;
    showConfigButtons?: boolean;
    showFieldHighlights?: boolean;
    buttonStyle?: "button" | "highlight" | "both";
}

const HtmlRendererWithConfig: React.FC<HtmlRendererWithConfigProps> = ({
    html,
    onFieldClick,
    fieldConfig = {},
    showConfigButtons = true,
    showFieldHighlights = true,
    buttonStyle = "both",
}) => {
    const processedHtml = useMemo(() => {
        let processed = html;

        // Handle [[field]] pattern - replace with config buttons
        if (
            showConfigButtons &&
            (buttonStyle === "button" || buttonStyle === "both")
        ) {
            processed = processed.replace(
                /\[\[([^\]]+)\]\]/g,
                (match, field) => {
                    const config = fieldConfig[field];
                    const isConfigured = !!config;

                    return `<span class="config-btn" data-field="${field}" data-configured="${isConfigured}" style="
          display: inline-block;
          margin: 0 2px;
          vertical-align: middle;
        ">
          <button type="button" style="
            background: ${isConfigured ? "#f6ffed" : "#f0f0f0"};
            border: 1px solid ${isConfigured ? "#b7eb8f" : "#d9d9d9"};
            border-radius: 4px;
            padding: 2px 8px;
            cursor: pointer;
            font-size: 12px;
            color: ${isConfigured ? "#52c41a" : "#1890ff"};
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s;
            font-weight: ${isConfigured ? "500" : "normal"};
          " onmouseover="this.style.background='${
              isConfigured ? "#d9f7be" : "#e6f7ff"
          }'; this.style.borderColor='${isConfigured ? "#95de64" : "#91d5ff"}'" 
             onmouseout="this.style.background='${
                 isConfigured ? "#f6ffed" : "#f0f0f0"
             }'; this.style.borderColor='${
                        isConfigured ? "#b7eb8f" : "#d9d9d9"
                    }'">
            <span>${isConfigured ? "✅" : "⚙️"}</span>
            <span>${field}</span>
          </button>
        </span>`;
                },
            );
        }

        // Handle [field] pattern - replace with highlighted text
        if (
            showFieldHighlights &&
            (buttonStyle === "highlight" || buttonStyle === "both")
        ) {
            processed = processed.replace(/\[([^\]]+)\]/g, (match, field) => {
                const config = fieldConfig[field];
                const isConfigured = !!config;

                return `<span class="field-highlight" data-field="${field}" data-configured="${isConfigured}" style="
          background-color: ${isConfigured ? "#d4edda" : "#fff3cd"};
          border: 1px solid ${isConfigured ? "#c3e6cb" : "#ffeaa7"};
          border-radius: 3px;
          padding: 2px 6px;
          margin: 0 1px;
          cursor: pointer;
          position: relative;
          display: inline-block;
          font-size: 12px;
          color: ${isConfigured ? "#155724" : "#856404"};
          transition: all 0.2s;
          font-weight: ${isConfigured ? "500" : "normal"};
        " onmouseover="this.style.backgroundColor='${
            isConfigured ? "#c3e6cb" : "#ffeaa7"
        }'; this.style.borderColor='${isConfigured ? "#b8dacc" : "#fdcb6e"}'" 
           onmouseout="this.style.backgroundColor='${
               isConfigured ? "#d4edda" : "#fff3cd"
           }'; this.style.borderColor='${
                    isConfigured ? "#c3e6cb" : "#ffeaa7"
                }'">
          <span style="margin-right: 4px;">${isConfigured ? "✅" : "⚙️"}</span>
          <span>${field}</span>
        </span>`;
            });
        }

        return processed;
    }, [
        html,
        fieldConfig,
        showConfigButtons,
        showFieldHighlights,
        buttonStyle,
    ]);

    const parsedContent = useMemo(() => {
        return parse(processedHtml, {
            replace: (domNode: any) => {
                // Handle config buttons
                if (
                    domNode.type === "tag" &&
                    domNode.name === "span" &&
                    domNode.attribs?.["class"] === "config-btn"
                ) {
                    const field = domNode.attribs["data-field"];
                    const isConfigured =
                        domNode.attribs["data-configured"] === "true";
                    const config = fieldConfig[field];

                    return (
                        <Tooltip
                            title={
                                <div>
                                    <div>
                                        <strong>Trường:</strong> {field}
                                    </div>
                                    <div>
                                        <strong>Trạng thái:</strong>{" "}
                                        {isConfigured
                                            ? "Đã cấu hình"
                                            : "Chưa cấu hình"}
                                    </div>
                                    {config && (
                                        <div>
                                            <div>
                                                <strong>Loại:</strong>{" "}
                                                {config.type || "text"}
                                            </div>
                                            {config.required && (
                                                <div>
                                                    <strong>Bắt buộc:</strong>{" "}
                                                    Có
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            }
                        >
                            <Button
                                size="small"
                                type={isConfigured ? "primary" : "default"}
                                icon={<SettingFilled />}
                                onClick={() => onFieldClick?.(field)}
                                style={{
                                    margin: "0 2px",
                                    verticalAlign: "middle",
                                    fontSize: "12px",
                                    height: "24px",
                                    padding: "0 8px",
                                    fontWeight: isConfigured ? "500" : "normal",
                                }}
                            >
                                {field}
                            </Button>
                        </Tooltip>
                    );
                }

                // Handle field highlights
                if (
                    domNode.type === "tag" &&
                    domNode.name === "span" &&
                    domNode.attribs?.["class"] === "field-highlight"
                ) {
                    const field = domNode.attribs["data-field"];
                    const isConfigured =
                        domNode.attribs["data-configured"] === "true";
                    const config = fieldConfig[field];

                    return (
                        <Tooltip
                            title={
                                <div>
                                    <div>
                                        <strong>Trường:</strong> {field}
                                    </div>
                                    <div>
                                        <strong>Trạng thái:</strong>{" "}
                                        {isConfigured
                                            ? "Đã cấu hình"
                                            : "Chưa cấu hình"}
                                    </div>
                                    {config && (
                                        <div>
                                            <div>
                                                <strong>Loại:</strong>{" "}
                                                {config.type || "text"}
                                            </div>
                                            {config.required && (
                                                <div>
                                                    <strong>Bắt buộc:</strong>{" "}
                                                    Có
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            }
                        >
                            <span
                                style={{
                                    backgroundColor: isConfigured
                                        ? "#d4edda"
                                        : "#fff3cd",
                                    border: `1px solid ${
                                        isConfigured ? "#c3e6cb" : "#ffeaa7"
                                    }`,
                                    borderRadius: "3px",
                                    padding: "2px 6px",
                                    margin: "0 1px",
                                    cursor: "pointer",
                                    position: "relative",
                                    display: "inline-block",
                                    fontSize: "12px",
                                    color: isConfigured ? "#155724" : "#856404",
                                    transition: "all 0.2s",
                                    fontWeight: isConfigured ? "500" : "normal",
                                }}
                                onClick={() => onFieldClick?.(field)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        isConfigured ? "#c3e6cb" : "#ffeaa7";
                                    e.currentTarget.style.borderColor =
                                        isConfigured ? "#b8dacc" : "#fdcb6e";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        isConfigured ? "#d4edda" : "#fff3cd";
                                    e.currentTarget.style.borderColor =
                                        isConfigured ? "#c3e6cb" : "#ffeaa7";
                                }}
                            >
                                <span style={{ marginRight: "4px" }}>
                                    {isConfigured ? "✅" : "⚙️"}
                                </span>
                                <span>{field}</span>
                            </span>
                        </Tooltip>
                    );
                }
            },
        });
    }, [processedHtml, fieldConfig, onFieldClick]);

    return <>{parsedContent}</>;
};

export default HtmlRendererWithConfig;

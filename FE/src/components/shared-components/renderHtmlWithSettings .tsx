import { SettingFilled } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import parse, { domToReact } from "html-react-parser";
import React from "react";

interface RenderHtmlWithSettingsProps {
    html: string;
    onFieldClick?: (field: string) => void;
    fieldConfig?: Record<string, any>;
}

const renderHtmlWithSettings = (
    html: string,
    onFieldClick?: (field: string) => void,
    fieldConfig?: Record<string, any>,
) => {
    // Thêm wrapper div để đảm bảo không phá vỡ layout
    const wrappedHtml = `<div class="html-wrapper">${html}</div>`;

    // Pre-process HTML to handle multiple patterns
    const processedHtml = wrappedHtml
        // Handle [[field]] pattern - replace with inline button
        .replace(/\[\[([^\]]+)\]\]/g, (match, field) => {
            return `<span class="setting-btn" data-field="${field}" style="
        display: inline-block;
        margin: 0 2px;
        vertical-align: middle;
      ">
        <button type="button" style="
          background: #f0f0f0;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          padding: 2px 6px;
          cursor: pointer;
          font-size: 12px;
          color: #1890ff;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
          max-width: 200px;
        " onmouseover="this.style.background='#e6f7ff'; this.style.borderColor='#91d5ff'" 
           onmouseout="this.style.background='#f0f0f0'; this.style.borderColor='#d9d9d9'">
          <span>⚙️</span>
          <span>${field}</span>
        </button>
      </span>`;
        })
        // Handle [field] pattern - replace with highlighted text
        .replace(/\[([^\]]+)\]/g, (match, field) => {
            const config = fieldConfig?.[field];
            const configIcon = config ? "✅" : "⚙️";
            return `<span class="field-highlight" data-field="${field}" style="
        background-color: ${config ? "#d4edda" : "#fff3cd"};
        border: 1px solid ${config ? "#c3e6cb" : "#ffeaa7"};
        border-radius: 3px;
        padding: 2px 6px;
        margin: 0 1px;
        cursor: pointer;
        position: relative;
        display: inline-block;
        font-size: 12px;
        color: ${config ? "#155724" : "#856404"};
        transition: all 0.2s;
        max-width: 200px;
        word-break: break-word;
      " onmouseover="this.style.backgroundColor='${
          config ? "#c3e6cb" : "#ffeaa7"
      }'; this.style.borderColor='${config ? "#b8dacc" : "#fdcb6e"}'" 
         onmouseout="this.style.backgroundColor='${
             config ? "#d4edda" : "#fff3cd"
         }'; this.style.borderColor='${config ? "#c3e6cb" : "#ffeaa7"}'">
        <span style="margin-right: 4px;">${configIcon}</span>
        <span>${field}</span>
      </span>`;
        });

    const options = {
        replace: (domNode: any) => {
            // Handle wrapper div
            if (
                domNode.type === "tag" &&
                domNode.name === "div" &&
                domNode.attribs?.["class"] === "html-wrapper"
            ) {
                // Convert parsed children using the same options so nested nodes get handlers
                return (
                    <>{domToReact(domNode.children as any, options as any)}</>
                );
            }

            // Handle setting buttons
            if (
                domNode.type === "tag" &&
                domNode.name === "span" &&
                domNode.attribs?.["class"] === "setting-btn"
            ) {
                const field = domNode.attribs["data-field"];
                const config = fieldConfig?.[field];

                return (
                    <Tooltip
                        title={`Cấu hình trường: ${field}${
                            config ? " (Đã cấu hình)" : ""
                        }`}
                    >
                        <Button
                            size="small"
                            type={config ? "primary" : "default"}
                            icon={<SettingFilled />}
                            onClick={() => onFieldClick?.(field)}
                            style={{
                                margin: "0 2px",
                                verticalAlign: "middle",
                                fontSize: "12px",
                                height: "24px",
                                padding: "0 8px",
                                maxWidth: "200px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
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
                const config = fieldConfig?.[field];

                return (
                    <Tooltip
                        title={`Trường: ${field}${
                            config ? " (Đã cấu hình)" : " (Chưa cấu hình)"
                        }`}
                    >
                        <span
                            style={{
                                backgroundColor: config ? "#d4edda" : "#fff3cd",
                                border: `1px solid ${
                                    config ? "#c3e6cb" : "#ffeaa7"
                                }`,
                                borderRadius: "3px",
                                padding: "2px 6px",
                                margin: "0 1px",
                                cursor: "pointer",
                                position: "relative",
                                display: "inline-block",
                                fontSize: "12px",
                                color: config ? "#155724" : "#856404",
                                transition: "all 0.2s",
                                maxWidth: "200px",
                                wordBreak: "break-word",
                            }}
                            onClick={() => onFieldClick?.(field)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = config
                                    ? "#c3e6cb"
                                    : "#ffeaa7";
                                e.currentTarget.style.borderColor = config
                                    ? "#b8dacc"
                                    : "#fdcb6e";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = config
                                    ? "#d4edda"
                                    : "#fff3cd";
                                e.currentTarget.style.borderColor = config
                                    ? "#c3e6cb"
                                    : "#ffeaa7";
                            }}
                        >
                            <span style={{ marginRight: "4px" }}>
                                {config ? "✅" : "⚙️"}
                            </span>
                            <span>{field}</span>
                        </span>
                    </Tooltip>
                );
            }
        },
    } as const;

    return parse(processedHtml, options as any);
};

// Safe render component
const RenderHtmlWithSettings: React.FC<RenderHtmlWithSettingsProps> = ({
    html,
    onFieldClick,
    fieldConfig,
}) => {
    return (
        <div className="safe-html-renderer" style={{ width: "100%" }}>
            {renderHtmlWithSettings(html, onFieldClick, fieldConfig)}
        </div>
    );
};
export default RenderHtmlWithSettings;

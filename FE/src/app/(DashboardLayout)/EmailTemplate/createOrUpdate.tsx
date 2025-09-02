"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Form,
  Input,
  Modal,
  Switch,
  Tabs,
  Card,
  Row,
  Col,
  Space,
  Button,
  Typography,
  Tooltip,
  Select,
  Tag,
  Alert,
  Badge
} from "antd";
import { EmailTemplateCreateOrUpdateType, EmailTemplateType } from "@/types/emailTemplate/EmailTemplate";
import emailTemplateService from "@/services/emailTemplate/EmailTemplateService";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  EditOutlined,
  EyeOutlined,
  CodeOutlined,
  InfoCircleOutlined,
  SaveOutlined,
  CloseOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  KeyOutlined
} from "@ant-design/icons";
import { toast } from "react-toastify";
const { Title } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

// Import CSS styles
import styles from './EmailTemplateForm.module.css';

// Interfaces
interface Props {
  item?: EmailTemplateType | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Sample HTML Template
const SAMPLE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #1890ff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 10px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{title}}</h1>
        </div>
        <div class="content">
            <p>Xin chào {{name}},</p>
            <p>{{message}}</p>
            <p>Trân trọng,<br>{{company}}</p>
        </div>
        <div class="footer">
            <p>&copy; {{year}} {{company}}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

const SPECIAL_VARS = ["TenUngVien", "ViTri", "ThoiGianPhongVan", "NamHienTai"];

const SYSTEM_VARS = [
  { key: 'TenUngVien', label: 'Tên ứng viên' },
  { key: 'ViTri', label: 'Vị trí ứng tuyển' },
  { key: 'ThoiGianPhongVan', label: 'Thời gian phỏng vấn' },
  { key: 'NamHienTai', label: 'Năm hiện tại' },
];

const CreateOrUpdate: React.FC<Props> = ({ item, onClose, onSuccess }) => {
  // Form and basic state
  const [form] = Form.useForm<EmailTemplateCreateOrUpdateType>();
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Code editor state
  const [content, setContent] = useState<string>(item?.content || SAMPLE_TEMPLATE);
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');

  const [previewContent, setPreviewContent] = useState('');

  // Initialize form data
  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        code: item.code,
        name: item.name,
        description: item.description
      });
      setContent(item.content);
    }
  }, [item, form]);

  // Extract variables from content
  const extractedVariables = useMemo(() => {
    const regex = /\{\{(\w+)\}\}/g;
    const variables = new Set<string>();
    let match;

    while ((match = regex.exec(content)) !== null) {
      variables.add(match[1]);
    }

    return Array.from(variables);
  }, [content]);

  // Generate preview content
  const generatePreview = useCallback(() => {
    let preview = content;
    // Replace any remaining variables with placeholder
    const remainingVars = preview.match(/\{\{\w+\}\}/g);
    if (remainingVars) {
      remainingVars.forEach(variable => {
        preview = preview.replace(new RegExp(variable.replace(/[{}]/g, '\\$&'), 'g'),
          `<span style="background: #ffeb3b; padding: 2px 4px; border-radius: 3px;">${variable}</span>`);
      });
    }

    setPreviewContent(preview);
  }, [content]); // XÓA

  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  useEffect(() => {
    if (!item) return;

    form.setFieldsValue({
      code: item.code,
      name: item.name,
      description: item.description
    });
    setContent(item.content);

    // Quét biến động từ content
    const regex = /\{\{([a-zA-Z0-9_]+)\}\}/g;
    const foundVars = new Set<string>();
    let match;
    while ((match = regex.exec(item.content))) {
      foundVars.add(match[1]);
    }

    // Map value từ lstKeyEmailTemplate nếu có, nếu không thì rỗng
    const mappedVars: Record<string, string> = {};
    foundVars.forEach(key => {
      let value = '';
      if (Array.isArray(item.lstKeyEmailTemplate)) {
        const found = item.lstKeyEmailTemplate.find(v => v.key === key);
        value = found && found.value != null ? found.value : '';
      }
      mappedVars[key] = value;
    });
    setVariableValues(mappedVars);
  }, [item, form]);

  // Tạo danh sách biến động thực tế (không gồm biến hệ thống)
  const dynamicVariables = useMemo(() =>
    extractedVariables.filter(v => !SPECIAL_VARS.includes(v)),
    [extractedVariables]
  );

  // State cho value của biến động
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // State cho loại template
  const [templateTypes, setTemplateTypes] = useState<{ label: string; value: string }[]>([]);
  const [templateTypeLoading, setTemplateTypeLoading] = useState(false);

  // Fetch loại template khi mở component
  useEffect(() => {
    const fetchTemplateTypes = async () => {
      setTemplateTypeLoading(true);
      try {
        const res = await emailTemplateService.getAllLoaiTemplate();
        if (res.status && Array.isArray(res.data)) {
          setTemplateTypes(res.data.map((item: any) => ({ label: item.name || item.code, value: item.code })));
        } else {
          setTemplateTypes([]);
        }
      } catch {
        setTemplateTypes([]);
      } finally {
        setTemplateTypeLoading(false);
      }
    };
    fetchTemplateTypes();
  }, []);

  // Khi mở modal sửa, set đúng loại template vào form
  useEffect(() => {
    if (item) {
      form.setFieldsValue({
        code: item.code,
        name: item.name,
        description: item.description,
        loaiTemPlate: item.loaiTemPlate || undefined
      });
      setContent(item.content);
    }
  }, [item, form]);

  // Submit function
  const handleFinish = async (values: EmailTemplateCreateOrUpdateType) => {
    setSaving(true);
    try {
      // Đảm bảo lstKeyEmailTemplate luôn chứa tất cả dynamicVariables
      const lstKeyEmailTemplate: Record<string, string> = {};
      dynamicVariables.forEach(key => {
        lstKeyEmailTemplate[key] = variableValues[key] || "";
      });
      const submitData = {
        ...values,
        content,
        lstKeyEmailTemplate
      };

      let res;
      if (item) {
        res = await emailTemplateService.update({ ...submitData, id: item.id });
      } else {
        res = await emailTemplateService.create(submitData);
      }

      if (res.status) {
        toast.success(item ? "Cập nhật thành công" : "Thêm mới thành công");
        onSuccess();
        onClose();
        form.resetFields();
      } else {
        toast.error(res.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xử lý yêu cầu");
    } finally {
      setSaving(false);
    }
  };

  // Insert variable into editor
  const insertVariable = useCallback((variable: string) => {
    const newContent = content + `{{${variable}}}`;
    setContent(newContent);
  }, [content]);

  // Copy template to clipboard
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(content);
    toast.success('Đã copy template vào clipboard');
  }, [content]);

  // Render Basic Info Tab
  const renderBasicInfo = () => (
    <Card className={styles.formCard} style={{ margin: '16px 0' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
        size="large"
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Mã template"
              name="code"
              rules={[{ required: true, message: "Vui lòng nhập mã template" }]}
            >
              <Input
                placeholder="Nhập mã template"
                prefix={<CodeOutlined style={{ color: '#bfbfbf' }} />}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Tên template"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên template" }]}
            >
              <Input
                placeholder="Nhập tên template"
                prefix={<FileTextOutlined style={{ color: '#bfbfbf' }} />}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Loại template"
          name="loaiTemPlate"
          rules={[{ required: true, message: "Vui lòng chọn loại template" }]}
        >
          <Select
            placeholder="Chọn loại template"
            loading={templateTypeLoading}
            options={templateTypes}
            showSearch
            optionFilterProp="label"
            allowClear
          />
        </Form.Item>
        {/* XÓA trường Trạng thái */}
        <Form.Item
          label="Mô tả template"
          name="description"
        >
          <TextArea
            placeholder="Nhập mô tả cho template này..."
            rows={3}
            showCount
            maxLength={500}
          />
        </Form.Item>
      </Form>
    </Card>
  );

  // Render Code Editor Tab
  const renderCodeEditor = () => (
    <Card className={styles.formCard} style={{ margin: '16px 0' }}>
      <div style={{ marginBottom: 16 }}>
        <Alert
          message="Sử dụng {{variableName}} để chèn biến động vào template"
          type="info"
          showIcon
          icon={<BulbOutlined />}
          style={{ marginBottom: 12 }}
        />
        <div style={{ marginBottom: 8 }}>
          <b>Các biến hệ thống có thể sử dụng:</b>
          <div style={{ marginTop: 4 }}>
            {SYSTEM_VARS.map((v: { key: string; label: string }) => (
              <Tag color="geekblue" key={v.key} style={{ marginBottom: 4 }}>
                {'{{' + v.key + '}}'} <span style={{ fontSize: 12, color: '#888' }}>– {v.label}</span>
              </Tag>
            ))}
          </div>
          <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
            Các biến này sẽ được tự động truyền khi gửi mail.
          </div>
        </div>
      </div>
      <Row gutter={24}>
        <Col xs={24} lg={12}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Title level={5} style={{ margin: 0 }}>
              <CodeOutlined /> Code Editor
            </Title>
            <Select
              value={editorTheme}
              onChange={setEditorTheme}
              size="small"
              style={{ width: 110 }}
              options={[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' }
              ]}
            />
          </div>
          <CodeMirror
            value={content}
            onChange={setContent}
            extensions={[html(), css(), javascript()]}
            theme={editorTheme === 'dark' ? oneDark : undefined}
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              fontSize: '14px',
              maxHeight: '950px',
              overflow: 'auto'
            }}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: false
            }}
          />
        </Col>
        <Col xs={24} lg={12}>
          <Title level={5}>
            <EyeOutlined /> Live Preview
          </Title>
          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              minHeight: '400px',
              overflow: 'auto',
              backgroundColor: '#fff',
              width: '100%',
              margin: 0
            }}
          >
            {previewContent ? (
              <iframe
                title="Email Template Preview"
                style={{
                  width: '100%',
                  minHeight: 950,
                  border: 'none',
                  background: 'white',
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
                srcDoc={previewContent}
              />
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#999'
              }}>
                <EyeOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                <div>Preview sẽ hiển thị ở đây</div>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );

  // Render Variables Tab
  const renderVariables = () => (
    <Card className={styles.formCard} style={{ margin: '16px 0' }}>
      <Row gutter={24}>
        {/* Cột trái: Biến động */}
        <Col xs={24} md={12}>
          <Title level={5}>
            <KeyOutlined /> Danh sách biến động
          </Title>
          {dynamicVariables.length === 0 ? (
            <Alert
              message="Không có biến động nào trong template."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {dynamicVariables.map(key => {
                const value = variableValues[key] || '';
                const isFilled = !!value.trim();
                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Tag color="green" style={{ minWidth: 110, textAlign: 'center' }}>{`{{${key}}}`}</Tag>
                    <Input
                      value={value}
                      onChange={e => setVariableValues(prev => ({ ...prev, [key]: e.target.value }))}
                      size="small"
                      placeholder="Giá trị mặc định"
                      style={{ flex: 1 }}
                    />
                    {isFilled ? (
                      <Tooltip title="Đã nhập giá trị mặc định">
                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Chưa nhập giá trị mặc định">
                        <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 18 }} />
                      </Tooltip>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Col>
        {/* Cột phải: Tất cả biến tìm thấy */}
        <Col xs={24} md={12}>
          <Title level={5}>Tất cả biến trong template</Title>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {extractedVariables.map(variable =>
              SPECIAL_VARS.includes(variable) ? (
                <Tooltip key={variable} title="Biến hệ thống – sẽ được tự động thay thế khi gửi mail">
                  <Tag color="geekblue">{`{{${variable}}}`} <span style={{ fontSize: 12 }}>(hệ thống)</span></Tag>
                </Tooltip>
              ) : (
                <Tag
                  key={variable}
                  color={variableValues[variable]?.trim() ? 'green' : 'orange'}
                  style={{ fontWeight: 500 }}
                >
                  {`{{${variable}}}`}
                  {variableValues[variable]?.trim() ? (
                    <CheckCircleOutlined style={{ marginLeft: 4, color: '#52c41a' }} />
                  ) : (
                    <ExclamationCircleOutlined style={{ marginLeft: 4, color: '#faad14' }} />
                  )}
                </Tag>
              )
            )}
          </div>
          <div style={{ color: '#888', fontSize: 13, marginTop: 8 }}>
            Biến hệ thống sẽ được truyền tự động khi gửi mail.<br />Biến động cần nhập giá trị mặc định nếu muốn hiển thị trong preview hoặc gửi mail.
          </div>
        </Col>
      </Row>
    </Card>
  );

  // Main render
  return (
    <Modal
      className={styles.emailTemplateModal}
      title={
        <Space>
          <EditOutlined />
          <span>{item ? "Cập nhật Email Template" : "Tạo Email Template mới"}</span>
        </Space>
      }
      open={true}
      onCancel={onClose}
      width="95%"
      style={{ top: 20 }}
      footer={
        <div className={styles.modalFooter}>
          <div className={styles.footerActions}>
            <Button
              icon={<CloseOutlined />}
              onClick={onClose}
            >
              Hủy
            </Button>

            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={saving}
              disabled={!content.trim()}
            >
              {item ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </div>
      }
    >
      <Tabs
        className={styles.modernTabs}
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        size="large"
        items={[
          {
            key: 'basic',
            label: (
              <Space>
                <InfoCircleOutlined />
                <span>Thông tin cơ bản</span>
              </Space>
            ),
            children: renderBasicInfo()
          },
          {
            key: 'editor',
            label: (
              <Space>
                <CodeOutlined />
                <span>Code Editor</span>
              </Space>
            ),
            children: renderCodeEditor()
          },
          {
            key: 'variables',
            label: (
              <Space>
                <KeyOutlined />
                <span>Biến động</span>
                {dynamicVariables.length > 0 && (
                  <Badge count={dynamicVariables.length} size="small" />
                )}
              </Space>
            ),
            children: renderVariables()
          }
        ]}
      />
    </Modal>
  );
};

export default CreateOrUpdate;

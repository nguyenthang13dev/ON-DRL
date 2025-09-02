import React from "react";
import { Modal, Descriptions, Tag } from "antd";
import { TemplateTestCase } from "@/types/templateTestCase/templateTestCase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data?: TemplateTestCase | null;
}

const TemplateTestCaseDetail: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!data) return null;
 

  console.log("data templateTestCaseDetail", data); 
  const renderKeywords = (keywords: string) => {
    const keywordList = keywords?.split(',').map(k => k.trim()).filter(k => k);
    return (
      <div>
        {keywordList?.map((keyword, index) => (
          <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
            {keyword}
          </Tag>
        ))}
      </div>
    );
  };

  const renderTemplateContent = (content: string) => {
    return (
      <div 
        style={{ 
          whiteSpace: 'pre-wrap', 
          backgroundColor: '#f5f5f5', 
          padding: '12px', 
          borderRadius: '4px',
          border: '1px solid #d9d9d9'
        }}
      >
        {content}
      </div>
    );
  };

  return (
    <Modal
      title="Chi tiết Template Test Case"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions
        bordered
        column={1}
        size="middle"
        labelStyle={{ fontWeight: "bold", width: "20%" }}
      >
        <Descriptions.Item label="Tên Template">
          <strong style={{ fontSize: "16px", color: "#1890ff" }}>
            {data.templateName}
          </strong>
        </Descriptions.Item>

        <Descriptions.Item label="Từ khóa">
          {renderKeywords(data.keyWord)}
        </Descriptions.Item>

        <Descriptions.Item label="Nội dung Template">
          {renderTemplateContent(data.templateContent)}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '4px' }}>
        <h4 style={{ color: '#0369a1', marginBottom: '8px' }}>Hướng dẫn sử dụng:</h4>
        <p style={{ marginBottom: '4px' }}>
          <strong>Các key cho trước:</strong> {"{TenUseCase}"}, {"{TenChucNang}"}, {"{TacNhan}"}, {"{HanhDong}"}
        </p>
        <p style={{ marginBottom: '0' }}>
          <strong>Từ khóa:</strong> Sử dụng để tìm kiếm template phù hợp khi tạo test case
        </p>
      </div>
    </Modal>
  );
};

export default TemplateTestCaseDetail; 
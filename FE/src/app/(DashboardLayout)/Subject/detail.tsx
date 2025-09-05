'use client';

import { TableSubjectDataType } from "@/types/Subject/Subject";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Col, Descriptions, Drawer, Row, Tag } from "antd";

interface SubjectDetailProps {
  Subject: TableSubjectDataType | undefined;
  isOpen: boolean;
  onClose: () => void;
}

const SubjectDetail: React.FC<SubjectDetailProps> = ({
  Subject,
  isOpen,
  onClose,
}) => {
  if (!Subject) return null;

  return (
    <Drawer
      title="Chi tiết môn học"
      width={700}
      onClose={onClose}
      open={isOpen}
      extra={
        <Button onClick={onClose} icon={<CloseOutlined />}>
          Đóng
        </Button>
      }
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Mã môn học">
          <span style={{ fontWeight: "bold", color: "#1890ff" }}>
            {Subject.code}
          </span>
        </Descriptions.Item>
        
        <Descriptions.Item label="Tên môn học">
          <span style={{ fontWeight: "500" }}>{Subject.name}</span>
        </Descriptions.Item>
        
        <Descriptions.Item label="Mô tả">
          {Subject.description || "Chưa có mô tả"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Số tín chỉ">
          <Tag color="blue">{Subject.credits} TC</Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="Khoa/Bộ môn phụ trách">
          {Subject.department}
        </Descriptions.Item>
        
        <Descriptions.Item label="Học kỳ khuyến nghị">
          {Subject.semester ? `Học kỳ ${Subject.semester}` : "Chưa xác định"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Số tiết">
          <Row gutter={16}>
            <Col span={12}>
              <strong>Lý thuyết:</strong> {Subject.theoryHours || 0} tiết
            </Col>
            <Col span={12}>
              <strong>Thực hành:</strong> {Subject.practiceHours || 0} tiết
            </Col>
          </Row>
        </Descriptions.Item>
        
        <Descriptions.Item label="Loại môn học">
          <Tag color={Subject.isElective ? "orange" : "green"}>
            {Subject.isElective ? "Tự chọn" : "Bắt buộc"}
          </Tag>
        </Descriptions.Item>
        
        <Descriptions.Item label="Hình thức đánh giá">
          {Subject.assessmentMethod || "Chưa xác định"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Môn học tiên quyết">
          {Subject.prerequisites || "Không có"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Môn học song hành">
          {Subject.corequisites || "Không có"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Ngày tạo">
          {Subject.createdDate
            ? new Date(Subject.createdDate).toLocaleDateString("vi-VN")
            : "Chưa có thông tin"}
        </Descriptions.Item>
        
        <Descriptions.Item label="Người tạo">
          {Subject.createdBy || "Chưa có thông tin"}
        </Descriptions.Item>
        
        {Subject.updatedDate && (
          <Descriptions.Item label="Ngày cập nhật">
            {new Date(Subject.updatedDate).toLocaleDateString("vi-VN")}
          </Descriptions.Item>
        )}
        
        {Subject.updatedBy && (
          <Descriptions.Item label="Người cập nhật">
            {Subject.updatedBy}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Drawer>
  );
};

export default SubjectDetail;

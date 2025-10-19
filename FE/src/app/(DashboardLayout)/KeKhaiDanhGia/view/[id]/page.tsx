"use client";
import { evaluationsData } from "@/libs/mock-data";
import
  {
    ArrowLeftOutlined,
    BookOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EditOutlined,
    StarOutlined,
    TeamOutlined,
    TrophyOutlined,
    UserOutlined
  } from "@ant-design/icons";
import
  {
    Button,
    Card,
    Col,
    Descriptions,
    Empty,
    Progress,
    Row,
    Statistic,
    Tag,
    Typography
  } from "antd";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

import classes from "../view.module.css";

const { Title, Text, Paragraph } = Typography;

interface CriterionType {
  name: string;
  description: string;
  score: number;
}

interface EvaluationDataType {
  id: string;
  studentName: string;
  studentId: string;
  subject: string;
  class: string;
  teacher: string;
  submitted: boolean;
  submittedDate: string | null;
  completionPercentage: number;
  criteria: CriterionType[];
  notes: string;
}

const ViewEvaluation: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const [evaluation, setEvaluation] = useState<EvaluationDataType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load evaluation data
  useEffect(() => {
    if (params.id) {
      const evaluationData = evaluationsData.find((item) => item.id === params.id);
      if (evaluationData) {
        setEvaluation(evaluationData);
      }
      setLoading(false);
    }
  }, [params.id]);

  const handleBack = useCallback(() => {
    router.push("/KeKhaiDanhGia");
  }, [router]);

  const handleEdit = useCallback(() => {
    router.push(`/KeKhaiDanhGia/evaluation/${evaluation?.id}`);
  }, [router, evaluation?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không tìm thấy đánh giá"
        >
          <Button onClick={handleBack}>Quay lại</Button>
        </Empty>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "#52c41a";
    if (score >= 6) return "#faad14";
    if (score >= 4) return "#fa8c16";
    return "#ff4d4f";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Xuất sắc";
    if (score >= 6) return "Tốt";
    if (score >= 4) return "Trung bình";
    if (score > 0) return "Yếu";
    return "Chưa đánh giá";
  };

  const calculateAverageScore = () => {
    const scoredCriteria = evaluation.criteria.filter(c => c.score > 0);
    if (scoredCriteria.length === 0) return 0;
    const total = scoredCriteria.reduce((sum, criterion) => sum + criterion.score, 0);
    return total / scoredCriteria.length;
  };

  const averageScore = calculateAverageScore();

  return (
    <div className={classes.container}>
      {/* Header */}
      <Card className={classes.headerCard}>
        <div className="flex items-center justify-between mb-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            type="text"
            className="text-gray-600"
          >
            Quay lại
          </Button>
          
          <div className="flex items-center gap-3">
            <Tag 
              color={evaluation.submitted ? "success" : "processing"}
              icon={evaluation.submitted ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
              className={classes.statusTag}
            >
              {evaluation.submitted ? "Đã hoàn thành" : "Đang soạn thảo"}
            </Tag>
            
            {!evaluation.submitted && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                Chỉnh sửa
              </Button>
            )}
          </div>
        </div>

        <Title level={2} className="mb-4">
          <TrophyOutlined className="mr-3 text-yellow-500" />
          Chi tiết đánh giá học sinh
        </Title>
        
        {/* Student Information */}
        <Row gutter={24} className="mb-6">
          <Col span={6}>
            <Card className={classes.infoCard} size="small">
              <Statistic
                title="Học sinh"
                value={evaluation.studentName}
                prefix={<UserOutlined className="text-blue-500" />}
                valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
              />
              <Text type="secondary" className="block mt-1">
                ID: {evaluation.studentId}
              </Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card className={classes.infoCard} size="small">
              <Statistic
                title="Môn học"
                value={evaluation.subject}
                prefix={<BookOutlined className="text-green-500" />}
                valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className={classes.infoCard} size="small">
              <Statistic
                title="Lớp"
                value={evaluation.class}
                prefix={<TeamOutlined className="text-orange-500" />}
                valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className={classes.infoCard} size="small">
              <Statistic
                title="Giáo viên"
                value={evaluation.teacher}
                prefix={<UserOutlined className="text-purple-500" />}
                valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Evaluation Summary */}
        <Row gutter={24}>
          <Col span={8}>
            <Card className={classes.summaryCard} size="small">
              <Statistic
                title="Điểm trung bình"
                value={averageScore}
                suffix="/ 10"
                valueStyle={{ 
                  color: getScoreColor(averageScore),
                  fontSize: '24px',
                  fontWeight: 'bold' 
                }}
                prefix={<StarOutlined />}
              />
              <Tag color={getScoreColor(averageScore)} className="mt-2">
                {getScoreLabel(averageScore)}
              </Tag>
            </Card>
          </Col>
          <Col span={8}>
            <Card className={classes.summaryCard} size="small">
              <Statistic
                title="Tiến độ hoàn thành"
                value={evaluation.completionPercentage}
                suffix="%"
                valueStyle={{ 
                  color: evaluation.completionPercentage === 100 ? '#52c41a' : '#1890ff',
                  fontSize: '24px',
                  fontWeight: 'bold' 
                }}
              />
              <Progress
                percent={evaluation.completionPercentage}
                size="small"
                status={evaluation.completionPercentage === 100 ? "success" : "active"}
                className="mt-2"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className={classes.summaryCard} size="small">
              <Statistic
                title="Ngày nộp"
                value={evaluation.submittedDate ? 
                  new Date(evaluation.submittedDate).toLocaleDateString("vi-VN") : 
                  "Chưa nộp"
                }
                prefix={<CalendarOutlined />}
                valueStyle={{ fontSize: '16px', fontWeight: 'bold' }}
              />
              {evaluation.submittedDate && (
                <Text type="secondary" className="block mt-1">
                  {new Date(evaluation.submittedDate).toLocaleTimeString("vi-VN", {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              )}
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Criteria Details */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <StarOutlined className="text-yellow-500" />
            Chi tiết đánh giá theo tiêu chí
          </div>
        }
        className={classes.criteriaCard}
      >
        <div className={classes.criteriaGrid}>
          {evaluation.criteria.map((criterion, index) => (
            <Card 
              key={index} 
              className={classes.criterionCard}
              size="small"
              hoverable
            >
              <div className={classes.criterionHeader}>
                <Title level={5} className="mb-2">
                  {criterion.name}
                </Title>
                <div className={classes.scoreDisplay}>
                  <div 
                    className={classes.scoreValue}
                    style={{ color: getScoreColor(criterion.score) }}
                  >
                    {criterion.score}/10
                  </div>
                  <Tag 
                    color={getScoreColor(criterion.score)}
                    className={classes.scoreTag}
                  >
                    {getScoreLabel(criterion.score)}
                  </Tag>
                </div>
              </div>
              
              <Paragraph 
                type="secondary" 
                className={classes.criterionDescription}
              >
                {criterion.description}
              </Paragraph>
              
              <div className={classes.scoreBar}>
                <Progress
                  percent={(criterion.score / 10) * 100}
                  size="small"
                  strokeColor={getScoreColor(criterion.score)}
                  showInfo={false}
                  className="mb-0"
                />
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Notes Section */}
      <Card 
        title={
          <div className="flex items-center gap-2">
            <EditOutlined className="text-blue-500" />
            Nhận xét và ghi chú
          </div>
        }
        className={classes.notesCard}
      >
        {evaluation.notes ? (
          <div className={classes.notesContent}>
            <Paragraph className={classes.notesText}>
              {evaluation.notes}
            </Paragraph>
          </div>
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Chưa có nhận xét"
            className={classes.emptyNotes}
          />
        )}
      </Card>

      {/* Detailed Information */}
      <Card 
        title="Thông tin chi tiết"
        className={classes.detailCard}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Tên học sinh">
            {evaluation.studentName}
          </Descriptions.Item>
          <Descriptions.Item label="Mã học sinh">
            {evaluation.studentId}
          </Descriptions.Item>
          <Descriptions.Item label="Môn học">
            {evaluation.subject}
          </Descriptions.Item>
          <Descriptions.Item label="Lớp">
            {evaluation.class}
          </Descriptions.Item>
          <Descriptions.Item label="Giáo viên">
            {evaluation.teacher}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag 
              color={evaluation.submitted ? "success" : "processing"}
              icon={evaluation.submitted ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            >
              {evaluation.submitted ? "Đã hoàn thành" : "Đang soạn thảo"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Số tiêu chí đã đánh giá">
            {evaluation.criteria.filter(c => c.score > 0).length} / {evaluation.criteria.length}
          </Descriptions.Item>
          <Descriptions.Item label="Điểm trung bình">
            <span style={{ color: getScoreColor(averageScore), fontWeight: 'bold' }}>
              {averageScore}/10 ({getScoreLabel(averageScore)})
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo" span={2}>
            {evaluation.submittedDate ? 
              new Date(evaluation.submittedDate).toLocaleString("vi-VN") : 
              "Chưa có thông tin"
            }
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ViewEvaluation;